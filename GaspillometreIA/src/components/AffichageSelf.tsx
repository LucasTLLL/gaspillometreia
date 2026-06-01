import { useState, useEffect } from "react";

const AffichageSelf = () => {

  // Déclaration des states pour gérer les données dynamiques de l'interface
  const [now, setNow] = useState(new Date());
  const [data, setData] = useState<any[]>([]);
  const [totalGaspille, setTotalGaspille] = useState<number>(0);
  const [moyenne, setMoyenne] = useState<number | string>(0);
  const [diff, setDiff] = useState<number | string>(0);

  // 1er useEffect : Gère le rafraîchissement des données de l'API
  useEffect(() => {
    fetchData(); // Premier appel au chargement du composant
    
    // Création d'un minuteur pour actualiser les données toutes les minutes (60000ms)
    const minuteur = setInterval(() => {
      console.log("Actualisation");
      fetchData();
    }, 60000);
    
    // Nettoyage de l'intervalle au démontage du composant 
    return () => clearInterval(minuteur);
  }, []); // Le tableau vide [] indique que l'effet se lance uniquement au montage

  // 2ème useEffect : Gère l'horloge en temps réel pour l'affichage en haut de page
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Formatage de la date et de l'heure en français 
  const dateDuJour = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  const heure = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  // Fonction principale pour récupérer et traiter les données du gaspillage
  const fetchData = async () => {
    // Calcul des dates nécessaires pour cibler les requêtes API
    const date1 = new Date(); // Aujourd'hui
    const date2 = new Date(); // Demain (pour englober toute la journée actuelle)
    const date3 = new Date(); // Hier
    
    date3.setDate(date3.getDate() - 1);
    date2.setDate(date2.getDate() + 1);

    // Formatage des dates au format ISO (YYYY-MM-DD) attendu par l'API
    const rech = date1.toISOString().split('T')[0];
    const rech2 = date2.toISOString().split('T')[0];
    const rech3 = date3.toISOString().split('T')[0];

    try {
      let somme = 0
      
      // Appel API pour les données du jour
      const reponse = await fetch(
        `http://10.0.200.78:8000/analyse?from_=${rech}&to=${rech2}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      // Appel API pour les données de la veille (pour comparaison)
      const rephier = await fetch(
        `http://10.0.200.78:8000/analyse?from_=${rech3}&to=${rech}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      // --- Traitement des données du jour ---
      if (reponse.ok) {
        const json = await reponse.json();
        
        // Objet pour regrouper les poids par type d'aliment
        const totalaliment: Record<string, number> = {};

        // Boucle sur les données pour faire la somme globale et par aliment
        json.forEach((element: any) => {
          const aliment = element.dechet?.dechet_nom || "Inconnu";
          const poids = element.poid || 0;

          somme += poids;
          
          // Incrémentation ou initialisation du poids pour chaque aliment
          if (totalaliment[aliment]) {
            totalaliment[aliment] += poids;
          } else {
            totalaliment[aliment] = poids;
          }
        });

        // Conversion de l'objet en tableau pour faciliter le tri et l'affichage avec .map()
        const tableau = Object.keys(totalaliment).map((aliment) => ({
          name: aliment,
          value: totalaliment[aliment]
        }));

        // Tri du tableau par ordre décroissant (le plus gaspillé en haut)
        tableau.sort((a: any, b: any) => b.value - a.value);
        setData(tableau);

        // Calcul de la moyenne par plateau
        const nbplateau = json.length;
        let moyenne = 0;
        if (nbplateau > 0) {
          moyenne = somme / nbplateau
        }
        
        // On force 2 chiffres après la virgule pour un affichage propre
        const moyennear = moyenne.toFixed(2);

        // Mise à jour des states
        setMoyenne(moyennear);
        setTotalGaspille(somme);

        // Logs de debug laissés pour suivre l'évolution en console
        console.log("Somme", somme);
        console.log("Data", json);
        console.log("Nombre de plateau", nbplateau)
        console.log("Total", totalaliment);
        console.log("moyenne", moyennear)

      } else {
        console.error("Erreur HTTP (Aujourd'hui) :", reponse.status);
      }

      // --- Traitement des données d'hier pour la différence ---
      if (rephier.ok) {
        const jsonhier = await rephier.json();
        let sommehier = 0;
        jsonhier.forEach((element: any) => {
          sommehier += element.poid || 0;
        });

        // Calcul de l'écart (positif = on a plus gaspillé, négatif = on a moins gaspillé)
        const difference = somme - sommehier;
        setDiff(difference);

      } else {
        console.error("Erreur HTTP (Hier) :", rephier.status);
      }

    } catch (erreur) {
      alert('Impossible de joindre le serveur');
      console.error(erreur);
    }
  };

  // --- Configuration de la jauge visuelle de l'objectif ---
  const OBJMOY = 30; // Objectif fixé en grammes
  const barremax = 60; // Valeur maximale de la barre pour le calcul du pourcentage
  const moyenneNum = Number(moyenne) || 0; // Sécurisation du type pour le calcul
  const pourcentage = Math.min((moyenneNum / barremax) * 100, 100); // Plafond bloqué à 100% max

  return (
    <div data-theme="light" className="min-h-screen bg-base-100 w-full flex flex-col items-center p-6">

      {/* En-tête fixe (sticky) avec l'horloge */}
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

      {/* Cartes des statistiques principales */}
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
          <p className="font-bold">Différence avec hier</p>
          {/* Changement de couleur selon si on a plus ou moins gaspillé qu'hier */}
          <p className={diff < 0 ? "text-success font-bold" : "text-error font-bold"}> 
            {diff > 0 ? "+" : ""} {diff} g
          </p>
        </div>
      </div>

      {/* Liste du top 3 des aliments gaspillés */}
      <div className="mt-12">
        <div className="mt-12 w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Classement des aliments</h2>
          {/* Vérification que le tableau data n'est pas vide avant de l'afficher */}
          {data && data.length > 0 ? (
            <ul className="space-y-2">
              {/* Utilisation de slice(0,3) pour n'afficher que les 3 premiers */}
              {data.slice(0, 3).map((item: any, index: number) => (
                <li key={index} className="text-xl">
                  Numéro {index + 1} : <span className="capitalize">{item.name}</span> : {item.value} g
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucune donnée à afficher</p>
          )}
        </div>
      </div>
            
      {/* Jauge d'objectif visuelle */}
      <div className="mt-16 w-full max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Objectif du jour : Moins de {OBJMOY} g / plateau
        </h2>

        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Barre de progression : Passe au rouge si on dépasse l'objectif */}
          <div 
            className={`h-full transition-all duration-1000 ${moyenneNum > OBJMOY ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${pourcentage}%` }}
          ></div>

          {/* Curseur noir marquant l'objectif sur la barre */}
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