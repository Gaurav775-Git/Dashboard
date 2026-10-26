const { initializeFlutterwave, verifyFlutterwave } = require('../services/flutterwave.service');

const createFlutterwaveSession = async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;
    
    // You can accept currency from the frontend or hardcode 'USD'
    const checkoutUrl = await initializeFlutterwave(email, amount, orderId, 'USD');
    
    res.status(200).json({ success: true, checkoutUrl });
  } catch (error) {
    console.error('Flutterwave Init Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyFlutterwavePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const isValid = await verifyFlutterwave(transactionId);
    
    if (isValid) {
      res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createFlutterwaveSession, verifyFlutterwavePayment };