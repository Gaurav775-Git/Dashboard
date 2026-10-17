import Card from './Card'

const StatCard = ({ label, value, hint, icon, tone = 'blue' }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-muted">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-rf-text">{value}</p>
        <p className="mt-2 text-xs text-rf-muted">{hint}</p>
      </div>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
        tone === 'green' ? 'bg-rf-success/15 text-rf-success' : tone === 'yellow' ? 'bg-rf-warning/15 text-rf-warning' : tone === 'red' ? 'bg-rf-danger/15 text-rf-danger' : 'bg-rf-blue-light/15 text-rf-blue-light'
      }`} aria-hidden="true">{icon}</span>
    </div>
  </Card>
)

export default StatCard
