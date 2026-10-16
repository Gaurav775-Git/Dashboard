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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border bg-[#111832] p-6 ${s.alert ? 'border-[#F0788C]/60' : 'border-[#232A46]'}`}
        >
          <p className="text-base text-[#4F5A84]">{s.label}</p>
          <p className="mt-3 text-4xl font-semibold text-[#FFFFFF]">{s.value}</p>
          <p className="mt-2 text-sm text-[#4F5A84]">{s.hint}</p>
        </div>
      ))}
    </div>
  )
}

export default StatCards