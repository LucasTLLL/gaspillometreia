// Import du hook de navigation pour gérer le routage sans rechargement de page
import { useNavigate } from 'react-router-dom'

const NavBarCantine = () => {
    // Initialisation de la fonction de navigation
    const navigate = useNavigate()
    
    return (
        <div>
            {/* Conteneur principal avec Flexbox pour la gestion du responsive :
                - justify-left par défaut (pour les petits écrans/mobiles)
                - justify-center à partir des écrans moyens (grâce au préfixe md:) */}
            <div className="flex md:justify-center justify-left">
                
                {/* Liste horizontale stylisée (classes utilitaires type Tailwind / DaisyUI) */}
                <ul className="menu menu-horizontal bg-secondary">
                    
                    {/* Élément 1 : Redirection vers le tableau de bord des tendances 
                        La largeur s'adapte (w-auto) ou se fixe (md:w-100) selon l'écran */}
                    <li className="w-auto md:w-100 ">
                        {/* On utilise un onClick avec navigate() au lieu d'un href classique pour rester en mode SPA */}
                        <a onClick={() => navigate('/tendance')} className=" flex items-center justify-center">
                            Visualiser les tendances 
                        </a>
                    </li>
                    
                    {/* Élément 2 : Redirection vers l'outil de génération de rapports */}
                    <li className="w-auto md:w-100 ">
                        <a onClick={() => navigate('/rapport')} className=" flex items-center justify-center">
                            Générer les rapports
                        </a>
                    </li>
                    
                    {/* Élément 3 : Redirection vers le formulaire d'ajout des menus */}
                    <li className="w-auto md:w-100 ">
                        <a onClick={() => navigate('/menu')} className=" flex items-center justify-center">
                            Importer les menus
                        </a>
                    </li>
                    
                </ul>
            </div>
        </div>
    )
}

export default NavBarCantine