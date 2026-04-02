import { ScrollText } from "lucide-react"
import NavBArAdmin from "./NavBArAdmin"


const LogAdmin = () => {
  return (
    <div>

      <div>
  <NavBArAdmin/>
      </div>
      
           <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-8  ml-5 mr-5 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300">
          <div>
            <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
              
              <ScrollText className="text-success h-8 w-8"/>
              Gestion des logs
            </h1>

          </div>
        </div>
        

      </div>
    </div>
  )
}

export default LogAdmin
