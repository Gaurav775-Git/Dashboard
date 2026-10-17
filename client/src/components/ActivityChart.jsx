import { STATUSES } from '../api/mockData'
import LineChart from './LineChart'
import Card from './ui/Card'

const COLORS = {
  Pending: '#E0B15A',
  'In progress': '#54ABF8',
  Completed: '#4FC9A0',
  'Needs info': '#F0788C',
}

const ActivityChart = ({ orders, weekly }) => {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Trend */}
      <Card className="p-6 lg:col-span-2">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-rf-text">Orders completed per week</h2>
          <span className="text-sm text-rf-muted">Last 12 weeks</span>
        </div>
        <LineChart points={weekly.map((value, index) => ({ date: index + 1, value }))} label="Orders completed per week, trending up" />
      </Card>

      {/* Status split */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-rf-text">Orders by status</h2>
        <div className="mb-5 flex h-3 overflow-hidden rounded-full bg-rf-border">
          {STATUSES.map((s) => {
            const n = orders.filter((o) => o.status === s).length
            return n ? <div key={s} style={{ width: `${(n / orders.length) * 100}%`, background: COLORS[s] }} /> : null
          })}
        </div>
        <ul className="space-y-4 text-sm">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-rf-text">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[s] }} />
                {s}
              </span>
              <span className="text-rf-muted">{orders.filter((o) => o.status === s).length}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default ActivityChart