import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAluguel, createAluguel, updateAluguel, getCarros, getCarrosDisponiveis, getPerfis, getUsers } from '../services/api'
import Layout from '../components/Layout'

export default function AluguelForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ perfil_cliente: '', carro: '', funcionario: '', data_inicio: '', data_fim: '', status: 'ativo' })
  const [carros, setCarros] = useState([])
  const [perfis, setPerfis] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const carrosPromise = isEdit ? getCarros() : getCarrosDisponiveis()
        const [carrosData, perfisData, usersData] = await Promise.all([
          carrosPromise,
          getPerfis(),
          getUsers(),
        ])
        setCarros(carrosData)
        setPerfis(perfisData)
        setFuncionarios(usersData.filter((u) => u.is_staff))

        if (isEdit) {
          const aluguel = await getAluguel(id)
          setForm({
            perfil_cliente: aluguel.perfil_cliente,
            carro: aluguel.carro,
            funcionario: aluguel.funcionario || '',
            data_inicio: aluguel.data_inicio,
            data_fim: aluguel.data_fim,
            status: aluguel.status,
          })
        }
      } catch {
        navigate('/alugueis')
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
        await updateAluguel(id, form)
      } else {
        await createAluguel(form)
      }
      navigate('/alugueis')
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
        <h1>{isEdit ? 'Editar Aluguel' : 'Novo Aluguel'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-grid">
            <div className="input-group">
              <label>Cliente</label>
              <select name="perfil_cliente" value={form.perfil_cliente} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {perfis.map((p) => (
                  <option key={p.id} value={p.id}>{p.user?.username || p.user_id} - {p.cnh}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Carro</label>
              <select name="carro" value={form.carro} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {carros.map((c) => (
                  <option key={c.id} value={c.id}>{c.modelo} ({c.placa}) - R$ {parseFloat(c.valor_diaria).toFixed(2)}/dia</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Funcionário</label>
              <select name="funcionario" value={form.funcionario} onChange={handleChange}>
                <option value="">Selecione...</option>
                {funcionarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Data de Início</label>
              <input name="data_inicio" type="date" value={form.data_inicio} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Data de Fim</label>
              <input name="data_fim" type="date" value={form.data_fim} onChange={handleChange} required />
            </div>
            {isEdit && (
              <div className="input-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="ativo">Ativo</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/alugueis')}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
