import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Loader = () => <div className="flex min-h-screen items-center justify-center bg-rf-bg"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-rf-border border-t-rf-primary" /><p className="mt-4 text-sm text-rf-muted">Loading your workspace...</p></div></div>

const ProtectedRoute = () => {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <Loader />
  if (status !== 'authenticated') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
export default ProtectedRoute
