const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_API_URL = 'https://api.flutterwave.com/v3/payments';

async function initializeFlutterwave(email, amount, orderId, currency = 'USD') {
  // Flutterwave expects amount as a string or number (e.g., "45" for $45)
  const response = await fetch(FLW_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: orderId, // Unique reference
      amount: amount,
      currency: currency, // 'USD', 'NGN', 'KES', etc.
      redirect_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success`,
      customer: {
        email: email,
      },
      customizations: {
        title: 'Rankfasta Payment',
        description: 'Payment for your SEO campaign',
      },
    }),
  });

  const data = await response.json();
  
  if (data.status === 'success') {
    return data.data.link; // The checkout URL
  } else {
    throw new Error(data.message || 'Flutterwave initialization failed');
  }
}

async function verifyFlutterwave(transactionId) {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
  });
  const data = await response.json();
  return data.status === 'success' && data.data.status === 'successful';
}

module.exports = { initializeFlutterwave, verifyFlutterwave };