import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'

const records = [
  ['https://acme.com/new-collection', 'Indexed', 'Oct 18, 2026'],
  ['https://acme.com/guides/seo', 'Crawled', 'Oct 18, 2026'],
  ['https://acme.com/pricing', 'Crawled Not Indexed', 'Oct 17, 2026'],
  ['https://acme.com/about', 'Submitted', 'Oct 16, 2026'],
]
const statusStyles = { Indexed: 'bg-rf-success/15 text-rf-success', Crawled: 'bg-rf-primary/15 text-rf-blue-light', Submitted: 'bg-rf-blue-light/15 text-rf-blue-light', 'Crawled Not Indexed': 'bg-rf-warning/15 text-rf-warning' }

const BingIndexingTracking = () => {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => records.filter(([url, status]) => (filter === 'All' || status === filter) && url.toLowerCase().includes(query.toLowerCase())), [filter, query])
  const exportCsv = () => {
    const csv = ['URL,Status,Last checked', ...filtered.map((row) => row.join(','))].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'bing-indexing-report.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return <div className="min-h-screen bg-rf-bg"><Navbar activeTab="Orders" onNavigate={(tab) => { if (tab === 'Overview') window.location.assign('/'); if (tab === 'Orders') window.location.assign('/projects') }} /><main className="mx-auto w-full max-w-7xl px-5 py-10 md:ml-64 md:px-10 md:py-12"><header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-rf-muted">Projects / Bing indexing</p><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold text-rf-text md:text-4xl">Acme Bing indexing campaign</h1><span className="rounded-full bg-rf-primary/15 px-3 py-1 text-xs font-semibold text-rf-blue-light">In progress</span></div><p className="mt-2 text-base text-rf-muted">Monitoring submissions, crawl activity, and IndexNow health.</p></div><Button variant="secondary" onClick={exportCsv}>Export report</Button></header><Card className="mb-6 p-6"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-rf-muted">Bing index coverage <span className="text-rf-blue-light">· Connected</span></p><p className="mt-2 text-5xl font-bold text-rf-text">25<span className="text-2xl text-rf-muted">%</span></p><p className="mt-2 text-sm text-rf-success">↗ +8.4% since last check</p></div><div className="min-w-[260px] flex-1"><div className="flex h-32 items-end gap-2 rounded-lg bg-rf-surface-soft p-4">{[30, 42, 38, 54, 48, 62, 56, 72].map((height, index) => <div key={index} className="flex-1 rounded-t bg-rf-primary/70" style={{ height: `${height}%` }} />)}</div><div className="mt-2 flex justify-between text-xs text-rf-muted"><span>Oct 1</span><span>Oct 19, 2026</span></div></div></div></Card><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Indexed', '1'], ['Submitted', '1'], ['Crawled', '1'], ['Pending', '1']].map(([label, value]) => <Card key={label} className="p-5"><p className="text-sm text-rf-muted">{label}</p><p className="mt-3 text-3xl font-bold text-rf-text">{value}</p><p className="mt-2 text-xs text-rf-muted">Connected</p></Card>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"><Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-rf-border p-5"><div><h2 className="text-lg font-semibold text-rf-text">URL status</h2><p className="mt-1 text-sm text-rf-muted">Last checked Oct 18, 2026</p></div><div className="flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search URLs" placeholder="Search URLs" className="w-44 rounded-lg border border-rf-border bg-rf-bg px-3 py-2 text-sm" /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter URL status" className="rounded-lg border border-rf-border bg-rf-bg px-3 py-2 text-sm"><option>All</option>{records.map(([, status]) => <option key={status}>{status}</option>)}</select></div></div><div className="divide-y divide-rf-border">{filtered.map(([url, status, date]) => <div key={url} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="break-all text-sm text-rf-text">{url}</p><p className="mt-1 text-xs text-rf-muted">{date}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span></div>)}{filtered.length === 0 && <p className="p-6 text-sm text-rf-muted">No URLs match this filter.</p>}</div></Card><div className="space-y-6"><Card className="p-6"><h2 className="text-lg font-semibold text-rf-text">Submission health</h2><p className="mt-4 text-3xl font-bold text-rf-text">Healthy</p><p className="mt-2 text-sm text-rf-success">IndexNow key file verified</p><p className="mt-4 text-sm text-rf-muted">1 of 4 URLs indexed. Bing controls final indexing decisions.</p></Card><Card className="p-6"><h2 className="text-lg font-semibold text-rf-text">Next actions</h2><p className="mt-3 text-sm text-rf-muted">Review the “Crawled Not Indexed” URL before the next scan.</p><button type="button" className="mt-4 text-sm font-semibold text-rf-blue-light">View remediation →</button></Card><Card className="p-6"><h2 className="text-lg font-semibold text-rf-text">Assigned specialist</h2><p className="mt-3 font-semibold text-rf-text">Priya Sharma</p><p className="text-sm text-rf-success">● Online</p></Card></div></div></main></div>
}

export default BingIndexingTracking
