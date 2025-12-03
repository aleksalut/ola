export default function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full bg-surfaceAlt rounded h-2">
      <div className="bg-primary h-2 rounded" style={{ width: pct + '%' }} />
    </div>
  )
}
