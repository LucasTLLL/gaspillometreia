import { useEffect, useRef, useState } from "react";
import NavBarCantine from "./NavBarCantine"
import { useReactToPrint } from "react-to-print";

import Aliment from "./Aliment";
import { Download, Sheet } from "lucide-react";


const rapport = () => {

  const [date, setDate] = useState('2026-03-19');
  const [date2, setDate2] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [dataCamember, setDataCamember] = useState<any[]>([]);
  const Couleur = ['#FF78AC',
    '#A8D5E3',
    '#F2F0EA',
    '#FF921C',
    '(#ECA427',
    '#D8125B',
    '#205A28',
    '#C72B32',]


  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef
  });


  useEffect(() => {
    const donneapi = async () => {

      if (date === "") {
        return
      }



      const datedebut = date.split("T")[0];
      setDate(datedebut);


      const dateObj = new Date(datedebut);
      dateObj.setDate(dateObj.getDate() + 1);

      const datedemain = dateObj.toISOString().split("T")[0];

      setDate2(datedemain);

      console.log("Date de jours : ", datedebut)
      console.log("Date de jours d'après : ", datedemain)


      try {
        const reponse = await fetch(
          `http://10.0.200.78:8000/analyse?from_=${datedebut}&to=${datedemain}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );



        if (reponse.ok) {
          const json = await reponse.json();
          
          setData(json)
          console.log(json)

          const totalaliment: Record<string, number> = {};

          json.forEach((element: any) => {
            const aliment = element.dechet.dechet_nom;
            const poids = element.poid;
        
            //Ajout si 2 aliment identique 

          if (totalaliment[aliment]) {
            totalaliment[aliment] += poids;
          } else {
            totalaliment[aliment] = poids;
          }
  });
          const tableau = Object.keys(totalaliment).map((aliment) => {
            return {
              name: aliment,
              value: totalaliment[aliment]
            };
          });

          setDataCamember(tableau);
        


        } else {
          console.error("Erreur HTTP :", reponse.status);
        }
      } catch (erreur) {
        console.error("=== ERRER DE CONNEXION ===", erreur);
      }
    };


    donneapi();


  }, [date]);




  return (
    <div>
      <div><NavBarCantine /></div>

      <div className="pt-5 text-xl items-center justify-center text-center text-white font-bold mb-4 text-base-content/80">
        <div>
          Sélectionner le jour pour créer le rapport
        </div>



        <div className="flex items-center justify-center pt-5 ">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px]"
          />

          <div>
            <button className="btn btn-accent ml-5" onClick={() => handlePrint()}><Download />Exporter PDF</button>
          </div>
          <div>
            <button className="btn btn-success ml-5" onClick={() => handlePrint()}><Sheet />Exporter EXEL</button>
          </div>

        </div>

      </div>




      <div ref={componentRef} className="flex flex-col items-center justify-center p-6">


           {/* --- SECTION HISTORIQUE DÉTAILLÉ --- */}
      <div className="mt-12 bg-base-100 p-8 rounded-3xl shadow-xl border border-base-300">
        
        {/* L'en-tête très pro */}
        <div className="mb-8 border-b border-base-200 pb-4">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            État Récapitulatif Journalier
          </h2>
          <p className="text-base-content/70 italic">
            Ce document présente le relevé journalier détaillé des pertes alimentaires, établi dans le cadre de notre démarche de réduction du gaspillage.
          </p>
        </div>

       
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-base">
            
            
            <thead className="bg-base-200 text-base-content text-sm uppercase tracking-wider">
              <tr>
                <th className="rounded-tl-xl py-4">Date </th>
                <th className="py-4">Type d'aliments</th>
                <th className="rounded-tr-xl py-4 text-right">Volume gaspillé</th>
              </tr>
            </thead>
            
           
            <tbody>
              
              {data.map((item, index) => {
                
                
                const datePropre = item.date.split('T')[0];

                return (
                  <tr key={index} className="hover">
                    <td className="font-mono text-base-content/70">
                      {datePropre}
                    </td>
                    <td className="font-semibold capitalize">
                      {item.dechet.dechet_nom}
                    </td>
                    <td className="text-right">
                      <span className="badge badge-ghost badge-md font-bold font-mono">
                        {item.poid} g
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            
          </table>
        </div>
        


      </div>





      </div>


    </div>
  )
}




export default rapport
