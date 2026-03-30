import { ClipboardX, ScrollText, ShieldAlert, UserPen } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NavBArAdmin = () => {

  const navigate = useNavigate()

  return (


    <div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300">
        <div>
          <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
            <ShieldAlert className="text-error h-8 w-8" />
            Centre de Contrôle Admin
          </h1>
          <p className="text-base-content/60">Gestion globale du Gaspillomètre</p>
        </div>
        </div>
      <div></div>
    
    <div className="flex justify-center">
      <div className="w-1/2 bg-base-100 rounded-3xl shadow-sm border border-base-300 px-3 py-2">
        <div className="flex items-center">
          <button className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center "
          onClick={() => navigate('/AdminPanels')} 
          ><UserPen /> Utilisateurs</button>
          <button className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center"
          onClick={() => navigate('/LogAdmin')} 
          >
            <ScrollText /> Log</button>
          <button className="flex items-center gap-1 btn btn-ghost px-3 py-1 flex-1 justify-center"
          onClick={() => navigate('/GestionAdmin')} 
          >
            
            <ClipboardX /> Gestion</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default NavBArAdmin
