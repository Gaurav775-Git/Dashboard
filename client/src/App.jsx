import Dashboard from './pages/Dashboard'
import GoogleIndexingOrder from './pages/GoogleIndexingOrder'
import GoogleIndexingTracking from './pages/GoogleIndexingTracking'
import OrderConfirmation from './pages/OrderConfirmation'

const App = () => {
  const path = window.location.pathname
  if (path === '/services/google-indexing/order') return <GoogleIndexingOrder />
  if (path.startsWith('/services/google-indexing/order/confirmation/')) return <OrderConfirmation orderId={path.split('/').pop()} />
  if (path.startsWith('/projects/google-indexing/')) return <GoogleIndexingTracking />
  return (
    <>
      <Dashboard/>
    </>
  )
}

export default App