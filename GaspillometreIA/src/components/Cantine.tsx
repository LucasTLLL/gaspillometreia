import NavBarCantine from "./NavBarCantine"
import { Outlet } from 'react-router-dom'

const Cantine = () => {
  return (
    <div>
      <div><NavBarCantine/></div>
      <Outlet />
    </div>
  )
}

export default Cantine
