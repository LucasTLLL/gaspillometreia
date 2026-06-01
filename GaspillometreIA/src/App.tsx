import { useState } from 'react';
// Importation des composants fondamentaux de React Router pour orchestrer le routage
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importation de l'ensemble des vues/composants du projet
import Tendance from "./components/Tendance";
import Rapport from "./components/Rapport";
import AffichageSelf from "./components/AffichageSelf";
import AdminPanels from "./components/AdminPanels";
import LogAdmin from './components/LogAdmin';
import GestionAdmin from './components/GestionAdmin';
import Login from './components/Login';
import Menu from './components/Menu';

// Importation du composant de sécurité pour restreindre l'accès
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    // BrowserRouter : Initialise le contexte de navigation globale 
    <BrowserRouter>
      {/* Routes : Conteneur principal qui examine l'URL courante pour afficher la bonne vue */}
      <Routes>
     
        {/* --- Route Publique --- */}
        {/* Page d'authentification accessible par tout le monde */}
        <Route path="/login" element={<Login onLoginSuccess={() => { }} />} />


        {/* --- Routes Protégées : Espace Administrateur (Role 0) --- */}
        {/* Chaque composant admin est enveloppé dans ProtectedRoute avec le rôle requis correspondant */}
        <Route
          path="/AdminPanels"
          element={
            <ProtectedRoute roleRequis={0}>
              <AdminPanels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/LogAdmin"
          element={
            <ProtectedRoute roleRequis={0}>
              <LogAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GestionAdmin"
          element={
            <ProtectedRoute roleRequis={0}>
              <GestionAdmin />
            </ProtectedRoute>
          }
        />


        {/* --- Routes Protégées : Espace Gestion Cantine / Personnel (Role 1) --- */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute roleRequis={1}>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tendance"
          element={
            <ProtectedRoute roleRequis={1}>
              <Tendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rapport"
          element={
            <ProtectedRoute roleRequis={1}>
              <Rapport />
            </ProtectedRoute>
          }
        />


        {/* --- Route Protégée : Écran d'Affichage du Self (Role 2) --- */}
        <Route
          path="/AffichageSelf"
          element={
            <ProtectedRoute roleRequis={2}>
              <AffichageSelf />
            </ProtectedRoute>
          }
        />


        {/* --- Redirection Générique / Sécurité --- */}
        {/* Si l'utilisateur saisit une URL inexistante (ex: /nimportequoi), 
            le caractère "*" capte l'erreur et le redirige automatiquement vers le Login */}
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;