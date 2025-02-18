# subscription.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import (
    create_subscription_group,
    get_subscription_group_by_id,
    update_subscription_group,
    fetch_subscriptions_by_user
)
from bson.objectid import ObjectId
from datetime import datetime

subscription_bp = Blueprint('subscription', __name__)

@subscription_bp.route('/create', methods=['POST'])
@jwt_required()
def create_group():
    """
    Create a new subscription group.
    Expected JSON:
    {
        "service_name": "Netflix",
        "cost": 15.99,
        "due_date": "2025-03-01",
        "invitees": ["friend1@example.com", "friend2@example.com"]
    }
    """
    data = request.get_json()
    required_fields = ["service_name", "cost", "due_date", "invitees"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400

    admin_id = get_jwt_identity()  # The creator is the admin
    group_data = {
        "admin_id": admin_id,
        "service_name": data["service_name"],
        "cost": data["cost"],
        "due_date": data["due_date"],
        "invitees": [{"email": email, "status": "Pending"} for email in data["invitees"]],
        "created_at": datetime.utcnow(),
        "paid": False  # Initially not paid
    }
    result = create_subscription_group(group_data)
    group_data["_id"] = str(result.inserted_id)
    return jsonify({"msg": "Subscription group created", "group": group_data}), 201

@subscription_bp.route('/<group_id>/invite', methods=['POST'])
@jwt_required()
def invite_members(group_id):
    """
    Invite additional members to an existing subscription group.
    Expected JSON:
    {
        "invitees": ["newfriend@example.com", "another@example.com"]
    }
    """
    data = request.get_json()
    if "invitees" not in data:
        return jsonify({"msg": "Missing invitees field"}), 400

    group = get_subscription_group_by_id(group_id)
    if not group:
        return jsonify({"msg": "Subscription group not found"}), 404

    # Check if the current user is the admin of this group
    admin_id = get_jwt_identity()
    if group["admin_id"] != admin_id:
        return jsonify({"msg": "Only the group admin can invite new members"}), 403

    # Append new invitees, ensuring no duplicates (by email)
    existing_emails = {invitee["email"] for invitee in group.get("invitees", [])}
    new_invites = []
    for email in data["invitees"]:
        if email not in existing_emails:
            new_invites.append({"email": email, "status": "Pending"})
    
    # Update the group by adding the new invites
    group["invitees"].extend(new_invites)
    update_subscription_group(group_id, {"invitees": group["invitees"]})
    return jsonify({"msg": "Invitees added", "new_invitees": new_invites}), 200

@subscription_bp.route('/<group_id>', methods=['GET'])
@jwt_required()
def get_group_details(group_id):
    """
    Retrieve details of a subscription group, including member statuses.
    """
    group = get_subscription_group_by_id(group_id)
    if not group:
        return jsonify({"msg": "Subscription group not found"}), 404
    
    # Convert ObjectId to string
    group["_id"] = str(group["_id"])
    return jsonify(group), 200

@subscription_bp.route('/<group_id>/pay', methods=['PUT'])
@jwt_required()
def mark_as_paid(group_id):
    """
    Mark a subscription group as paid.
    Expected JSON:
    {
        "paid_by": "friend1@example.com"  // Optional: or a list of payments updates
    }
    For simplicity, this endpoint will mark the group as paid and update all invitees' statuses to "Paid".
    """
    group = get_subscription_group_by_id(group_id)
    if not group:
        return jsonify({"msg": "Subscription group not found"}), 404

    admin_id = get_jwt_identity()
    if group["admin_id"] != admin_id:
        return jsonify({"msg": "Only the group admin can mark the subscription as paid"}), 403

    # Update the group: mark as paid and update all invitees' statuses to "Paid"
    updated_invitees = [{"email": invitee["email"], "status": "Paid"} for invitee in group.get("invitees", [])]
    update_data = {
        "paid": True,
        "invitees": updated_invitees,
        "paid_at": datetime.utcnow()
    }
    update_subscription_group(group_id, update_data)

    group = get_subscription_group_by_id(group_id)
    group["_id"] = str(group["_id"])
    return jsonify({"msg": "Subscription marked as paid", "group": group}), 200

@subscription_bp.route('', methods=['GET'])
@jwt_required()
def get_all_subscriptions():
    """
    Retrieve all subscription groups for the current user.
    This endpoint returns groups where the user is the admin or is an invitee (based on email).
    """
    current_user = get_jwt_identity()
    subscriptions = fetch_subscriptions_by_user(current_user)
    
    # Convert ObjectIds to strings
    for sub in subscriptions:
        sub["_id"] = str(sub["_id"])
    return jsonify(subscriptions), 200
