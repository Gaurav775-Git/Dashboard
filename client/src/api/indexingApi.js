import { api } from '../lib/api'

export const createGoogleIndexingOrder = async (orderData) => {
  const response = await api.post('/services/google-indexing', orderData)
  return response.data
}

export const getGoogleIndexingOrders = async () => {
  const response = await api.get('/services/google-indexing')
  return response.data
}

// Fetch all projects (Indexing + Ranking) for User
export const getAllProjects = async () => {
  const response = await api.get('/services/projects/all')
  return response.data
}

// Fetch all orders (Indexing + Ranking) for Admin
export const getAdminAllOrders = async () => {
  const response = await api.get('/services/admin/all-orders')
  return response.data
}

export const updateGoogleIndexingStatus = async (id, status, engine = 'google') => {
  const response = await api.patch(`/services/google-indexing/${id}/status`, { status, engine })
  return response.data
}