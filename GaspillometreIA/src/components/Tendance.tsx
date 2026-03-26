import Aliment from "./Aliment";
import CoreMenu from "./CoreMenu";
import NavBarCantine from "./NavBarCantine"
import Periode from "./Periode";


const tendance = () => {
  return (
    <div>
       <div><NavBarCantine/></div>
        <div>
<div className="flex flex-row h-screen w-full">
      
     
      <div className="flex-1 p-8 border-r border-accent">
        <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
          1. Comparer les périodes
        </h2>
        <div className="mt-5">
          <Periode/>
        </div>
      </div>

      

      <div className="flex-1 p-8 border-r border-accent">
        <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
         2. Aliments les plus gaspillés
        </h2>
        <div className="mt-5">
             <Aliment/>
        </div>
      </div>
      


            <div className="flex-1 p-8 border-">
        <h2 className="text-2xl font-bold text-white bg-accent text-center rounded-xl py-2">
         3. Correspondance menus
        </h2>
        <div className="mt-5">
          <CoreMenu/>
        </div>
      </div>

    </div>
        </div>
    </div>
  )
}

export default tendance
