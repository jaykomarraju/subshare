// src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);

  if (!authData.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
