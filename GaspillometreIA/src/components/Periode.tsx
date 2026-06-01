import React, { useState, useEffect } from 'react';
// Importation des composants de Recharts pour la visualisation de données
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Periode = () => {

  // Récupération de la date du jour au format YYYY-MM-DD
  const date1 = new Date().toISOString().split('T')[0];
  
  // Initialisation des states pour la période de recherche
  const [dateDebut, setDateDebut] = useState('2026-01-01'); // Date de début par défaut
  const [dateFin, setDateFin] = useState(date1);            // Date de fin par défaut (aujourd'hui)
  
  // State pour stocker les données formatées prêtes à être injectées dans le graphique
  const [doneegraphique, setDoneegraphique] = useState<any[]>([]);

  // Le useEffect se redéclenche automatiquement dès que dateDebut ou dateFin est modifiée
  useEffect(() => {
    const donneapi = async () => {
      try {
        // Appel API dynamique basé sur les dates sélectionnées par l'utilisateur
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

          // Objet accumulateur pour regrouper les gaspillages par jour
          const totaljours: Record<string, number> = {};

          // Parcours des données brutes de l'API
          json.forEach((element: any) => {
            // On extrait uniquement la date (sans l'heure) grâce au split
            const jours = element.date.split('T')[0];
            const poids = element.poid;

            // Logique d'accumulation : si la date existe déjà, on additionne le poids
            if (totaljours[jours]) {
              totaljours[jours] += poids;
            } else {
              // Sinon, on initialise la date avec le premier poids trouvé
              totaljours[jours] = poids;
            }
          });

          // Recharts attend un tableau d'objets. On transforme donc notre objet totaljours en tableau.
          const tableau = Object.keys(totaljours).map((jour) => {
            return {
              date: jour,       // Axe X
              total: totaljours[jour] // Axe Y
            };
          });

          // Mise à jour du state graphique avec le tableau final formaté
          setDoneegraphique(tableau);

        } else {
          console.error("Erreur HTTP :", reponse.status);
        }
      } catch (erreur) {
        console.error("=== ERREUR DE CONNEXION ===", erreur);
      }
    };

    donneapi();

  }, [dateDebut, dateFin]); // <-- Tableau de dépendances déclenchant la mise à jour

  return (
    <div className="flex flex-col gap-6 w-full p-4">

      {/* --- Section : Filtres de dates --- */}
      <div className="flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm w-full">
        <label className="text-sm font-semibold mb-4 text-base-content/80">
          Sélectionnez la période à analyser :
        </label>

        <div className="flex flex-row items-center justify-center gap-4 w-full">

          {/* Input : Date de début */}
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

          {/* Input : Date de fin */}
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

      {/* --- Section : Affichage du Graphique --- */}
      <div className="w-full h-96 mt-8 card flex flex-col items-center p-6 bg-base-200 rounded-2xl shadow-sm">
        
        {/* ResponsiveContainer permet au graphique de s'adapter à la taille de la div parente (mobile, tablette, PC) */}
        <ResponsiveContainer width="100%" height="100%">
          {/* Composant principal du graphique en barres */}
          <BarChart data={doneegraphique}>
            {/* Axe des abscisses (dates) */}
            <XAxis dataKey="date" />
            {/* Axe des ordonnées (généré automatiquement selon les valeurs max) */}
            <YAxis />
            {/* Tooltip : bulle d'information au survol de la souris */}
            <Tooltip />
            {/* Définition des barres (donnée cible = "total" et couleur personnalisée) */}
            <Bar dataKey="total" fill="#F54927" />
          </BarChart>
        </ResponsiveContainer>

      </div>  

    </div>
  );
};

export default Periode;