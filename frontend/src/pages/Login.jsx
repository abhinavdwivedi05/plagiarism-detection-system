import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiBarChart2, FiLock, FiMail } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-slate-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FiBarChart2 className="text-3xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white">
            Plagiarism Detection
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Faculty Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg border border-danger/20">
              {typeof error === 'string' ? error : 'Login failed'}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </p>
        <p className="text-xs text-center text-slate-400 mt-3">
          Demo: faculty@university.edu / faculty123
        </p>
      </div>
    </div>
  )
}
