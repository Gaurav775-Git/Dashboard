import { api } from '../lib/api';

export const createKnowledgePanelOrder = async (orderData) => {
  const response = await api.post('/services/knowledge-panel-order', orderData);
  return response.data;
};

export const getKnowledgePanelTracking = async (orderId) => {
  const response = await api.get(`/services/knowledge-panel-tracking/${orderId}`);
  return response.data; 
};

export const submitKnowledgePanelReport = async (orderId, reportData) => {
  const response = await api.post(`/services/admin/knowledge-panel/${orderId}/submit-report`, reportData);
  return response.data;
};