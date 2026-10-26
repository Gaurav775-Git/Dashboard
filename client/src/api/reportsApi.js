import { api } from '../lib/api'

export const getReports = async () => {
  const response = await api.get('/services/reports')
  return response.data
}

export const downloadReport = async (orderId) => {
  // We use the api instance to ensure auth headers are attached
  const response = await api.get(`/services/reports/${orderId}/download`, {
    responseType: 'blob', // Important for file downloads
  })
  
  // Create a temporary URL for the blob and trigger the download
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `Rankfasta_Report_${orderId}.csv`)
  document.body.appendChild(link)
  link.click()
  link.parentNode.removeChild(link)
}