import { useCallback, useEffect, useState } from 'react'
import { FiPlus, FiSearch, FiTrash2, FiUpload } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import RiskBadge from '../components/RiskBadge'
import { submissionsApi } from '../services/api'

const SAMPLE_CODE = `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(5):
    print(factorial(i))
`

export default function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    student_name: '',
    roll_number: '',
    assignment_name: '',
    language: 'python',
    code: SAMPLE_CODE,
  })

  const load = useCallback(() => {
    setLoading(true)
    submissionsApi
      .list(search || undefined)
      .then((res) => setSubmissions(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await submissionsApi.create(form)
      setShowForm(false)
      setForm({
        student_name: '',
        roll_number: '',
        assignment_name: '',
        language: 'python',
        code: SAMPLE_CODE,
      })
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create submission')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission?')) return
    try {
      await submissionsApi.delete(id)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Delete failed')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, code: ev.target?.result || '' }))
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary dark:text-white">Submissions</h2>
          <p className="text-slate-500">Manage student programming assignments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <FiPlus /> New Submission
        </button>
      </div>

      {error && (
        <div className="text-danger bg-danger/10 p-3 rounded-lg text-sm">{String(error)}</div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Student Name"
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
              required
            />
            <input
              placeholder="Roll Number"
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
              required
            />
            <input
              placeholder="Assignment Name"
              value={form.assignment_name}
              onChange={(e) => setForm({ ...form, assignment_name: e.target.value })}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
              required
            />
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
            >
              <option value="python">Python</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-primary cursor-pointer mb-2">
              <FiUpload /> Upload code file
              <input type="file" accept=".py,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
            <textarea
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              rows={10}
              className="w-full font-mono text-sm border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">
            Submit
          </button>
        </form>
      )}

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by name, roll number, or assignment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
        />
      </div>

      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="text-left px-4 py-3">Student</th>
                  <th className="text-left px-4 py-3">Roll No</th>
                  <th className="text-left px-4 py-3">Assignment</th>
                  <th className="text-left px-4 py-3">Language</th>
                  <th className="text-left px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="px-4 py-3">{s.student_name}</td>
                    <td className="px-4 py-3">{s.roll_number}</td>
                    <td className="px-4 py-3">{s.assignment_name}</td>
                    <td className="px-4 py-3 capitalize">{s.language}</td>
                    <td className="px-4 py-3">
                      <RiskBadge level={s.risk_level} score={s.final_risk_score} />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link
                        to={`/compare?a=${s.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Compare
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-danger hover:text-danger/80"
                        aria-label="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {!submissions.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      No submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
