import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, createUser, updateUser } from '../services/api'
import Layout from '../components/Layout'

export default function UsuarioForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', primeiro_nome: '', senha: '', is_staff: false, is_active: true })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getUser(id).then((data) => {
        setForm({ username: data.username, email: data.email || '', primeiro_nome: data.primeiro_nome || '', senha: '', is_staff: data.is_staff, is_active: data.is_active })
      }).catch(() => navigate('/usuarios'))
    }
  }, [id])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      if (isEdit && !payload.senha) delete payload.senha
      if (isEdit) {
        await updateUser(id, payload)
      } else {
        await createUser(payload)
      }
      navigate('/usuarios')
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-grid">
            <div className="input-group">
              <label>Usuário</label>
              <input name="username" value={form.username} onChange={handleChange} required placeholder="Nome de usuário" />
            </div>
            <div className="input-group">
              <label>Nome</label>
              <input name="primeiro_nome" value={form.primeiro_nome} onChange={handleChange} required placeholder="Nome completo" />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" />
            </div>
            <div className="input-group">
              <label>Senha {isEdit && '(deixe vazio para manter)'}</label>
              <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder={isEdit ? '' : 'Senha'} />
            </div>
            <div className="input-group">
              <label className="checkbox-label">
                <input name="is_staff" type="checkbox" checked={form.is_staff} onChange={handleChange} />
                Funcionário
              </label>
            </div>
            <div className="input-group">
              <label className="checkbox-label">
                <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
                Ativo
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/usuarios')}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
