const { pool } = require('../config/db');

const RAPID_INDEXER_API_KEY = process.env.RAPID_INDEXER_API_KEY;
const RAPID_INDEXER_URL = 'https://rapid-indexer.com/api/v1/index.php?action=create_task';

async function submitToRapidIndexer(orderId, urls, engine = 'google') {
  try {
    console.log(`[Rapid Indexer] Sending request for Order ID: ${orderId} to ${engine}`);
    
    if (!RAPID_INDEXER_API_KEY) {
      throw new Error("RAPID_INDEXER_API_KEY is missing in .env");
    }

    const response = await fetch(RAPID_INDEXER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': RAPID_INDEXER_API_KEY
      },
      body: JSON.stringify({
        urls: urls,
        type: 'indexer',
        engine: engine
      })
    });

    const data = await response.json();
    console.log(`[Rapid Indexer] API Response:`, data);

    if (data.success) {
      await pool.query(
        'UPDATE google_indexing_orders SET rapid_indexer_task_id = ?, google_api_status = ? WHERE id = ?',
        [data.task_id || data.data?.task_id, 'submitted', orderId]
      );
      return true;
    } else {
      throw new Error(data.message || 'Rapid Indexer submission failed');
    }
  } catch (error) {
    console.error(`[Rapid Indexer] Failed for order ${orderId}:`, error.message);
    
    await pool.query(
      'UPDATE google_indexing_orders SET google_api_status = ?, google_api_error = ? WHERE id = ?',
      ['failed', error.message, orderId]
    );
    return false;
  }
}

module.exports = { submitToRapidIndexer };