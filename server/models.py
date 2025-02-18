# models.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()

# Connect to MongoDB using the URI from environment variables
client = MongoClient(os.getenv('MONGO_URI'))
db = client.get_default_database()

# Define the collection for users
users_collection = db.users

def find_user_by_email(email: str):
    return users_collection.find_one({"email": email})

def find_user_by_id(user_id: str):
    """Retrieve a user document by its ObjectId string."""
    return users_collection.find_one({"_id": ObjectId(user_id)})

def create_user(user_data: dict):
    return users_collection.insert_one(user_data)

def update_user_profile(user_id: str, update_data: dict):
    """Update a user's profile with the provided fields."""
    return users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

# ----- Subscription Group Models -----

# Create a new collection for subscription groups
subscription_groups_collection = db.subscription_groups

def create_subscription_group(group_data: dict):
    """Insert a new subscription group into the collection."""
    return subscription_groups_collection.insert_one(group_data)

def get_subscription_group_by_id(group_id: str):
    """Retrieve a subscription group by its ObjectId string."""
    return subscription_groups_collection.find_one({"_id": ObjectId(group_id)})

def update_subscription_group(group_id: str, update_data: dict):
    """Update a subscription group with provided data."""
    return subscription_groups_collection.update_one({"_id": ObjectId(group_id)}, {"$set": update_data})

def fetch_subscriptions_by_user(user_id: str):
    """
    Fetch all subscription groups for the given user.
    Returns groups where the user is the admin OR where the user's email is found in the invitees list.
    """
    # Get the user's email from the users collection
    user = find_user_by_id(user_id)
    if not user:
        return []
    user_email = user.get("email")
    
    # Query for groups where the user is the admin OR their email is in the invitees array
    return list(subscription_groups_collection.find({
        "$or": [
            {"admin_id": user_id},
            {"invitees.email": user_email}
        ]
    }))

# ----- Payment Tracking Models -----

# Create a new collection for payments
payments_collection = db.payments

def create_payment(payment_data: dict):
    """Insert a new payment record into the collection."""
    return payments_collection.insert_one(payment_data)

def get_payments_for_group(group_id: str):
    """Retrieve all payments for a given subscription group."""
    return list(payments_collection.find({"group_id": group_id}))

def get_payments_for_user(user_id: str):
    """Retrieve all payments logged by a given user."""
    return list(payments_collection.find({"payer_id": user_id}))
