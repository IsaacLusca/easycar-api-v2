import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Carros from './pages/Carros'
import CarroForm from './pages/CarroForm'
import Alugueis from './pages/Alugueis'
import AluguelForm from './pages/AluguelForm'
import MeusAlugueis from './pages/MeusAlugueis'
import Usuarios from './pages/Usuarios'
import UsuarioForm from './pages/UsuarioForm'
import Perfis from './pages/Perfis'
import PerfilForm from './pages/PerfilForm'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/carros" element={<ProtectedRoute><Carros /></ProtectedRoute>} />
      <Route path="/carros/novo" element={<ProtectedRoute><CarroForm /></ProtectedRoute>} />
      <Route path="/carros/:id/editar" element={<ProtectedRoute><CarroForm /></ProtectedRoute>} />
      <Route path="/alugueis" element={<ProtectedRoute><Alugueis /></ProtectedRoute>} />
      <Route path="/alugueis/novo" element={<ProtectedRoute><AluguelForm /></ProtectedRoute>} />
      <Route path="/alugueis/:id/editar" element={<ProtectedRoute><AluguelForm /></ProtectedRoute>} />
      <Route path="/meus-alugueis" element={<ProtectedRoute><MeusAlugueis /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/usuarios/novo" element={<ProtectedRoute><UsuarioForm /></ProtectedRoute>} />
      <Route path="/usuarios/:id/editar" element={<ProtectedRoute><UsuarioForm /></ProtectedRoute>} />
      <Route path="/perfis" element={<ProtectedRoute><Perfis /></ProtectedRoute>} />
      <Route path="/perfis/novo" element={<ProtectedRoute><PerfilForm /></ProtectedRoute>} />
      <Route path="/perfis/:id/editar" element={<ProtectedRoute><PerfilForm /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
