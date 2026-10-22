import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from './ProtectedRoute'

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default PublicOnlyRoute