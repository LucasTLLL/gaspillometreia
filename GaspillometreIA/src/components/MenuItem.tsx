import { Trash } from "lucide-react"

type MenuType = {
    id: number;
    aliment: string;
    qte: string;
    date: string;
}

type Props = {
    menu: MenuType;
    onDelete: () => void;
}

const MenuItem = ({ menu, onDelete }: Props) => {
    return (
        <li className="p-3">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2 font-medium">
                    {menu.aliment} - {menu.qte} Kg
                </div>
              
                <button className="btn btn-sm btn-error btn-soft" onClick={onDelete}>
                    <Trash className="w-4 h-4"/>
                </button>
            </div>
        </li>
    )
}

export default MenuItem
