import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = async (username, password) => {
  const response = await api.post('/auth/token/', { username, password })
  return response.data
}

export const getCarros = async () => {
  const response = await api.get('/carros/')
  return response.data
}

export const getCarro = async (id) => {
  const response = await api.get(`/carros/${id}/`)
  return response.data
}

export const createCarro = async (data) => {
  const response = await api.post('/carros/', data)
  return response.data
}

export const updateCarro = async (id, data) => {
  const response = await api.patch(`/carros/${id}/`, data)
  return response.data
}

export const deleteCarro = async (id) => {
  await api.delete(`/carros/${id}/`)
}

export const getCarrosDisponiveis = async () => {
  const response = await api.get('/carros/disponiveis/')
  return response.data
}

export const getCarrosAlugados = async () => {
  const response = await api.get('/carros/alugados/')
  return response.data
}

export const getAlugueis = async (params = {}) => {
  const response = await api.get('/alugar/', { params })
  return response.data
}

export const getAluguel = async (id) => {
  const response = await api.get(`/alugar/${id}/`)
  return response.data
}

export const createAluguel = async (data) => {
  const response = await api.post('/alugar/', data)
  return response.data
}

export const updateAluguel = async (id, data) => {
  const response = await api.patch(`/alugar/${id}/`, data)
  return response.data
}

export const deleteAluguel = async (id) => {
  await api.delete(`/alugar/${id}/`)
}

export const getMeusAlugueis = async () => {
  const response = await api.get('/me/alugueis/')
  return response.data
}

export const getUsers = async () => {
  const response = await api.get('/users/')
  return response.data
}

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}/`)
  return response.data
}

export const createUser = async (data) => {
  const response = await api.post('/users/', data)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await api.patch(`/users/${id}/`, data)
  return response.data
}

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}/`)
}

export const getPerfis = async () => {
  const response = await api.get('/perfis-clientes/')
  return response.data
}

export const getPerfil = async (id) => {
  const response = await api.get(`/perfis-clientes/${id}/`)
  return response.data
}

export const createPerfil = async (data) => {
  const response = await api.post('/perfis-clientes/', data)
  return response.data
}

export const updatePerfil = async (id, data) => {
  const response = await api.patch(`/perfis-clientes/${id}/`, data)
  return response.data
}

export const deletePerfil = async (id) => {
  await api.delete(`/perfis-clientes/${id}/`)
}

export const getAlugueisDoPerfil = async (perfilId) => {
  const response = await api.get(`/perfis-clientes/${perfilId}/alugueis/`)
  return response.data
}

export default api
