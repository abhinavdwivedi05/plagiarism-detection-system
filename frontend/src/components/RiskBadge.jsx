export default function RiskBadge({ level, score }) {
  const styles = {
    'Low Risk': 'bg-success/10 text-success border-success/30',
    'Medium Risk': 'bg-warning/10 text-warning border-warning/30',
    'High Risk': 'bg-danger/10 text-danger border-danger/30',
  }
  const style = styles[level] || styles['Low Risk']

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {level}
      {score !== undefined && <span className="opacity-75">({score}%)</span>}
    </span>
  )
}
