import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getGeminiTracking } from '../api/geminiApi' // 👈 Import Gemini API
import { FiArrowLeft, FiRefreshCw, FiExternalLink, FiTrendingUp, FiMessageSquare, FiTarget } from 'react-icons/fi'

const GeminiTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setSyncing(true)
    try {
      const res = await getGeminiTracking(id)
      setData(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tracking data')
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) return <div className="p-10 text-rf-text">Loading Gemini tracking data...</div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-rf-muted hover:text-rf-text mb-4">
            <FiArrowLeft /> Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-rf-text">Gemini Visibility</h1>
          <p className="text-rf-muted mt-2">Track how your brand is recommended in Gemini answers.</p>
        </div>
        <Button onClick={fetchData} disabled={syncing}>
          <FiRefreshCw className={`mr-2 ${syncing ? 'animate-spin' : ''}`} /> 
          {syncing ? 'Syncing...' : 'Sync with TrueRanker'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm">
          {error} (Please ensure your TrueRanker project ID is linked and API key is active).
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <FiTarget className="text-rf-primary h-5 w-5" />
                <p className="text-sm font-medium text-rf-muted">AI Visibility Score</p>
              </div>
              <p className="text-3xl font-bold text-rf-text">{data.visibilityScore || 0}%</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <FiMessageSquare className="text-rf-primary h-5 w-5" />
                <p className="text-sm font-medium text-rf-muted">Brand Mentions</p>
              </div>
              <p className="text-3xl font-bold text-rf-text">{data.mentionCount || 0} / {data.totalPrompts || 0}</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <FiTrendingUp className="text-rf-primary h-5 w-5" />
                <p className="text-sm font-medium text-rf-muted">Share of Voice</p>
              </div>
              <p className="text-3xl font-bold text-rf-text">{data.shareOfVoice || 0}%</p>
            </Card>
          </div>

          {/* Prompt Results Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-rf-text mb-4">Monitored Prompts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-rf-surface-2 text-xs uppercase text-rf-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-l-lg">Prompt</th>
                    <th className="px-4 py-3 font-medium">Brand Cited?</th>
                    <th className="px-4 py-3 font-medium">Position</th>
                    <th className="px-4 py-3 font-medium text-right rounded-r-lg">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rf-border">
                  {data.prompts?.length > 0 ? data.prompts.map((prompt, i) => (
                    <tr key={i} className="hover:bg-rf-surface-2/50">
                      <td className="px-4 py-3 text-rf-text">{prompt.text}</td>
                      <td className="px-4 py-3">
                        {prompt.cited ? (
                          <span className="text-xs font-semibold text-rf-success bg-rf-success/10 px-2 py-1 rounded-full">Yes</span>
                        ) : (
                          <span className="text-xs font-semibold text-rf-muted bg-rf-surface-2 px-2 py-1 rounded-full">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-rf-text">{prompt.position || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        {prompt.evidenceUrl ? (
                          <a href={prompt.evidenceUrl} target="_blank" rel="noreferrer" className="text-rf-primary hover:underline inline-flex items-center gap-1">
                            View <FiExternalLink className="h-3 w-3" />
                          </a>
                        ) : '—'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-rf-muted">
                        No AI-related keywords found for this project yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default GeminiTracking