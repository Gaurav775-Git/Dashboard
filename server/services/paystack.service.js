const { PaystackClient } = require('paystack-sdk-node');

const client = new PaystackClient({
  apiKey: process.env.PAYSTACK_SECRET_KEY,
});

// Map your desired currency here. Change 'NGN' to 'KES', 'GHS', or 'ZAR' depending on your Paystack account.
const LOCAL_CURRENCY = 'NGN'; 
const EXCHANGE_RATE_USD_TO_LOCAL = 1500; // Example: 1 USD = 1500 NGN

async function initializePaystack(email, amountInUSD, orderId) {
  // 1. Convert USD to local currency
  const localAmount = amountInUSD * EXCHANGE_RATE_USD_TO_LOCAL;
  
  // 2. Paystack expects the amount in the lowest denomination (kobo for NGN, cents for KES)
  const amountInCents = Math.round(localAmount * 100);

  const response = await client.transactions.initialize({
    email: email,
    amount: amountInCents,
    currency: LOCAL_CURRENCY, 
    reference: orderId, 
    callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success`,
  });

  return response.data.authorization_url;
}

async function verifyPaystack(reference) {
  const response = await client.transactions.verify(reference);
  return response.data.status === 'success';
}

module.exports = { initializePaystack, verifyPaystack };