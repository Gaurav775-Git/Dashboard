import React from 'react'

const StatCards = ({ orders }) => {
  const count = (...s) => orders.filter((o) => s.includes(o.status)).length
  const spend = orders.reduce((sum, o) => sum + o.amount, 0)

  const stats = [
    { label: 'Active orders', value: count('Pending', 'In progress'), hint: 'Pending or being worked on' },
    { label: 'Completed', value: count('Completed'), hint: 'Delivered to you' },
    { label: 'Needs your input', value: count('Needs info'), hint: 'We’re waiting on details', alert: count('Needs info') > 0 },
    { label: 'Total spend', value: `$${spend.toLocaleString()}`, hint: 'Across all orders' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border bg-[#1A2233] p-5 ${s.alert ? 'border-[#F0788C]/60' : 'border-[#263149]'}`}
        >
          <p className="text-sm text-[#8C95A6]">{s.label}</p>
          <p className="mt-2 text-3xl font-semibold text-[#F2F4F7]">{s.value}</p>
          <p className="mt-1 text-xs text-[#8C95A6]">{s.hint}</p>
        </div>
      ))}
    </div>
  )
}

export default StatCards