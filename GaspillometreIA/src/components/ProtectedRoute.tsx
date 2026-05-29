import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequis: number; 
}

const ProtectedRoute = ({ children, roleRequis }: ProtectedRouteProps) => {

  const roleEnMemoire = localStorage.getItem('userRole');


  if (roleEnMemoire !== String(roleRequis)) {

    return <Navigate to="/login" replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;