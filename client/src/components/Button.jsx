export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100'
  }[variant];
  return <button className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${styles} ${className}`} {...props}>{children}</button>;
}
