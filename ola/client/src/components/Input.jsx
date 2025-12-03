export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="label">{label}</label>}
      <input className="input" {...props} />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}
