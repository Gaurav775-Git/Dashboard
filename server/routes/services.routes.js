const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/payment.controller');

const { 
  createIndexingOrder, 
  getIndexingOrders, 
  updateOrderStatus 
} = require('../controllers/indexing.controller');

router.route('/google-indexing')
  .post(createIndexingOrder)
  .get(getIndexingOrders);

router.patch('/google-indexing/:id/status', updateOrderStatus); 
router.post('/payments/create-intent', createPaymentIntent);


module.exports = router;