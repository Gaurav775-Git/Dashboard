const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/dashboard.controller'); 
const { pool } = require('../config/db'); 

const { 
  createIndexingOrder, 
  getIndexingOrders, 
  updateOrderStatus 
} = require('../controllers/indexing.controller');

// Dashboard Stats
router.get('/dashboard/stats', protect, getDashboardStats);

// Client Routes (Protected by JWT)
router.route('/google-indexing')
  .post(protect, createIndexingOrder)
  .get(protect, getIndexingOrders);

// Admin Route (No JWT required, fetches ALL orders)
router.get('/admin/google-indexing', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email 
      FROM google_indexing_orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    const formattedOrders = rows.map(row => ({
      ...row,
      urls: typeof row.urls === 'string' ? JSON.parse(row.urls) : row.urls,
      userId: {
        _id: row.user_id,
        name: row.user_name || 'Guest User',
        email: row.user_email || 'No email'
      },
      createdAt: row.created_at
    }));

    res.status(200).json({ success: true, count: formattedOrders.length, data: formattedOrders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.patch('/google-indexing/:id/status', protect, updateOrderStatus); 
router.post('/payments/create-intent', createPaymentIntent);

module.exports = router;