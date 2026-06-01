import Aliment from "./Aliment";
import CoreMenu from "./CoreMenu";
import NavBarCantine from "./NavBarCantine"
import Periode from "./Periode";


const Tendance = () => {
  return (
    <div>
       {/* Intégration de la barre de navigation */}
       <div><NavBarCantine/></div>
       
        <div>
          {/* Conteneur principal : 
              - flex-row : Aligne les éléments horizontalement
              - h-screen : Prend toute la hauteur de l'écran visible
              - w-full : Prend toute la largeur */}
          <div className="flex flex-row h-screen w-full">
      
            {/* Colonne 1 : Graphique des périodes
                'flex-1' force cette div à prendre exactement 1/3 de l'espace disponible.
                'border-r border-accent' crée une ligne de séparation verticale esthétique. */}
            <div className="flex-1 p-8 border-r border-accent">
              <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
                1. Comparer les périodes
              </h2>
              <div className="mt-5">
                {/* Appel du sous-composant gérant son propre fetch et state */}
                <Periode/>
              </div>
            </div>

            {/* Colonne 2 : Classement des aliments */}
            <div className="flex-1 p-8 border-r border-accent">
              <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
              2. Aliments les plus gaspillés
              </h2>
              <div className="mt-5">
                  {/* Appel du sous-composant Aliment */}
                  <Aliment/>
              </div>
            </div>
            
            {/* Colonne 3 : Comparaison Menus/Gaspillage
                Pas de 'border-r' ici puisque c'est la dernière colonne à droite */}
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
              3. Correspondance menus
              </h2>
              <div className="mt-5">
                {/* Appel du sous-composant CoreMenu */}
                <CoreMenu/>
              </div>
            </div>

          </div>
        </div>
    </div>
  )
}

export default Tendance