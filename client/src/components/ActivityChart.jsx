import React from 'react'
import { STATUSES } from '../api/mockData'

const COLORS = {
  Pending: '#E0B15A',
  'In progress': '#6AA8FF',
  Completed: '#4FC9A0',
  'Needs info': '#F0788C',
}

const ActivityChart = ({ orders, weekly }) => {
  const W = 600, H = 170, P = 8
  const max = Math.max(...weekly)
  const pts = weekly.map((v, i) => [
    P + (i * (W - P * 2)) / (weekly.length - 1),
    H - P - (v / max) * (H - P * 2),
  ])
  const line = pts.map((p) => p.join(',')).join(' ')
  const area = `${P},${H - P} ${line} ${W - P},${H - P}`

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Trend */}
      <div className="lg:col-span-2 rounded-xl border border-[#263149] bg-[#1A2233] p-5">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-[#F2F4F7]">Orders completed per week</h2>
          <span className="text-xs text-[#8C95A6]">Last 12 weeks</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" role="img" aria-label="Orders completed per week, trending up">
          <polygon points={area} fill="#6AA8FF" opacity="0.12" />
          <polyline points={line} fill="none" stroke="#6AA8FF" strokeWidth="2.5" strokeLinejoin="round" />
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4.5 : 2.5} fill="#6AA8FF" />
          ))}
        </svg>
      </div>

      {/* Status split */}
      <div className="rounded-xl border border-[#263149] bg-[#1A2233] p-5">
        <h2 className="font-semibold text-[#F2F4F7] mb-4">Orders by status</h2>
        <div className="flex h-3 rounded-full overflow-hidden bg-[#263149] mb-5">
          {STATUSES.map((s) => {
            const n = orders.filter((o) => o.status === s).length
            return n ? <div key={s} style={{ width: `${(n / orders.length) * 100}%`, background: COLORS[s] }} /> : null
          })}
        </div>
        <ul className="space-y-3 text-sm">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#F2F4F7]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[s] }} />
                {s}
              </span>
              <span className="text-[#8C95A6]">{orders.filter((o) => o.status === s).length}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ActivityChart