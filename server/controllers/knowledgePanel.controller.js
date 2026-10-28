const { pool } = require('../config/db');
const crypto = require('crypto'); 

// 1. Client: Create a new Knowledge Panel Order
const createKnowledgePanelOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { packageId, packageName, totalPrice, targetEntity, bioLinks, notes, paymentIntentId } = req.body;

    // Fallback in case generic form sends 'target' instead of 'targetEntity'
    const finalTargetEntity = targetEntity || req.body.target; 

    if (!finalTargetEntity) {
      return res.status(400).json({ success: false, message: 'Target entity name is required' });
    }

    const orderId = `KPNL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const bioLinksJson = JSON.stringify(bioLinks || []);

    const query = `
      INSERT INTO knowledge_panel_orders 
      (user_id, order_id, package_id, package_name, total_price, target_entity, bio_links, notes, payment_intent_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [userId, orderId, packageId, packageName, totalPrice, finalTargetEntity, bioLinksJson, notes, paymentIntentId]);

    // Initialize an empty report row for this order
    await pool.query(`INSERT INTO knowledge_panel_reports (order_id) VALUES (?)`, [orderId]);

    res.status(201).json({ success: true, message: 'Knowledge Panel order created', data: { orderId } });
  } catch (error) {
    console.error('Error creating KP order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Admin: Submit/Update the report and calculate score
const submitKnowledgePanelReport = async (req, res) => {
  const { orderId } = req.params;
  const { 
    kgid_generated, kgid_url, 
    bio_links_count, news_articles_count, wiki_articles_count 
  } = req.body;

  // Scoring Logic (Adjust weights as needed)
  let score = 0;
  score += (bio_links_count || 0) * 10;
  score += (news_articles_count || 0) * 20;
  score += (wiki_articles_count || 0) * 50;
  if (kgid_generated) score += 100; 

  try {
    // Upsert the report
    await pool.query(`
      INSERT INTO knowledge_panel_reports 
      (order_id, kgid_generated, kgid_url, bio_links_count, news_articles_count, wiki_articles_count, entity_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      kgid_generated = VALUES(kgid_generated),
      kgid_url = VALUES(kgid_url),
      bio_links_count = VALUES(bio_links_count),
      news_articles_count = VALUES(news_articles_count),
      wiki_articles_count = VALUES(wiki_articles_count),
      entity_score = VALUES(entity_score)
    `, [orderId, kgid_generated, kgid_url, bio_links_count, news_articles_count, wiki_articles_count, score]);

    // Update the main order status to processing
    await pool.query(`UPDATE knowledge_panel_orders SET status = 'processing' WHERE order_id = ?`, [orderId]);

    res.json({ success: true, message: 'Report updated successfully', score });
  } catch (error) {
    console.error('Error submitting KP report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Client: Fetch the report for the tracking page
const getKnowledgePanelReport = async (req, res) => {
  const { orderId } = req.params;
  try {
    // Fetch order details
    const [orders] = await pool.query(`SELECT * FROM knowledge_panel_orders WHERE order_id = ?`, [orderId]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });

    // Fetch report details
    const [reports] = await pool.query(`SELECT * FROM knowledge_panel_reports WHERE order_id = ?`, [orderId]);

    res.json({ 
      success: true, 
      data: {
        order: orders[0],
        report: reports[0] || {} 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 👇 CRITICAL FIX: Export all three functions
module.exports = { 
  createKnowledgePanelOrder, 
  submitKnowledgePanelReport, 
  getKnowledgePanelReport 
};