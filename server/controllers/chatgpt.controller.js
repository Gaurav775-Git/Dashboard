const { pool } = require('../config/db'); 
const crypto = require('crypto');
const { getAiVisibility } = require('../services/trueranker.service'); 

const createChatGptOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { packageId, packageName, totalPrice, website, prompts, competitors, targetMarket, notes, paymentIntentId, truerankerProjectId } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one prompt' });
    }

    const orderId = `CGPT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const promptsJson = JSON.stringify(prompts);
    const competitorsJson = JSON.stringify(competitors || []);

    const query = `
      INSERT INTO chatgpt_orders 
      (user_id, order_id, package_id, package_name, total_price, website, prompts, total_prompts, competitors, target_market, notes, payment_intent_id, trueranker_project_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId, orderId, packageId, packageName, totalPrice, 
      website, promptsJson, prompts.length, competitorsJson, targetMarket, notes, paymentIntentId, truerankerProjectId || null
    ];

    await pool.query(query, values);

    res.status(201).json({ success: true, message: 'ChatGPT campaign created', data: { orderId } });
  } catch (error) {
    console.error('Error creating ChatGPT order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getChatGptTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const [rows] = await pool.query('SELECT trueranker_project_id FROM chatgpt_orders WHERE order_id = ?', [orderId]);
    
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!rows[0].trueranker_project_id) return res.status(400).json({ success: false, message: 'Project not synced with TrueRanker yet.' });

    const trData = await getAiVisibility(rows[0].trueranker_project_id);
    res.status(200).json({ success: true, data: trData });
  } catch (error) {
    console.error('Error fetching tracking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 👇 NEW ADMIN ACTION FUNCTION
const submitChatGptToTrueRanker = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trueranker_project_id } = req.body;

    if (!trueranker_project_id) {
      return res.status(400).json({ success: false, message: 'TrueRanker Project ID is required' });
    }

    // Update DB: set the project ID and change status to processing
    const [result] = await pool.query(
      `UPDATE chatgpt_orders 
       SET trueranker_project_id = ?, status = 'processing' 
       WHERE order_id = ?`,
      [trueranker_project_id, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Optional: Do a quick test fetch to ensure the API key and Project ID are valid
    try {
      await getAiVisibility(trueranker_project_id);
    } catch (apiError) {
      console.warn("TrueRanker API warning during submission:", apiError.message);
    }

    res.status(200).json({ success: true, message: 'Order successfully linked to TrueRanker' });
  } catch (error) {
    console.error('Error submitting to TrueRanker:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { 
  createChatGptOrder, 
  getChatGptTracking,
  submitChatGptToTrueRanker 
};