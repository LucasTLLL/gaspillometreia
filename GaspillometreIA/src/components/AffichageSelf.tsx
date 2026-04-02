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


    <div data-theme="light" className="min-h-screen bg-base-100 w-full flex flex-col items-center pt-10">


      <div className="p-4 md:p-10 flex justify-center w-full" >
        <div className="border border-base-300 shadow-md rounded-3xl p-10 md:p-20 lg:p-24 w-full max-w-[95%] lg:max-w-screen-2xl flex flex-col items-center bg-base-100">
          <p className="text-center font-bold text-5xl md:text-7xl lg:text-8xl xl:text-[8rem] text-base-content tracking-tight mb-4 uppercase">
            Gaspillomètre
          </p>

          <p className="text-center font-semibold text-xl md:text-3xl lg:text-5xl text-base-content/80 mt-8">Aujourd'hui, {dateDuJour}</p>
        </div>
      </div>

      

      






     
    </div>






  )
}

export default AffichageSelf
