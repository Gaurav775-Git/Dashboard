const { pool } = require('../config/db');
const crypto = require('crypto');

// 1. Client: Create Order
const createBacklinkOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { packageId, packageName, totalPrice, targetUrl, notes, paymentIntentId } = req.body;

    if (!targetUrl) return res.status(400).json({ success: false, message: 'Target URL is required' });

    const orderId = `BLNK-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const query = `
      INSERT INTO backlink_orders 
      (user_id, order_id, package_id, package_name, total_price, target_url, notes, payment_intent_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [userId, orderId, packageId, packageName, totalPrice, targetUrl, notes, paymentIntentId]);

    res.status(201).json({ success: true, message: 'Backlink order created', data: { orderId } });
  } catch (error) {
    console.error('Error creating backlink order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Admin: Submit Backlinks & Calculate Score
const submitBacklinkReport = async (req, res) => {
  const { orderId } = req.params;
  const { links } = req.body; // Array of { url, domain_rating, traffic, anchor_text }

  try {
    // Clear old links if re-submitting
    await pool.query('DELETE FROM backlink_items WHERE order_id = ?', [orderId]);

    // Insert new links
    if (links && links.length > 0) {
      const values = links.map(link => [
        orderId, link.url, link.domain_rating || 0, link.traffic || 0, link.anchor_text || ''
      ]);
      
      await pool.query(`
        INSERT INTO backlink_items (order_id, url, domain_rating, traffic, anchor_text) 
        VALUES ?
      `, [values]);
    }

    // Update Order Status
    await pool.query(`UPDATE backlink_orders SET status = 'processing' WHERE order_id = ?`, [orderId]);

    res.json({ success: true, message: 'Backlink report updated successfully' });
  } catch (error) {
    console.error('Error submitting backlinks:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Client: Fetch Report
const getBacklinkReport = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [orders] = await pool.query(`SELECT * FROM backlink_orders WHERE order_id = ?`, [orderId]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });

    const [links] = await pool.query(`SELECT * FROM backlink_items WHERE order_id = ? ORDER BY domain_rating DESC`, [orderId]);

    // Calculate overall score based on links
    let score = 0;
    links.forEach(link => {
      // Example scoring: DR * 2 + (Traffic / 100)
      score += (link.domain_rating * 2) + Math.floor(link.traffic / 100);
    });

    res.json({ 
      success: true, 
      data: {
        order: orders[0],
        links: links,
        total_links: links.length,
        backlink_score: score
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBacklinkOrder, submitBacklinkReport, getBacklinkReport };