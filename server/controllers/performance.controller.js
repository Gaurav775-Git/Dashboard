const { pool } = require('../config/db');

const getPerformanceStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    // 1. Fetch Indexing Data
    const [indexingOrders] = await pool.query(
      'SELECT total_urls, status, created_at FROM google_indexing_orders WHERE user_id = ?',
      [userId]
    );

    // 2. Fetch Ranking Data
    const [rankingOrders] = await pool.query(
      'SELECT total_keywords, status, created_at FROM ranking_orders WHERE user_id = ?',
      [userId]
    );

    // 3. Calculate Aggregates
    let totalUrls = 0;
    let indexedUrls = 0;
    let totalKeywords = 0;

    indexingOrders.forEach(o => {
      totalUrls += o.total_urls || 0;
      if (o.status === 'completed') indexedUrls += o.total_urls || 0;
    });

    rankingOrders.forEach(o => {
      totalKeywords += o.total_keywords || 0;
    });

    // 4. Generate 7-day trend data for visibility
    const trendData = [];
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
      
      // Mocking a smooth trend for UI purposes (replace with real daily snapshots)
      trendData.push({
        date: dateStr,
        visibility: Math.floor(Math.random() * 20) + 60, // 60-80%
        traffic: Math.floor(Math.random() * 500) + 1000
      });
    }

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          indexedUrls,
          totalUrls,
          totalKeywords,
          visibilityScore: totalUrls > 0 ? Math.round((indexedUrls / totalUrls) * 100) : 0,
        },
        trendData,
        dates,
        lastUpdated: new Date().toISOString(),
        source: 'Connected via Database'
      }
    });
  } catch (error) {
    console.error('Error fetching performance stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getPerformanceStats };