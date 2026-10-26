import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReports, downloadReport } from '../api/reportsApi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FiDownload, FiFileText, FiSearch, FiArrowLeft } from 'react-icons/fi'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [downloading, setDownloading] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports()
        setReports(response.data)
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const handleDownload = async (orderId) => {
    setDownloading(orderId)
    try {
      await downloadReport(orderId)
    } catch (error) {
      alert("Failed to download report")
    } finally {
      setDownloading(null)
    }
  }

  const filteredReports = reports.filter((r) => 
    r.order_id.toLowerCase().includes(search.toLowerCase()) ||
    r.website.toLowerCase().includes(search.toLowerCase()) ||
    r.service_type.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-10 text-rf-text">Loading reports...</div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Back Button and Header */}
      <div className="mb-8 flex flex-col gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-rf-muted hover:text-rf-text transition-colors w-fit"
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-rf-text">Reports & Exports</h1>
            <p className="text-rf-muted mt-2">Download performance data and campaign summaries.</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-rf-muted" />
          <input
            type="text"
            placeholder="Search by Order ID, Website, or Service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-rf-border bg-rf-surface pl-10 px-4 py-2 text-sm text-rf-text"
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="p-10 text-center flex flex-col items-center justify-center">
          <FiFileText className="text-4xl text-rf-muted mb-4" />
          <p className="text-rf-text font-semibold">No reports available</p>
          <p className="text-rf-muted text-sm mt-1">You haven't run any campaigns yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.order_id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-rf-blue-light">{report.order_id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rf-surface-2 text-rf-muted border border-rf-border">
                    {report.service_type}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-rf-text">{report.website}</h3>
                <p className="text-xs text-rf-muted mt-1">
                  {new Date(report.created_at).toLocaleDateString()} · {report.package_name} Package
                </p>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={() => handleDownload(report.order_id)}
                disabled={downloading === report.order_id}
              >
                <FiDownload className="mr-2" />
                {downloading === report.order_id ? 'Generating...' : 'Download CSV'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports