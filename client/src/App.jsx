import Dashboard from './pages/Dashboard'
import GoogleIndexingOrder from './pages/GoogleIndexingOrder'
import GoogleIndexingTracking from './pages/GoogleIndexingTracking'
import OrderConfirmation from './pages/OrderConfirmation'
import BingIndexingOrder from './pages/BingIndexingOrder'
import BingIndexingTracking from './pages/BingIndexingTracking'
import GoogleRankingOrder from './pages/GoogleRankingOrder'
import GoogleRankingTracking from './pages/GoogleRankingTracking'
import BingRankingOrder from './pages/BingRankingOrder'
import BingRankingTracking from './pages/BingRankingTracking'
import GenericServiceOrder from './pages/GenericServiceOrder'
import GenericServiceTracking from './pages/GenericServiceTracking'
import { GENERIC_SERVICE_CONFIGS } from './config/serviceConfigs'

const App = () => {
  const path = window.location.pathname
  if (path === '/services/google-indexing/order') return <GoogleIndexingOrder />
  if (path.startsWith('/services/google-indexing/order/confirmation/')) return <OrderConfirmation orderId={path.split('/').pop()} />
  if (path.startsWith('/projects/google-indexing/')) return <GoogleIndexingTracking />
  if (path === '/services/bing-indexing/order') return <BingIndexingOrder />
  if (path.startsWith('/services/bing-indexing/order/confirmation/')) return <OrderConfirmation orderId={path.split('/').pop()} />
  if (path.startsWith('/projects/bing-indexing/')) return <BingIndexingTracking />
  if (path === '/services/google-ranking/order') return <GoogleRankingOrder />
  if (path.startsWith('/services/google-ranking/order/confirmation/')) return <OrderConfirmation orderId={path.split('/').pop()} />
  if (path.startsWith('/projects/google-ranking/')) return <GoogleRankingTracking />
  if (path === '/services/bing-ranking/order') return <BingRankingOrder />
  if (path.startsWith('/services/bing-ranking/order/confirmation/')) return <OrderConfirmation orderId={path.split('/').pop()} />
  if (path.startsWith('/projects/bing-ranking/')) return <BingRankingTracking />
  const genericOrder = path.match(/^\/services\/([^/]+)\/order$/)
  if (genericOrder && GENERIC_SERVICE_CONFIGS[genericOrder[1]]) return <GenericServiceOrder serviceId={genericOrder[1]} />
  const genericConfirmation = path.match(/^\/services\/([^/]+)\/order\/confirmation\//)
  if (genericConfirmation && GENERIC_SERVICE_CONFIGS[genericConfirmation[1]]) return <OrderConfirmation orderId={path.split('/').pop()} />
  const genericTracking = path.match(/^\/projects\/([^/]+)\/[^/]+$/)
  if (genericTracking && GENERIC_SERVICE_CONFIGS[genericTracking[1]]) return <GenericServiceTracking serviceId={genericTracking[1]} />
  return (
    <>
      <Dashboard/>
    </>
  )
}

export default App