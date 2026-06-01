import { useState } from "react";
import MenuItem from "./MenuItem"; // Composant enfant gérant l'affichage d'un plat
import NavBArAdmin from "./NavBArAdmin"
import { CirclePlus, CloudDownload } from "lucide-react";

const GestionAdmin = () => {

        // States pour gérer les champs du formulaire 
        const [value, setValue] = useState('')
        const [quantite, setQuantite] = useState('')
    
        // State pour stocker la liste temporaire des menus avant l'envoi au serveur
        const [menus, setMenus] = useState<MenuType[]>([])
    
        // Fonction pour ajouter un menu à la liste locale
        function addMenu() {
            // Vérification de sécurité : on empêche l'ajout si le champ est vide ou ne contient que des espaces
            if (value.trim() == "") {
                return
            }
    
            // Récupération de la date du jour formatée pour la BDD (YYYY-MM-DD)
            const datedjour = new Date().toISOString().split('T')[0];
    
            // Création de l'objet menu avec un ID unique temporaire généré grâce au timestamp
            const newMenu: MenuType = {
                id: Number(Date.now().toString().slice(-7)),
                aliment: value.trim(),
                qte: quantite.trim(),
                date: datedjour
            }
    
            // Mise à jour du tableau avec le "spread operator" (...) pour conserver les anciens menus
            const newMenus = [newMenu, ...menus]
            setMenus(newMenus)
            
            // Réinitialisation des inputs
            setValue('')
            setQuantite('')
        }
    
        // Fonction pour supprimer un menu de la liste temporaire grâce à son ID
        function deleteMenu(id: number) {
            // La méthode .filter() crée un nouveau tableau en excluant l'élément cliqué
            const newMenus = menus.filter(menu => menu.id !== id);
            setMenus(newMenus);
        }
    
        // Fonction asynchrone pour envoyer toute la liste en base de données
        async function addMenuBDD() {
            // On bloque l'envoi si la liste est vide
            if (menus.length === 0) return;
            
            // Sécurisation du token pour l'URL (encode les caractères spéciaux comme +, /, =)
            const Token = localStorage.getItem('userToken') || "";
            const tokenSecurise = encodeURIComponent(Token);
        
            // Boucle for...of pour traiter les envois de manière séquentielle
            for (const menu of menus) {
                try {
                    // Appel API pour insérer un plat
                    const reponse = await fetch(
                        `http://10.0.200.78:8000/insertmenu?id=${menu.id}&aliment=${menu.aliment}&qte=${menu.qte}&date=${menu.date}&rasp=rasp1&token=${tokenSecurise}`,
                        {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json'
                            }
                        }
                    );
            
                    if (reponse.ok) {
                        console.log(`${menu.aliment} ajouté en BDD !`);
                    } else {
                        console.error(` Erreur serveur pour ${menu.aliment} :`, reponse.status);
                    }
                } catch (error) {
                    console.error(` Erreur réseau pour ${menu.aliment} :`, error);
                }
            }
        
            console.log("menu:", menus)
            alert("Tous les plats ont été envoyés !");
        }
    
    return (
        <div>
            {/* Barre de navigation propre à l'admin */}
            <div> <NavBArAdmin /> </div>

            {/* Conteneur principal (responsive avec Flexbox) */}
            <div className="flex flex-row md:flex-row items-start gap-16 mt-15 w-full px-5 justify-center ">
                <div className="flex flex-col items-center bg-base-100 p-6 rounded-3xl shadow-sm border border-accent">
                    <h1 className="font-bold text-xl mb-5">Importer des menus</h1>
                    
                    {/* Zone de saisie des nouveaux plats */}
                    <div className="flex justify-center gap-2 ml-15 mr-15 md:m-auto">
                        
                        <input type="text"
                            placeholder="Entrez le plat "
                            className="input input-l"
                            value={value}
                            onChange={(e) => setValue(e.target.value)} // Mise à jour du state à chaque frappe
                        />

                        <input type="number"
                            placeholder="Entrez la quantité ( Kg )"
                            className="input input-l w-auto md:w-40"
                            value={quantite}
                            onChange={(e) => setQuantite(e.target.value)}
                        />

                        {/* Bouton déclenchant l'ajout dans la liste locale */}
                        <button type="submit" className="btn btn-accent ml-2" onClick={addMenu}> 
                            <CirclePlus /> Ajouter 
                        </button>
                    </div>

                    {/* Affichage dynamique de la liste des menus en attente */}
                    <div className="mt-8 flex justify-center">
                        <ul className="divide-y divide-primary/20 w-full max-w-lg">
                            {menus.map((menu) => (
                                <li key={menu.id}>
                                    {/* Appel du composant enfant en lui passant les infos du menu et la fonction de suppression */}
                                    <MenuItem menu={menu} onDelete={() => deleteMenu(menu.id)} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bouton final pour déclencher l'envoi vers l'API */}
                    <div className="flex justify-center ">
                        <button className="btn btn-success w-50 h-15 mt-5 " onClick={addMenuBDD}> 
                            <CloudDownload /> Envoyer au serveur 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GestionAdmin