export default function PriorityBadge({ priority }) {
  const map = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-red-100 text-red-700'
  }
  const cls = map[priority] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{priority}</span>
}
