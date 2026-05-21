import { useState, useEffect } from "react";

const AffichageSelf = () => {

  useEffect(() => {
    fetchData();
    const minuteur = setInterval(() => {
      console.log("Actualisation");
      fetchData();

    }, 60000);
    return () => clearInterval(minuteur);

  }, []
  );



  const [now, setNow] = useState(new Date());
  const [data, setData] = useState<any[]>([]);
  const [totalGaspille, setTotalGaspille] = useState<number>(0);

  const [moyenne, setMoyenne] = useState<number>(0);

  const [diff, setDiff] = useState<number | string>(0);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dateDuJour = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  const heure = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  //Recuperation du jour et mise en moyenne 
  const fetchData = async () => {
    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date();
    date3.setDate(date3.getDate() - 1);
    date2.setDate(date2.getDate() + 1);

    const rech = date1.toISOString().split('T')[0];
    const rech2 = date2.toISOString().split('T')[0];
    const rech3 = date3.toISOString().split('T')[0];

    try {
      let somme = 0
      const reponse = await fetch(
        `http://10.0.200.78:8000/analyse?from_=${rech}&to=${rech2}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const rephier = await fetch(
        `http://10.0.200.78:8000/analyse?from_=${rech3}&to=${rech}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );



      if (reponse.ok) {
        const json = await reponse.json();


        const totalaliment: Record<string, number> = {};

        json.forEach((element: any) => {
          const aliment = element.dechet?.dechet_nom || "Inconnu";
          const poids = element.poid || 0;

          somme += poids;
          if (totalaliment[aliment]) {
            totalaliment[aliment] += poids;
          } else {
            totalaliment[aliment] = poids;
          }
        });

        const tableau = Object.keys(totalaliment).map((aliment) => ({
          name: aliment,
          value: totalaliment[aliment]
        }));

        tableau.sort((a: any, b: any) => b.value - a.value);
        setData(tableau);



        const nbplateau = json.length;
        let moyenne = 0;
        if (nbplateau > 0) {
          moyenne = somme / nbplateau
        }
        const moyennear = moyenne.toFixed(2);

        setMoyenne(moyennear);

        setTotalGaspille(somme);

        console.log("Somme", somme);
        console.log("Data", json);
        console.log("Nombre de plateau", nbplateau)
        console.log("Total", totalaliment);
        console.log("Aujourd'hui", date1);
        console.log("Demain", date2);
        console.log("Hier", date3);
        console.log("Rech1", rech);
        console.log("Rech2", rech2);
        console.log("Rech3", rech3)
        console.log("moyenne", moyennear)


      } else {
        console.error("Erreur HTTP :", reponse.status);
      }

      if (rephier.ok) {
        const jsonhier = await rephier.json();
        let sommehier = 0;
        jsonhier.forEach((element: any) => {
          sommehier += element.poid || 0;
        });

        const difference = somme - sommehier;

        console.log("difference", difference);
        console.log("Somme hier", sommehier);
        setDiff(difference);

      } else {
        console.error("Erreur HTTP :", reponse.status);
      }

    } catch (erreur) {
      alert('Impossible de joindre le serveur');
      console.error(erreur);
    }
  };

const OBJMOY= 30;
const barremax=60;
const moyenneNum = Number(moyenne) || 0;
const pourcentage= Math.min((moyenneNum / barremax) * 100, 100);




  return (
    <div data-theme="light" className="min-h-screen bg-base-100 w-full flex flex-col items-center p-4">

      <div className="sticky top-4 z-50 w-full flex justify-center px-2">
        <div className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl px-6 py-3 md:px-12 md:py-5 text-center max-w-2xl w-full">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 tracking-wide uppercase">
            Gaspillomètre
          </h1>
          <p className="text-xs md:text-base text-gray-500 font-medium mt-1 capitalize">
            {dateDuJour} - {heure}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-16 w-full text-center">
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm w-64">
          <p className="font-bold">Quantité gaspillée aujourd'hui</p>
          <p className="text-gray-500"> {totalGaspille} g</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm w-64">
          <p className="font-bold">Quantité moyenne par plateau</p>
          <p className="text-gray-500"> {moyenne} g/plateau</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm w-64">
          <p className="font-bold">différence avec hier</p>
          <p className={diff < 0 ? "text-success font-bold" : "text-error font-bold"}> {diff > 0 ? "+" : ""} {diff} g</p>
        </div>
      </div>


      <div className="mt-12">


     
        <div className="mt-12 w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Classement des aliments</h2>

          {data && data.length > 0 ? (
            <ul className="space-y-2">
              {data.slice(0, 3).map((item: any, index: number) => (
                <li key={index} className="text-xl">
                  Numéro {index + 1} : <span className="capitalize">{item.name}</span> - {item.value} g
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucune donnée à afficher</p>
          )}
        </div>
      </div>
            
      <div className="mt-16 w-full max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Objectif du jour : Moins de {OBJMOY} g / plateau
        </h2>

        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          
          
          <div 
            className={`h-full transition-all duration-1000 ${moyenneNum > OBJMOY ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${pourcentage}%` }}
          ></div>

         
          <div 
            className="absolute top-0 bottom-0 w-1 bg-black z-10"
            style={{ left: `${(OBJMOY / barremax) * 100}%` }}
          ></div>
          
        </div>

     
        <div className="flex justify-between text-sm font-bold text-gray-500 mt-2 px-2">
          <span>0 g</span>
          <span>{barremax} g (Max)</span>
        </div>
      </div>

    </div >






  )
}

export default AffichageSelf
