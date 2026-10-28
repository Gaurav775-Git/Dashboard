import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getKnowledgePanelTracking } from '../api/knowledgePanelApi'
import { FiArrowLeft, FiDownload, FiExternalLink, FiCheckCircle } from 'react-icons/fi'
import { CSVLink } from 'react-csv'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const KnowledgePanelTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getKnowledgePanelTracking(id)
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch report')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="p-10 text-rf-text">Loading Knowledge Panel report...</div>

  // Fallback if admin hasn't submitted data yet
  if (error || !data?.report) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-rf-text mb-4">Report Not Ready</h1>
        <p className="text-rf-muted mb-6">{error || "Our team is currently working on your Knowledge Panel. Check back soon!"}</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    )
  }

  const { order, report } = data

  // Format data for the chart
  const chartData = [
    { name: 'Bio Links', count: report.bio_links_count || 0 },
    { name: 'News Articles', count: report.news_articles_count || 0 },
    { name: 'Wiki Articles', count: report.wiki_articles_count || 0 },
    { name: 'KGID Generated', count: report.kgid_generated ? 1 : 0 },
  ]

  // Format data for CSV download
  const csvData = [
    { Metric: 'Bio Links Created', Value: report.bio_links_count || 0 },
    { Metric: 'News Articles Published', Value: report.news_articles_count || 0 },
    { Metric: 'Wiki Articles Created', Value: report.wiki_articles_count || 0 },
    { Metric: 'Knowledge Graph ID Generated', Value: report.kgid_generated ? 'Yes' : 'No' },
    { Metric: 'KGID URL', Value: report.kgid_url || 'N/A' },
    { Metric: 'Total Entity Score', Value: report.entity_score || 0 },
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-rf-muted hover:text-rf-text mb-4">
            <FiArrowLeft /> Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-rf-text">Knowledge Panel Report</h1>
          <p className="text-rf-muted mt-2">Entity: {order.target_entity}</p>
        </div>
        
        {/* CSV Download Button */}
        <CSVLink data={csvData} filename={`KnowledgePanel-${order.order_id}.csv`}>
          <Button variant="secondary">
            <FiDownload className="mr-2" /> Download CSV Report
          </Button>
        </CSVLink>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] mb-8">
        {/* Score Card */}
        <Card className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-rf-surface to-rf-surface-2">
          <p className="text-sm font-semibold text-rf-muted uppercase tracking-widest mb-2">Entity Score</p>
          <p className="text-6xl font-extrabold text-rf-primary">{report.entity_score || 0}</p>
          <p className="text-xs text-rf-muted mt-4 max-w-[200px]">This score is calculated based on the authority and number of links, articles, and KGID status.</p>
        </Card>

        {/* Chart Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-rf-text mb-4">Asset Breakdown</h2>
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

      {/* Detailed Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-rf-text mb-4">Detailed Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-rf-surface-2 text-xs uppercase text-rf-muted">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Asset Type</th>
                <th className="px-4 py-3 font-medium">Count / Status</th>
                <th className="px-4 py-3 font-medium text-right rounded-r-lg">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rf-border">
              <tr className="hover:bg-rf-surface-2/50">
                <td className="px-4 py-3 text-rf-text">Bio Links Created</td>
                <td className="px-4 py-3 text-rf-text">{report.bio_links_count || 0}</td>
                <td className="px-4 py-3 text-right text-rf-muted">—</td>
              </tr>
              <tr className="hover:bg-rf-surface-2/50">
                <td className="px-4 py-3 text-rf-text">News Articles Published</td>
                <td className="px-4 py-3 text-rf-text">{report.news_articles_count || 0}</td>
                <td className="px-4 py-3 text-right text-rf-muted">—</td>
              </tr>
              <tr className="hover:bg-rf-surface-2/50">
                <td className="px-4 py-3 text-rf-text">Wiki Articles Created</td>
                <td className="px-4 py-3 text-rf-text">{report.wiki_articles_count || 0}</td>
                <td className="px-4 py-3 text-right text-rf-muted">—</td>
              </tr>
              <tr className="hover:bg-rf-surface-2/50">
                <td className="px-4 py-3 text-rf-text">Knowledge Graph ID</td>
                <td className="px-4 py-3">
                  {report.kgid_generated ? (
                    <span className="text-rf-success flex items-center gap-1"><FiCheckCircle /> Generated</span>
                  ) : (
                    <span className="text-rf-muted">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {report.kgid_url ? (
                    <a href={report.kgid_url} target="_blank" rel="noreferrer" className="text-rf-primary hover:underline inline-flex items-center gap-1">
                      View <FiExternalLink className="h-3 w-3" />
                    </a>
                  ) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default KnowledgePanelTracking