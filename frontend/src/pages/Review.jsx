import { useEffect, useState } from 'react'
import { FiCheck, FiAlertCircle, FiXCircle } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import RiskBadge from '../components/RiskBadge'
import { reviewApi, submissionsApi } from '../services/api'

const DECISIONS = [
  { id: 'genuine', label: 'Genuine', icon: FiCheck, color: 'bg-success text-white' },
  { id: 'suspicious', label: 'Suspicious', icon: FiAlertCircle, color: 'bg-warning text-white' },
  { id: 'confirmed_plagiarism', label: 'Confirmed Plagiarism', icon: FiXCircle, color: 'bg-danger text-white' },
]

export default function Review() {
  const [submissions, setSubmissions] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [submission, setSubmission] = useState(null)
  const [reviews, setReviews] = useState([])
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    submissionsApi.list().then((res) => setSubmissions(res.data))
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setSubmission(null)
      setReviews([])
      return
    }
    setLoading(true)
    Promise.all([
      submissionsApi.get(selectedId),
      reviewApi.list(selectedId),
    ])
      .then(([subRes, revRes]) => {
        setSubmission(subRes.data)
        setReviews(revRes.data)
      })
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [selectedId])

  const submitReview = async (decision) => {
    setError(null)
    setSuccess(null)
    try {
      await reviewApi.create({
        submission_id: selectedId,
        decision,
        comments,
      })
      setSuccess('Review saved successfully')
      setComments('')
      const { data } = await reviewApi.list(selectedId)
      setReviews(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save review')
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-secondary dark:text-white">Faculty Review</h2>
        <p className="text-slate-500">Record decisions on flagged submissions</p>
      </div>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full max-w-md border rounded-lg px-3 py-2 dark:bg-slate-800 dark:border-slate-600"
      >
        <option value="">Select submission to review</option>
        {submissions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.student_name} — {s.assignment_name} ({s.risk_level})
          </option>
        ))}
      </select>

      {error && <div className="text-danger text-sm bg-danger/10 p-3 rounded-lg">{error}</div>}
      {success && <div className="text-success text-sm bg-success/10 p-3 rounded-lg">{success}</div>}

      {loading && <LoadingSpinner className="py-12" />}

      {submission && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500">Student</p>
                <p className="font-semibold">{submission.student_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Roll Number</p>
                <p className="font-semibold">{submission.roll_number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Assignment</p>
                <p className="font-semibold">{submission.assignment_name}</p>
              </div>
              <RiskBadge level={submission.risk_level} score={submission.final_risk_score} />
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-auto max-h-64">
              {submission.code}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-4">Decision</h3>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add review comments..."
                rows={4}
                className="w-full border rounded-lg px-3 py-2 text-sm mb-4 dark:bg-slate-900 dark:border-slate-600"
              />
              <div className="space-y-2">
                {DECISIONS.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => submitReview(id)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg ${color} hover:opacity-90`}
                  >
                    <Icon /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold mb-3">Review History</h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400">No reviews yet</p>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((r) => (
                    <li key={r.id} className="text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                      <span className="font-medium capitalize">{r.decision.replace(/_/g, ' ')}</span>
                      {r.comments && <p className="text-slate-500 mt-1">{r.comments}</p>}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(r.reviewed_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
