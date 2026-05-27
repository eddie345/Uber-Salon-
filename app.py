"""
StyleSync — Enterprise Flask Backend
=====================================
Modules implemented:
  1. Resilient State Machine — row-level locking (SELECT FOR UPDATE NOWAIT)
     + APScheduler expiry worker releasing slots after 10-min TTL
  2. Idempotent Webhook Security Ledger — SHA512 HMAC, atomic DB transactions
  3. Vendor Onboarding — Paystack Subaccount creation API
  4. Payout Auditing Engine — payout_ledger view exposed via JSON + HTML
"""

import os
import hmac
import hashlib
import json
import logging
import threading
from datetime import datetime
from functools import wraps

import requests
from flask import Flask, render_template, request, jsonify, abort, g
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Graceful psycopg2 import — app runs in demo mode if Postgres is unavailable
# ---------------------------------------------------------------------------
try:
    import psycopg2
    import psycopg2.extras
    from psycopg2.extensions import ISOLATION_LEVEL_READ_COMMITTED
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    logging.warning("psycopg2 not installed — running in demo/mock mode.")

# ---------------------------------------------------------------------------
# APScheduler for slot expiry background worker
# ---------------------------------------------------------------------------
try:
    from apscheduler.schedulers.background import BackgroundScheduler
    SCHEDULER_AVAILABLE = True
except ImportError:
    SCHEDULER_AVAILABLE = False
    logging.warning("APScheduler not installed — expiry worker disabled.")

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------
load_dotenv()

app = Flask(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s"
)
logger = logging.getLogger("stylesync")

# ---------------------------------------------------------------------------
# Configuration — all sensitive values must live in a .env file in production
# ---------------------------------------------------------------------------
PAYSTACK_SECRET_KEY  = os.getenv("PAYSTACK_SECRET_KEY",  "sk_test_dummy_key_1234567890abcdef")
PAYSTACK_PUBLIC_KEY  = os.getenv("PAYSTACK_PUBLIC_KEY",  "pk_test_dummy_key_1234567890abcdef")
DATABASE_URL         = os.getenv("DATABASE_URL",          "postgresql://localhost/stylesync")
PLATFORM_FEE_PERCENT = float(os.getenv("PLATFORM_FEE_PERCENT", "10.0"))
IS_DEMO_MODE         = "dummy" in PAYSTACK_SECRET_KEY


# ============================================================
# DATABASE LAYER
# ============================================================

def get_db():
    """
    Return a thread-local psycopg2 connection.
    Creates a new connection per request context if needed.
    In demo mode (no Postgres), returns None — callers must handle.
    """
    if not DB_AVAILABLE:
        return None
    if "db" not in g:
        try:
            g.db = psycopg2.connect(DATABASE_URL)
            g.db.set_isolation_level(ISOLATION_LEVEL_READ_COMMITTED)
        except Exception as exc:
            logger.error(f"DB connection failed: {exc}")
            g.db = None
    return g.db


@app.teardown_appcontext
def close_db(exc=None):
    """Always return connections to the pool after each request."""
    db = g.pop("db", None)
    if db is not None:
        try:
            db.close()
        except Exception:
            pass


