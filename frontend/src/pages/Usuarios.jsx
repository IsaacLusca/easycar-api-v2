import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../services/api'
import Layout from '../components/Layout'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsuarios(data)
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

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id, username) => {
    if (!confirm(`Excluir usuário "${username}"?`)) return
    try {
      await deleteUser(id)
      fetchUsers()
    } catch {
      alert('Erro ao excluir.')
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
        <h1>Usuários</h1>
        <button className="btn-primary btn-sm" onClick={() => navigate('/usuarios/novo')}>
          + Novo Usuário
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
                <th>Email</th>
                <th>Nome</th>
                <th>Staff</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="td-bold">{u.username}</td>
                  <td>{u.email || '-'}</td>
                  <td>{u.primeiro_nome || u.first_name || '-'}</td>
                  <td>{u.is_staff ? 'Sim' : 'Não'}</td>
                  <td>{u.is_active ? 'Sim' : 'Não'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" title="Editar" onClick={() => navigate(`/usuarios/${u.id}/editar`)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Excluir" onClick={() => handleDelete(u.id, u.username)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && <div className="empty-state">Nenhum usuário encontrado.</div>}
        </div>
      )}
    </Layout>
  )
}
