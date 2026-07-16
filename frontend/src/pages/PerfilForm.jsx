import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPerfil, createPerfil, updatePerfil, getUsers } from '../services/api'
import Layout from '../components/Layout'

export default function PerfilForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ user_id: '', cnh: '', telefone: '', endereco: '' })
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await getUsers()
        setUsuarios(usersData.filter((u) => !u.is_staff))

        if (isEdit) {
          const perfil = await getPerfil(id)
          setForm({ user_id: perfil.user_id, cnh: perfil.cnh, telefone: perfil.telefone, endereco: perfil.endereco })
        }
      } catch {
        navigate('/perfis')
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isEdit) {
        await updatePerfil(id, form)
      } else {
        await createPerfil(form)
      }
      navigate('/perfis')
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) return <Layout><div className="loading">Carregando...</div></Layout>

  return (
    <Layout>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Perfil' : 'Novo Perfil'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-grid">
            <div className="input-group">
              <label>Usuário</label>
              <select name="user_id" value={form.user_id} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>CNH</label>
              <input name="cnh" value={form.cnh} onChange={handleChange} required placeholder="Número da CNH" />
            </div>
            <div className="input-group">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(61) 99999-9999" />
            </div>
            <div className="input-group">
              <label>Endereço</label>
              <input name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Endereço completo" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/perfis')}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
