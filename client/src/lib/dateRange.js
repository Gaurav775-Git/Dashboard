export const DEFAULT_RANGE = { from: '2026-10-01', to: '2026-10-19' }

export const readRange = () => {
  const params = new URLSearchParams(window.location.search)
  const from = params.get('from') || DEFAULT_RANGE.from
  const to = params.get('to') || DEFAULT_RANGE.to
  return from <= to ? { from, to } : DEFAULT_RANGE
}

export const formatRange = ({ from, to }) => {
  const format = (value) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
  const start = format(from)
  const end = format(to)
  return start.endsWith(end.slice(-4)) ? `${start.replace(/, \d{4}$/, '')} – ${end}` : `${start} – ${end}`
}

export const setRangeInUrl = (range) => {
  const url = new URL(window.location.href)
  url.searchParams.set('from', range.from)
  url.searchParams.set('to', range.to)
  window.history.replaceState({}, '', url)
}
