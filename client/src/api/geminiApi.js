import { api } from '../lib/api';

export const createGeminiOrder = async (orderData) => {
  const response = await api.post('/services/gemini-order', orderData);
  return response.data;
};

export const getGeminiTracking = async (orderId) => {
  const response = await api.get(`/services/gemini-tracking/${orderId}`);
  return response.data; 
};

export const submitGeminiToTrueRanker = async (orderId, truerankerProjectId) => {
  const response = await api.post(`/services/admin/gemini/${orderId}/submit`, {
    trueranker_project_id: truerankerProjectId
  });
  return response.data;
};