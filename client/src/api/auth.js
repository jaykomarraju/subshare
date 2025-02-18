// src/api/auth.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Sign up a new user
 * @param {Object} userData - { email, password }
 * @returns {Promise<Object>}
 */
export async function signUp(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Signup failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Log in a user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - Returns the JWT token and any other info
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }
    return data; // Should include access_token
  } catch (error) {
    throw error;
  }
}

// Optionally, you can add functions to handle Google OAuth flows if needed.
