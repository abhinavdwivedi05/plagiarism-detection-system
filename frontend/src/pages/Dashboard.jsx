import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FiAlertTriangle, FiFileText, FiPercent, FiTrendingUp } from 'react-icons/fi'
import LoadingSpinner from '../components/LoadingSpinner'
import RiskBadge from '../components/RiskBadge'
import StatCard from '../components/StatCard'
import { analyticsApi } from '../services/api'

const RISK_COLORS = { 'Low Risk': '#10B981', 'Medium Risk': '#F59E0B', 'High Risk': '#EF4444' }

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    analyticsApi
      .get()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner className="py-20" />
  if (error) {
    return (
      <div className="text-danger bg-danger/10 p-4 rounded-lg">{error}</div>
    )
  }

  const riskData = Object.entries(data.risk_distribution || {}).map(([name, value]) => ({
    name,
    value,
  }))

  const langData = Object.entries(data.language_distribution || {}).map(([name, value]) => ({
    name,
    count: value,
  }))

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-secondary dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400">Plagiarism detection overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={data.total_submissions}
          icon={FiFileText}
          color="primary"
        />
        <StatCard
          title="Flagged Cases"
          value={data.total_flagged}
          icon={FiAlertTriangle}
          color="warning"
        />
        <StatCard
          title="Average Similarity"
          value={`${data.average_similarity}%`}
          icon={FiPercent}
          color="primary"
        />
        <StatCard
          title="High Risk Cases"
          value={data.high_risk_cases}
          icon={FiTrendingUp}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4 text-secondary dark:text-white">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4 text-secondary dark:text-white">Submissions by Language</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={langData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data.monthly_trend?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold mb-4 text-secondary dark:text-white">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.monthly_trend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1E293B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-secondary dark:text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Student</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Assignment</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Risk</th>
                <th className="text-left px-6 py-3 font-medium text-slate-500">Score</th>
              </tr>
            </thead>
            <tbody>
              {(data.recent_activity || []).map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-6 py-3">{item.student_name}</td>
                  <td className="px-6 py-3">{item.assignment_name}</td>
                  <td className="px-6 py-3">
                    <RiskBadge level={item.risk_level} />
                  </td>
                  <td className="px-6 py-3">{item.final_risk_score}%</td>
                </tr>
              ))}
              {!data.recent_activity?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No submissions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
