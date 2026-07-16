import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPerfis, deletePerfil, getAlugueisDoPerfil } from '../services/api'
import Layout from '../components/Layout'

export default function Perfis() {
  const [perfis, setPerfis] = useState([])
  const [loading, setLoading] = useState(true)
  const [alugueisModal, setAlugueisModal] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchPerfis = async () => {
    try {
      const data = await getPerfis()
      setPerfis(data)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Acesso restrito a funcionários.')
      } else {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPerfis() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Excluir este perfil?')) return
    try {
      await deletePerfil(id)
      fetchPerfis()
    } catch {
      alert('Erro ao excluir.')
    }
  }

  const handleVerAlugueis = async (perfilId) => {
    try {
      const data = await getAlugueisDoPerfil(perfilId)
      setAlugueisModal(data)
    } catch {
      alert('Erro ao carregar aluguéis.')
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="empty-state">{error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Perfis de Cliente</h1>
        <button className="btn-primary btn-sm" onClick={() => navigate('/perfis/novo')}>
          + Novo Perfil
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>CNH</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {perfis.map((p) => (
                <tr key={p.id}>
                  <td className="td-bold">{p.user?.username || p.user_id}</td>
                  <td>{p.cnh}</td>
                  <td>{p.telefone}</td>
                  <td>{p.endereco}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Aluguéis" onClick={() => handleVerAlugueis(p.id)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      </button>
                      <button className="btn-icon" title="Editar" onClick={() => navigate(`/perfis/${p.id}/editar`)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Excluir" onClick={() => handleDelete(p.id)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {perfis.length === 0 && <div className="empty-state">Nenhum perfil encontrado.</div>}
        </div>
      )}

      {alugueisModal && (
        <div className="modal-overlay" onClick={() => setAlugueisModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Aluguéis do Cliente</h2>
              <button className="btn-icon" onClick={() => setAlugueisModal(null)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {alugueisModal.length === 0 ? (
              <p style={{ color: '#64748b', padding: '24px', textAlign: 'center' }}>Nenhum aluguel encontrado.</p>
            ) : (
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
                  {alugueisModal.map((a) => (
                    <tr key={a.id}>
                      <td>{a.carro_modelo || a.carro}</td>
                      <td>{a.data_inicio}</td>
                      <td>{a.data_fim}</td>
                      <td>R$ {parseFloat(a.valor_total || 0).toFixed(2)}</td>
                      <td><span className={`status-badge ${a.status === 'finalizado' ? 'status-ok' : a.status === 'ativo' ? 'status-warn' : 'status-err'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
