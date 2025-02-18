from flask import Blueprint, request, jsonify, redirect, url_for, current_app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models import find_user_by_email, create_user
import os

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# --- Email/Password Endpoints ---

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Email and password are required"}), 400

    # Check if user already exists
    if find_user_by_email(data['email']):
        return jsonify({"msg": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create the user record
    user = {
        "email": data['email'],
        "password": hashed_password,
    }
    create_user(user)
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Email and password are required"}), 400

    user = find_user_by_email(data['email'])
    if not user:
        return jsonify({"msg": "Invalid email or password"}), 401

    # Verify password
    if not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"msg": "Invalid email or password"}), 401

    # Create a new access token
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify(access_token=access_token), 200

# --- Google Social Login Endpoints ---

@auth_bp.route('/login/google')
def google_login():
    """
    Redirect the user to Google's OAuth 2.0 consent page.
    """
    redirect_uri = url_for('auth.google_callback', _external=True)
    return current_app.oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/login/google/callback')
def google_callback():
    """
    Handle the callback from Google
    """
    try:
        token = current_app.oauth.google.authorize_access_token()
        user_info = current_app.oauth.google.parse_id_token(token)
        
        if not user_info:
            return jsonify({"msg": "Failed to retrieve user info from Google"}), 400

        email = user_info.get("email")
        if not email:
            return jsonify({"msg": "Google account has no email associated"}), 400

        # Check if user exists
        user = find_user_by_email(email)
        if not user:
            # Create new user
            new_user = {
                "email": email,
                "name": user_info.get("name"),
                "social": "google"
            }
            create_user(new_user)
            user = find_user_by_email(email)

        # Create JWT token
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"msg": "Failed to authorize with Google", "error": str(e)}), 400