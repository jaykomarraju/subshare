// src/api/payments.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Helper to get Authorization headers with token
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

/**
 * Log a payment for a subscription group
 * @param {Object} paymentData - { group_id, amount, method, details }
 * @returns {Promise<Object>}
 */
export async function logPayment(paymentData) {
  try {
    const response = await fetch(`${API_URL}/payments/log`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to log payment');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get payment history for a given subscription group
 * @param {string} groupId 
 * @returns {Promise<Array>}
 */
export async function getGroupPayments(groupId) {
  try {
    const response = await fetch(`${API_URL}/payments/group/${groupId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get group payments');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get payment history for the current user
 * @returns {Promise<Array>}
 */
export async function getUserPayments() {
  try {
    const response = await fetch(`${API_URL}/payments/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get user payments');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Venmo integration placeholder – returns dummy payment details
 * @returns {Promise<Object>}
 */
export async function integrateVenmo() {
  try {
    const response = await fetch(`${API_URL}/payments/venmo/integrate`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Venmo integration failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
}
