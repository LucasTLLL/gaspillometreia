import { CirclePlus, CloudDownload } from "lucide-react";
import MenuItem from "./MenuItem"
import NavBarCantine from "./NavBarCantine"
import { useState } from 'react'

// Typage strict avec TypeScript pour s'assurer que chaque plat a bien ces 4 propriétés
type MenuType = {
    id: number;
    aliment: string;
    qte: string;
    date: string;
}

const Menu = () => {

    // States contrôlant les inputs de l'utilisateur
    const [value, setValue] = useState('')
    const [quantite, setQuantite] = useState('')

    // State contenant la liste des plats ajoutés temporairement (côté client)
    const [menus, setMenus] = useState<MenuType[]>([])

    // Fonction pour ajouter un plat à la liste visuelle
    function addMenu() {
        // Sécurité : on empêche l'ajout si le nom du plat est vide ou ne contient que des espaces
        if (value.trim() == "") {
            return
        }

        // On récupère la date du jour et on la coupe pour garder juste le format YYYY-MM-DD
        const datedjour = new Date().toISOString().split('T')[0];

        // Création de l'objet plat
        const newMenu: MenuType = {
            id: Number(Date.now().toString().slice(-7)), // Génération d'un ID aléatoire basé sur le temps
            aliment: value.trim(),
            qte: quantite.trim(),
            date: datedjour
        }

        // Ajout du nouveau plat en tête de liste grâce au spread operator (...)
        const newMenus = [newMenu, ...menus]
        setMenus(newMenus)
        
        // Réinitialisation des inputs pour la saisie suivante
        setValue('')
        setQuantite('')
    }

    // Fonction pour retirer un plat de la liste si on s'est trompé
    function deleteMenu(id: number) {
        // On recrée un tableau sans le plat qui correspond à l'ID cliqué
        const newMenus = menus.filter(menu => menu.id !== id);
        setMenus(newMenus);
    }

    // Fonction asynchrone pour insérer la liste finale dans la base de données
    async function addMenuBDD() {
        // Inutile d'envoyer une requête si la liste est vide
        if (menus.length === 0) return;

        // Bonne pratique : Récupération dynamique du token de session stocké à la connexion
        const Token = localStorage.getItem('userToken') || "";
        const tokenSecurise = encodeURIComponent(Token); // Encodage des caractères spéciaux

        // Boucle pour envoyer les requêtes l'une après l'autre (évite de spammer l'API)
        for (const menu of menus) {
            try {
                // Requête HTTP POST vers l'API
                const reponse = await fetch(
                    `http://10.0.200.78:8000/insertmenu?id=${menu.id}&aliment=${menu.aliment}&qte=${menu.qte}&date=${menu.date}&rasp=rasp1&token=${tokenSecurise}`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                // Vérification du statut de la réponse HTTP
                if (reponse.ok) {
                    console.log(`${menu.aliment} ajouté en BDD !`);
                } else {
                    console.error(`Erreur serveur pour ${menu.aliment} :`, reponse.status);
                }
            } catch (error) {
                console.error(`Erreur réseau pour ${menu.aliment} :`, error);
            }
        }

        console.log("menu:", menus)
        alert("Tous les plats ont été envoyés !");
    }

    return (
        <div>
            {/* Navigation spécifique à la partie Cantine */}
            <div><NavBarCantine /></div>
            
            <div>
                <p className="font-bold text-accent flex justify-center text-4xl m-5">Menu du jour</p>
                <br />
            </div>
            
            {/* Formulaire d'ajout rapide */}
            <div className="flex justify-center gap-2 ml-15 mr-15 md:m-auto">
                <input type="text"
                    placeholder="Entrez le plat "
                    className="input input-l"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <input type="number"
                    placeholder="Entrez la quantité ( g )"
                    className="input input-l w-auto md:w-40"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                />

                <button type="submit" className="btn btn-accent ml-2" onClick={addMenu}> 
                    <CirclePlus /> Ajouter 
                </button>
            </div>

            {/* Affichage de la liste d'attente */}
            <div className="mt-8 flex justify-center">
                <ul className="divide-y divide-primary/20 w-full max-w-lg">
                    {/* Parcours du tableau 'menus' pour générer dynamiquement l'affichage */}
                    {menus.map((menu) => (
                        <li key={menu.id}>
                            {/* Le composant MenuItem gère l'affichage individuel et le bouton poubelle */}
                            <MenuItem menu={menu} onDelete={() => deleteMenu(menu.id)} />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Validation globale vers la BDD */}
            <div className="flex justify-center ">
                <button className="btn btn-success w-50 h-15 mt-5 " onClick={addMenuBDD}> 
                    <CloudDownload /> Envoyer au serveur 
                </button>
            </div>
        </div>
    )
}

export default Menu