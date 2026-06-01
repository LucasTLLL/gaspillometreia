// Importation de l'icône de gestion de compte depuis la librairie d'icônes
import { UserCog } from "lucide-react"
// Importation de la barre de navigation dédiée à la zone administration
import NavBArAdmin from "./NavBArAdmin"

// Déclaration du composant principal pour le panneau d'administration
const AdminPanels = () => {
  return (
    <div>
      {/* Inclusion du composant de navigation supérieure */}
      <div>
        <NavBArAdmin />
      </div>

      {/* Zone de contenu principal de la page d'administration */}
      <div>
        {/* En-tête de section avec mise en page responsive via Tailwind CSS :
            - flex-col : alignement vertical sur mobile
            - md:flex-row : passage en alignement horizontal sur écran PC
            - bg-base-100, rounded-3xl, shadow-sm : styles de la carte (fond, arrondis, ombre) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-8 ml-5 mr-5 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300">
          
          <div>
            {/* Titre de l'IHM avec alignement vertical de l'icône et du texte (items-center) */}
            <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
              <UserCog className="text-info h-8 w-8" />
              Gestion des utilisateurs
            </h1>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default AdminPanels