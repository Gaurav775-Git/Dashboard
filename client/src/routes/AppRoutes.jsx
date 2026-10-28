import { Routes, Route, useParams } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminPasswordGate from '../components/AdminPasswordGate'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import OrderSuccess from '../pages/OrderSuccess'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import VerifyEmail from '../pages/VerifyEmail'
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/Dashboard'
import ComingSoon from '../pages/ComingSoon'
import Projects from '../pages/Projects'
import Reports from '../pages/Reports'
import Performance from '../pages/Performance'
import GoogleIndexingOrder from '../pages/GoogleIndexingOrder'
import GoogleIndexingTracking from '../pages/GoogleIndexingTracking'
import OrderConfirmation from '../pages/OrderConfirmation'
import BingIndexingOrder from '../pages/BingIndexingOrder'
import BingIndexingTracking from '../pages/BingIndexingTracking'
import GoogleRankingOrder from '../pages/GoogleRankingOrder'
import GoogleRankingTracking from '../pages/GoogleRankingTracking'
import BingRankingOrder from '../pages/BingRankingOrder'
import BingRankingTracking from '../pages/BingRankingTracking'
import ChatGptOrder from '../pages/ChatGptOrder'
import ChatGptTracking from '../pages/ChatGptTracking'
// 👇 Import Gemini Pages
import GeminiOrder from '../pages/GeminiOrder'
import GeminiTracking from '../pages/GeminiTracking'
import GenericServiceOrder from '../pages/GenericServiceOrder'
import GenericServiceTracking from '../pages/GenericServiceTracking'

const sections = { 
  '/ai-visibility': 'AI Visibility', 
  '/messages': 'Messages', 
  '/billing': 'Billing', 
  '/help': 'Help Center' 
}

const Confirmation = () => {
  const { orderId } = useParams();
  return <OrderConfirmation orderId={orderId} />;
}

const ServiceRoutes = () => (
  <>
    <Route path="/services/google-indexing/order" element={<GoogleIndexingOrder />} />
    <Route path="/services/google-indexing/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/google-indexing/:id" element={<GoogleIndexingTracking />} />
    
    <Route path="/services/bing-indexing/order" element={<BingIndexingOrder />} />
    <Route path="/services/bing-indexing/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/bing-indexing/:id" element={<BingIndexingTracking />} />
    
    <Route path="/services/google-ranking/order" element={<GoogleRankingOrder />} />
    <Route path="/services/google-ranking/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/google-ranking/:id" element={<GoogleRankingTracking />} />
    
    <Route path="/services/bing-ranking/order" element={<BingRankingOrder />} />
    <Route path="/services/bing-ranking/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/bing-ranking/:id" element={<BingRankingTracking />} />

    {/* ChatGPT Routes */}
    <Route path="/services/chatgpt-citations/order" element={<ChatGptOrder />} />
    <Route path="/services/chatgpt-citations/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/chatgpt-citations/:id" element={<ChatGptTracking />} />

    {/* 👇 Gemini Routes */}
    <Route path="/services/gemini-recommendations/order" element={<GeminiOrder />} />
    <Route path="/services/gemini-recommendations/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/gemini-recommendations/:id" element={<GeminiTracking />} />
    
    {/* Generic Fallback Routes */}
    <Route path="/services/:serviceId/order" element={<GenericServiceOrder />} />
    <Route path="/services/:serviceId/order/confirmation/:orderId" element={<Confirmation />} />
    <Route path="/projects/:serviceId/:id" element={<GenericServiceTracking />} />
  </>
)

const AppRoutes = () => (
  <Routes>
    {/* Public Auth Routes */}
    <Route element={<AuthLayout />}>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Route>

    {/* Admin Route */}
    <Route 
      path="/admin" 
      element={
        <AdminPasswordGate>
          <AdminDashboard />
        </AdminPasswordGate>
      } 
    />

    {/* Client Dashboard Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/projects" element={<Projects />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/performance" element={<Performance />} />
        
        <Route path="/payment-success" element={<OrderSuccess />} />
        
        {Object.entries(sections).map(([path, section]) => (
          <Route key={path} path={path} element={<ComingSoon section={section} />} />
        ))}
        
        <Route path="/services" element={<Dashboard />} />
        {ServiceRoutes()}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes