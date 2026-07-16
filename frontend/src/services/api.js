import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
  return response.data.token
}

export const getCarros = async () => {
  const response = await api.get('/carros/')
  return response.data
}

export const getCarrosDisponiveis = async () => {
  const response = await api.get('/carros/disponiveis/')
  return response.data
}

export const getCarrosAlugados = async () => {
  const response = await api.get('/carros/alugados/')
  return response.data
}

export default api
