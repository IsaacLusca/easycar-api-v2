import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCarro, createCarro, updateCarro } from '../services/api'
import Layout from '../components/Layout'

export default function CarroForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ modelo: '', placa: '', ano: '', valor_diaria: '', status: 'disponivel' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getCarro(id).then((data) => {
        setForm({ modelo: data.modelo, placa: data.placa, ano: String(data.ano), valor_diaria: String(data.valor_diaria), status: data.status })
      }).catch(() => navigate('/carros'))
    }
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, ano: parseInt(form.ano), valor_diaria: parseFloat(form.valor_diaria) }
      if (isEdit) {
        await updateCarro(id, payload)
      } else {
        await createCarro(payload)
      }
      navigate('/carros')
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Carro' : 'Novo Carro'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-grid">
            <div className="input-group">
              <label>Modelo</label>
              <input name="modelo" value={form.modelo} onChange={handleChange} required placeholder="Ex: Fiat Uno" />
            </div>
            <div className="input-group">
              <label>Placa</label>
              <input name="placa" value={form.placa} onChange={handleChange} required placeholder="ABC1A23" />
            </div>
            <div className="input-group">
              <label>Ano</label>
              <input name="ano" type="number" value={form.ano} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Valor da Diária (R$)</label>
              <input name="valor_diaria" type="number" step="0.01" value={form.valor_diaria} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="disponivel">Disponível</option>
                <option value="alugado">Alugado</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/carros')}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
