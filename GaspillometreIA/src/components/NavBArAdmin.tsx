// Import des icônes pour habiller les boutons
import { ClipboardX, ScrollText, ShieldAlert, UserPen } from "lucide-react"
// Import du hook de navigation fourni par React Router
import { useNavigate } from "react-router-dom"

const NavBArAdmin = () => {

  // Initialisation du hook pour permettre les redirections dynamiques
  const navigate = useNavigate()

  return (
    <div>
      {/* --- En-tête de l'espace Administrateur --- */}
      {/* Utilisation de marges et de Flexbox pour centrer et mettre en forme le bloc */}
      <div className="flex flex-col mt-10 ml-50 mr-50 justify-between items-center mb-8 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300">
        <div>
          {/* Titre avec alignement de l'icône et du texte sur la même ligne */}
          <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
            <ShieldAlert className="text-error h-8 w-8" />
            Centre de Contrôle Admin
          </h1>
          <p className="text-base-content/60">Gestion globale du Gaspillomètre</p>
        </div>
      </div>
      
      <div></div>
    
      {/* --- Menu de navigation --- */}
      <div className="flex justify-center">
        {/* Conteneur principal des boutons (occupe la moitié de l'écran avec w-1/2) */}
        <div className="w-1/2 bg-base-100 rounded-3xl shadow-sm border border-accent px-3 py-2">
          
          <div className="flex items-center">
            {/* Bouton 1 : Redirection vers la gestion des utilisateurs */}
            {/* onClick exécute une fonction fléchée anonyme qui appelle navigate() */}
            <button 
              className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center"
              onClick={() => navigate('/AdminPanels')} 
            >
              <UserPen /> Utilisateurs
            </button>
            
            {/* Bouton 2 : Redirection vers la page des logs système */}
            <button 
              className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center"
              onClick={() => navigate('/LogAdmin')} 
            >
              <ScrollText /> Log
            </button>
            
            {/* Bouton 3 : Redirection vers l'ajout de menus */}
            <button 
              className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center"
              onClick={() => navigate('/GestionAdmin')} 
            >
              <ClipboardX /> Gestion
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default NavBArAdmin