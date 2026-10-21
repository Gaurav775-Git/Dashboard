import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from './ProtectedRoute'

const PublicOnlyRoute = () => {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <Loader />
  if (status === 'authenticated') {
    const from = location.state?.from
    const target = from?.pathname?.startsWith('/') && !from.pathname.startsWith('//') ? `${from.pathname}${from.search || ''}` : '/'
    return <Navigate to={target} replace />
  }
  return <Outlet />
}
export default PublicOnlyRoute
