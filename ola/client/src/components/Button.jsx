export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryDark',
    secondary: 'bg-surfaceAlt text-text border border-border hover:bg-surface',
    accent: 'bg-accent text-white hover:bg-primary',
    outline: 'border border-border text-text bg-transparent hover:bg-surfaceAlt'
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
  )
}
