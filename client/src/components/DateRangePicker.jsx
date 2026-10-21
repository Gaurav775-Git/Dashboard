import { useState } from 'react'
import { formatRange, setRangeInUrl } from '../lib/dateRange'

const DateRangePicker = ({ range, onApply, onClose }) => {
  const [draft, setDraft] = useState(range)
  const apply = () => {
    if (draft.from > draft.to || draft.to > '2026-10-21') return
    setRangeInUrl(draft)
    onApply(draft)
    onClose()
  }
  return <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-rf-border bg-rf-surface p-4 shadow-2xl"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-rf-text">Date range</h2><button type="button" onClick={onClose} className="text-rf-muted">×</button></div><div className="grid gap-3"><label className="text-xs text-rf-muted">From<input type="date" value={draft.from} max="2026-10-21" onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} className="mt-1 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2 text-sm text-rf-text" /></label><label className="text-xs text-rf-muted">To<input type="date" value={draft.to} max="2026-10-21" onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} className="mt-1 w-full rounded-lg border border-rf-border bg-rf-bg px-3 py-2 text-sm text-rf-text" /></label></div><div className="mt-4 flex justify-between gap-2"><span className="text-xs text-rf-muted">{formatRange(draft)}</span><button type="button" onClick={apply} className="rounded-lg bg-rf-primary px-3 py-2 text-xs font-semibold text-rf-text">Apply</button></div></div>
}

export default DateRangePicker
