# Subshare

Subshare is a web application designed to simplify the management and tracking of shared subscription payments. It enables a group of friends to share subscription services (such as Netflix, YouTube Premium, etc.), where one user pays for the service and the rest reimburse their share. The platform provides robust features for user authentication, profile management, subscription group management, and payment tracking.

## Table of Contents

- [Subshare](#subshare)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup \& Installation](#setup--installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [API Documentation](#api-documentation)
  - [Usage](#usage)
  - [Future Improvements](#future-improvements)
  - [License](#license)

## Features

- **User Accounts & Authentication**
  - Sign up with email and password (securely hashed using Flask-Bcrypt)
  - Social login support (Google OAuth integration)
  - JWT-based authentication for secure API access

- **Profile Management**
  - View and update user profile details (name, profile picture, etc.)

- **Dashboard**
  - Personalized dashboard that aggregates all subscription groups for a user (both as admin and invitee)
  - Visual indicators for payment status and subscription details

- **Subscription Group Management**
  - Create a new subscription group with details (service name, cost, due date, invitees)
  - Invite additional members to an existing group
  - Display subscription group details (including admin and invitee statuses)
  - Mark a subscription as paid (with updated invitee payment statuses)

- **Payment Tracking**
  - Log payments made for subscription groups (manual and Venmo integration placeholder)
  - View detailed transaction history for both groups and individual users

## Tech Stack

- **Backend:** Python, Flask, MongoDB, PyMongo, Flask-JWT-Extended, Flask-Bcrypt, Authlib
- **Frontend:** React, React Router, Context API, CSS (with optional styling libraries)
- **CI/CD:** GitHub Actions (for running tests and building the project)

## Setup & Installation

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/subshare.git
   cd subshare/server
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install backend dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**  
   Create a `.env` file in the `server` directory with the following keys (adjust values as needed):

   ```
   MONGO_URI=mongodb://localhost:27017/subshare_dev
   JWT_SECRET_KEY=your-super-secret-key
   SECRET_KEY=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

5. **Run the backend:**

   ```bash
   flask run --host=0.0.0.0 --port=8000
   ```

### Frontend Setup

1. **Navigate to the client directory:**

   ```bash
   cd ../client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the `client` directory with:

   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Run the frontend:**

   ```bash
   npm start
   ```

## API Documentation

Refer to the [Subshare API Documentation](#subshare-api-documentation) section in this README for details on available endpoints, request/response formats, and error handling.

## Usage

- **Authentication:**  
  Users can sign up with email/password or use Google OAuth. Once logged in, a JWT token is stored in local storage and used for all subsequent API calls.

- **Dashboard:**  
  After login, users are redirected to the Dashboard, which aggregates all subscription groups (both those they created and those they were invited to).

- **Subscription Groups:**  
  Users can create new subscription groups, invite friends by email, view subscription details, and mark a subscription as paid.

- **Payment Tracking:**  
  Users can log payments against a subscription group, view payment history for the group, and see their personal payment records.

## Future Improvements

- **Enhanced Venmo Integration:**  
  Replace the placeholder with real Venmo API integration.
- **User Notifications:**  
  Add in-app notifications for pending payments.
- **UI/UX Enhancements:**  
  Improve styling and mobile responsiveness.
- **Additional Social Logins:**  
  Support for other providers such as Facebook.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides an overview of Subshare, explains how to set up and run both the backend and frontend, outlines the API, and describes the project structure. Feel free to customize it further to match any additional changes or requirements.

Would you like any further modifications or additional sections in the README?