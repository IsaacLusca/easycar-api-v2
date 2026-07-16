import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAlugueis, updateAluguel } from '../services/api'
import Layout from '../components/Layout'

const statusConfig = {
  ativo: { label: 'Ativo', class: 'status-warn' },
  finalizado: { label: 'Finalizado', class: 'status-ok' },
  cancelado: { label: 'Cancelado', class: 'status-err' },
}

export default function Alugueis() {
  const [alugueis, setAlugueis] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAlugueis = async () => {
    try {
      const data = await getAlugueis()
      setAlugueis(data)
    } catch {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlugueis() }, [])

  const handleFinalizar = async (id) => {
    if (!confirm('Finalizar este aluguel?')) return
    await updateAluguel(id, { status: 'finalizado' })
    fetchAlugueis()
  }

  const handleCancelar = async (id) => {
    if (!confirm('Cancelar este aluguel?')) return
    await updateAluguel(id, { status: 'cancelado' })
    fetchAlugueis()
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Aluguéis</h1>
        <button className="btn-primary btn-sm" onClick={() => navigate('/alugueis/novo')}>
          + Novo Aluguel
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Carro</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alugueis.map((a) => {
                const cfg = statusConfig[a.status] || {}
                return (
                  <tr key={a.id}>
                    <td className="td-bold">{a.cliente_nome || a.perfil_cliente}</td>
                    <td>{a.carro_modelo || a.carro} ({a.carro_placa})</td>
                    <td>{a.data_inicio}</td>
                    <td>{a.data_fim}</td>
                    <td>R$ {parseFloat(a.valor_total || 0).toFixed(2)}</td>
                    <td><span className={`status-badge ${cfg.class || ''}`}>{cfg.label || a.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-icon" title="Editar" onClick={() => navigate(`/alugueis/${a.id}/editar`)}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        {a.status === 'ativo' && (
                          <>
                            <button className="btn-icon btn-icon-success" title="Finalizar" onClick={() => handleFinalizar(a.id)}>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                            </button>
                            <button className="btn-icon btn-icon-danger" title="Cancelar" onClick={() => handleCancelar(a.id)}>
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {alugueis.length === 0 && <div className="empty-state">Nenhum aluguel registrado.</div>}
        </div>
      )}
    </Layout>
  )
}
