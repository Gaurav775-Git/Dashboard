const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users');
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;