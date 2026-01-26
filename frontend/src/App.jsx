import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import MeusAlugueis from './pages/MeusAlugueis'
import './App.css'

function App() {
  // Estado Global de Autenticação
  const [token, setToken] = useState(localStorage.getItem('token'))

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  // Se não tem token, força mostrar o Login
  if (!token) {
    return <Login setToken={setToken} />
  }

  // Se tem token, mostra o site com nav
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* navbar */}
        <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '10px', borderBottom: '1px solid #444' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
          <Link to="/meus-alugueis" style={{ color: 'white', textDecoration: 'none' }}>Meus Aluguéis</Link>
          <button onClick={logout} style={{ marginLeft: 'auto', background: 'red', border: 'none', color: 'white', cursor: 'pointer' }}>Sair</button>
        </nav>

        {/* mudança de páginas */}
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/meus-alugueis" element={<MeusAlugueis token={token} />} />
          {/* Rota para erro */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
