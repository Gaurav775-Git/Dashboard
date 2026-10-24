const { pool } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Fetch all orders for this user
    const [orders] = await pool.query(
      'SELECT total_urls, status, created_at FROM google_indexing_orders WHERE user_id = ? ORDER BY created_at ASC',
      [userId]
    );

    let totalUrls = 0;
    let completedUrls = 0;
    
    orders.forEach(order => {
      totalUrls += order.total_urls || 0;
      if (order.status === 'completed') {
        completedUrls += order.total_urls || 0;
      }
    });

    const visibilityScore = totalUrls > 0 ? Math.round((completedUrls / totalUrls) * 100) : 0;

    // Generate Graph Data (URLs submitted per day for the last 7 days)
    const last7Days = [];
    const graphData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days.push(dateStr);
      
      const dayTotal = orders
        .filter(o => new Date(o.created_at).toISOString().split('T')[0] === dateStr)
        .reduce((sum, o) => sum + (o.total_urls || 0), 0);
        
      graphData.push(dayTotal);
    }

    res.status(200).json({
      success: true,
      data: {
        visibilityScore,
        totalUrls,
        completedUrls,
        totalOrders: orders.length,
        graphData,
        dates: last7Days
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats };
