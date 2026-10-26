const { pool } = require('../config/db');

const getReports = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    // Fetch all completed/active projects to generate reports
    const [indexing] = await pool.query(
      "SELECT order_id, website, package_name, total_price, status, created_at, 'Google Indexing' as service_type FROM google_indexing_orders WHERE user_id = ?",
      [userId]
    );

    const [ranking] = await pool.query(
      "SELECT order_id, website, package_name, total_price, status, created_at, 'Google Ranking' as service_type FROM ranking_orders WHERE user_id = ?",
      [userId]
    );

    const allReports = [...indexing, ...ranking].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.status(200).json({ success: true, data: allReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const downloadReport = async (req, res) => {
  try {
    const { orderId } = req.params;
    // In a real app, you would generate a PDF or CSV here using a library like pdfkit or json2csv
    // For now, we simulate a successful download response
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report-${orderId}.csv`);
    
    const csvContent = "Metric,Value\nStatus,Completed\nPerformance,Good\nDate," + new Date().toISOString();
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

module.exports = { getReports, downloadReport };