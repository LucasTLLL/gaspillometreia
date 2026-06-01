import { useEffect, useRef, useState } from "react";
import NavBarCantine from "./NavBarCantine"
// Import des librairies tierces pour l'export PDF et Excel
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import Aliment from "./Aliment";
import { Download, Sheet } from "lucide-react";

const rapport = () => {
  // Récupération de la date du jour au format ISO (YYYY-MM-DD)
  const date1 = new Date().toISOString().split('T')[0];

  // States pour les filtres de dates
  const [date, setDate] = useState('2026-01-01'); // Date de début
  const [date2, setDate2] = useState(date1);      // Date de fin (aujourd'hui par défaut)
  
  // States pour stocker les données de l'API et les totaux
  const [poidtotal, setPoidtotal] = useState<number | string>('');
  const [data, setData] = useState<any[]>([]);


  // useRef permet de cibler précisément la div <div> qui contient le tableau pour l'impression PDF
  const componentRef = useRef<HTMLDivElement>(null);

  // Hook personnalisé de la librairie react-to-print
  const handlePrint = useReactToPrint({
    contentRef: componentRef
  });

  // useEffect déclenché au chargement et à chaque modification de la date de début
  useEffect(() => {
    const donneapi = async () => {
      // Sécurité : on stoppe l'exécution si la date est vide
      if (date === "") {
        return
      }

      try {
        // Appel API avec les paramètres de date dynamiques
        const reponse = await fetch(
          `http://10.0.200.78:8000/analyse?from_=${date}&to=${date2}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (reponse.ok) {
          const json = await reponse.json();

          // Mise à jour du state principal avec les données brutes
          setData(json)

          // Variables pour le traitement des totaux
          const totalaliment: Record<string, number> = {};
          let somme = 0;

          // Boucle de traitement pour calculer le poids total et regrouper par aliment
          json.forEach((element: any) => {
            const aliment = element.dechet.dechet_nom;
            const poids = element.poid;

            somme += poids;
            
            // Regroupement si 2 aliments sont identiques
            if (totalaliment[aliment]) {
              totalaliment[aliment] += poids;
            } else {
              totalaliment[aliment] = poids;
            }
          });
          
          // Formatage en tableau d'objets (utile si on veut afficher un graphique plus tard)
          const tableau = Object.keys(totalaliment).map((aliment) => {
            return {
              name: aliment,
              value: totalaliment[aliment]
            };
          });

          // Mise à jour des states de totaux

          setPoidtotal(somme);

        } else {
          console.error("Erreur HTTP :", reponse.status);
        }
      } catch (erreur) {
        console.error("=== ERREUR DE CONNEXION ===", erreur);
      }
    };

    donneapi();

  }, [date, date2]); // Ajout de date2 dans les dépendances pour actualiser si on change la date de fin

  // --- Fonction d'export au format Excel ---
  const exportexel = () => {
    // 1. On formate les données de l'API pour que les colonnes Excel aient des noms propres en français
    const dataexel = data.map((item) => ({
      "Date ": item.date ? item.date.split("T")[0] : "Inconnue",
      "Aliment gaspiller ": item.dechet?.dechet_nom || "Inconnue",
      "Poids (grammes) ": item.poid || 0,
    }));

    // 2. On ajoute manuellement une dernière ligne pour afficher le total
    dataexel.push({
      "Date ": "",
      "Aliment gaspiller ": "POIDS TOTAL :",
      "Poids (grammes) ": poidtotal,
    });

    // 3. Utilisation de la librairie XLSX pour générer et télécharger le fichier
    const feuille = XLSX.utils.json_to_sheet(dataexel); // Création de la feuille
    const classeur = XLSX.utils.book_new();             // Création du classeur Excel
    XLSX.utils.book_append_sheet(classeur, feuille, "Historique Gaspillage"); // Assemblage
    XLSX.writeFile(classeur, "Rapport_Gaspillage.xlsx") // Téléchargement sur le PC
  }

  return (
    <div>
      <div><NavBarCantine /></div>

      {/* --- Section : Contrôles et boutons d'export (Non visible sur le PDF) --- */}
      <div className="pt-5 text-xl items-center justify-center text-center text-white font-bold mb-4 text-base-content/80">
        <div>
          Sélectionner le jour pour créer le rapport
        </div>

        <div className="flex items-center justify-center pt-5 ">
          {/* Inputs pour choisir la plage de dates */}
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
            className="input input-bordered bg-base-100 text-base-content w-full max-w-[160px] ml-2"
          />

          {/* Boutons déclenchant les librairies d'export */}
          <div>
            <button className="btn btn-accent ml-5" onClick={() => handlePrint()}><Download />Exporter PDF</button>
          </div>
          <div>
            <button className="btn btn-success ml-5" onClick={() => exportexel()}><Sheet />Exporter EXEL</button>
          </div>
        </div>
      </div>

      {/* --- Section : Zone Imprimable (Ciblée par le useRef) --- */}
      <div ref={componentRef} className="flex flex-col items-center justify-center p-6">

        <div className="mt-12 bg-base-100 p-8 rounded-3xl shadow-xl border border-base-300 w-full max-w-4xl">

          {/* En-tête du document PDF/Impression */}
          <div className="mb-8 border-b border-base-200 pb-4">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              État Récapitulatif du {date.split('T')[0]} au {date2.split('T')[0]}
            </h2>
            <p className="text-base-content/70 italic">
              Ce document présente le relevé journalier détaillé des pertes alimentaires, établi dans le cadre de notre démarche de réduction du gaspillage.
            </p>
          </div>

          {/* Tableau de données */}
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
                {/* Boucle sur les données pour créer les lignes (rows) du tableau */}
                {data.map((item, index) => {
                  const datePropre = item.date.split('T')[0];

                  return (
                    <tr key={index} className="hover">
                      <td>{datePropre}</td>
                      <td className="font-semibold ">{item.dechet.dechet_nom}</td>
                      <td className="text-right"><span>{item.poid} g</span></td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            {/* Affichage du poids total sous le tableau */}
            <div className="bg-base-200 text-base-content text-sm font-bold tracking-wider text-right p-4 rounded-b-xl mt-2">
              Poids total : {poidtotal} g
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default rapport