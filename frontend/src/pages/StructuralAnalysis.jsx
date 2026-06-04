import { useEffect, useState } from 'react'
import AstTreeView from '../components/AstTreeView'
import LoadingSpinner from '../components/LoadingSpinner'
import RiskBadge from '../components/RiskBadge'
import { compareApi, submissionsApi } from '../services/api'

export default function StructuralAnalysis() {
  const [submissions, setSubmissions] = useState([])
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    submissionsApi.list().then((res) => setSubmissions(res.data))
  }, [])

  const analyze = async () => {
    if (!idA || !idB) {
      setError('Select two submissions')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await compareApi.compare(idA, idB)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-secondary dark:text-white">Structural Analysis</h2>
        <p className="text-slate-500">
          AST visualization with Zhang-Shasha tree edit distance
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={idA}
            onChange={(e) => setIdA(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="">AST Tree A</option>
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>{s.student_name}</option>
            ))}
          </select>
          <select
            value={idB}
            onChange={(e) => setIdB(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="">AST Tree B</option>
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>{s.student_name}</option>
            ))}
          </select>
        </div>
        <button onClick={analyze} className="bg-primary text-white px-6 py-2 rounded-lg">
          Analyze Structure
        </button>
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
      </div>

      {loading && <LoadingSpinner className="py-12" />}

      {result && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 text-center">
              <p className="text-sm text-slate-500">Tree Edit Distance</p>
              <p className="text-3xl font-bold text-secondary dark:text-white mt-1">
                {result.tree_edit_distance}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 text-center">
              <p className="text-sm text-slate-500">Structural Similarity</p>
              <p className="text-3xl font-bold text-success mt-1">{result.ast_similarity}%</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 flex items-center justify-center">
              <RiskBadge level={result.risk_level} score={result.final_risk_score} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AstTreeView tree={result.ast_tree_a} title={`Tree A — ${result.submission_a.student_name}`} />
            <AstTreeView tree={result.ast_tree_b} title={`Tree B — ${result.submission_b.student_name}`} />
          </div>

          {result.node_differences?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Node Differences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
                {result.node_differences.map((d, i) => (
                  <div
                    key={i}
                    className={`text-xs font-mono px-3 py-2 rounded ${
                      d.side === 'a'
                        ? 'bg-danger/10 text-danger'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {d.side === 'a' ? 'Only in A' : 'Only in B'}: {d.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
