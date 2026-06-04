import { useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const children = node.children || []
  const hasChildren = children.length > 0

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-1 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded cursor-pointer"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? <FiChevronDown className="text-slate-400 shrink-0" /> : <FiChevronRight className="text-slate-400 shrink-0" />
        ) : (
          <span className="w-4" />
        )}
        <span className="text-xs font-mono text-primary">{node.type}</span>
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{node.label}</span>
      </div>
      {expanded &&
        children.map((child, i) => (
          <TreeNode key={`${child.label}-${i}`} node={child} depth={depth + 1} />
        ))}
    </div>
  )
}

export default function AstTreeView({ tree, title }) {
  if (!tree) {
    return (
      <div className="p-4 text-sm text-slate-500 border rounded-lg dark:border-slate-700">
        {title}: Unable to parse AST (syntax error or non-Python code)
      </div>
    )
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 font-medium text-sm">
        {title}
      </div>
      <div className="p-3 max-h-96 overflow-auto bg-white dark:bg-slate-900">
        <TreeNode node={tree} />
      </div>
    </div>
  )
}
