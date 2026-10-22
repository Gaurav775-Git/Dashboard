import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Loader = () => (
  <div className="flex min-h-screen items-center justify-center text-rf-muted">Loading...</div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children || <Outlet />
}

export default ProtectedRoute