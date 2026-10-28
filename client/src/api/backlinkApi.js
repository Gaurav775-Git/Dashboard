import { api } from '../lib/api';

export const createBacklinkOrder = async (orderData) => {
  const response = await api.post('/services/backlink-order', orderData);
  return response.data;
};

export const getBacklinkTracking = async (orderId) => {
  const response = await api.get(`/services/backlink-tracking/${orderId}`);
  return response.data; 
};

export const submitBacklinkReport = async (orderId, reportData) => {
  const response = await api.post(`/services/admin/backlink/${orderId}/submit-report`, reportData);
  return response.data;
};