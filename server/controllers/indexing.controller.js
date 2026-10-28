const { pool } = require('../config/db');
const crypto = require('crypto');
const { submitToRapidIndexer } = require('../services/rapidIndexer.service');

const createIndexingOrder = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user ID found' });
    }

    const { 
      packageId, packageName, totalPrice, 
      website, property, propertyType, sitemap, urls, 
      locale, priority, trackingDays, frequency, notes,
      paymentIntentId, engine = 'google'
    } = req.body;

    if (!urls || urls.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one URL' });
    }

    const safeWebsite = website || property || 'N/A';
    const safeProperty = property || website || 'N/A';
    const safePropertyType = propertyType || 'Domain';
    const safeSitemap = sitemap || null;
    const safeNotes = notes || '';
    const safeLocale = locale || 'United States · English';
    const safePriority = priority || 'Standard';
    const safeTrackingDays = trackingDays || '30';
    const safeFrequency = frequency || 'Weekly';

    const orderId = `GIDX-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const urlsJson = JSON.stringify(urls);

    const query = `
      INSERT INTO google_indexing_orders 
      (user_id, order_id, package_id, package_name, total_price, website, property, property_type, sitemap, urls, total_urls, locale, priority, tracking_days, frequency, notes, payment_intent_id, engine) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId, orderId, packageId, packageName, totalPrice, 
      safeWebsite, safeProperty, safePropertyType, safeSitemap, urlsJson, urls.length, 
      safeLocale, safePriority, safeTrackingDays, safeFrequency, safeNotes,
      paymentIntentId, engine
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { id: result.insertId, orderId, status: 'pending' }
    });
  } catch (error) {
    console.error('--- DATABASE INSERT ERROR ---');
    console.error('Error Message:', error.message);
    console.error('SQL Error Code:', error.code);
    console.error('-----------------------------');
    
    res.status(500).json({ success: false, message: 'Server error while creating order' });
  }
};

const getIndexingOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin'; 

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user ID found' });
    }

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
    const { status, engine = 'google' } = req.body;
    const { id } = req.params;

    console.log(`[Backend] Updating order ${id} to status: ${status} for engine: ${engine}`);

    const [result] = await pool.query(
      'UPDATE google_indexing_orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status === 'processing') {
      console.log(`[Backend] Fetching URLs for order ${id}`);
      
      const [rows] = await pool.query('SELECT urls FROM google_indexing_orders WHERE id = ?', [id]);
      
      if (rows.length > 0) {
        const urls = typeof rows[0].urls === 'string' ? JSON.parse(rows[0].urls) : rows[0].urls;
        console.log(`[Backend] Sending URLs to Rapid Indexer:`, urls);
        
        const isSuccess = await submitToRapidIndexer(id, urls, engine);
        console.log(`[Backend] Rapid Indexer Result for order ${id}:`, isSuccess ? 'Success' : 'Failed');
      } else {
        console.log(`[Backend] No URLs found for order ${id}`);
      }
    }

    res.status(200).json({ success: true, message: 'Status updated and indexing triggered.' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch Indexing, Ranking, ChatGPT, AND Gemini orders for the user
const getAllProjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    // 1. Fetch Indexing Orders
    const [indexingOrders] = await pool.query(
      "SELECT *, 'indexing' as type FROM google_indexing_orders WHERE user_id = ?",
      [userId]
    );

    // 2. Fetch Ranking Orders
    const [rankingOrders] = await pool.query(
      "SELECT *, 'ranking' as type FROM ranking_orders WHERE user_id = ?",
      [userId]
    );

    // 3. Fetch ChatGPT Orders
    const [chatgptOrders] = await pool.query(
      "SELECT *, 'chatgpt' as type FROM chatgpt_orders WHERE user_id = ?",
      [userId]
    );

    // 👇 4. Fetch Gemini Orders
    const [geminiOrders] = await pool.query(
      "SELECT *, 'gemini' as type FROM gemini_orders WHERE user_id = ?",
      [userId]
    );

    // Format Indexing
    const formattedIndexing = indexingOrders.map(row => ({
      ...row,
      urls: typeof row.urls === 'string' ? JSON.parse(row.urls) : row.urls,
      createdAt: row.created_at,
      projectName: row.engine === 'bing' ? 'Bing Indexing' : 'Google Indexing'
    }));

    // Format Ranking
    const formattedRanking = rankingOrders.map(row => ({
      ...row,
      keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
      createdAt: row.created_at,
      projectName: 'Google Ranking'
    }));

    // Format ChatGPT
    const formattedChatgpt = chatgptOrders.map(row => ({
      ...row,
      prompts: typeof row.prompts === 'string' ? JSON.parse(row.prompts) : row.prompts,
      createdAt: row.created_at,
      projectName: 'ChatGPT Visibility'
    }));

    // 👇 Format Gemini
    const formattedGemini = geminiOrders.map(row => ({
      ...row,
      prompts: typeof row.prompts === 'string' ? JSON.parse(row.prompts) : row.prompts,
      createdAt: row.created_at,
      projectName: 'Gemini Visibility'
    }));

    // Combine all and sort by newest
    const allProjects = [...formattedIndexing, ...formattedRanking, ...formattedChatgpt, ...formattedGemini].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, data: allProjects });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createIndexingOrder,
  getIndexingOrders,
  updateOrderStatus,
  getAllProjects
};