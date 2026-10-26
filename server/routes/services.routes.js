const express = require('express');
const router = express.Router();

const { createPaymentIntent } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/dashboard.controller'); 
const { getReports, downloadReport } = require('../controllers/reports.controller');
const { pool } = require('../config/db'); 
const { createRankingOrder } = require('../controllers/ranking.controller');
const { createPaystackSession, verifyPaystackPayment } = require('../controllers/paystack.controller'); 
const { createFlutterwaveSession, verifyFlutterwavePayment } = require('../controllers/flutterwave.controller');


const { 
  createIndexingOrder, 
  getIndexingOrders, 
  updateOrderStatus,
  getAllProjects 
} = require('../controllers/indexing.controller');

router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/reports', protect, getReports); 
router.get('/reports/:orderId/download', protect, downloadReport);
router.get('/projects/all', protect, getAllProjects);
router.post('/google-ranking', protect, createRankingOrder);

// Paystack Routes
router.post('/payments/paystack/initialize', protect, createPaystackSession);
router.get('/payments/paystack/verify/:reference', protect, verifyPaystackPayment);

router.route('/google-indexing')
  .post(protect, createIndexingOrder)
  .get(protect, getIndexingOrders);

router.get('/admin/all-orders', async (req, res) => {
  try {
    const [indexing] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email, 'indexing' as type
      FROM google_indexing_orders o
      LEFT JOIN users u ON o.user_id = u.id
    `);
    
    const [ranking] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email, 'ranking' as type
      FROM ranking_orders o
      LEFT JOIN users u ON o.user_id = u.id
    `);

    const formattedIndexing = indexing.map(row => ({
      ...row,
      urls: typeof row.urls === 'string' ? JSON.parse(row.urls) : row.urls,
      userId: { _id: row.user_id, name: row.user_name || 'Guest', email: row.user_email || 'No email' },
      createdAt: row.created_at,
      projectName: row.engine === 'bing' ? 'Bing Indexing' : 'Google Indexing'
    }));

    const formattedRanking = ranking.map(row => ({
      ...row,
      keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
      userId: { _id: row.user_id, name: row.user_name || 'Guest', email: row.user_email || 'No email' },
      createdAt: row.created_at,
      projectName: 'Google Ranking'
    }));

    const allOrders = [...formattedIndexing, ...formattedRanking].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, count: allOrders.length, data: allOrders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.patch('/google-indexing/:id/status', protect, updateOrderStatus); 
router.post('/payments/create-intent', createPaymentIntent);

router.post('/payments/flutterwave/initialize', protect, createFlutterwaveSession);
router.get('/payments/flutterwave/verify/:transactionId', protect, verifyFlutterwavePayment);


module.exports = router;