import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Importation des styles CSS globaux (incluant les directives Tailwind)
import App from './App.tsx' // Importation du composant racine de l'application

// --- Point d'ancrage avec le HTML réel ---
// 1. On va chercher la balise div avec l'id "root" située dans le fichier public/index.html
// 2. Le point d'exclamation "!" indique à TypeScript qu'on est certain que cet élément existe
// 3. createRoot initialise le DOM virtuel de React sur cet élément
createRoot(document.getElementById('root')!).render(
  // <StrictMode> : Outil de développement qui vérifie que le code ne contient pas de bugs ou de fonctions obsolètes
  <StrictMode>
    {/* Injection et rendu du composant principal App qui contient toutes nos routes */}
    <App />
  </StrictMode>,
)