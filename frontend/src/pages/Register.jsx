import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiBarChart2, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [validationError, setValidationError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validate = () => {
    if (form.full_name.trim().length < 2) {
      return 'Full name must be at least 2 characters'
    }
    if (!form.email.includes('@')) {
      return 'Please enter a valid email address'
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    if (form.password !== form.confirm_password) {
      return 'Passwords do not match'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError(null)
    setSuccess(null)

    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }

    const ok = await register(form)
    if (ok) {
      setSuccess('Account created! Redirecting to dashboard...')
      setTimeout(() => navigate('/'), 1000)
    }
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-slate-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FiBarChart2 className="text-3xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Faculty Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg border border-danger/20">
              {typeof displayError === 'string' ? displayError : 'Registration failed'}
            </div>
          )}
          {success && (
            <div className="bg-success/10 text-success text-sm px-4 py-2 rounded-lg border border-success/20">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
