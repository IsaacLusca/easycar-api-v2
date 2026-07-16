import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCarros, deleteCarro } from '../services/api'
import Layout from '../components/Layout'

const statusConfig = {
  disponivel: { label: 'Disponível', class: 'status-ok' },
  alugado: { label: 'Alugado', class: 'status-warn' },
  indisponivel: { label: 'Indisponível', class: 'status-err' },
}

export default function Carros() {
  const [carros, setCarros] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCarros = async () => {
    try {
      const data = await getCarros()
      setCarros(data)
    } catch {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCarros() }, [])

  const handleDelete = async (id, modelo) => {
    if (!confirm(`Excluir "${modelo}"?`)) return
    try {
      await deleteCarro(id)
      fetchCarros()
    } catch (err) {
      alert('Erro ao excluir carro. Verifique se não está vinculado a aluguéis.')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Carros</h1>
        <button className="btn-primary btn-sm" onClick={() => navigate('/carros/novo')}>
          + Novo Carro
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Placa</th>
                <th>Ano</th>
                <th>Diária</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carros.map((c) => {
                const cfg = statusConfig[c.status] || {}
                return (
                  <tr key={c.id}>
                    <td className="td-bold">{c.modelo}</td>
                    <td>{c.placa}</td>
                    <td>{c.ano}</td>
                    <td>R$ {parseFloat(c.valor_diaria).toFixed(2)}</td>
                    <td><span className={`status-badge ${cfg.class || ''}`}>{cfg.label || c.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon" title="Editar" onClick={() => navigate(`/carros/${c.id}/editar`)}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button className="btn-icon btn-icon-danger" title="Excluir" onClick={() => handleDelete(c.id, c.modelo)}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {carros.length === 0 && <div className="empty-state">Nenhum carro cadastrado.</div>}
        </div>
      )}
    </Layout>
  )
}
