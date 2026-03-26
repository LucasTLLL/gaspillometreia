import { useEffect, useState } from "react";


const CoreMenu = () => {

    const dateDuJour = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });


    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setDate(date2.getDate() + 1);

    const rech = date1.toISOString().split('T')[0];
    const rech2 = date2.toISOString().split('T')[0];

    const [data, setData] = useState<any[]>([]);
    const [totalgaspiller, setTotalgaspiller] = useState<any[]>([]);


    const donneapigaspi = async () => {

        try {
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
                setData(json);
                console.log(data);
                let somme =0;
                json.forEach((element: any) => {
                    if(element.poid){
                    somme += element.poid
                    }
                });

                setData(json);
                setTotalgaspiller(somme);
                console.log(totalgaspiller)

            } else {
                console.error("Erreur HTTP :", reponse.status);
            }
        } catch (erreur) {
            console.error("=== ERRER DE CONNEXION ===", erreur);
        }
    };









    return (





        <div className="p-4">
            <div className="card items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
                <div className="text-2xl font-semibold">
                    Information Général
                </div>
                <div className="text-center m-5 ">
                    <span className="text-xl font-semibold text-base-content/80">Quantité d'aliments totale {dateDuJour}</span>
                    <br />
                    <span className="text-l font-bold  text-white">500Kg</span>
                </div>

                <div className="text-center m-5">
                    <span className="text-xl font-semibold text-base-content/80">Quantité d'aliments gaspillés {dateDuJour}</span>
                    <br />
                    <span className="text-l font-bold text-white">{totalgaspiller} g</span>
                </div>

                <div className="text-center m-5">
                    <span className="text-xl font-semibold text-base-content/80">Différence :</span>
                    <br />
                    <span className="text-l font-bold text-white">100Kg</span>
                </div>


            </div>

            <div className="card items-center p-6 bg-base-200 rounded-2xl mt-8 shadow-sm w-full">

            </div>


            <div>
                <button className="btn btn-accent" onClick={donneapigaspi}> TEST </button>
            </div>
        </div>
    )
}

export default CoreMenu
