export default function CodeViewer({ code, highlights = [], title, className = '' }) {
  const lines = (code || '').split('\n')
  const highlightSet = new Set()
  highlights.forEach((h) => {
    for (let i = h.start_a ?? h.start; i < (h.end_a ?? h.end); i++) {
      highlightSet.add(i)
    }
  })

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {title && (
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 text-sm font-medium">
          {title}
        </div>
      )}
      <pre className="flex-1 overflow-auto p-4 text-xs font-mono bg-slate-900 text-slate-100 m-0">
        {lines.map((line, i) => (
          <div
            key={i}
            className={highlightSet.has(i) ? 'bg-warning/30 -mx-4 px-4' : ''}
          >
            <span className="inline-block w-8 text-slate-500 select-none">{i + 1}</span>
            {line || ' '}
          </div>
        ))}
      </pre>
    </div>
  )
}
