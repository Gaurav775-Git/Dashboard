const { initializeCryptomus, verifyCryptomusWebhook } = require('../services/cryptomus.service');
const { pool } = require('../config/db');

const createCryptomusSession = async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;
    const checkoutUrl = await initializeCryptomus(email, amount, orderId);
    res.status(200).json({ success: true, checkoutUrl });
  } catch (error) {
    console.error('Cryptomus Init Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// This receives the payment confirmation from Cryptomus
const handleCryptomusWebhook = async (req, res) => {
  try {
    const { sign, ...body } = req.body;
    
    if (!verifyCryptomusWebhook(body, sign)) {
      return res.status(400).send('Invalid signature');
    }

    // body.status will be 'paid' or 'paid_over' when successful
    if (body.status === 'paid' || body.status === 'paid_over') {
      const orderId = body.order_id; // This is the temp order ID you passed
      // Update your database here to mark the order as paid
      console.log(`Cryptomus payment confirmed for ${orderId}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Cryptomus Webhook Error:', error);
    res.status(500).send('Error');
  }
};

module.exports = { createCryptomusSession, handleCryptomusWebhook };