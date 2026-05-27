-- ============================================================
-- StyleSync (Uber for Hair) — Production PostgreSQL Schema
-- Designed for multi-tenant, high-throughput booking SaaS
-- All tables use UUID PKs and optimistic/row-level locking
-- ============================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE booking_status_enum AS ENUM (
    'pending_payment',  -- Slot claimed, awaiting MoMo deposit
    'confirmed',        -- Payment received, slot permanently locked
    'expired',          -- 10-min TTL elapsed, slot released
    'cancelled'         -- Explicitly cancelled by client or system
);

CREATE TYPE payment_status_enum AS ENUM (
    'initiated',   -- Paystack transaction created, awaiting prompt
    'success',     -- Charge confirmed via webhook
    'failed',      -- Charge failed or abandoned
    'reversed'     -- Refund/chargeback issued
);

CREATE TYPE momo_network_enum AS ENUM (
    'MTN',
    'Vodafone',
    'AirtelTigo'
);

-- ============================================================
-- SALONS (Multi-Tenant Root Entity)
-- ============================================================

CREATE TABLE IF NOT EXISTS salons (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    TEXT NOT NULL,
    neighborhood            TEXT NOT NULL,
    owner_name              TEXT NOT NULL,
    owner_phone             TEXT NOT NULL,
    -- Paystack Subaccount fields (populated on onboarding)
    paystack_subaccount_code TEXT UNIQUE,
    momo_network            momo_network_enum,
    momo_number             TEXT,
    platform_fee_percent    NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed one demo salon for local dev
INSERT INTO salons (name, neighborhood, owner_name, owner_phone) VALUES
    ('Luxe Locks Studio', 'East Legon', 'Abena Mensah', '0244123456')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SERVICES (Offered by each Salon)
-- ============================================================

CREATE TABLE IF NOT EXISTS services (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id    UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    price_ghs   NUMERIC(10, 2) NOT NULL,
    duration_mins INTEGER NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO services (salon_id, name, price_ghs, duration_mins)
SELECT id, 'Knotless Braids', 350.00, 180 FROM salons WHERE name = 'Luxe Locks Studio'
ON CONFLICT DO NOTHING;

INSERT INTO services (salon_id, name, price_ghs, duration_mins)
SELECT id, 'Silk Press', 200.00, 90 FROM salons WHERE name = 'Luxe Locks Studio'
ON CONFLICT DO NOTHING;

-- ============================================================
-- SLOTS (Bookable Time Intervals per Salon)
-- Uses optimistic locking via `version` column +
-- pessimistic row-level lock via SELECT ... FOR UPDATE NOWAIT
-- in the application layer.
-- ============================================================

CREATE TABLE IF NOT EXISTS slots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    slot_time       TIMESTAMPTZ NOT NULL,
    is_booked       BOOLEAN NOT NULL DEFAULT FALSE,
    -- Locked means a booking is in-flight (pending payment).
    -- If the 10-min TTL expires, this must flip back to FALSE.
    is_locked       BOOLEAN NOT NULL DEFAULT FALSE,
    locked_until    TIMESTAMPTZ,
    locked_by_booking_id UUID, -- FK added below after bookings table
    -- Optimistic lock version counter. Increment on every state change.
    version         INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS slots_salon_time_uidx ON slots(salon_id, slot_time);

-- ============================================================
-- BOOKINGS (Core Transactional Entity)
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id        UUID NOT NULL REFERENCES salons(id),
    slot_id         UUID NOT NULL REFERENCES slots(id),
    service_id      UUID NOT NULL REFERENCES services(id),
    client_name     TEXT NOT NULL,
    client_phone    TEXT NOT NULL,  -- Validated Ghana E.164/local format
    client_email    TEXT NOT NULL,
    booking_ref     TEXT UNIQUE NOT NULL,
    booking_status  booking_status_enum NOT NULL DEFAULT 'pending_payment',
    -- Deposit amount locked for this slot
    deposit_amount_ghs NUMERIC(10, 2) NOT NULL DEFAULT 20.00,
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    confirmed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Back-fill FK from slots to bookings
ALTER TABLE slots
    ADD CONSTRAINT IF NOT EXISTS slots_locked_by_booking_fk
    FOREIGN KEY (locked_by_booking_id) REFERENCES bookings(id);

-- ============================================================
-- MOMO TRANSACTIONS (Payment Ledger)
-- ============================================================

CREATE TABLE IF NOT EXISTS momo_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id          UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    salon_id            UUID NOT NULL REFERENCES salons(id),
    paystack_reference  TEXT UNIQUE NOT NULL,
    paystack_access_code TEXT,
    amount_ghs          NUMERIC(10, 2) NOT NULL,
    -- Platform split fields
    platform_fee_ghs    NUMERIC(10, 2),
    net_payout_ghs      NUMERIC(10, 2),
    payment_status      payment_status_enum NOT NULL DEFAULT 'initiated',
    paystack_raw_event  JSONB,  -- Full webhook payload stored for audit
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WEBHOOK EVENTS (Idempotency Guard)
-- Every processed webhook reference is stored here.
-- On duplicate delivery, the handler returns 200 immediately.
-- ============================================================

CREATE TABLE IF NOT EXISTS webhook_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference       TEXT UNIQUE NOT NULL,
    event_type      TEXT NOT NULL,
    processed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    raw_payload     JSONB NOT NULL
);

-- ============================================================
-- PAYOUT LEDGER VIEW (Admin Auditing Engine)
-- Aggregates gross revenue, platform fees, and net payouts
-- per salon for fully transparent vendor settlements.
-- ============================================================

CREATE OR REPLACE VIEW payout_ledger AS
SELECT
    s.id                                                        AS salon_id,
    s.name                                                      AS salon_name,
    s.paystack_subaccount_code,
    s.platform_fee_percent,
    COUNT(b.id)                                                 AS total_confirmed_bookings,
    COALESCE(SUM(mt.amount_ghs), 0)                            AS gross_revenue_ghs,
    COALESCE(SUM(mt.platform_fee_ghs), 0)                      AS total_platform_fees_ghs,
    COALESCE(SUM(mt.net_payout_ghs), 0)                        AS total_net_payouts_ghs
FROM
    salons s
LEFT JOIN bookings b
    ON b.salon_id = s.id AND b.booking_status = 'confirmed'
LEFT JOIN momo_transactions mt
    ON mt.booking_id = b.id AND mt.payment_status = 'success'
GROUP BY
    s.id, s.name, s.paystack_subaccount_code, s.platform_fee_percent;

-- ============================================================
-- INDEXES FOR QUERY PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS bookings_salon_status_idx    ON bookings(salon_id, booking_status);
CREATE INDEX IF NOT EXISTS bookings_expires_at_idx      ON bookings(expires_at) WHERE booking_status = 'pending_payment';
CREATE INDEX IF NOT EXISTS momo_tx_status_idx           ON momo_transactions(payment_status);
CREATE INDEX IF NOT EXISTS momo_tx_booking_idx          ON momo_transactions(booking_id);
CREATE INDEX IF NOT EXISTS slots_salon_locked_idx       ON slots(salon_id, is_locked, is_booked);
