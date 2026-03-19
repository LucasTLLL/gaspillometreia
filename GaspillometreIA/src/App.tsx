import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from "./components/Login"
import Cantine from "./components/Cantine"
import Menu from "./components/Menu"
import Tendance from "./components/Tendance"
import Rapport from "./components/Rapport"
import AffichageSelf from "./components/AffichageSelf"
import AdminPanels from "./components/AdminPanels"


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/cantine"
          element={isAuthenticated ? <Cantine /> : <Navigate to="/login" />}
        />
        <Route
          path="/tendance"
          element={isAuthenticated ? <Tendance /> : <Navigate to="/login" />}
        />
        <Route
          path="/rapport"
          element={isAuthenticated ? <Rapport /> : <Navigate to="/login" />}
        />
        <Route
          path="/menu"
          element={isAuthenticated ? <Menu /> : <Navigate to="/login" />}
        />
        <Route
          path="/affichageSelf"
          element={isAuthenticated ? <AffichageSelf /> : <Navigate to="/login" />}
        />
        <Route
          path="/AdminPanels"
          element={isAuthenticated ? <AdminPanels /> : <Navigate to="/login" />}
        />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App


