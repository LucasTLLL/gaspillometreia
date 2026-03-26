import React, { useState, useEffect } from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const Periode = () => {



  const date1 = new Date().toISOString().split('T')[0];
  const [dateDebut, setDateDebut] = useState('2026-01-01');
  const [dateFin, setDateFin] = useState(date1);
  const [doneegraphique, setDoneegraphique] = useState<any[]>([]);



  useEffect(() => {
    const donneapi = async () => {




      try {
        const reponse = await fetch(
          `http://10.0.200.78:8000/analyse?from_=${dateDebut}&to=${dateFin}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );



        if (reponse.ok) {
          const json = await reponse.json();

          const totaljours: Record<string, number> = {};

          json.forEach((element: any) => {
            const jours = element.date.split('T')[0];
            const poids = element.poid;

            if (totaljours[jours]) {
              totaljours[jours] += poids;
            } else {
              totaljours[jours] = poids;
            }
          });



          const tableau = Object.keys(totaljours).map((jour) => {
            return {
              date: jour,
              total: totaljours[jour]
            };
          });


          setDoneegraphique(tableau);


        } else {
          console.error("Erreur HTTP :", reponse.status);
        }
      } catch (erreur) {
        console.error("=== ERRER DE CONNEXION ===", erreur);
      }
    };


    donneapi();


  }, [dateDebut, dateFin]);



  return (
    <div className="flex flex-col gap-6 w-full p-4">


      <div className="flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
        <label className="text-sm font-semibold mb-4 text-base-content/80">
          Sélectionnez la période à analyser :
        </label>

        <div className="flex flex-row items-center justify-center gap-4 w-full">


          <div className="flex flex-col">
            <span className="text-xs ml-1 mb-1 opacity-70">Du (Début)</span>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px]"
            />
          </div>

          <span className="font-bold text-lg text-base-content/70 mt-4">Au</span>

          <div className="flex flex-col">
            <span className="text-xs ml-1 mb-1 opacity-70">Jusqu'au (Fin)</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px]"
            />
          </div>

        </div>
      </div>

      <div className="w-full h-96 mt-8  card flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={doneegraphique}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#F54927" />
          </BarChart>
        </ResponsiveContainer>
      </div>  


      </div>

    
  );
};

export default Periode;
