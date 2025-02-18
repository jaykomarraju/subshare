# server/profile.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import find_user_by_id, update_user_profile

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    """Return the profile of the currently logged-in user."""
    user_id = get_jwt_identity()
    user = find_user_by_id(user_id)
    if user:
        # Remove sensitive fields (e.g., password) before returning data.
        user.pop('password', None)
        # Convert ObjectId to string for JSON serialization.
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({"msg": "User not found"}), 404

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    """Allow the user to update their profile information."""
    user_id = get_jwt_identity()
    data = request.get_json()

    # Prevent updating restricted fields
    if "password" in data:
        return jsonify({"msg": "Password update not allowed via this endpoint"}), 400

    update_result = update_user_profile(user_id, data)
    if update_result.modified_count:
        updated_user = find_user_by_id(user_id)
        updated_user.pop('password', None)
        updated_user['_id'] = str(updated_user['_id'])
        return jsonify(updated_user), 200

    return jsonify({"msg": "No changes made"}), 200
