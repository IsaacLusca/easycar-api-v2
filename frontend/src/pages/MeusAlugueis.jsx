import { useState, useEffect } from 'react'
import { getMeusAlugueis } from '../services/api'
import Layout from '../components/Layout'

const statusConfig = {
  ativo: { label: 'Ativo', class: 'status-warn' },
  finalizado: { label: 'Finalizado', class: 'status-ok' },
  cancelado: { label: 'Cancelado', class: 'status-err' },
}

export default function MeusAlugueis() {
  const [alugueis, setAlugueis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMeusAlugueis()
      .then(setAlugueis)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="page-header">
        <h1>Meus Aluguéis</h1>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : alugueis.length === 0 ? (
        <div className="empty-state">Você não possui aluguéis.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Carro</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alugueis.map((a) => {
                const cfg = statusConfig[a.status] || {}
                return (
                  <tr key={a.id}>
                    <td className="td-bold">{a.carro_modelo || a.carro} ({a.carro_placa})</td>
                    <td>{a.data_inicio}</td>
                    <td>{a.data_fim}</td>
                    <td>R$ {parseFloat(a.valor_total || 0).toFixed(2)}</td>
                    <td><span className={`status-badge ${cfg.class || ''}`}>{cfg.label || a.status}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
