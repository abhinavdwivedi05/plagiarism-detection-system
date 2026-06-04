import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CodeViewer from '../components/CodeViewer'
import LoadingSpinner from '../components/LoadingSpinner'
import RiskBadge from '../components/RiskBadge'
import { compareApi, submissionsApi } from '../services/api'

function ScoreBar({ label, value, weight, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 dark:text-slate-300">{label} ({weight})</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

export default function Compare() {
  const [searchParams] = useSearchParams()
  const [submissions, setSubmissions] = useState([])
  const [idA, setIdA] = useState(searchParams.get('a') || '')
  const [idB, setIdB] = useState(searchParams.get('b') || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    submissionsApi.list().then((res) => setSubmissions(res.data))
  }, [])

  const runCompare = async () => {
    if (!idA || !idB || idA === idB) {
      setError('Select two different submissions')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await compareApi.compare(idA, idB)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  const highlightsA = (result?.matching_sections || []).map((m) => ({
    start: m.start_a,
    end: m.end_a,
  }))
  const highlightsB = (result?.matching_sections || []).map((m) => ({
    start: m.start_b,
    end: m.end_b,
  }))

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-secondary dark:text-white">Submission Comparison</h2>
        <p className="text-slate-500">Compare two submissions for plagiarism indicators</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={idA}
            onChange={(e) => setIdA(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="">Submission A</option>
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.student_name} — {s.assignment_name}
              </option>
            ))}
          </select>
          <select
            value={idB}
            onChange={(e) => setIdB(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-slate-600"
          >
            <option value="">Submission B</option>
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.student_name} — {s.assignment_name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={runCompare}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? 'Analyzing...' : 'Run Comparison'}
        </button>
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
      </div>

      {loading && <LoadingSpinner className="py-12" />}

      {result && !loading && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="font-semibold text-lg">Plagiarism Report</h3>
              <RiskBadge level={result.risk_level} score={result.final_risk_score} />
            </div>
            <div className="space-y-4">
              <ScoreBar label="Text Similarity" value={result.text_similarity} weight="40%" color="bg-primary" />
              <ScoreBar label="AST Structural Similarity" value={result.ast_similarity} weight="50%" color="bg-success" />
              <ScoreBar label="Metadata Similarity" value={result.metadata_similarity} weight="10%" color="bg-warning" />
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-500">Tree Edit Distance</p>
                <p className="text-xl font-bold">{result.tree_edit_distance}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-500">Final Risk</p>
                <p className="text-xl font-bold text-danger">{result.final_risk_score}%</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg col-span-2">
                <p className="text-xs text-slate-500">Matching Blocks</p>
                <p className="text-xl font-bold">{result.matching_sections?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-xl overflow-hidden dark:border-slate-700">
              <CodeViewer
                title={`A: ${result.submission_a.student_name}`}
                code={result.submission_a.code}
                highlights={highlightsA}
              />
            </div>
            <div className="border rounded-xl overflow-hidden dark:border-slate-700">
              <CodeViewer
                title={`B: ${result.submission_b.student_name}`}
                code={result.submission_b.code}
                highlights={highlightsB}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
