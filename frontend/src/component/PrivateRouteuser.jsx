import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteuser = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return currentUser.role === 'user' ? <Outlet /> : <Navigate to="/admindashboard" />;
};

export default PrivateRouteuser;
