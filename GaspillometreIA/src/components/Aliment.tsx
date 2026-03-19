
import React, { useState } from 'react';

const Aliment = () => {

    const num_mois = {
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
    const [mois, setMois] = useState('Janvier');


    const [data, setData] = useState<any[]>([]);
    const moischoisis = num_mois[mois];
    const annee = new Date().getFullYear();
    const rech = `${annee}-${moischoisis}-01`;

    const num = parseInt(moischoisis);
    const anneeSuivante = num === 12 ? annee + 1 : annee;
    const moisSuivant = num === 12 ? 1 : num + 1;
    const moisFormat = moisSuivant < 10 ? `0${moisSuivant}` : moisSuivant;
    const rech2 = `${anneeSuivante}-${moisFormat}-01`;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(rech);
        console.log(rech2);

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
                const jsontrie= json.sort((a:any, b:any) => b.poid - a.poid);
                console.log(json);
                setData(jsontrie);


            } else {
                console.error("Erreur HTTP :", reponse.status);
            }

        } catch (erreur) {
            alert('Impossible de joindre le serveur');
            console.error(erreur);
        }
    };





    function test() {
        console.log(rech)
    }

    return (
        <div>
            <div className="flex flex-col gap-6 w-full p-4">

                <div className="flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
                    <div>

                        <select defaultValue="Sélectionner le mois"
                            className="select select-accent"
                            value={mois}
                            onChange={(e) => setMois(e.target.value)}
                            onClick={handleSubmit}

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





                    <div className='mt-5'>

                        <h2>Résultats :</h2>

                        {data.length === 0 && <p>Aucune donnée trouvée.</p>}

                        <ul className='mt-5'>
                            {data.map(item => (
                                <li key={item.id}
                                className='mb-5'
                                  >



                                    <strong>Déchet :</strong> {item.dechet.dechet_nom}
                                    <br />
                                    <strong>Poids mesuré :</strong> {item.poid} kg<br />
                                    
                                    <strong>Date :</strong> {item.date.split('T')[0]}<br />


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
