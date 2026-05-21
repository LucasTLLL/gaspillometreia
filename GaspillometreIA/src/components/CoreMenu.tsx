import { useEffect, useState } from "react";


const CoreMenu = () => {

    const [dateDebut, setDateDebut] = useState(new Date().toISOString().split('T')[0]);

    const [data, setData] = useState<any[]>([]);
    const [totalgaspiller, setTotalgaspiller] = useState(0);
    const [totalprod, setTotalprod] = useState(0);
    const [listeGaspilles, setListeGaspille] = useState<any[]>([]);
    const [listeProduite, setListeProduite] = useState<any[]>([]);

    useEffect(() => {
        // 1. On calcule la date de fin directement ici
        const dateChoisie = new Date(dateDebut || new Date());
        const dateSuivante = new Date(dateChoisie);
        dateSuivante.setDate(dateSuivante.getDate() + 1);
        const dateFin = dateSuivante.toISOString().split('T')[0];

        // 2. On crée la fonction ICI. Elle "voit" dateDebut et dateFin toute seule !
        const donneapigaspi = async () => {
            try {
                // Regarde : on utilise directement tes vraies variables
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
                    json.forEach((element: any) => {
                        if (element.poid) {
                            somme += element.poid
                        }
                    });
                    setListeGaspille(json);
                    setTotalgaspiller(somme);
                }
            } catch (erreur) {
                console.error("=== ERREUR ===", erreur);
            }
        };

        const donnnemenu = async () => {
            try {
                // Pareil ici, on utilise directement dateDebut et dateFin
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
                    jsonmenu.forEach((element: any) => {
                        if (element.qte) {
                            sommem += element.qte
                        }
                    });
                    setListeProduite(jsonmenu);
                    setTotalprod(sommem);
                }
            } catch (erreur) {
                console.error("=== ERREUR ===", erreur);
            }
        };


        donneapigaspi();
        donnnemenu();

    }, [dateDebut]);











    return (





        <div className="p-4">
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
                    <span className="text-l font-bold text-white">{totalprod - totalgaspiller} g</span>
                </div>


            </div>



            <div className="card items-center p-6 bg-base-200 rounded-2xl mt-8 shadow-sm w-full">

                <div className="flex flex-col md:flex-row justify-center gap-16 text-center mt-12">


                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-6 text-white">Détail des plats produits</h3>
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


                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-6 text-white">Détail des gaspillages</h3>
                        {listeGaspilles.length > 0 ? (
                            <ul className="space-y-4">
                                {listeGaspilles.map((item, index) => (
                                    <li key={index} className="text-gray-300 text-base">
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
function setTotalprod(sommem: number) {
    throw new Error("Function not implemented.");
}

