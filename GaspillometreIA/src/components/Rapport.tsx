import { useEffect, useRef, useState } from "react";
import NavBarCantine from "./NavBarCantine"
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import Aliment from "./Aliment";
import { Download, Sheet } from "lucide-react";


const rapport = () => {
  const date1 = new Date().toISOString().split('T')[0];



  const [date, setDate] = useState('2026-01-01');
  const [date2, setDate2] = useState(date1);
  const [poidtotal, setPoidtotal] = useState('');
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


      console.log(date1)
      console.log(date2)



      try {
        const reponse = await fetch(
          `http://10.0.200.78:8000/analyse?from_=${date}&to=${date2}`,
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
          let somme = 0;

          json.forEach((element: any) => {
            const aliment = element.dechet.dechet_nom;
            const poids = element.poid;

            //Ajout si 2 aliment identique 

            somme += poids;
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
          console.log(tableau);
          console.log(somme);
          setPoidtotal(somme);

        } else {
          console.error("Erreur HTTP :", reponse.status);
        }
      } catch (erreur) {
        console.error("=== ERRER DE CONNEXION ===", erreur);
      }
    };


    donneapi();


  }, [date]);



  const exportexel = () => {

    const dataexel = data.map((item) => ({
      "Date ": item.date ? item.date.split("T")[0] : "Inconnue",
      "Aliment gaspiller ": item.dechet?.dechet_nom || "Inconnue",
      "Poids (grammes) ": item.poid | 0,
      
      

    }));

    dataexel.push({
      "Poids total (grammes) ": poidtotal,
      "Date ": "",
      "Aliment gaspiller ": "",
      "Poids (grammes) ": "",
      
    });






    const feuille = XLSX.utils.json_to_sheet(dataexel);
    const classeur = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(classeur, feuille, "Historique Gaspillage");
    XLSX.writeFile(classeur, "Rapport_Gaspillage.xlsx")



  }




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

          <input
            type="date"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px]"
          />

          <div>
            <button className="btn btn-accent ml-5" onClick={() => handlePrint()}><Download />Exporter PDF</button>
          </div>
          <div>
            <button className="btn btn-success ml-5" onClick={() => exportexel()}><Sheet />Exporter EXEL</button>
          </div>

        </div>

      </div>




      <div ref={componentRef} className="flex flex-col items-center justify-center p-6">



        <div className="mt-12 bg-base-100 p-8 rounded-3xl shadow-xl border border-base-300">

          <div className="mb-8 border-b border-base-200 pb-4">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              État Récapitulatif du {date1.split('T')[0]} au {date2.split('T')[0]}
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
                      <td >
                        {datePropre}
                      </td>
                      <td className="font-semibold ">
                        {item.dechet.dechet_nom}
                      </td>
                      <td className="text-right">
                        <span >
                          {item.poid} g
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>



            </table>

            <div className="bg-base-200 text-base-content text-sm  tracking-wider text-right">
              Poid total : {poidtotal} g
            </div>
          </div>



        </div>





      </div>


    </div>
  )
}




export default rapport