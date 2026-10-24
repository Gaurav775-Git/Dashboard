const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const { 
  createIndexingOrder, 
  getIndexingOrders, 
  updateOrderStatus 
} = require('../controllers/indexing.controller');

router.route('/google-indexing')
  .post(protect, createIndexingOrder)
  .get(protect, getIndexingOrders);

router.patch('/google-indexing/:id/status', protect, updateOrderStatus); 
router.post('/payments/create-intent', createPaymentIntent);

module.exports = router;