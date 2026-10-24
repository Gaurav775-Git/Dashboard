import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGoogleIndexingOrders } from '../api/indexingApi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Projects = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await getGoogleIndexingOrders()
        setOrders(response.data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserOrders()
  }, [])

  if (loading) return <div className="p-10 text-rf-text">Loading your projects...</div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-rf-text">My Projects</h1>
          <p className="text-rf-muted mt-2">Manage your active campaigns and view payment history.</p>
        </div>
        <Button onClick={() => navigate('/services/google-indexing/order')}>
          + New Campaign
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-rf-muted">You don't have any active projects yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-rf-blue-light">{order.orderId}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-rf-text">{order.website}</h3>
                <p className="text-sm text-rf-muted mt-1">
                  {order.totalUrls || order.urls?.length || 0} URLs submitted · {order.packageName || 'Standard'} Package
                </p>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div>
                  <p className="text-xs text-rf-muted mb-1">Amount Paid</p>
                  <p className="font-bold text-rf-text">${order.total_price || order.totalPrice || '0.00'}</p>
                  {order.payment_intent_id && (
                    <div className="mt-1">
                      <p className="text-[10px] text-rf-success font-semibold">✓ Paid via Stripe</p>
                      <p className="text-[9px] text-rf-muted font-mono truncate max-w-[120px]" title={order.payment_intent_id}>
                        {order.payment_intent_id}
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/projects/google-indexing/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects