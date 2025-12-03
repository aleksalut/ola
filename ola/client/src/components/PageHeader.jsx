export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-text">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
