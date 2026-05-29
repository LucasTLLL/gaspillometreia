import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tendance from "./components/Tendance";
import Rapport from "./components/Rapport";
import AffichageSelf from "./components/AffichageSelf";
import AdminPanels from "./components/AdminPanels";
import LogAdmin from './components/LogAdmin';
import GestionAdmin from './components/GestionAdmin';
import Login from './components/Login';
import Menu from './components/Menu';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
     
        <Route path="/login" element={<Login onLoginSuccess={() => { }} />} />

     
        <Route
          path="/AdminPanels"
          element={
            <ProtectedRoute roleRequis={0}>
              <AdminPanels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/LogAdmin"
          element={
            <ProtectedRoute roleRequis={0}>
              <LogAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GestionAdmin"
          element={
            <ProtectedRoute roleRequis={0}>
              <GestionAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute roleRequis={1}>
              <Menu />
            </ProtectedRoute>
          }
        />

 

       
        <Route
          path="/tendance"
          element={
            <ProtectedRoute roleRequis={1}>
              <Tendance />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/rapport"
          element={
            <ProtectedRoute roleRequis={1}>
              <Rapport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AffichageSelf"
          element={
            <ProtectedRoute roleRequis={2}>
              <AffichageSelf />
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
