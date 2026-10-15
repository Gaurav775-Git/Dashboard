import React, { useMemo, useState } from 'react'
import { STATUSES } from '../api/mockData'

const BADGE = {
  Pending: 'bg-[#E0B15A]/15 text-[#E0B15A]',
  'In progress': 'bg-[#6AA8FF]/15 text-[#6AA8FF]',
  Completed: 'bg-[#4FC9A0]/15 text-[#4FC9A0]',
  'Needs info': 'bg-[#F0788C]/15 text-[#F0788C]',
}
const BAR = {
  Pending: '#E0B15A', 'In progress': '#6AA8FF', Completed: '#4FC9A0', 'Needs info': '#F0788C',
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
    <div className="rounded-xl border border-[#263149] bg-[#1A2233]">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <h2 className="font-semibold text-[#F2F4F7] mr-auto">{limit ? 'Recent orders' : 'All orders'}</h2>
        {!limit && (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order, service or URL"
              className="w-full sm:w-64 rounded-lg bg-[#131A26] border border-[#263149] px-3 py-2 text-sm text-[#F2F4F7] placeholder-[#8C95A6] focus:outline-none focus:border-[#6AA8FF]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg bg-[#131A26] border border-[#263149] px-3 py-2 text-sm text-[#F2F4F7] focus:outline-none focus:border-[#6AA8FF]"
            >
              {['All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => exportCsv(rows)}
              className="rounded-lg border border-[#263149] px-3 py-2 text-sm text-[#F2F4F7] hover:bg-[#263149] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6AA8FF]"
            >
              Export CSV
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[#8C95A6] border-y border-[#263149]">
              {['Order', 'Service', 'Target', 'Date', 'Status', 'Progress', 'Amount'].map((h) => (
                <th key={h} className="px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-[#263149] last:border-0 text-[#F2F4F7]">
                <td className="px-5 py-3 text-[#8C95A6]">{o.id}</td>
                <td className="px-5 py-3 max-w-[220px] truncate" title={o.service}>{o.service}</td>
                <td className="px-5 py-3 max-w-[180px] truncate text-[#8C95A6]" title={o.target}>{o.target}</td>
                <td className="px-5 py-3 text-[#8C95A6] whitespace-nowrap">{o.date}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${BADGE[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-5 py-3 w-36">
                  <div className="h-1.5 rounded-full bg-[#263149]">
                    <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: BAR[o.status] }} />
                  </div>
                </td>
                <td className="px-5 py-3 text-right">${o.amount}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#8C95A6]">
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