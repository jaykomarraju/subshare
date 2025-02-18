// src/api/profile.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Helper to get Authorization headers with token
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

/**
 * Fetch the current user's profile
 * @returns {Promise<Object>}
 */
export async function getProfile() {
  try {
    const response = await fetch(`${API_URL}/profile/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get profile');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update the current user's profile
 * @param {Object} updateData - e.g. { name, profile_picture }
 * @returns {Promise<Object>}
 */
export async function updateProfile(updateData) {
  try {
    const response = await fetch(`${API_URL}/profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to update profile');
    }
    return data;
  } catch (error) {
    throw error;
  }
}
