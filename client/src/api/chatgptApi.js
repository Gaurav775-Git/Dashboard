import { api } from '../lib/api';

export const createChatGptOrder = async (orderData) => {
  const response = await api.post('/services/chatgpt-order', orderData);
  return response.data;
};

export const getChatGptTracking = async (orderId) => {
  const response = await api.get(`/services/chatgpt-tracking/${orderId}`);
  return response.data; 
};

// 👇 NEW API CALL
export const submitChatGptToTrueRanker = async (orderId, truerankerProjectId) => {
  const response = await api.post(`/services/admin/chatgpt/${orderId}/submit`, {
    trueranker_project_id: truerankerProjectId
  });
  return response.data;
};