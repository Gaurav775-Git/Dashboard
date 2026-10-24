import { api } from '../lib/api'

export const getDashboardStats = async () => {
  const response = await api.get('/services/dashboard/stats')
  return response.data
}