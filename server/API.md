# Subshare API Documentation

This document outlines the API endpoints for Subshare, a platform for managing shared subscription payments. All endpoints (unless specified otherwise) expect JSON payloads and require JWT authentication for access.

> **Note:** All protected endpoints require an `Authorization: Bearer <jwt_token>` header.

---

## Table of Contents

- [Subshare API Documentation](#subshare-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [1. User Accounts \& Authentication](#1-user-accounts--authentication)
    - [Sign Up](#sign-up)
    - [Login](#login)
    - [Google OAuth Login](#google-oauth-login)
  - [2. Profile Management](#2-profile-management)
    - [Get Profile](#get-profile)
    - [Update Profile](#update-profile)
  - [3. Subscription Group Management](#3-subscription-group-management)
    - [Create Subscription Group](#create-subscription-group)
    - [Invite Members](#invite-members)
    - [Get Group Details](#get-group-details)
    - [Mark Subscription as Paid](#mark-subscription-as-paid)
  - [4. Payment Tracking](#4-payment-tracking)
    - [Log a Payment](#log-a-payment)
    - [Get Payment History for a Group](#get-payment-history-for-a-group)
    - [Get Payment History for a User](#get-payment-history-for-a-user)
    - [Venmo Integration Placeholder](#venmo-integration-placeholder)
  - [5. Dashboard](#5-dashboard)
  - [Error Handling](#error-handling)
  - [Final Notes](#final-notes)

---

## 1. User Accounts & Authentication

### Sign Up

**Endpoint:** `POST /auth/signup`

**Description:**  
Create a new user using an email and password. Passwords are securely hashed.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "YourSecurePassword"
}
```

**Response (Success - 201):**

```json
{
  "msg": "User created successfully"
}
```

**Errors:**
- 400: Missing email/password or user already exists.

---

### Login

**Endpoint:** `POST /auth/login`

**Description:**  
Authenticate a user using email and password and return a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "YourSecurePassword"
}
```

**Response (Success - 200):**

```json
{
  "access_token": "jwt-token-here"
}
```

**Errors:**
- 400: Missing email/password.
- 401: Invalid email or password.

---

### Google OAuth Login

**Endpoints:**

- **Initiate Login:** `GET /auth/login/google`  
  Redirects the user to Google’s OAuth 2.0 consent page.

- **Callback:** `GET /auth/login/google/callback`  
  Handles the OAuth callback, creates (or updates) the user record, and returns a JWT token.

**Flow:**
1. User accesses `/auth/login/google` and is redirected to Google.
2. After consent, Google redirects back to `/auth/login/google/callback`.
3. A JWT token is returned in the JSON response.

---

## 2. Profile Management

### Get Profile

**Endpoint:** `GET /profile/`

**Description:**  
Retrieve the currently logged-in user’s profile.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Response (Success - 200):**

```json
{
  "_id": "user_object_id",
  "email": "user@example.com",
  "name": "User Name",
  "profile_picture": "http://example.com/profile.jpg",
  // ... any additional fields
}
```

**Errors:**
- 404: User not found.

---

### Update Profile

**Endpoint:** `PUT /profile/`

**Description:**  
Update the current user’s profile information. **Note:** The password field cannot be updated here.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "name": "New Name",
  "profile_picture": "http://example.com/newprofile.jpg"
}
```

**Response (Success - 200):**

```json
{
  "_id": "user_object_id",
  "email": "user@example.com",
  "name": "New Name",
  "profile_picture": "http://example.com/newprofile.jpg"
}
```

**Errors:**
- 400: Attempting to update restricted fields (e.g., password).

---

## 3. Subscription Group Management

### Create Subscription Group

**Endpoint:** `POST /subscription/create`

**Description:**  
Create a new subscription group for sharing a subscription (e.g., Netflix). The creator becomes the group admin.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "service_name": "Netflix",
  "cost": 15.99,
  "due_date": "2025-03-01",
  "invitees": ["friend1@example.com", "friend2@example.com"]
}
```

**Response (Success - 201):**

```json
{
  "msg": "Subscription group created",
  "group": {
    "_id": "group_object_id",
    "admin_id": "admin_user_id",
    "service_name": "Netflix",
    "cost": 15.99,
    "due_date": "2025-03-01",
    "invitees": [
      {"email": "friend1@example.com", "status": "Pending"},
      {"email": "friend2@example.com", "status": "Pending"}
    ],
    "created_at": "timestamp",
    "paid": false
  }
}
```

**Errors:**
- 400: Missing required fields.

---

### Invite Members

**Endpoint:** `POST /subscription/<group_id>/invite`

**Description:**  
Invite additional members to an existing subscription group. Only the group admin can add invitees.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "invitees": ["newfriend@example.com", "another@example.com"]
}
```

**Response (Success - 200):**

```json
{
  "msg": "Invitees added",
  "new_invitees": [
    {"email": "newfriend@example.com", "status": "Pending"},
    {"email": "another@example.com", "status": "Pending"}
  ]
}
```

**Errors:**
- 400: Missing invitees field.
- 403: User is not the group admin.
- 404: Subscription group not found.

---

### Get Group Details

**Endpoint:** `GET /subscription/<group_id>`

**Description:**  
Retrieve details of a subscription group, including member statuses.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Response (Success - 200):**

```json
{
  "_id": "group_object_id",
  "admin_id": "admin_user_id",
  "service_name": "Netflix",
  "cost": 15.99,
  "due_date": "2025-03-01",
  "invitees": [
    {"email": "friend1@example.com", "status": "Pending"},
    {"email": "friend2@example.com", "status": "Pending"}
  ],
  "created_at": "timestamp",
  "paid": false
}
```

**Errors:**
- 404: Subscription group not found.

---

### Mark Subscription as Paid

**Endpoint:** `PUT /subscription/<group_id>/pay`

**Description:**  
Mark a subscription group as paid. Only the group admin can mark the group as paid. This endpoint updates all invitees' statuses to "Paid" and records the payment timestamp.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body (Optional):**

```json
{
  "paid_by": "friend1@example.com" // Optional if specific payer detail is required
}
```

**Response (Success - 200):**

```json
{
  "msg": "Subscription marked as paid",
  "group": {
    "_id": "group_object_id",
    "admin_id": "admin_user_id",
    "service_name": "Netflix",
    "cost": 15.99,
    "due_date": "2025-03-01",
    "invitees": [
      {"email": "friend1@example.com", "status": "Paid"},
      {"email": "friend2@example.com", "status": "Paid"}
    ],
    "created_at": "timestamp",
    "paid": true,
    "paid_at": "timestamp"
  }
}
```

**Errors:**
- 403: User is not the group admin.
- 404: Subscription group not found.

---

## 4. Payment Tracking

### Log a Payment

**Endpoint:** `POST /payments/log`

**Description:**  
Log a payment made for a subscription group. This endpoint records payment details including amount, method, and any relevant details.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "group_id": "<group_object_id>",
  "amount": 15.99,
  "method": "venmo",  // or "manual"
  "details": "Venmo txn id: 12345"
}
```

**Response (Success - 201):**

```json
{
  "msg": "Payment logged",
  "payment": {
    "_id": "payment_object_id",
    "group_id": "<group_object_id>",
    "payer_id": "current_user_id",
    "amount": 15.99,
    "method": "venmo",
    "details": "Venmo txn id: 12345",
    "payment_date": "timestamp"
  }
}
```

**Optional Behavior:**  
- This endpoint can also update the subscription group’s invitee status for the payer (if applicable).

---

### Get Payment History for a Group

**Endpoint:** `GET /payments/group/<group_id>`

**Description:**  
Retrieve all payment records for a given subscription group. Intended for use by the group admin.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Response (Success - 200):**

```json
[
  {
    "_id": "payment_object_id",
    "group_id": "<group_object_id>",
    "payer_id": "user_id",
    "amount": 15.99,
    "method": "venmo",
    "details": "Venmo txn id: 12345",
    "payment_date": "timestamp"
  },
  // ... additional payment records
]
```

---

### Get Payment History for a User

**Endpoint:** `GET /payments/user`

**Description:**  
Retrieve all payment records logged by the currently authenticated user.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Response (Success - 200):**

```json
[
  {
    "_id": "payment_object_id",
    "group_id": "<group_object_id>",
    "payer_id": "current_user_id",
    "amount": 15.99,
    "method": "venmo",
    "details": "Venmo txn id: 12345",
    "payment_date": "timestamp"
  }
  // ... additional payment records
]
```

---

### Venmo Integration Placeholder

**Endpoint:** `GET /payments/venmo/integrate`

**Description:**  
A placeholder endpoint for Venmo integration. In a complete implementation, this endpoint would handle the OAuth flow and transaction verification with Venmo. For now, it returns dummy payment details.

**Headers:**  
`Authorization: Bearer <jwt_token>`

**Response (Success - 200):**

```json
{
  "venmo_transaction_id": "dummy_venmo_txn_12345",
  "status": "Success",
  "amount": 15.99,
  "message": "Venmo integration placeholder"
}
```

---

## 5. Dashboard

**Note:**  
There is no single dashboard endpoint. The frontend dashboard is composed by aggregating data from the following endpoints:
- **User Profile:** `/profile/`
- **Subscription Group Details:** `/subscription/<group_id>`
- **Group Payment History:** `/payments/group/<group_id>`
- **User Payment History:** `/payments/user`

The frontend can use these endpoints to display active subscriptions, payment statuses, and notifications using visual indicators (e.g., color coding, progress bars).

---

## Error Handling

- **404 Not Found:** Returned when a requested resource (user, group, payment) cannot be found.
- **500 Internal Server Error:** Returned when an unexpected error occurs on the server.
- Additional error messages are provided in the JSON response with a `msg` field.

---

## Final Notes

- **Authentication:** All protected endpoints require a valid JWT token.
- **Environment:** Ensure your environment variables (e.g., `MONGO_URI`, `JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`, etc.) are correctly set.
- **Testing:** Use tools like Postman or cURL to test endpoints individually before integrating with the frontend.