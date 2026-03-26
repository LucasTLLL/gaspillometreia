import { useNavigate } from 'react-router-dom'

const NavBarCantine = () => {
    const navigate = useNavigate()
    
    return (
        <div>
            <div className="flex md:justify-center justify-left">
                <ul className="menu menu-horizontal bg-secondary">
                    <li className="w-auto md:w-100 "><a onClick={() => navigate('/tendance')} className=" flex items-center justify-center">Visualiser les tendances de paf</a></li>
                    <li className="w-auto md:w-100 "><a onClick={() => navigate('/rapport')} className=" flex items-center justify-center">Générer les rapports paf</a></li>
                    <li className="w-auto md:w-100 "><a onClick={() => navigate('/menu')} className=" flex items-center justify-center">Importer les paf</a></li>
                </ul></div>
        </div>
    )
}

export default NavBarCantine
