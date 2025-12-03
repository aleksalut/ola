export default function EmptyState({ title = 'Nothing here yet', message = 'Add your first item to get started.' }) {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
