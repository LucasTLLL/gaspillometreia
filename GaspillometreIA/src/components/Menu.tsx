import { CirclePlus, CloudDownload } from "lucide-react";
import MenuItem from "./MenuItem"
import NavBarCantine from "./NavBarCantine"
import { useState } from 'react'


type MenuType = {
    id: number;
    aliment: string;
    qte: string; 
    date: string;
}

const Menu = () => {
    const [value, setValue] = useState('')
    const [quantite, setQuantite] = useState('')
    
    const [menus, setMenus] = useState<MenuType[]>([])

    function addMenu() {
        if (value.trim() == "") {
            return
        }

        const datedjour= new Date().toISOString();

        const newMenu: MenuType = {
            id: Date.now(),
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

    function addMenuBDD(){
        console.log(menus)
    }

    return (
        <div>
            <div><NavBarCantine /></div>
            <div>  
                <p className="font-bold text-accent flex justify-center text-4xl m-5">Menu du jour</p>
                <br />
            </div>
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

            <div></div>
        </div>
    )
}

export default Menu
