import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteadmin = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return currentUser.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouteadmin;
