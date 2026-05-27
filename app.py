import os
import hmac
import hashlib
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, abort
# Database imports temporarily commented out for local preview
# import psycopg2
# from psycopg2.extras import RealDictCursor
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Dummy Paystack Keys for Local Development
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY', 'sk_test_dummy_key_1234567890abcdef')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY', 'pk_test_dummy_key_1234567890abcdef')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/uber_for_hair')

def get_db_connection():
    # In a real app, use connection pooling
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

@app.route('/')
def index():
    # In a real scenario, we would fetch salons from DB
    # Passing dummy data for UI rendering
    salons = [
        {
            "id": "c138b301-1e9d-4e94-81e5-78e24c9c228a", 
            "name": "Luxe Locks Accra", 
            "neighborhood": "East Legon",
            "services": [
                {"id": "1", "name": "Knotless Braids", "price": 350.00, "duration": 180},
                {"id": "2", "name": "Silk Press", "price": 200.00, "duration": 90}
            ]
        }
    ]
    return render_template('index.html', salons=salons, paystack_public_key=PAYSTACK_PUBLIC_KEY)

@app.route('/api/slots')
def get_slots():
    """Fetch available slots. Mocked for the dummy UI."""
    date = request.args.get('date', datetime.today().strftime('%Y-%m-%d'))
    # Mocked time slots for the UI
    slots = [
        {"id": "s1", "time": "09:00 AM", "available": True},
        {"id": "s2", "time": "11:30 AM", "available": True},
        {"id": "s3", "time": "02:00 PM", "available": False},
        {"id": "s4", "time": "04:30 PM", "available": True}
    ]
    return jsonify({"slots": slots, "date": date})

@app.route('/api/bookings/init', methods=['POST'])
def init_booking():
    """Initialize a booking and create a Paystack transaction with Split."""
    data = request.json
    client_name = data.get('client_name')
    client_phone = data.get('client_phone')
    client_email = data.get('client_email')
    service_id = data.get('service_id')
    slot_id = data.get('slot_id')
    amount_ghs = float(data.get('amount_ghs', 20.00)) # Default deposit 20 GHS
    
    # In a real app, we'd insert into DB as 'pending' here.
    booking_ref = f"BKG-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    # Initialize Paystack Transaction
    url = "https://api.paystack.co/transaction/initialize"
    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    
    # We use Paystack Split to route money
    # Let's say the salon's subaccount code is 'ACCT_xxxx'
    # For dummy implementation, we will just request standard init
    payload = {
        "email": client_email,
        "amount": int(amount_ghs * 100), # Paystack uses pesewas/kobo
        "reference": booking_ref,
        "callback_url": "http://localhost:5000/booking/success",
        "channels": ["mobile_money"],
        "metadata": {
            "custom_fields": [
                {"display_name": "Client Name", "variable_name": "client_name", "value": client_name},
                {"display_name": "Phone Number", "variable_name": "client_phone", "value": client_phone}
            ],
            "booking_type": "momo_deposit"
        }
        # In production with splits:
        # "split_code": "SPL_12345678"
    }

    # Since we are using dummy keys, we will mock the response instead of actually calling Paystack
    if 'dummy' in PAYSTACK_SECRET_KEY:
        mock_response = {
            "status": True,
            "message": "Authorization URL created",
            "data": {
                "authorization_url": f"https://checkout.paystack.com/{booking_ref}",
                "access_code": "dummy_access_code",
                "reference": booking_ref
            }
        }
        return jsonify(mock_response)

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Paystack Init Error: {e}")
        return jsonify({"status": False, "message": "Failed to initialize payment"}), 500

@app.route('/api/webhooks/paystack', methods=['POST'])
def paystack_webhook():
    """Secure endpoint for Paystack webhook events."""
    paystack_signature = request.headers.get('X-Paystack-Signature')
    if not paystack_signature:
        abort(400)

    # Verify signature
    payload = request.data
    hash_obj = hmac.new(PAYSTACK_SECRET_KEY.encode('utf-8'), msg=payload, digestmod=hashlib.sha512)
    expected_signature = hash_obj.hexdigest()

    if expected_signature != paystack_signature:
        app.logger.warning("Invalid Paystack Signature")
        abort(400)

    event_data = json.loads(payload)
    event_type = event_data.get('event')

    if event_type == 'charge.success':
        reference = event_data['data']['reference']
        app.logger.info(f"Payment successful for reference: {reference}")
        
        # 1. Update Booking status to 'confirmed' in DB
        # 2. Update Transaction status to 'success' in DB
        
        # 3. Trigger SMS via local gateway (e.g., Arkesel/mNotify)
        send_sms_notification(
            phone=event_data['data']['metadata']['custom_fields'][1]['value'],
            message=f"Your booking is confirmed! 20 GHS deposit received. See you at the salon."
        )

    return jsonify({"status": "success"}), 200

def send_sms_notification(phone, message):
    """Mock function to send SMS via Arkesel/mNotify"""
    app.logger.info(f"SMS SENT to {phone}: {message}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
