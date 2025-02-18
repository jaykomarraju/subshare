const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Helper to get Authorization headers with token
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

/**
 * Create a new subscription group
 * @param {Object} groupData - { service_name, cost, due_date, invitees }
 * @returns {Promise<Object>}
 */
export async function createSubscriptionGroup(groupData) {
  try {
    const response = await fetch(`${API_URL}/subscription/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to create subscription group');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Invite members to an existing subscription group
 * @param {string} groupId 
 * @param {Array} invitees - Array of email strings
 * @returns {Promise<Object>}
 */
export async function inviteMembers(groupId, invitees) {
  try {
    const response = await fetch(`${API_URL}/subscription/${groupId}/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invitees }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to invite members');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get subscription group details by groupId
 * @param {string} groupId 
 * @returns {Promise<Object>}
 */
export async function getGroupDetails(groupId) {
  try {
    const response = await fetch(`${API_URL}/subscription/${groupId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to get group details');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Mark a subscription group as paid
 * @param {string} groupId 
 * @param {Object} payData - Optional data such as { paid_by }
 * @returns {Promise<Object>}
 */
export async function markSubscriptionAsPaid(groupId, payData = {}) {
  try {
    const response = await fetch(`${API_URL}/subscription/${groupId}/pay`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to mark subscription as paid');
    }
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch all subscription groups for the logged-in user.
 * Returns groups where the user is either the admin or an invitee.
 * @returns {Promise<Array>}
 */
export async function getSubscriptions() {
  try {
    const response = await fetch(`${API_URL}/subscription`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to fetch subscriptions');
    }
    return data;
  } catch (error) {
    throw error;
  }
}