def with_db_cursor(func):
    """
    Decorator that injects a (conn, cursor) pair into the wrapped function.
    On exception, rolls back and re-raises.  On success, commits.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        conn = get_db()
        if conn is None:
            raise RuntimeError("Database unavailable")
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            result = func(*args, conn=conn, cur=cur, **kwargs)
            conn.commit()
            return result
        except Exception:
            conn.rollback()
            raise
        finally:
            cur.close()
    return wrapper


# ============================================================
# MODULE 1 — SLOT EXPIRY BACKGROUND WORKER (APScheduler)
# ============================================================

def release_expired_slots():
    """
    Scheduled job: runs every 60 seconds.
    Finds all bookings where:
      - booking_status = 'pending_payment'
      - expires_at < NOW()
    For each: marks the booking 'expired', releases the slot lock.
    Wrapped in a single atomic transaction.
    """
    if not DB_AVAILABLE:
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_READ_COMMITTED)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Find expired pending bookings
        cur.execute("""
            SELECT b.id AS booking_id, b.slot_id
            FROM bookings b
            WHERE b.booking_status = 'pending_payment'
              AND b.expires_at < NOW()
            FOR UPDATE NOWAIT
        """)
        expired = cur.fetchall()

        if not expired:
            cur.close()
            conn.close()
            return

        booking_ids = [r["booking_id"] for r in expired]
        slot_ids    = [r["slot_id"]    for r in expired]

        # Expire bookings
        cur.execute("""
            UPDATE bookings
               SET booking_status = 'expired',
                   updated_at     = NOW()
             WHERE id = ANY(%s)
        """, (booking_ids,))

        # Release slot locks
        cur.execute("""
            UPDATE slots
               SET is_locked            = FALSE,
                   locked_until         = NULL,
                   locked_by_booking_id = NULL,
                   version              = version + 1
             WHERE id = ANY(%s)
        """, (slot_ids,))

        # Fail pending momo transactions linked to expired bookings
        cur.execute("""
            UPDATE momo_transactions
               SET payment_status = 'failed',
                   updated_at     = NOW()
             WHERE booking_id = ANY(%s)
               AND payment_status = 'initiated'
        """, (booking_ids,))

        conn.commit()
        logger.info(f"[ExpiryWorker] Released {len(expired)} expired slot(s): {slot_ids}")

    except psycopg2.errors.LockNotAvailable:
        # Another worker beat us to it — silently skip
        logger.debug("[ExpiryWorker] Lock contention on expiry scan — skipping cycle.")
        conn.rollback()
    except Exception as exc:
        logger.error(f"[ExpiryWorker] Unhandled error: {exc}", exc_info=True)
        try:
            conn.rollback()
        except Exception:
            pass
    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass


if SCHEDULER_AVAILABLE:
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.add_job(
        func=release_expired_slots,
        trigger="interval",
        seconds=60,
        id="slot_expiry_worker",
        max_instances=1,           # Prevent overlapping runs
        coalesce=True,             # Skip missed runs instead of piling up
        misfire_grace_time=30,
    )
    scheduler.start()
    logger.info("[APScheduler] Slot expiry worker started — polling every 60s.")


# ============================================================
# PAGE ROUTES
# ============================================================

@app.route("/")
def index():
    salon_data = {
        "id":           "c138b301-1e9d-4e94-81e5-78e24c9c228a",
        "name":         "Luxe Locks Studio",
        "neighborhood": "East Legon",
        "services": [
            {"id": "svc-001", "name": "Knotless Braids", "price": 350.00, "duration": 180},
            {"id": "svc-002", "name": "Silk Press",       "price": 200.00, "duration": 90},
        ]
    }
    return render_template(
        "index.html",
        salon=salon_data,
        paystack_public_key=PAYSTACK_PUBLIC_KEY
    )


@app.route("/salons")
def salons():
    return render_template("salons.html")


@app.route("/bookings")
def my_bookings():
    return render_template("bookings.html")


@app.route("/admin/ledger")
def admin_ledger():
    ledger_rows = []
    if DB_AVAILABLE:
        conn = get_db()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("SELECT * FROM payout_ledger ORDER BY gross_revenue_ghs DESC")
                ledger_rows = cur.fetchall()
                cur.close()
            except Exception as exc:
                logger.error(f"Ledger query failed: {exc}")

    # Demo fallback
    if not ledger_rows:
        ledger_rows = [
            {
                "salon_name": "Luxe Locks Studio",
                "paystack_subaccount_code": "ACCT_demo_xxxx",
                "platform_fee_percent": 10.0,
                "total_confirmed_bookings": 24,
                "gross_revenue_ghs": 480.00,
                "total_platform_fees_ghs": 48.00,
                "total_net_payouts_ghs": 432.00,
            },
            {
                "salon_name": "Glamour Styles Osu",
                "paystack_subaccount_code": "ACCT_demo_yyyy",
                "platform_fee_percent": 10.0,
                "total_confirmed_bookings": 11,
                "gross_revenue_ghs": 220.00,
                "total_platform_fees_ghs": 22.00,
                "total_net_payouts_ghs": 198.00,
            }
        ]

    return render_template("admin_ledger.html", ledger=ledger_rows)


# ============================================================
# MODULE 1 API — BOOKING INIT WITH ROW-LEVEL LOCKING
# ============================================================

@app.route("/api/slots")
def get_slots():
    """
    Returns available time slots for a salon + date.
    In demo mode: returns static mock data.
    In live mode: queries the slots table.
    """
    date = request.args.get("date", datetime.today().strftime("%Y-%m-%d"))
    salon_id = request.args.get("salon_id", "c138b301-1e9d-4e94-81e5-78e24c9c228a")

    if DB_AVAILABLE:
        conn = get_db()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute("""
                    SELECT id, slot_time,
                           NOT (is_locked OR is_booked) AS available
                      FROM slots
                     WHERE salon_id = %s
                       AND DATE(slot_time AT TIME ZONE 'Africa/Accra') = %s
                     ORDER BY slot_time
                """, (salon_id, date))
                rows = cur.fetchall()
                cur.close()
                slots = [
                    {
                        "id":        str(r["id"]),
                        "time":      r["slot_time"].strftime("%I:%M %p"),
                        "available": r["available"],
                    }
                    for r in rows
                ]
                return jsonify({"slots": slots, "date": date, "source": "live"})
            except Exception as exc:
                logger.error(f"Slot query failed: {exc}")

    # Demo fallback
    slots = [
        {"id": "s1", "time": "09:00 AM", "available": True},
        {"id": "s2", "time": "11:30 AM", "available": True},
        {"id": "s3", "time": "02:00 PM", "available": False},
        {"id": "s4", "time": "04:30 PM", "available": True},
    ]
    return jsonify({"slots": slots, "date": date, "source": "demo"})


@app.route("/api/bookings/init", methods=["POST"])
def init_booking():
    """
    Atomically claims a slot with a row-level exclusive lock.

    Flow:
      1. BEGIN transaction
      2. SELECT slot FOR UPDATE NOWAIT  →  409 if locked by another tx
      3. Verify slot is still free (is_locked=FALSE, is_booked=FALSE)
      4. INSERT booking (pending_payment, expires_at = NOW()+10min)
      5. UPDATE slot (is_locked=TRUE, locked_until, version++)
      6. INSERT momo_transaction (initiated)
      7. Initialize Paystack (or mock)
      8. COMMIT  →  return authorization_url to client
    """
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"status": False, "message": "Invalid JSON body"}), 400

    client_name  = data.get("client_name", "").strip()
    client_phone = data.get("client_phone", "").strip()
    client_email = data.get("client_email", "").strip()
    service_id   = data.get("service_id", "svc-001")
    slot_id      = data.get("slot_id")
    amount_ghs   = float(data.get("amount_ghs", 20.00))

    if not all([client_name, client_phone, client_email, slot_id]):
        return jsonify({"status": False, "message": "Missing required fields"}), 422

    booking_ref = f"BKG-{datetime.now().strftime('%Y%m%d%H%M%S%f')[:18]}"
    platform_fee_ghs = round(amount_ghs * (PLATFORM_FEE_PERCENT / 100), 2)
    net_payout_ghs   = round(amount_ghs - platform_fee_ghs, 2)

    # ----------------------------------------------------------------
    # LIVE PATH: Postgres row-level locking
    # ----------------------------------------------------------------
    if DB_AVAILABLE:
        conn = get_db()
        if conn:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            try:
                # 1. Acquire exclusive row lock — NOWAIT raises immediately on contention
                cur.execute("""
                    SELECT id, is_locked, is_booked, version
                      FROM slots
                     WHERE id = %s
                       FOR UPDATE NOWAIT
                """, (slot_id,))
                slot = cur.fetchone()

                if not slot:
                    conn.rollback()
                    return jsonify({"status": False, "message": "Slot not found"}), 404

                if slot["is_locked"] or slot["is_booked"]:
                    conn.rollback()
                    return jsonify({
                        "status": False,
                        "message": "This slot was just taken. Please pick another time.",
                        "code": "SLOT_UNAVAILABLE"
                    }), 409

                # 2. Insert the booking
                cur.execute("""
                    INSERT INTO bookings
                        (salon_id, slot_id, service_id, client_name,
                         client_phone, client_email, booking_ref,
                         deposit_amount_ghs, expires_at)
                    SELECT s.salon_id, %s, %s, %s, %s, %s, %s, %s,
                           NOW() + INTERVAL '10 minutes'
                      FROM slots s
                     WHERE s.id = %s
                    RETURNING id
                """, (slot_id, service_id, client_name, client_phone,
                      client_email, booking_ref, amount_ghs, slot_id))
                booking_id = cur.fetchone()["id"]

                # 3. Lock the slot
                cur.execute("""
                    UPDATE slots
                       SET is_locked            = TRUE,
                           locked_until         = NOW() + INTERVAL '10 minutes',
                           locked_by_booking_id = %s,
                           version              = version + 1
                     WHERE id = %s
                """, (booking_id, slot_id))

                # 4. Record momo transaction
                cur.execute("""
                    INSERT INTO momo_transactions
                        (booking_id, salon_id, paystack_reference,
                         amount_ghs, platform_fee_ghs, net_payout_ghs)
                    SELECT %s, s.salon_id, %s, %s, %s, %s
                      FROM slots s WHERE s.id = %s
                """, (booking_id, booking_ref, amount_ghs,
                      platform_fee_ghs, net_payout_ghs, slot_id))

                conn.commit()
                logger.info(f"[Booking] Slot {slot_id} locked — ref={booking_ref}")

            except psycopg2.errors.LockNotAvailable:
                # Race condition: another request holds the lock right now
                conn.rollback()
                logger.warning(f"[Booking] Race condition detected on slot {slot_id}")
                return jsonify({
                    "status": False,
                    "message": "Another user is claiming this slot. Please try again in a moment.",
                    "code": "LOCK_CONTENTION"
                }), 409

            except Exception as exc:
                conn.rollback()
                logger.error(f"[Booking] Init failed: {exc}", exc_info=True)
                return jsonify({"status": False, "message": "Booking initialization failed"}), 500

            finally:
                cur.close()

    # ----------------------------------------------------------------
    # Paystack Transaction Initialization
    # ----------------------------------------------------------------
    if IS_DEMO_MODE:
        logger.info(f"[Paystack] Demo mode — mocking authorization for {booking_ref}")
        return jsonify({
            "status": True,
            "message": "Authorization URL created (demo)",
            "data": {
                "authorization_url": f"https://checkout.paystack.com/{booking_ref}",
                "access_code":       "demo_access_code",
                "reference":         booking_ref,
            }
        })

    # Live Paystack call
    try:
        ps_payload = {
            "email":        client_email,
            "amount":       int(amount_ghs * 100),   # Paystack uses kobo/pesewas
            "reference":    booking_ref,
            "callback_url": os.getenv("CALLBACK_URL", "http://localhost:5000/booking/success"),
            "channels":     ["mobile_money"],
            "metadata": {
                "custom_fields": [
                    {"display_name": "Client Name",   "variable_name": "client_name",   "value": client_name},
                    {"display_name": "Phone Number",  "variable_name": "client_phone",  "value": client_phone},
                ],
                "booking_ref": booking_ref,
            },
        }

        response = requests.post(
            "https://api.paystack.co/transaction/initialize",
            headers={
                "Authorization":  f"Bearer {PAYSTACK_SECRET_KEY}",
                "Content-Type":   "application/json",
            },
            json=ps_payload,
            timeout=10,
        )
        response.raise_for_status()
        ps_data = response.json()

        # Persist the access code for later verification
        if DB_AVAILABLE and get_db():
            try:
                cur = get_db().cursor()
                cur.execute("""
                    UPDATE momo_transactions
                       SET paystack_access_code = %s
                     WHERE paystack_reference = %s
                """, (ps_data["data"]["access_code"], booking_ref))
                get_db().commit()
                cur.close()
            except Exception:
                pass  # Non-critical — proceed

        return jsonify(ps_data)

    except requests.exceptions.Timeout:
        logger.error(f"[Paystack] Timeout initializing transaction for {booking_ref}")
        return jsonify({"status": False, "message": "Payment gateway timeout. Please retry."}), 504
    except requests.exceptions.RequestException as exc:
        logger.error(f"[Paystack] Request error: {exc}")
        return jsonify({"status": False, "message": "Payment gateway error"}), 502


# ============================================================
# MODULE 2 — IDEMPOTENT WEBHOOK SECURITY LEDGER
# ============================================================

@app.route("/webhook/paystack", methods=["POST"])
def paystack_webhook():
    """
    Enterprise-grade Paystack webhook processor.

    Security layers:
      1. SHA512 HMAC signature verification (constant-time compare)
      2. Idempotency guard — duplicate references exit early with 200
      3. Atomic DB transaction wrapping all state mutations
      4. Full raw payload stored for audit trail
    """
    # ── Layer 1: Signature Verification ───────────────────────────
    paystack_sig = request.headers.get("X-Paystack-Signature", "")
    if not paystack_sig:
        logger.warning("[Webhook] Missing X-Paystack-Signature header — rejecting.")
        abort(400)

    raw_payload = request.get_data()  # Raw bytes — must NOT decode before hashing

    expected_sig = hmac.new(
        PAYSTACK_SECRET_KEY.encode("utf-8"),
        msg=raw_payload,
        digestmod=hashlib.sha512,
    ).hexdigest()

    # Constant-time comparison prevents timing attacks
    if not hmac.compare_digest(expected_sig, paystack_sig):
        logger.warning(f"[Webhook] Invalid signature. Expected prefix: {expected_sig[:12]}…")
        abort(400)

    # ── Parse payload ──────────────────────────────────────────────
    try:
        event_data  = json.loads(raw_payload)
        event_type  = event_data.get("event", "")
        reference   = event_data.get("data", {}).get("reference", "")
    except (json.JSONDecodeError, KeyError) as exc:
        logger.error(f"[Webhook] Malformed payload: {exc}")
        abort(400)

    if not reference:
        logger.warning("[Webhook] Payload missing transaction reference.")
        abort(400)

    logger.info(f"[Webhook] Received event={event_type} ref={reference}")

    # ── Layer 2: Idempotency Guard ─────────────────────────────────
    if DB_AVAILABLE and get_db():
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            cur.execute(
                "SELECT id FROM webhook_events WHERE reference = %s",
                (reference,)
            )
            if cur.fetchone():
                logger.info(f"[Webhook] Duplicate event for ref={reference} — skipping.")
                cur.close()
                return jsonify({"status": "already_processed"}), 200
        except Exception as exc:
            logger.error(f"[Webhook] Idempotency check failed: {exc}")
            cur.close()
            return jsonify({"status": "error"}), 500
        finally:
            cur.close()

    # ── Layer 3: Atomic State Mutation ────────────────────────────
    if event_type == "charge.success":
        if DB_AVAILABLE and get_db():
            conn = get_db()
            cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            try:
                # Fetch the booking linked to this reference
                cur.execute("""
                    SELECT mt.id AS tx_id, mt.booking_id, b.slot_id
                      FROM momo_transactions mt
                      JOIN bookings b ON b.id = mt.booking_id
                     WHERE mt.paystack_reference = %s
                       AND mt.payment_status     = 'initiated'
                """, (reference,))
                tx = cur.fetchone()

                if not tx:
                    logger.warning(f"[Webhook] No initiated transaction found for ref={reference}")
                    # Still record the webhook so it isn't reprocessed
                else:
                    # a) Confirm the momo transaction
                    cur.execute("""
                        UPDATE momo_transactions
                           SET payment_status   = 'success',
                               paystack_raw_event = %s,
                               updated_at        = NOW()
                         WHERE id = %s
                    """, (json.dumps(event_data), tx["tx_id"]))

                    # b) Confirm the booking
                    cur.execute("""
                        UPDATE bookings
                           SET booking_status = 'confirmed',
                               confirmed_at   = NOW(),
                               updated_at     = NOW()
                         WHERE id = %s
                    """, (tx["booking_id"],))

                    # c) Permanently mark the slot as booked (not just locked)
                    cur.execute("""
                        UPDATE slots
                           SET is_booked             = TRUE,
                               is_locked             = FALSE,
                               locked_until          = NULL,
                               version               = version + 1
                         WHERE id = %s
                    """, (tx["slot_id"],))

                    logger.info(f"[Webhook] Booking {tx['booking_id']} confirmed — ref={reference}")

                    # Trigger SMS notification (non-blocking)
                    phone = event_data.get("data", {}).get("metadata", {}).get(
                        "custom_fields", [{}]
                    )
                    phone_val = phone[1].get("value", "") if len(phone) > 1 else ""
                    threading.Thread(
                        target=send_sms_notification,
                        args=(phone_val, f"✅ Your booking is confirmed! ₵20 deposit received. See you at the salon. Ref: {reference}"),
                        daemon=True,
                    ).start()

                # d) Record idempotency token — ALWAYS, even if tx was missing
                cur.execute("""
                    INSERT INTO webhook_events (reference, event_type, raw_payload)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (reference) DO NOTHING
                """, (reference, event_type, json.dumps(event_data)))

                conn.commit()
                logger.info(f"[Webhook] Event {event_type} for ref={reference} committed.")

            except Exception as exc:
                conn.rollback()
                logger.error(f"[Webhook] Atomic transaction failed — rolled back. Error: {exc}", exc_info=True)
                return jsonify({"status": "error"}), 500
            finally:
                cur.close()

    elif event_type in ("charge.failed", "transfer.failed"):
        # Mark transaction as failed — non-critical, best-effort
        if DB_AVAILABLE and get_db():
            try:
                conn = get_db()
                cur  = conn.cursor()
                cur.execute("""
                    UPDATE momo_transactions
                       SET payment_status    = 'failed',
                           paystack_raw_event = %s,
                           updated_at         = NOW()
                     WHERE paystack_reference = %s
                """, (json.dumps(event_data), reference))
                cur.execute("""
                    INSERT INTO webhook_events (reference, event_type, raw_payload)
                    VALUES (%s, %s, %s) ON CONFLICT (reference) DO NOTHING
                """, (reference, event_type, json.dumps(event_data)))
                conn.commit()
                cur.close()
            except Exception as exc:
                logger.error(f"[Webhook] Failed-event processing error: {exc}")

    return jsonify({"status": "success"}), 200


# ============================================================
# MODULE 4 — VENDOR ONBOARDING API
# ============================================================

@app.route("/api/admin/onboard-salon", methods=["POST"])
def onboard_salon():
    """
    Programmatically creates a Paystack Subaccount for a new salon owner.
    Saves the resulting subaccount_code to the salons table.

    Expected body:
    {
      "salon_id":        "<uuid>",         -- existing salons.id
      "business_name":   "Luxe Locks",
      "primary_contact": "0244123456",
      "settlement_bank": "MTN",            -- or Vodafone / AirtelTigo
      "account_number":  "0244123456",     -- MoMo wallet number
      "percentage_charge": 10.0
    }
    """
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"status": False, "message": "Invalid JSON body"}), 400

    required = ["business_name", "primary_contact", "settlement_bank", "account_number"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"status": False, "message": f"Missing fields: {missing}"}), 422

    salon_id          = data.get("salon_id")
    business_name     = data["business_name"].strip()
    primary_contact   = data["primary_contact"].strip()
    settlement_bank   = data["settlement_bank"].strip()   # MoMo network name
    account_number    = data["account_number"].strip()
    percentage_charge = float(data.get("percentage_charge", PLATFORM_FEE_PERCENT))

    # ── Demo Mode ────────────────────────────────────────────────
    if IS_DEMO_MODE:
        mock_code = f"ACCT_demo_{account_number[-4:]}"
        logger.info(f"[Onboarding] Demo mode — mocking subaccount {mock_code} for '{business_name}'")
        return jsonify({
            "status":   True,
            "message":  "Subaccount created (demo mode)",
            "data": {
                "subaccount_code":  mock_code,
                "business_name":    business_name,
                "settlement_bank":  settlement_bank,
                "account_number":   account_number,
                "percentage_charge": percentage_charge,
            }
        })

    # ── Live Paystack Subaccount Creation ────────────────────────
    try:
        response = requests.post(
            "https://api.paystack.co/subaccount",
            headers={
                "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
                "Content-Type":  "application/json",
            },
            json={
                "business_name":     business_name,
                "settlement_bank":   settlement_bank,
                "account_number":    account_number,
                "percentage_charge": percentage_charge,
                "primary_contact_phone": primary_contact,
            },
            timeout=15,
        )
        response.raise_for_status()
        ps_data = response.json()

        if not ps_data.get("status"):
            logger.error(f"[Onboarding] Paystack rejected subaccount: {ps_data.get('message')}")
            return jsonify({"status": False, "message": ps_data.get("message")}), 422

        subaccount_code = ps_data["data"]["subaccount_code"]
        logger.info(f"[Onboarding] Created Paystack subaccount {subaccount_code} for '{business_name}'")

        # Persist to DB
        if DB_AVAILABLE and salon_id and get_db():
            conn = get_db()
            cur  = conn.cursor()
            try:
                cur.execute("""
                    UPDATE salons
                       SET paystack_subaccount_code = %s,
                           platform_fee_percent     = %s,
                           updated_at               = NOW()
                     WHERE id = %s
                """, (subaccount_code, percentage_charge, salon_id))
                conn.commit()
            except Exception as exc:
                conn.rollback()
                logger.error(f"[Onboarding] DB persist failed: {exc}")
            finally:
                cur.close()

        return jsonify({"status": True, "data": ps_data["data"]})

    except requests.exceptions.RequestException as exc:
        logger.error(f"[Onboarding] Paystack API error: {exc}")
        return jsonify({"status": False, "message": "Paystack API unreachable"}), 502


# ============================================================
# MODULE 4 — PAYOUT LEDGER JSON API
# ============================================================

@app.route("/api/admin/ledger")
def ledger_api():
    """Returns the payout_ledger view as JSON for programmatic consumption."""
    if DB_AVAILABLE and get_db():
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            cur.execute("SELECT * FROM payout_ledger ORDER BY gross_revenue_ghs DESC")
            rows = [dict(r) for r in cur.fetchall()]
            return jsonify({"status": True, "data": rows})
        except Exception as exc:
            logger.error(f"[Ledger] Query failed: {exc}")
            return jsonify({"status": False, "message": "Ledger query failed"}), 500
        finally:
            cur.close()

    return jsonify({"status": True, "data": [], "note": "Demo mode — no DB connected"})


# ============================================================
# UTILITIES
# ============================================================

def send_sms_notification(phone: str, message: str):
    """
    Sends an SMS via Arkesel or mNotify (Ghana SMS gateways).
    Replace the API call below with your preferred provider.
    Currently logs only — wire in your gateway credentials to activate.
    """
    arkesel_api_key = os.getenv("ARKESEL_API_KEY", "")
    if arkesel_api_key:
        try:
            requests.post(
                "https://sms.arkesel.com/sms/api",
                params={
                    "action":  "send-sms",
                    "api_key": arkesel_api_key,
                    "to":      phone,
                    "from":    "StyleSync",
                    "sms":     message,
                },
                timeout=8,
            )
            logger.info(f"[SMS] Sent to {phone}")
        except Exception as exc:
            logger.error(f"[SMS] Delivery failed to {phone}: {exc}")
    else:
        logger.info(f"[SMS-MOCK] → {phone}: {message}")


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
