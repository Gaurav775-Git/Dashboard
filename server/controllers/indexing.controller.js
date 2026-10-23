const { pool } = require('../config/db');
const crypto = require('crypto');

const createIndexingOrder = async (req, res) => {
  try {
    const userId = req.user?.id || 1; 

    const { 
      packageId, packageName, totalPrice, 
      website, property, propertyType, sitemap, urls, 
      locale, priority, trackingDays, frequency, notes 
    } = req.body;

    if (!urls || urls.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one URL' });
    }

    const orderId = `GIDX-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const urlsJson = JSON.stringify(urls);

    const query = `
      INSERT INTO google_indexing_orders 
      (user_id, order_id, package_id, package_name, total_price, website, property, property_type, sitemap, urls, total_urls, locale, priority, tracking_days, frequency, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId, orderId, packageId, packageName, totalPrice, 
      website, property, propertyType, sitemap, urlsJson, urls.length, 
      locale, priority, trackingDays, frequency, notes
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { id: result.insertId, orderId, status: 'pending' }
    });
  } catch (error) {
    console.error('Error creating indexing order:', error);
    res.status(500).json({ success: false, message: 'Server error while creating order' });
  }
};

const getIndexingOrders = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const isAdmin = req.user?.role === 'admin' || true;

    let query = `
      SELECT o.*, u.name AS user_name, u.email AS user_email 
      FROM google_indexing_orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    let params = [];

    if (!isAdmin) {
      query += ' WHERE o.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.query(query, params);

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
    console.error('Error fetching indexing orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE google_indexing_orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createIndexingOrder,
  getIndexingOrders,
  updateOrderStatus
};