# server/payments.py
from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import create_payment, get_payments_for_group, get_payments_for_user, get_subscription_group_by_id, update_subscription_group
from bson.objectid import ObjectId
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/log', methods=['POST'])
@jwt_required()
def log_payment():
    """
    Log a payment for a subscription group.
    Expected JSON:
    {
        "group_id": "<group_id>",
        "amount": 15.99,
        "method": "manual" or "venmo",
        "details": "Optional details, e.g., Venmo transaction id"
    }
    """
    data = request.get_json()
    required_fields = ["group_id", "amount", "method"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400

    payer_id = get_jwt_identity()
    payment_data = {
        "group_id": data["group_id"],
        "payer_id": payer_id,
        "amount": data["amount"],
        "method": data["method"],
        "details": data.get("details", ""),
        "payment_date": datetime.utcnow()
    }
    result = create_payment(payment_data)
    payment_data["_id"] = str(result.inserted_id)

    # Optionally, update the subscription group to record the payment status for the payer.
    group = get_subscription_group_by_id(data["group_id"])
    if group:
        # Update invitee status for the payer if found
        updated_invitees = []
        for invitee in group.get("invitees", []):
            if invitee["email"] == data.get("payer_email", ""):
                invitee["status"] = "Paid"
            updated_invitees.append(invitee)
        update_subscription_group(data["group_id"], {"invitees": updated_invitees})
    
    return jsonify({"msg": "Payment logged", "payment": payment_data}), 201

@payments_bp.route('/group/<group_id>', methods=['GET'])
@jwt_required()
def get_group_payments(group_id):
    """
    Retrieve all payment records for a given subscription group.
    Intended for use by the group admin.
    """
    payments = get_payments_for_group(group_id)
    # Convert ObjectIds to strings for JSON serialization
    for payment in payments:
        payment["_id"] = str(payment["_id"])
    return jsonify(payments), 200

@payments_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_payments():
    """
    Retrieve all payment records logged by the currently logged-in user.
    """
    user_id = get_jwt_identity()
    payments = get_payments_for_user(user_id)
    for payment in payments:
        payment["_id"] = str(payment["_id"])
    return jsonify(payments), 200

# ----- Venmo Integration Placeholder -----

@payments_bp.route('/venmo/integrate', methods=['GET'])
@jwt_required()
def venmo_integration():
    """
    A placeholder endpoint for Venmo integration.
    In a real implementation, this would:
      - Redirect the payer to Venmo's OAuth consent page
      - Handle the callback to exchange the code for an access token
      - Retrieve payment details from Venmo
    For now, this simulates a successful Venmo integration.
    """
    # This is where you would add the Venmo OAuth flow.
    # For now, we'll simulate by returning a dummy Venmo payment detail.
    dummy_payment = {
        "venmo_transaction_id": "dummy_venmo_txn_12345",
        "status": "Success",
        "amount": 15.99,
        "message": "Venmo integration placeholder"
    }
    return jsonify(dummy_payment), 200
