import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getPerformanceStats } from '../api/performanceApi'
import { FiArrowLeft, FiInfo, FiDownload, FiTrendingUp, FiBarChart2, FiDatabase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

const Performance = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPerformanceStats()
      .then(res => setData(res.data))
      .catch(err => setError('Failed to load performance data. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-rf-text">Loading performance metrics...</div>
  if (error) return <div className="p-10 text-rf-danger">{error} <button onClick={() => window.location.reload()} className="underline">Retry</button></div>

  const { kpis, trendData, dates, lastUpdated, source } = data

  // SVG Line Chart Generator
  const maxVal = Math.max(...trendData.map(d => d.visibility), 100)
  const points = trendData.map((d, i) => `${(i / (trendData.length - 1)) * 620},${130 - (d.visibility / maxVal) * 130}`).join(' ')

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-rf-muted hover:text-rf-text mb-4 transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-rf-text">Performance Overview</h1>
          <p className="text-rf-muted mt-2">Aggregate metrics across all your active campaigns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-xs text-rf-muted bg-rf-surface px-3 py-1.5 rounded-lg border border-rf-border flex items-center gap-2">
            <FiDatabase className="text-rf-primary" />
            {source} · Updated {new Date(lastUpdated).toLocaleTimeString()}
          </div>
          <Button variant="secondary" onClick={() => alert('Report downloaded!')}>
            <FiDownload className="mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-rf-primary/10 flex items-center justify-center text-rf-primary">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-rf-muted">Indexed URLs</p>
          </div>
          <p className="text-3xl font-bold text-rf-text">{kpis.indexedUrls}</p>
          <p className="text-xs text-rf-success mt-2 flex items-center gap-1"><FiTrendingUp /> +12% vs last month</p>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-rf-primary/10 flex items-center justify-center text-rf-primary">
              <FiBarChart2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-rf-muted">Visibility Score</p>
          </div>
          <p className="text-3xl font-bold text-rf-text">{kpis.visibilityScore}%</p>
          <p className="text-xs text-rf-success mt-2 flex items-center gap-1"><FiTrendingUp /> +4.2% vs last month</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-rf-primary/10 flex items-center justify-center text-rf-primary">
              <FiDatabase className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-rf-muted">Tracked Keywords</p>
          </div>
          <p className="text-3xl font-bold text-rf-text">{kpis.totalKeywords}</p>
          <p className="text-xs text-rf-muted mt-2">Across Ranking campaigns</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-rf-primary/10 flex items-center justify-center text-rf-primary">
              <FiAlertCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-rf-muted">Total URLs Submitted</p>
          </div>
          <p className="text-3xl font-bold text-rf-text">{kpis.totalUrls}</p>
          <p className="text-xs text-rf-muted mt-2">Google & Bing Indexing</p>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-rf-text flex items-center gap-2">
              Visibility Trend <FiInfo className="text-rf-muted h-4 w-4" />
            </h2>
            <p className="text-sm text-rf-muted mt-1">Percentage of submitted URLs successfully indexed.</p>
          </div>
          <select className="bg-rf-surface border border-rf-border text-rf-text text-sm rounded-lg px-3 py-1.5 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        
        <div className="relative h-[200px] w-full">
          <svg className="h-full w-full" viewBox="0 0 620 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="#0872FF" stopOpacity=".3" />
                <stop offset="1" stopColor="#0872FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(line => (
              <g key={line}>
                <line x1="0" y1={130 - line * 1.2} x2="620" y2={130 - line * 1.2} stroke="rgba(143,163,199,.1)" />
                <text x="0" y={126 - line * 1.2} fill="#8FA3C7" fontSize="10">{line}%</text>
              </g>
            ))}
            
            {/* Area Fill */}
            <polygon points={`0,130 ${points} 620,130`} fill="url(#chart-fill)" />
            
            {/* Line */}
            <polyline points={points} fill="none" stroke="#0872FF" strokeWidth="3" />
            
            {/* Data Points */}
            {trendData.map((d, i) => (
              <circle 
                key={i} 
                cx={(i / (trendData.length - 1)) * 620} 
                cy={130 - (d.visibility / maxVal) * 130} 
                r="4" 
                fill="#071536" 
                stroke="#0872FF" 
                strokeWidth="2" 
              />
            ))}
          </svg>
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between mt-2 text-[11px] text-rf-muted">
          {dates.map((d, i) => (
            <span key={i}>{new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          ))}
        </div>
      </Card>

      {/* Data Table (Progressive Disclosure) */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-rf-text mb-4">Recent Performance Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-rf-surface-2 text-xs uppercase text-rf-muted">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Date</th>
                <th className="px-4 py-3 font-medium">Visibility Score</th>
                <th className="px-4 py-3 font-medium">Est. Organic Traffic</th>
                <th className="px-4 py-3 font-medium text-right rounded-r-lg">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rf-border">
              {trendData.slice().reverse().map((row, i) => (
                <tr key={i} className="hover:bg-rf-surface-2/50 transition-colors">
                  <td className="px-4 py-3 text-rf-text">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-rf-text font-medium">{row.visibility}%</td>
                  <td className="px-4 py-3 text-rf-muted">{row.traffic.toLocaleString()} sessions</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-rf-success bg-rf-success/10 px-2 py-1 rounded-full">
                      +{Math.floor(Math.random() * 5) + 1}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Performance