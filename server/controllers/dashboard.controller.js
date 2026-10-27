const { pool } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    // 1. Fetch Indexing
    const [indexing] = await pool.query(
      `SELECT id, order_id, website, total_urls, status, created_at, 'indexing' as type 
       FROM google_indexing_orders WHERE user_id = ?`, 
      [userId]
    );

    // 2. Fetch Ranking
    const [ranking] = await pool.query(
      `SELECT id, order_id, target_page as website, total_keywords, status, created_at, 'ranking' as type 
       FROM ranking_orders WHERE user_id = ?`, 
      [userId]
    );

    // 3. Fetch ChatGPT
    const [chatgpt] = await pool.query(
      `SELECT id, order_id, website, total_prompts, status, created_at, 'chatgpt' as type 
       FROM chatgpt_orders WHERE user_id = ?`, 
      [userId]
    );

    const allOrders = [...indexing, ...ranking, ...chatgpt];

    // Stats Calculation
    let totalUrls = 0;
    let completedUrls = 0;
    
    indexing.forEach(order => {
      const urls = order.total_urls || 0;
      totalUrls += urls;
      if (order.status === 'completed') completedUrls += urls;
    });

    const visibilityScore = totalUrls > 0 ? Math.round((completedUrls / totalUrls) * 100) : 0;

    // Graph Data
    const last7Days = [];
    const graphData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days.push(dateStr);
      
      const dayTotal = indexing
        .filter(o => new Date(o.created_at).toISOString().split('T')[0] === dateStr)
        .reduce((sum, o) => sum + (o.total_urls || 0), 0);
      graphData.push(dayTotal);
    }

    // Sort and Slice Recent Projects
    const recentProjects = allOrders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        visibilityScore,
        totalUrls,
        completedUrls,
        totalOrders: allOrders.length,
        graphData,
        dates: last7Days,
        recentProjects 
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats };