// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around our app
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    user: null,
    token: null,
  });

  // Load authentication data from local storage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthData({ token, user: JSON.parse(user) });
    }
  }, []);

  // Function to handle login
  const login = async (email, password) => {
    try {
      // Make API call to /auth/login
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Assume the API returns an access_token and optionally user info.
        const { access_token } = data;
        // Here, you may choose to decode the token or make another API call to fetch user info.
        // For simplicity, we'll store the token and set a dummy user.
        const user = { email }; // Replace with actual user data if available.
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthData({ token: access_token, user });
        return { success: true };
      } else {
        return { success: false, message: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthData({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
