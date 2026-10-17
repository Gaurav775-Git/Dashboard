import { useMemo, useState } from 'react'
import { STATUSES } from '../api/mockData'
import Card from './ui/Card'
import Pill from './ui/Pill'
import EmptyState from './ui/EmptyState'

const BAR = { Pending: '#E0B15A', 'In progress': '#54ABF8', Completed: '#4FC9A0', 'Needs info': '#F0788C' }
const exportCsv = (rows) => {
  const head = ['Order', 'Service', 'Target', 'Date', 'Status', 'Progress %', 'Amount (USD)']
  const esc = (value) => `"${String(value).replace(/"/g, '""')}"`
  const body = rows.map((order) => [order.id, order.service, order.target, order.date, order.status, order.progress, order.amount].map(esc).join(','))
  const blob = new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv' })
  const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = 'orders.csv'; anchor.click(); URL.revokeObjectURL(anchor.href)
}

const OrdersTable = ({ orders, limit, onSelect, compact = false }) => {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const rows = useMemo(() => {
    if (limit) return orders.slice(0, limit)
    const q = query.toLowerCase()
    return orders.filter((order) => (status === 'All' || order.status === status) && [order.id, order.service, order.target].some((value) => value.toLowerCase().includes(q)))
  }, [orders, query, status, limit])
  if (compact) return <div>{rows.map((order) => <button type="button" key={order.id} onClick={() => onSelect?.(order)} className="flex w-full items-center gap-3 border-b border-rf-border px-5 py-4 text-left last:border-0 hover:bg-rf-surface-soft"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-rf-text">{order.service}</span><span className="mt-1 block text-xs text-rf-muted">{order.id} · {order.target}</span></span><Pill status={order.status} /></button>)}{!rows.length && <EmptyState title="No orders yet" description="Your latest orders will show up here." icon="＋" />}</div>
  return <Card className="overflow-hidden">
    <div className="flex flex-wrap items-center gap-3 p-5"><div className="mr-auto"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-rf-blue-light">Order workspace</p><h2 className="mt-2 text-xl font-semibold text-rf-text">All orders</h2></div><input aria-label="Search orders" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className="w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text placeholder:text-rf-muted focus:border-rf-primary focus:outline-none sm:w-56" /><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-rf-border bg-rf-bg px-3 py-2.5 text-sm text-rf-text focus:border-rf-primary focus:outline-none">{['All', ...STATUSES].map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={() => exportCsv(rows)} className="rounded-lg border border-rf-border px-3 py-2.5 text-sm font-semibold text-rf-text hover:bg-rf-surface-soft">Export CSV</button></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-y border-rf-border text-left text-xs uppercase tracking-[0.08em] text-rf-muted">{['Order', 'Service', 'Target', 'Date', 'Status', 'Progress', 'Amount'].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody>{rows.map((order) => <tr key={order.id} onClick={() => onSelect?.(order)} onKeyDown={(event) => event.key === 'Enter' && onSelect?.(order)} tabIndex={onSelect ? 0 : undefined} className={`border-b border-rf-border last:border-0 ${onSelect ? 'cursor-pointer hover:bg-rf-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-rf-primary' : ''}`}><td className="px-5 py-4 text-rf-muted">{order.id}</td><td className="max-w-[220px] truncate px-5 py-4 text-rf-text">{order.service}</td><td className="max-w-[180px] truncate px-5 py-4 text-rf-muted">{order.target}</td><td className="whitespace-nowrap px-5 py-4 text-rf-muted">{order.date}</td><td className="px-5 py-4"><Pill status={order.status} /></td><td className="w-36 px-5 py-4"><div className="h-1.5 rounded-full bg-rf-border"><div className="h-full rounded-full" style={{ width: `${order.progress}%`, background: BAR[order.status] }} /></div></td><td className="px-5 py-4 text-right text-rf-text">${order.amount}</td></tr>)}{!rows.length && <tr><td colSpan={7}><EmptyState title="No matching orders" description="Clear the search or choose another status." /></td></tr>}</tbody></table></div>
  </Card>
}

export default OrdersTable
