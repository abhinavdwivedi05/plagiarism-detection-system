import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

function persistSession(data) {
  localStorage.setItem('token', data.access_token)
  const userData = {
    email: data.email,
    full_name: data.full_name,
    role: data.role,
  }
  localStorage.setItem('user', JSON.stringify(userData))
  return userData
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!localStorage.getItem('token') && !!user

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.login(email, password)
      setUser(persistSession(data))
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ full_name, email, password, confirm_password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authApi.register({
        full_name,
        email,
        password,
        confirm_password,
      })
      setUser(persistSession(data))
      return true
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(', '))
      } else {
        setError(detail || 'Registration failed')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout, loading, error }),
    [user, isAuthenticated, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
