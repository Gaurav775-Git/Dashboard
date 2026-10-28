import { useState, useMemo, useEffect } from 'react'
import { getAdminAllOrders, updateGoogleIndexingStatus } from '../api/indexingApi'
import { submitChatGptToTrueRanker } from '../api/chatgptApi'
import { submitGeminiToTrueRanker } from '../api/geminiApi'
import { submitKnowledgePanelReport } from '../api/knowledgePanelApi' // 👈 New Import
import { api } from '../lib/api'

const statusColors = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
}

const StatusBadge = ({ status }) => (
  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[status] || statusColors.pending}`}>
    {status}
  </span>
)

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Submission States
  const [trProjectId, setTrProjectId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  // 👇 Knowledge Panel State
  const [kpData, setKpData] = useState({
    kgid_generated: false,
    kgid_url: '',
    bio_links_count: 0,
    news_articles_count: 0,
    wiki_articles_count: 0
  })

  const fetchOrders = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      const response = await getAdminAllOrders()
      setOrders(response.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(true)
  }, [])

  const handleManualSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      if (selectedOrder.type === 'chatgpt') {
        if (!trProjectId.trim()) throw new Error('TrueRanker Project ID is required')
        await submitChatGptToTrueRanker(selectedOrder.orderId, trProjectId)
      } else if (selectedOrder.type === 'gemini') {
        if (!trProjectId.trim()) throw new Error('TrueRanker Project ID is required')
        await submitGeminiToTrueRanker(selectedOrder.orderId, trProjectId)
      } else if (selectedOrder.type === 'knowledge-panel') {
        // 👇 Submit Knowledge Panel Data
        await submitKnowledgePanelReport(selectedOrder.orderId, kpData)
      } else if (selectedOrder.type === 'indexing') {
        const engine = selectedOrder.engine || 'google';
        await updateGoogleIndexingStatus(selectedOrder.id, 'processing', engine)
      } else if (selectedOrder.type === 'ranking') {
        await api.post('/services/admin/orders/trigger-api', { 
          orderId: selectedOrder.orderId, 
          type: 'ranking' 
        })
      }
      
      // Update local state instantly
      setOrders(orders.map(o => 
        o.orderId === selectedOrder.orderId ? { ...o, status: 'processing' } : o
      ))
      
      setSelectedOrder(null)
      setTrProjectId('')
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      const searchLower = search.toLowerCase()
      const matchSearch =
        (o.orderId && o.orderId.toLowerCase().includes(searchLower)) ||
        (o.userId?.email || '').toLowerCase().includes(searchLower) ||
        (o.userId?.name || '').toLowerCase().includes(searchLower)
      return matchStatus && matchSearch
    })
  }, [orders, statusFilter, search])

  const kpis = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  }), [orders])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center text-white">
        <p className="animate-pulse">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage All Campaigns & Trigger APIs</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-medium text-slate-400">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-white">{kpis.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-medium text-slate-400">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{kpis.pending}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-medium text-slate-400">Processing</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">{kpis.processing}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-medium text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{kpis.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID / Type</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Target</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={`${order.type}-${order.id}`} className="transition hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-300">{order.orderId}</div>
                        <div className="mt-1 text-xs text-indigo-400 uppercase">{order.projectName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{order.userId?.name || 'Guest User'}</div>
                        <div className="text-xs text-slate-500">{order.userId?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-slate-300">
                          {order.type === 'indexing' 
                            ? (order.urls?.[0] || 'No URLs')
                            : (order.type === 'chatgpt' || order.type === 'gemini')
                            ? (order.website || 'No Website')
                            : order.type === 'knowledge-panel'
                            ? (order.target_entity || 'No Entity')
                            : (order.keywords?.[0] || 'No Keywords')}
                        </div>
                        {(order.type === 'chatgpt' || order.type === 'gemini') && (
                          <div className="mt-1 text-xs text-emerald-400">
                            {order.prompts?.length || 0} Prompts
                          </div>
                        )}
                        {order.type === 'knowledge-panel' && (
                          <div className="mt-1 text-xs text-blue-400">
                            Knowledge Panel Entity
                          </div>
                        )}
                        {order.type === 'indexing' && (
                          <div className="mt-1 text-xs text-indigo-400">
                            +{(order.urls?.length || 1) - 1} more URLs
                          </div>
                        )}
                        {order.type === 'ranking' && (
                          <div className="mt-1 text-xs text-indigo-400">
                            +{(order.keywords?.length || 1) - 1} more Keywords
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrProjectId(order.trueranker_project_id || '');
                            setSubmitError('');
                          }}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Manage Order</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              {/* Meta */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Meta</h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                  <div className="flex justify-between py-1"><span className="text-slate-400">Order ID</span><span className="font-mono text-xs text-slate-200">{selectedOrder.orderId}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Type</span><span className="font-semibold text-indigo-400">{selectedOrder.projectName}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Status</span><StatusBadge status={selectedOrder.status} /></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Date</span><span className="text-slate-200">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Client</span><span className="text-slate-200">{selectedOrder.userId?.email || '—'}</span></div>
                </div>
              </div>

              {/* Submission Data */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Submission Data</h3>
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                  <div>
                    <span className="mb-1 block text-xs text-slate-400">
                      {selectedOrder.type === 'indexing' ? 'Target URLs' : selectedOrder.type === 'chatgpt' || selectedOrder.type === 'gemini' ? 'Tracked Prompts' : selectedOrder.type === 'knowledge-panel' ? 'Target Entity' : 'Target Keywords'}
                    </span>
                    <div className="space-y-1">
                      {selectedOrder.type === 'indexing' 
                        ? selectedOrder.urls?.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="block truncate text-indigo-400 hover:underline">{url}</a>
                          ))
                        : (selectedOrder.type === 'chatgpt' || selectedOrder.type === 'gemini')
                        ? selectedOrder.prompts?.map((prompt, i) => (
                            <div key={i} className="block truncate text-indigo-400">"{prompt}"</div>
                          ))
                        : selectedOrder.type === 'knowledge-panel'
                        ? <div className="text-slate-200">{selectedOrder.target_entity}</div>
                        : selectedOrder.keywords?.map((kw, i) => (
                            <div key={i} className="block truncate text-indigo-400">{kw}</div>
                          ))
                      }
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="mb-1 block text-xs text-slate-400">Website / Target</span>
                    <span className="text-slate-200">{selectedOrder.website || selectedOrder.target_entity || '—'}</span>
                  </div>
                </div>
              </div>

              {/* MANUAL SUBMISSION BLOCK */}
              <div className="mt-6 border-t border-slate-800 pt-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                  Manual API Submission
                </h3>
                
                {selectedOrder.status === 'processing' || selectedOrder.status === 'completed' ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
                    <p className="text-emerald-400 font-medium">This order is already {selectedOrder.status}.</p>
                    {(selectedOrder.type === 'chatgpt' || selectedOrder.type === 'gemini') && selectedOrder.trueranker_project_id && (
                      <p className="text-xs text-slate-300 mt-1">Project ID: <span className="font-mono">{selectedOrder.trueranker_project_id}</span></p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                    
                    {(selectedOrder.type === 'chatgpt' || selectedOrder.type === 'gemini') && (
                      <div className="mb-3">
                        <label className="block text-xs text-slate-400 mb-2">TrueRanker Project ID:</label>
                        <input 
                          type="text" 
                          value={trProjectId}
                          onChange={(e) => setTrProjectId(e.target.value)}
                          placeholder="e.g. 12345"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    {selectedOrder.type === 'knowledge-panel' && (
                      <div className="space-y-4 mb-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Bio Links Created</label>
                          <input type="number" min="0" value={kpData.bio_links_count} onChange={(e) => setKpData({...kpData, bio_links_count: Number(e.target.value)})} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">News Articles Published</label>
                          <input type="number" min="0" value={kpData.news_articles_count} onChange={(e) => setKpData({...kpData, news_articles_count: Number(e.target.value)})} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Wiki Articles Created</label>
                          <input type="number" min="0" value={kpData.wiki_articles_count} onChange={(e) => setKpData({...kpData, wiki_articles_count: Number(e.target.value)})} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <input type="checkbox" checked={kpData.kgid_generated} onChange={(e) => setKpData({...kpData, kgid_generated: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
                          <label className="text-xs text-slate-300">Knowledge Graph ID Generated?</label>
                        </div>
                        {kpData.kgid_generated && (
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">KGID URL</label>
                            <input type="text" value={kpData.kgid_url} onChange={(e) => setKpData({...kpData, kgid_url: e.target.value})} placeholder="https://google.com/search?q=..." className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOrder.type === 'indexing' && (
                      <p className="text-xs text-slate-400 mb-3">Ready to submit to Rapid Indexer?</p>
                    )}

                    {selectedOrder.type === 'ranking' && (
                      <p className="text-xs text-slate-400 mb-3">Ready to submit to Ranking API?</p>
                    )}

                    {submitError && <p className="text-red-400 text-xs mb-2">{submitError}</p>}

                    <button
                      onClick={handleManualSubmit}
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : `Save Data & Calculate Score`}
                    </button>
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-8 w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard