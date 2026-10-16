import React, { useMemo, useState } from 'react'
import { STATUSES } from '../api/mockData'

const BADGE = {
  Pending: 'bg-[#E0B15A]/15 text-[#E0B15A]',
  'In progress': 'bg-[#54ABF8]/15 text-[#54ABF8]',
  Completed: 'bg-[#4FC9A0]/15 text-[#4FC9A0]',
  'Needs info': 'bg-[#F0788C]/15 text-[#F0788C]',
}
const BAR = {
  Pending: '#E0B15A', 'In progress': '#54ABF8', Completed: '#4FC9A0', 'Needs info': '#F0788C',
}

const exportCsv = (rows) => {
  const head = ['Order', 'Service', 'Target', 'Date', 'Status', 'Progress %', 'Amount (USD)']
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  const body = rows.map((o) => [o.id, o.service, o.target, o.date, o.status, o.progress, o.amount].map(esc).join(','))
  const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'orders.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

// `limit` shows a compact "recent orders" version without filters
const OrdersTable = ({ orders, limit }) => {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')

  const rows = useMemo(() => {
    if (limit) return orders.slice(0, limit)
    const q = query.toLowerCase()
    return orders.filter(
      (o) =>
        (status === 'All' || o.status === status) &&
        [o.id, o.service, o.target].some((v) => v.toLowerCase().includes(q))
    )
  }, [orders, query, status, limit])

  return (
    <div className="rounded-xl border border-[#232A46] bg-[#111832]">
      <div className="flex flex-wrap items-center gap-4 p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mr-auto">{limit ? 'Recent orders' : 'All orders'}</h2>
        {!limit && (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order, service or URL"
              className="w-full sm:w-72 rounded-lg bg-[#10162B] border border-[#232A46] px-3 py-2.5 text-base text-[#FFFFFF] placeholder-[#4F5A84] focus:outline-none focus:border-[#0059F7]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg bg-[#10162B] border border-[#232A46] px-3 py-2.5 text-base text-[#FFFFFF] focus:outline-none focus:border-[#0059F7]"
            >
              {['All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => exportCsv(rows)}
              className="rounded-lg border border-[#232A46] px-3 py-2.5 text-base text-[#FFFFFF] hover:bg-[#232A46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0059F7]"
            >
              Export CSV
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-base min-w-[720px]">
          <thead>
            <tr className="text-left text-[#4F5A84] border-y border-[#232A46]">
              {['Order', 'Service', 'Target', 'Date', 'Status', 'Progress', 'Amount'].map((h) => (
                <th key={h} className="px-5 py-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-[#232A46] last:border-0 text-[#FFFFFF]">
                <td className="px-5 py-4 text-[#4F5A84]">{o.id}</td>
                <td className="px-5 py-4 max-w-[220px] truncate" title={o.service}>{o.service}</td>
                <td className="px-5 py-4 max-w-[180px] truncate text-[#4F5A84]" title={o.target}>{o.target}</td>
                <td className="px-5 py-4 text-[#4F5A84] whitespace-nowrap">{o.date}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-sm font-medium whitespace-nowrap ${BADGE[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-5 py-4 w-36">
                  <div className="h-1.5 rounded-full bg-[#232A46]">
                    <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: BAR[o.status] }} />
                  </div>
                </td>
                <td className="px-5 py-4 text-right">${o.amount}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#4F5A84]">
                  No orders match. Clear the search or pick another status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable