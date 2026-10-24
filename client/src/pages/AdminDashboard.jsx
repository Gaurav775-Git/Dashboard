import { useState, useMemo, useEffect } from 'react'
import { getAdminAllOrders, updateGoogleIndexingStatus } from '../api/indexingApi'

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
  const [submittingId, setSubmittingId] = useState(null)

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

  const handleSubmitToIndexer = async (id, type) => {
    if (type === 'ranking') {
      alert("Ranking campaigns are processed automatically by the system.");
      return;
    }
    
    setSubmittingId(id)
    try {
      const order = orders.find(o => o.id === id && o.type === 'indexing');
      const engine = order?.engine || 'google';
      
      await updateGoogleIndexingStatus(id, 'processing', engine)
      
      setTimeout(() => {
        fetchOrders()
        setSubmittingId(null)
      }, 3000)
    } catch (error) {
      alert("Failed to submit to Rapid Indexer: " + error.message)
      setSubmittingId(null)
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
            <p className="text-sm text-slate-400">Manage All Campaigns (Indexing & Ranking)</p>
          </div>
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Live Database Connected
          </span>
        </div>

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
                            : (order.keywords?.[0] || 'No Keywords')}
                        </div>
                        <div className="mt-1 text-xs text-indigo-400">
                          {order.type === 'indexing' 
                            ? `+${(order.urls?.length || 1) - 1} more URLs` 
                            : `+${(order.keywords?.length || 1) - 1} more Keywords`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSubmitToIndexer(order.id, order.type)}
                          disabled={order.type === 'ranking' || submittingId === order.id || order.status === 'processing' || order.status === 'completed'}
                          className="mr-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {order.type === 'ranking' ? 'Auto-Tracked' : (submittingId === order.id ? 'Submitting...' : 'Submit')}
                        </button>
                        
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                        >
                          View
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Meta</h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                  <div className="flex justify-between py-1"><span className="text-slate-400">Order ID</span><span className="font-mono text-xs text-slate-200">{selectedOrder.orderId}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Type</span><span className="font-semibold text-indigo-400">{selectedOrder.projectName}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Status</span><StatusBadge status={selectedOrder.status} /></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Date</span><span className="text-slate-200">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Client</span><span className="text-slate-200">{selectedOrder.userId?.email || '—'}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-400">Amount</span><span className="font-semibold text-emerald-400">${selectedOrder.total_price || '0.00'}</span></div>
                  <div className="flex justify-between py-1 border-t border-slate-800 mt-1 pt-1">
                    <span className="text-slate-400">Stripe ID</span>
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]" title={selectedOrder.payment_intent_id}>
                      {selectedOrder.payment_intent_id || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Submission Data</h3>
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                  <div>
                    <span className="mb-1 block text-xs text-slate-400">{selectedOrder.type === 'indexing' ? 'Target URLs' : 'Target Keywords'}</span>
                    <div className="space-y-1">
                      {selectedOrder.type === 'indexing' 
                        ? selectedOrder.urls?.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="block truncate text-indigo-400 hover:underline">
                              {url}
                            </a>
                          ))
                        : selectedOrder.keywords?.map((kw, i) => (
                            <div key={i} className="block truncate text-indigo-400">{kw}</div>
                          ))
                      }
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="mb-1 block text-xs text-slate-400">Website</span>
                    <span className="text-slate-200">{selectedOrder.website || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
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