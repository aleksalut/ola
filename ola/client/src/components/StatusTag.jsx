export default function StatusTag({ status }) {
  const map = {
    NotStarted: 'bg-gray-100 text-gray-700',
    InProgress: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Archived: 'bg-gray-200 text-gray-700'
  }
  const cls = map[status] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{status}</span>
}
