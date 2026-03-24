import { useState } from "react";


const AffichageSelf = () => {

  const dateDuJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });




  const [data, setData] = useState<any[]>([]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setDate(date2.getDate() + 1);

    const rech = date1.toISOString().split('T')[0];
    const rech2 = date2.toISOString().split('T')[0];


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
        const jsontrie = json.sort((a: any, b: any) => b.poid - a.poid);
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





  return (


    <div>


      <div className="p-10" >

        <p className="text-center font-bold text-5xl md:text-7xl text-base-content tracking-tight mb-4 mt-15 uppercase">
          Gaspillometre
        </p>

        <p className="text-center font-semibold text-xl md:text-2xl text-base-content  mb-4 mt-15 ">Aujourd'hui, {dateDuJour}</p>
      </div>

      <div className="">
        <div className="stats shadow w-full max-4xl ">


          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Total gaspiller</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">{dateDuJour}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Equivalent repas </div>
            <div className="stat-value text-secondary">4,200</div>
            <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Par rapport a hier </div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>


      <div>
        <div className="text-center font-semibold text-xl md:text-2xl text-base-content mt-15 mb-15">
          Classement des aliments les plus gaspillés
        </div>

        <div className="flex flex-col item-center justify-center">

          <ul className='mt-5  '>
            {data.map(item => (
              <li key={item.id}
                className='mb-5 '
              >
                <div className="stats shadow bg-accent">
                  <div className="stat">
                    <div className="stat-title">Aliment : {item.dechet.dechet_nom}</div>
                    <div className="stat-value">Poids : {item.poid} Kg</div>
                    
                  </div>
                </div>

              </li>
            ))}
          </ul>

        </div>



      </div>



      <button className="btn btn-accent" onClick={handleSubmit}>TEST</button>

    </div>






  )
}

export default AffichageSelf
