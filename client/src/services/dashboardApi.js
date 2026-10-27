import { api } from '../lib/api'

export const getDashboardStats = async () => {
  const response = await api.get('/services/dashboard/stats')
  // Return the inner data object directly
  return response.data.data 
}