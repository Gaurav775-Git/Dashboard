const { pool } = require('../config/db');
const crypto = require('crypto');

const createRankingOrder = async (req, res) => {
  try {
    const userId = req.user?.id; 
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { 
      packageId, packageName, totalPrice, 
      website, target, keywords, 
      location, language, device, trackingDays, frequency, notes,
      paymentIntentId, engine = 'google'
    } = req.body;

    if (!keywords || keywords.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one keyword' });
    }

    const orderId = `RNKG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const keywordsJson = JSON.stringify(keywords);

    const query = `
      INSERT INTO ranking_orders 
      (user_id, order_id, engine, package_id, package_name, total_price, website, target_page, keywords, total_keywords, location, language, device, tracking_days, frequency, notes, payment_intent_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId, orderId, engine, packageId, packageName, totalPrice, 
      website, target, keywordsJson, keywords.length, 
      location, language, device, trackingDays, frequency, notes,
      paymentIntentId
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Ranking campaign created successfully',
      data: { id: result.insertId, orderId, status: 'pending' }
    });
  } catch (error) {
    console.error('Error creating ranking order:', error);
    res.status(500).json({ success: false, message: 'Server error while creating ranking campaign' });
  }
};

module.exports = { createRankingOrder };