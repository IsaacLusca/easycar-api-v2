import { useState, useEffect } from 'react'
import axios from 'axios'

function Home({ token }) {
  const [carros, setCarros] = useState([])

  useEffect(() => {
    // Busca carros (endpoint público ou privado)
    axios.get('http://localhost:8000/api/carros/', {
      headers: { Authorization: `Token ${token}` }
    })
    .then(res => setCarros(res.data))
    .catch(err => console.error(err))
  }, [token])

  const alugar = (id) => {
    alert(`Redirecionar para tela de aluguel do carro ${id}`)
    
  }

  return (
    <div>
      <h1>Lista de carros</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {carros.map(carro => (
          <div key={carro.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h3>{carro.modelo}</h3>
            <p>Placa: {carro.placa}</p>
            <p style={{ color: 'green' }}>R$ {carro.valor_diaria}/dia</p>
            <button onClick={() => alugar(carro.id)} disabled={carro.status !== 'disponivel'}>
              {carro.status === 'disponivel' ? 'Alugar' : 'Indisponível'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home