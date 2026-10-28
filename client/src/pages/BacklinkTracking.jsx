import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getBacklinkTracking } from '../api/backlinkApi'
import { FiArrowLeft, FiDownload, FiExternalLink, FiLink } from 'react-icons/fi'
import { CSVLink } from 'react-csv'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const BacklinkTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBacklinkTracking(id)
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch report')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="p-10 text-rf-text">Loading Backlink report...</div>

  // Fallback if admin hasn't submitted data yet
  if (error || !data?.order) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-rf-text mb-4">Report Not Ready</h1>
        <p className="text-rf-muted mb-6">{error || "Our team is currently building your backlinks. Check back soon!"}</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    )
  }

  const { order, links, total_links, backlink_score } = data

  // Group links by Domain Rating Tiers for the chart
  const drTiers = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
  links?.forEach(l => {
    if (l.domain_rating <= 20) drTiers['0-20']++
    else if (l.domain_rating <= 40) drTiers['21-40']++
    else if (l.domain_rating <= 60) drTiers['41-60']++
    else if (l.domain_rating <= 80) drTiers['61-80']++
    else drTiers['81-100']++
  })

  const chartData = Object.keys(drTiers).map(key => ({ name: `DR ${key}`, count: drTiers[key] }))

  // Format data for CSV download
  const csvData = links?.map(link => ({
    'Link URL': link.url,
    'Anchor Text': link.anchor_text || 'N/A',
    'Domain Rating': link.domain_rating,
    'Traffic': link.traffic,
    'Date Added': new Date(link.created_at).toLocaleDateString()
  })) || []

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-rf-muted hover:text-rf-text mb-4">
            <FiArrowLeft /> Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-rf-text">Backlink Report</h1>
          <p className="text-rf-muted mt-2">Target: {order.target_url}</p>
        </div>
        
        {links && links.length > 0 && (
          <CSVLink data={csvData} filename={`Backlinks-${order.order_id}.csv`}>
            <Button variant="secondary">
              <FiDownload className="mr-2" /> Download CSV Report
            </Button>
          </CSVLink>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] mb-8">
        {/* Score Card */}
        <Card className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-rf-surface to-rf-surface-2">
          <p className="text-sm font-semibold text-rf-muted uppercase tracking-widest mb-2">Backlink Score</p>
          <p className="text-6xl font-extrabold text-rf-primary">{backlink_score || 0}</p>
          <div className="flex items-center gap-2 mt-4 text-rf-muted">
            <FiLink className="h-4 w-4" />
            <p className="text-sm font-medium">{total_links} Total Links Acquired</p>
          </div>
          <p className="text-xs text-rf-muted mt-4 max-w-[200px]">Score is calculated based on the authority (DR) and traffic of the acquired links.</p>
        </Card>

        {/* Chart Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-rf-text mb-4">Link Quality Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a334a" vertical={false} />
                <XAxis dataKey="name" stroke="#8FA3C7" tick={{ fill: '#8FA3C7', fontSize: 12 }} />
                <YAxis stroke="#8FA3C7" tick={{ fill: '#8FA3C7', fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#0872FF11' }} contentStyle={{ backgroundColor: '#071536', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#0872FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-rf-text mb-4">Acquired Links</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-rf-surface-2 text-xs uppercase text-rf-muted">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Link URL</th>
                <th className="px-4 py-3 font-medium">Anchor Text</th>
                <th className="px-4 py-3 font-medium text-center">DR</th>
                <th className="px-4 py-3 font-medium text-center">Traffic</th>
                <th className="px-4 py-3 font-medium text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rf-border">
              {links?.length > 0 ? links.map((link, i) => (
                <tr key={i} className="hover:bg-rf-surface-2/50">
                  <td className="px-4 py-3 text-rf-text truncate max-w-[200px]" title={link.url}>{link.url}</td>
                  <td className="px-4 py-3 text-rf-muted">{link.anchor_text || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${link.domain_rating >= 50 ? 'text-emerald-400' : 'text-rf-primary'}`}>
                      {link.domain_rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-rf-text">{link.traffic?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-rf-primary hover:underline inline-flex items-center gap-1">
                      Visit <FiExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-rf-muted">
                    No links have been added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default BacklinkTracking