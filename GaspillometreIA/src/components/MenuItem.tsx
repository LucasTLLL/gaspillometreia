import { Trash } from "lucide-react"

// Définition de la structure d'un Menu pour TypeScript
// Cela garantit qu'on ne passera pas de mauvaises données à ce composant
type MenuType = {
    id: number;
    aliment: string;
    qte: string;
    date: string;
}

// Définition des "Props" (les paramètres que le composant parent va envoyer à cet enfant)
type Props = {
    menu: MenuType;       // L'objet contenant les infos du plat
    onDelete: () => void; // La fonction à déclencher si on clique sur la poubelle
}

// Composant fonctionnel "Enfant" gérant l'affichage d'une seule ligne de la liste
// On déstructure directement { menu, onDelete } depuis les Props pour simplifier le code
const MenuItem = ({ menu, onDelete }: Props) => {
    return (
        <li className="p-3">
            <div className="flex justify-between items-center gap-4">
                
                {/* Affichage des données dynamiques passées par le parent */}
                <div className="flex items-center gap-2 font-medium">
                    {menu.aliment} - {menu.qte} g
                </div>
              
                {/* Bouton de suppression : au clic, il exécute la fonction du parent */}
                <button className="btn btn-sm btn-error btn-soft" onClick={onDelete}>
                    <Trash className="w-4 h-4"/>
                </button>
                
            </div>
        </li>
    )
}

export default MenuItem