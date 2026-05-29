import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequis: number;
}

const ProtectedRoute = ({ children, roleRequis }: ProtectedRouteProps) => {
  const roleEnMemoire = localStorage.getItem('userRole');
  const navigate = useNavigate();

  useEffect(() => {
  
    if (roleEnMemoire === "0" || roleEnMemoire === "2") {
      
   
      const interval = setInterval(() => {
        const heureConnexion = localStorage.getItem('loginTime');
        if (heureConnexion) {
          const tempsEcoule = Date.now() - parseInt(heureConnexion);
          
          // 30 minutes = 1 800 000 millisecondes
          if (tempsEcoule > 1800000) {
            localStorage.clear(); 
            alert("Session expirée (30 minutes).");
            navigate('/login'); 
          }
        }
      }, 60000);

      
      return () => clearInterval(interval);
    }
  }, [roleEnMemoire, navigate]);

  // 🛡️ LE BLOCAGE CLASSIQUE DES PAGES
  if (roleEnMemoire !== String(roleRequis)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
