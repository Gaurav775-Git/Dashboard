import { api } from '../lib/api'

export const createGoogleIndexingOrder = async (orderData) => {
  const response = await api.post('/services/google-indexing', orderData)
  return response.data
}

export const getGoogleIndexingOrders = async () => {
  const response = await api.get('/services/google-indexing')
  return response.data
}

// NEW: Admin fetching route
export const getAdminGoogleIndexingOrders = async () => {
  const response = await api.get('/services/admin/google-indexing')
  return response.data
}

export const updateGoogleIndexingStatus = async (id, status) => {
  const response = await api.patch(`/services/google-indexing/${id}/status`, { status })
  return response.data
}