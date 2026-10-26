import { api } from '../lib/api'

export const getPerformanceStats = async () => {
  const response = await api.get('/services/performance/stats')
  return response.data
}