import React, { useState } from 'react';

const Aliment = () => {
    // Dictionnaire pour faire la correspondance entre le nom du mois et son numéro au format texte
    const num_mois: Record<string, string> = {
        "Janvier": "01",
        "Fevrier": "02",
        "Mars": "03",
        "Avril": "04",
        "Mai": "05",
        "Juin": "06",
        "Juillet": "07",
        "Aout": "08",
        "Septembre": "09",
        "Octobre": "10",
        "Novembre": "11",
        "Decembre": "12", 
    }
    
    // States pour stocker le mois sélectionné et les données de l'API
    const [mois, setMois] = useState('');
    const [data, setData] = useState<any[]>([]);

    // --- Logique de calcul des dates pour l'intervalle de la requête API ---
    const moischoisis = num_mois[mois];
    const annee = new Date().getFullYear();
    
    // Date de début : 1er jour du mois sélectionné
    const rech = `${annee}-${moischoisis}-01`;

    // Calcul de la date de fin (1er jour du mois suivant)
    const num = parseInt(moischoisis);
    // Gestion du passage à la nouvelle année si on est en décembre
    const anneeSuivante = num === 12 ? annee + 1 : annee;
    const moisSuivant = num === 12 ? 1 : num + 1;
    
    // Formatage pour s'assurer d'avoir toujours 2 chiffres (ex: "02" au lieu de "2")
    const moisFormat = moisSuivant < 10 ? `0${moisSuivant}` : moisSuivant;
    
    // Date de fin pour l'API
    const rech2 = `${anneeSuivante}-${moisFormat}-01`;

    // Fonction déclenchée lors de la sélection d'un mois
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Appel API avec la plage de dates calculée dynamiquement
            const reponse = await fetch(
                `http://10.0.200.78:8000/analyse?from_=${rech}&to=${rech2}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (reponse.ok) {
                const json = await reponse.json();
                
                // Objet servant d'accumulateur pour regrouper les doublons
                const totalaliment: Record<string, number> = {};

                // Parcours des données brutes pour faire la somme par aliment
                json.forEach((element: any) => {
                    const aliment = element.dechet.dechet_nom;
                    const poids = element.poid;
                
                    // Si l'aliment existe déjà dans l'objet, on additionne, sinon on l'initialise
                    if (totalaliment[aliment]) {
                        totalaliment[aliment] += poids;
                    } else {
                        totalaliment[aliment] = poids;
                    }
                });

                // Transformation de l'objet en tableau pour pouvoir l'afficher facilement
                const tableau = Object.keys(totalaliment).map((aliment) => {
                    return {
                        name: aliment,
                        value: totalaliment[aliment]
                    };
                });
          
                // Tri du tableau par ordre décroissant (le plus gros poids en premier)
                const jsontrie = tableau.sort((a: any, b: any) => b.value - a.value);
                
                // Mise à jour de l'état avec les données formatées et triées
                setData(jsontrie);

            } else {
                console.error("Erreur HTTP :", reponse.status);
            }

        } catch (erreur) {
            alert('Impossible de joindre le serveur');
            console.error(erreur);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-6 w-full p-4">
                <div className="flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
                    
                    {/* Zone de sélection du mois */}
                    <div>
                        <select 
                            defaultValue="Sélectionner le mois"
                            className="select select-accent"
                            value={mois}
                            onChange={(e) => {
                                setMois(e.target.value);
                                // On passe l'event au format "any" temporairement si le typage React coince ici
                                handleSubmit(e as any); 
                            }}
                        >
                            <option disabled={true}>Sélectionner le mois</option>
                            <option>Janvier</option>
                            <option>Fevrier</option>
                            <option>Mars</option>
                            <option>Avril</option>
                            <option>Mai</option>
                            <option>Juin</option>
                            <option>Juillet</option>
                            <option>Aout</option>
                            <option>Septembre</option>
                            <option>Octobre</option>
                            <option>Novembre</option>
                            <option>Decembre</option>
                        </select>
                    </div>

                    {/* Affichage des résultats */}
                    <div className='mt-5'>
                        {/* Message conditionnel si le tableau est vide */}
                        {data.length === 0 && <p>Aucune donnée trouvée.</p>}

                        <ul className='mt-5'>
                            {/* Rendu dynamique de la liste des aliments triés */}
                            {data.map((item, index) => (
                                // Utilisation de l'index comme clé de secours si on n'a pas d'ID unique
                                <li key={index} className='mb-5'>
                                    <div className="stats flex flex-col">
                                        <div className="stat">
                                            <div className="stat-title text-center font-bold text-xl">{item.name}</div>
                                            <div className="stat-value text-center">{item.value} kg</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Aliment