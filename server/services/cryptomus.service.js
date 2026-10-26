const crypto = require('crypto');
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1/payment';

// Helper to generate the required MD5 signature
function generateSign(payload, apiKey) {
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  return crypto.createHash('md5').update(base64 + apiKey).digest('hex');
}

async function initializeCryptomus(email, amount, orderId) {
  const payload = {
    amount: amount.toString(),
    currency: 'USD',
    order_id: orderId,
    url_callback: `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/services/payments/cryptomus/webhook`,
    url_return: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success`,
  };

  const sign = generateSign(payload, process.env.CRYPTOMUS_PAYMENT_KEY);

  const response = await fetch(CRYPTOMUS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'merchant': process.env.CRYPTOMUS_MERCHANT_ID,
      'sign': sign,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (data.state === 0 && data.result?.url) {
    return data.result.url; // The hosted payment page URL
  } else {
    throw new Error(data.message || 'Cryptomus initialization failed');
  }
}

// Cryptomus uses webhooks to confirm payments, not a redirect verification
function verifyCryptomusWebhook(body, sign) {
  const calculatedSign = generateSign(body, process.env.CRYPTOMUS_PAYMENT_KEY);
  return calculatedSign === sign;
}

module.exports = { initializeCryptomus, verifyCryptomusWebhook };