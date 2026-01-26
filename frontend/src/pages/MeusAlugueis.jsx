import { useState, useEffect } from 'react'
import axios from 'axios'

function MeusAlugueis({ token }) {
  const [alugueis, setAlugueis] = useState([])

  useEffect(() => {
    // Endpoint configurado no urls.py do Django
    axios.get('http://localhost:8000/api/me/alugueis/', {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setAlugueis(res.data))
    .catch(err => console.error(err))
  }, [token])

  return (
    <div>
      <h1>Histórico de Aluguéis</h1>
      {alugueis.length === 0 ? <p>Você não tem aluguéis.</p> : (
        <ul>
          {alugueis.map(a => (
            <li key={a.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #555' }}>
              <strong>{a.carro_modelo}</strong> - {a.data_inicio} até {a.data_fim} <br/>
              Status: {a.status} | Total: R$ {a.valor_total || 'Calculando...'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MeusAlugueis