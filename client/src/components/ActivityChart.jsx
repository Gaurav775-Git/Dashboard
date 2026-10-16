import React from 'react'
import { STATUSES } from '../api/mockData'
import LineChart from './LineChart'

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
      <div className="lg:col-span-2 rounded-xl border border-[#232A46] bg-[#111832] p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-[#FFFFFF]">Orders completed per week</h2>
          <span className="text-sm text-[#4F5A84]">Last 12 weeks</span>
        </div>
        <LineChart points={weekly.map((value, index) => ({ date: index + 1, value }))} label="Orders completed per week, trending up" />
      </div>

      {/* Status split */}
      <div className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
        <h2 className="font-semibold text-[#FFFFFF] mb-4">Orders by status</h2>
        <div className="flex h-3 rounded-full overflow-hidden bg-[#232A46] mb-5">
          {STATUSES.map((s) => {
            const n = orders.filter((o) => o.status === s).length
            return n ? <div key={s} style={{ width: `${(n / orders.length) * 100}%`, background: COLORS[s] }} /> : null
          })}
        </div>
        <ul className="space-y-4 text-base">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#FFFFFF]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[s] }} />
                {s}
              </span>
              <span className="text-[#4F5A84]">{orders.filter((o) => o.status === s).length}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ActivityChart