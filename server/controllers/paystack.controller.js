const { initializePaystack, verifyPaystack } = require('../services/paystack.service');
const { pool } = require('../config/db');

const createPaystackSession = async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;
    
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const checkoutUrl = await initializePaystack(email, amount, orderId);
    
    res.status(200).json({ success: true, checkoutUrl });
  } catch (error) {
    console.error('Paystack Init Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const isValid = await verifyPaystack(reference);
    
    if (isValid) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Paystack Verify Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPaystackSession, verifyPaystackPayment };