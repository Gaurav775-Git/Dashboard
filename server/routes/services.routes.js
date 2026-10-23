const express = require('express');
const router = express.Router();
const { 
  createIndexingOrder, 
  getIndexingOrders, 
  updateOrderStatus 
} = require('../controllers/indexing.controller');

router.route('/google-indexing')
  .post(createIndexingOrder)
  .get(getIndexingOrders);

router.patch('/google-indexing/:id/status', updateOrderStatus); 

module.exports = router;