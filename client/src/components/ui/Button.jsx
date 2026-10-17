
const Button = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => {
  const styles = variant === 'secondary'
    ? 'border border-rf-border bg-rf-surface-soft text-rf-text hover:bg-rf-surface'
    : variant === 'ghost'
      ? 'text-rf-blue-light hover:bg-rf-surface-soft hover:text-rf-text'
      : 'bg-rf-primary text-rf-text hover:bg-rf-primary-hover'

  return <button type={type} className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold ${styles} ${className}`} {...props}>{children}</button>
}

export default Button
