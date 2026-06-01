import { useEffect, useState } from "react";

const CoreMenu = () => {

    // Initialisation de la date du jour au format YYYY-MM-DD
    const [dateDebut, setDateDebut] = useState(new Date().toISOString().split('T')[0]);

    // States pour stocker les données brutes et les totaux
    const [data, setData] = useState<any[]>([]); // Note : state déclaré mais non utilisé dans le rendu actuel
    const [totalgaspiller, setTotalgaspiller] = useState(0);
    const [totalprod, setTotalprod] = useState(0);
    
    // States pour séparer les listes à afficher
    const [listeGaspilles, setListeGaspille] = useState<any[]>([]);
    const [listeProduite, setListeProduite] = useState<any[]>([]);

    // Le useEffect se déclenche au montage ET à chaque fois que 'dateDebut' change
    useEffect(() => {
        // --- 1. Calcul de la fenêtre de temps (24h) ---
        // On prend la date sélectionnée et on calcule le lendemain pour l'API
        const dateChoisie = new Date(dateDebut || new Date());
        const dateSuivante = new Date(dateChoisie);
        dateSuivante.setDate(dateSuivante.getDate() + 1);
        const dateFin = dateSuivante.toISOString().split('T')[0];

        // --- 2. Fonctions d'appels API ---
        
        // Récupération des données de gaspillage
        const donneapigaspi = async () => {
            try {
                const reponse = await fetch(
                    `http://10.0.200.78:8000/analyse?from_=${dateDebut}&to=${dateFin}`,
                    {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    }
                );

                if (reponse.ok) {
                    const json = await reponse.json();
                    let somme = 0;
                    
                    // Calcul du total gaspillé en additionnant les poids
                    json.forEach((element: any) => {
                        if (element.poid) {
                            somme += element.poid
                        }
                    });
                    
                    // Mise à jour des states
                    setListeGaspille(json);
                    setTotalgaspiller(somme);
                }
            } catch (erreur) {
                console.error("=== ERREUR API GASPILLAGE ===", erreur);
            }
        };

        // Récupération des données de production (les menus prévus)
        const donnnemenu = async () => {
            try {
                const reponse = await fetch(
                    `http://10.0.200.78:8000/menus?from_=${dateDebut}&to=${dateFin}`,
                    {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                    }
                );

                if (reponse.ok) {
                    const jsonmenu = await reponse.json();
                    let sommem = 0;
                    
                    // Calcul du total produit en additionnant les quantités
                    jsonmenu.forEach((element: any) => {
                        if (element.qte) {
                            sommem += element.qte
                        }
                    });
                    
                    // Mise à jour des states
                    setListeProduite(jsonmenu);
                    setTotalprod(sommem);
                }
            } catch (erreur) {
                console.error("=== ERREUR API MENUS ===", erreur);
            }
        };

        // --- 3. Exécution des requêtes ---
        // On lance les deux appels API en parallèle
        donneapigaspi();
        donnnemenu();

    }, [dateDebut]); // Dépendance : on relance tout ça si l'utilisateur change la date

    return (
        <div className="p-4">
            
            {/* --- Section : Sélection de la date --- */}
            <div className="card items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
                <label className="text-sm font-semibold mb-4 text-base-content/80">
                    Sélectionnez la période à analyser :
                </label>
                <div className="flex flex-col">
                    <span className="text-xs ml-1 mb-1 opacity-70"> </span>
                    <input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                        className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px]"
                    />
                </div>
            </div>

            {/* --- Section : Chiffres clés (Informations Générales) --- */}
            <div className="card items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full mt-8">
                <div className="text-2xl font-semibold">
                    Information Général
                </div>
                
                <div className="text-center m-5 ">
                    <span className="text-xl font-semibold text-base-content/80">Quantité d'aliments totale </span>
                    <br />
                    <span className="text-l font-bold  text-white">{totalprod} g</span>
                </div>

                <div className="text-center m-5">
                    <span className="text-xl font-semibold text-base-content/80">Quantité d'aliments gaspillés</span> 
                    <br />
                    <span className="text-l font-bold text-white">{totalgaspiller} g</span>
                </div>

                <div className="text-center m-5">
                    <span className="text-xl font-semibold text-base-content/80">Différence :</span>
                    <br />
                    {/* Calcul de l'écart directement dans le JSX */}
                    <span className="text-l font-bold text-white">{totalprod - totalgaspiller} g</span>
                </div>
            </div>

            {/* --- Section : Détails listés (Flexbox pour séparer en deux colonnes) --- */}
            <div className="card items-center p-6 bg-base-200 rounded-2xl mt-8 shadow-sm w-full">
                <div className="flex flex-col md:flex-row justify-center gap-16 text-center mt-12">

                    {/* Colonne 1 : Plats produits */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-6 text-white">Détail des plats produits</h3>
                        {/* Rendu conditionnel : on vérifie s'il y a des données avant d'afficher la liste */}
                        {listeProduite.length > 0 ? (
                            <ul className="space-y-4">
                                {listeProduite.map((item, index) => (
                                    <li key={index} className="text-gray-300 text-base">
                                        <span className="capitalize">{item.aliment}</span>
                                        <br />
                                        <span className="font-bold text-white">{item.qte} g</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Aucun plat enregistré</p>
                        )}
                    </div>

                    {/* Colonne 2 : Gaspillage */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-6 text-white">Détail des gaspillages</h3>
                        {listeGaspilles.length > 0 ? (
                            <ul className="space-y-4">
                                {listeGaspilles.map((item, index) => (
                                    <li key={index} className="text-gray-300 text-base">
                                        {/* Sécurisation : si 'dechet' ou 'dechet_nom' est null, on affiche "Inconnu" */}
                                        <span className="capitalize">{item.dechet?.dechet_nom || "Inconnu"}</span>
                                        <br />
                                        <span className="font-bold text-white">{item.poid} g</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Aucun gaspillage enregistré</p>
                        )}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CoreMenu