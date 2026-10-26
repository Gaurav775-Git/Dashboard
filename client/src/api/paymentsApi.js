import { api } from '../lib/api'

export const initializePaystack = async (amount, email, orderId) => {
  const response = await api.post('/services/payments/paystack/initialize', { amount, email, orderId })
  return response.data
}

export const verifyPaystack = async (reference) => {
  const response = await api.get(`/services/payments/paystack/verify/${reference}`)
  return response.data
}

export const createStripeIntent = async (amount, currency = 'usd') => {
  const response = await api.post('/services/payments/create-intent', { amount, currency })
  return response.data
}

export const initializeFlutterwave = async (amount, email, orderId) => {
  const response = await api.post('/services/payments/flutterwave/initialize', { amount, email, orderId })
  return response.data
}

export const verifyFlutterwave = async (transactionId) => {
  const response = await api.get(`/services/payments/flutterwave/verify/${transactionId}`)
  return response.data
}

export const initializeCryptomus = async (amount, email, orderId) => {
  const response = await api.post('/services/payments/cryptomus/initialize', { amount, email, orderId })
  return response.data
}