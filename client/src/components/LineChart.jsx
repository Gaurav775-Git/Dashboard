
const LineChart = ({ points = [], label = 'Metric trend', inverse = false }) => {
  const W = 600
  const H = 180
  const P = 12
  const values = points.map((point) => Number(point.value) || 0)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const coords = points.map((point, index) => [
    P + (index * (W - P * 2)) / Math.max(points.length - 1, 1),
    H - P - ((Number(point.value) - min) / range) * (H - P * 2),
  ])
  const line = coords.map((point) => point.join(',')).join(' ')
  const area = `${P},${H - P} ${line} ${W - P},${H - P}`

  if (!points.length) {
    return <div className="flex h-48 items-center justify-center text-sm text-rf-muted">Tracking data will appear here.</div>
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-48 w-full" role="img" aria-label={label}>
      <polygon points={area} fill="var(--color-rf-blue)" opacity="0.12" />
      <polyline points={line} fill="none" stroke="var(--color-rf-blue)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={index === coords.length - 1 ? 5 : 3} fill="var(--color-rf-blue)" />
      ))}
      {inverse && <title>Lower values indicate better performance</title>}
    </svg>
  )
}

export default LineChart
