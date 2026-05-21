import { useState } from "react";
import MenuItem from "./MenuItem";
import NavBArAdmin from "./NavBArAdmin"
import { CirclePlus, CloudDownload } from "lucide-react";

const GestionAdmin = () => {

     
        const [value, setValue] = useState('')
        const [quantite, setQuantite] = useState('')
    
        const [menus, setMenus] = useState<MenuType[]>([])
    
        function addMenu() {
            if (value.trim() == "") {
                return
            }
    
            const datedjour = new Date().toISOString().split('T')[0];
    
            const newMenu: MenuType = {
                id: Number(Date.now().toString().slice(-7)),
                aliment: value.trim(),
                qte: quantite.trim(),
                date: datedjour
    
            }
    
            const newMenus = [newMenu, ...menus]
            setMenus(newMenus)
            setValue('')
            setQuantite('')
    
        }
    
    
        function deleteMenu(id: number) {
            const newMenus = menus.filter(menu => menu.id !== id);
            setMenus(newMenus);
        }
    
           async function addMenuBDD() {
        if (menus.length === 0) return;
        
        const Token = "hmkr1BG7MuCmdPkFvWVY0Q$ay4u63x0DLPS52r/AYJYTwxLFAH/o9basv5X0EK9itw";
        const tokenSecurise = encodeURIComponent(Token);
    
        for (const menu of menus) {
          
          
          
    
          try {
            const reponse = await fetch(
              `http://10.0.200.78:8000/insertmenu?id=${menu.id}&aliment=${menu.aliment}&qte=${menu.qte}&date=${menu.date}&rasp=rasp1&token=${tokenSecurise}`,
              {
                method: 'POST',
                headers: {
                  'Accept': 'application/json'
                }
              }
            );
    
            if (reponse.ok) {
              console.log(`${menu.aliment} ajouté en BDD !`);
            } else {
              console.error(` Erreur serveur pour ${menu.aliment} :`, reponse.status);
            }
          } catch (error) {
            console.error(` Erreur réseau pour ${menu.aliment} :`, error);
          }
        }
    
     
        console.log("menu:", menus)
        alert("Tous les plats ont été envoyés !");
      }
    

 


    return (
        <div>


            <div> <NavBArAdmin /> </div>

            <div className="flex flex-row md:flex-row items-start gap-16 mt-15 w-full px-5 justify-center ">
                <div className="flex flex-col   items-center  bg-base-100 p-6 rounded-3xl shadow-sm border border-accent">
                    <h1 className="font-bold text-xl mb-5">Importer des menus</h1>
                    <div className="flex justify-center gap-2 ml-15 mr-15 md:m-auto">
                        
                        <input type="text"
                            placeholder="Entrez le plat "
                            className="input input-l"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />

                        <input type="number"
                            placeholder="Entrez la quantité ( Kg )"
                            className="input input-l w-auto md:w-40"
                            value={quantite}
                            onChange={(e) => setQuantite(e.target.value)}
                        />

                        <button type="submit" className="btn btn-accent ml-2" onClick={addMenu}> <CirclePlus /> Ajouter </button>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <ul className="divide-y divide-primary/20 w-full max-w-lg">
                            {menus.map((menu) => (
                                <li key={menu.id}>

                                    <MenuItem menu={menu} onDelete={() => deleteMenu(menu.id)} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center ">
                        <button className="btn btn-success w-50 h-15 mt-5 " onClick={addMenuBDD}> <CloudDownload /> Envoyer au serveur </button>
                    </div>

                </div>

               
            </div>
        </div>
    )
}

export default GestionAdmin
