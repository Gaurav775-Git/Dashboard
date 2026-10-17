
const Badge = ({ children, tone = 'blue', className = '' }) => {
  const tones = {
    blue: 'bg-rf-blue-light/15 text-rf-blue-light',
    green: 'bg-rf-success/15 text-rf-success',
    yellow: 'bg-rf-warning/15 text-rf-warning',
    red: 'bg-rf-danger/15 text-rf-danger',
    muted: 'bg-rf-surface-soft text-rf-muted',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>
}

export default Badge
