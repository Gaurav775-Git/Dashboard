const mysql = require('mysql2/promise');
require('dotenv').config();

function buildConfig() {
  if (process.env.DB_URI) {
    const u = new URL(process.env.DB_URI);
    return {
      host: u.hostname,
      port: Number(u.port) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace('/', '') || 'defaultdb',
    };
  }
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const pool = mysql.createPool({
  ...buildConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  // Aiven requires SSL
  ssl: process.env.DB_CA
    ? { ca: process.env.DB_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('MySQL connected, users table ready');
}

module.exports = { pool, initDb };