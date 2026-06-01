import React, { useEffect } from 'react';
// Navigate est utilisé pour une redirection immédiate au rendu, useNavigate pour une redirection dans une fonction
import { Navigate, useNavigate } from 'react-router-dom';

// Définition de l'interface (TypeScript) pour typer les props reçues par le composant
interface ProtectedRouteProps {
  children: React.ReactNode; // Représente le composant enfant qui sera affiché si l'accès est autorisé
  roleRequis: number;        // Le niveau de permission exigé pour voir cette page
}

// Ce composant agit autour des pages sensibles
const ProtectedRoute = ({ children, roleRequis }: ProtectedRouteProps) => {
  // Récupération du rôle actuel de l'utilisateur stocké lors de sa connexion
  const roleEnMemoire = localStorage.getItem('userRole');
  const navigate = useNavigate();

  // useEffect gérant la sécurité de la session (déconnexion automatique)
  useEffect(() => {
    // On applique cette règle d'expiration uniquement pour l'Admin (0) ou l'Affichage (2)
    if (roleEnMemoire === "0" || roleEnMemoire === "2") {
      
      // Mise en place d'un "worker" qui vérifie l'état de la session toutes les minutes (60000 ms)
      const interval = setInterval(() => {
        const heureConnexion = localStorage.getItem('loginTime');
        
        if (heureConnexion) {
          // Calcul du temps écoulé entre "maintenant" et l'heure de connexion initiale
          const tempsEcoule = Date.now() - parseInt(heureConnexion);
          
          // Vérification de l'expiration : 30 minutes = 1 800 000 millisecondes
          if (tempsEcoule > 1800000) {
            localStorage.clear(); // On vide le token et les infos pour détruire la session
            alert("Session expirée (30 minutes).");
            navigate('/login');   // Redirection forcée vers l'accueil/login
          }
        }
      }, 60000);

      // Fonction de nettoyage indispensable pour éviter les fuites de mémoire (memory leaks)
      // Si on quitte la page, on détruit le minuteur
      return () => clearInterval(interval);
    }
  }, [roleEnMemoire, navigate]); // Le hook se met à jour si le rôle ou la fonction de navigation change

  // --- Vérification des Droits d'Accès ---
  
  // Si le rôle de l'utilisateur ne correspond pas au rôle requis pour la page demandée
  if (roleEnMemoire !== String(roleRequis)) {
    // Redirection immédiate et silencieuse. 
    // L'attribut 'replace' remplace l'historique de navigation : l'utilisateur ne peut pas faire "Retour"
    return <Navigate to="/login" replace />;
  }

  // Si toutes les vérifications sont bonnes, on affiche la page demandée (les "children")
  return <>{children}</>;
};

export default ProtectedRoute;