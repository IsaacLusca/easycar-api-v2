import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCarros, getCarrosDisponiveis, getCarrosAlugados } from '../services/api'
import Layout from '../components/Layout'

const statusConfig = {
  disponivel: { label: 'Disponível', class: 'status-ok' },
  alugado: { label: 'Alugado', class: 'status-warn' },
  indisponivel: { label: 'Indisponível', class: 'status-err' },
}

export default function Dashboard() {
  const [carros, setCarros] = useState([])
  const [filter, setFilter] = useState('todos')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data
        if (filter === 'disponivel') {
          data = await getCarrosDisponiveis()
        } else if (filter === 'alugado') {
          data = await getCarrosAlugados()
        } else {
          data = await getCarros()
        }
        setCarros(data)
      } catch {
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filter, navigate])

  const disponiveis = carros.filter((c) => c.status === 'disponivel').length
  const alugados = carros.filter((c) => c.status === 'alugado').length

  return (
    <Layout>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-total">
          <span className="stat-number">{carros.length}</span>
          <span className="stat-label">Total de Veículos</span>
        </div>
        <div className="stat-card stat-available">
          <span className="stat-number">{disponiveis}</span>
          <span className="stat-label">Disponíveis</span>
        </div>
        <div className="stat-card stat-rented">
          <span className="stat-number">{alugados}</span>
          <span className="stat-label">Alugados</span>
        </div>
      </div>

      <div className="filter-bar">
        <h3>Veículos</h3>
        <div className="filter-buttons">
          {['todos', 'disponivel', 'alugado'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => { setLoading(true); setFilter(f) }}
            >
              {f === 'todos' ? 'Todos' : f === 'disponivel' ? 'Disponíveis' : 'Alugados'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="cars-grid">
          {carros.map((carro) => {
            const cfg = statusConfig[carro.status] || { label: carro.status, class: '' }
            return (
              <div key={carro.id} className="car-card">
                <div className="car-card-header">
                  <span className={`status-badge ${cfg.class}`}>{cfg.label}</span>
                </div>
                <div className="car-card-body">
                  <div className="car-icon">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 17h14M5 17l-2-4h2l2 4M19 17l2-4h-2l-2 4M7 13h10M9 9h6" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <h4 className="car-model">{carro.modelo}</h4>
                  <div className="car-details">
                    <div className="car-detail">
                      <span className="detail-label">Placa</span>
                      <span className="detail-value">{carro.placa}</span>
                    </div>
                    <div className="car-detail">
                      <span className="detail-label">Ano</span>
                      <span className="detail-value">{carro.ano}</span>
                    </div>
                    <div className="car-detail">
                      <span className="detail-label">Diária</span>
                      <span className="detail-value">R$ {parseFloat(carro.valor_diaria).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
