import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
}

export const submissionsApi = {
  list: (search) => api.get('/submissions', { params: search ? { search } : {} }),
  get: (id) => api.get(`/submissions/${id}`),
  create: (data) => api.post('/submissions', data),
  delete: (id) => api.delete(`/submissions/${id}`),
}

export const compareApi = {
  compare: (submissionIdA, submissionIdB) =>
    api.post('/compare', {
      submission_id_a: submissionIdA,
      submission_id_b: submissionIdB,
    }),
}

export const analyticsApi = {
  get: () => api.get('/analytics'),
}

export const reviewApi = {
  create: (data) => api.post('/review', data),
  list: (submissionId) => api.get(`/review/${submissionId}`),
}

export default api
