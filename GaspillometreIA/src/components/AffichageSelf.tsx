import { useState, useEffect } from "react";


const AffichageSelf = () => {

  const [now, setNow] = useState(new Date());
  const [data, setData] = useState<any[]>([]);
  const [totalGaspille, setTotalGaspille] = useState<number>(0);

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

  const fetchData = async () => {
    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date();
    date3.setDate(date3.getDate() - 1);
    date2.setDate(date2.getDate() + 1);

    const rech = date1.toISOString().split('T')[0];
    const rech2 = date2.toISOString().split('T')[0];

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

        let somme = 0;
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


        //a ajouter : moyenne par plateau     

        setTotalGaspille(somme);
        console.log(somme);
        console.log(data);
        console.log(jsontrie);
        console.log(totalaliment);
        console.log("Aujourd'hui", date1);
        console.log("Demain", date2);
        console.log("Hier", date3);
        console.log(rech);
        console.log(rech2);


      } else {
        console.error("Erreur HTTP :", reponse.status);
      }

    } catch (erreur) {
      alert('Impossible de joindre le serveur');
      console.error(erreur);
    }
  };





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
          <p className="text-gray-500"> xx Kg</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm w-64">
          <p className="font-bold">Quantité moyenne par plateau</p>
          <p className="text-gray-500"> xx Kg/plateau</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl shadow-sm w-64">
          <p className="font-bold">différence avec hier</p>
          <p className="text-gray-500"> + xx ou - xx</p>
        </div>
      </div>


      <div className="mt-50">
        {totalGaspille}
      </div>

      <div className="mt-15">
        <button className="btn btn-primary" onClick={fetchData}>Actualiser</button>
      </div>

    </div>






  )
}

export default AffichageSelf
