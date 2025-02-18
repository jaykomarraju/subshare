# server/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from authlib.integrations.flask_client import OAuth

# Load environment variables
load_dotenv()

# Initialize extensions
oauth = OAuth()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    # Set configuration variables from environment
    app.config.update(
        MONGO_URI=os.getenv('MONGO_URI', 'mongodb://localhost:27017/mydb'),
        JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY', 'super-secret-key'),
        SECRET_KEY=os.getenv('SECRET_KEY', 'your-secret-key'),  # Required for OAuth
        GOOGLE_CLIENT_ID=os.getenv('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET=os.getenv('GOOGLE_CLIENT_SECRET'),
        GOOGLE_DISCOVERY_URL="https://accounts.google.com/.well-known/openid-configuration"
    )

    # Enable CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialize extensions with app
    jwt.init_app(app)
    bcrypt.init_app(app)
    oauth.init_app(app)

    # Configure Google OAuth
    oauth.register(
        name='google',
        server_metadata_url=app.config['GOOGLE_DISCOVERY_URL'],
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        client_kwargs={
            'scope': 'openid email profile',
            'prompt': 'select_account'
        }
    )

    # Make oauth instance available to the app
    app.oauth = oauth

    # Import and register blueprints
    from auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    from profile import profile_bp
    app.register_blueprint(profile_bp, url_prefix='/profile')
    
    from subscription import subscription_bp
    app.register_blueprint(subscription_bp, url_prefix='/subscription')
    
    from payments import payments_bp
    app.register_blueprint(payments_bp, url_prefix='/payments')

    # Basic route for testing
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Hello from Subshare Flask server!',
            'status': 'operational'
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Not Found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal Server Error'}), 500

    return app

def main():
    app = create_app()
    port = int(os.getenv('PORT', 8000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    )

if __name__ == '__main__':
    main()
