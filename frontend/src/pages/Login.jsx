import { useState } from 'react'
import axios from 'axios'

function Login({ setToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/api/auth/token/', {
        username, password
      })
      // Salva o token no estado do Pai (App.jsx) e no navegador
      const t = response.data.token
      localStorage.setItem('token', t)
      setToken(t)
    } catch (err) {
      setError('Erro ao logar. Verifique os dados.')
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login