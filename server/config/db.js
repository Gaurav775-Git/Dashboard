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
  ssl: process.env.DB_CA
    ? { ca: process.env.DB_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
    : { rejectUnauthorized: false },
});

async function initDb() {
  // 1. Users Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Indexing Orders Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS google_indexing_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      website VARCHAR(255) NOT NULL,
      property VARCHAR(255) NOT NULL,
      property_type VARCHAR(50) NOT NULL,
      sitemap VARCHAR(255),
      urls JSON NOT NULL,
      total_urls INT NOT NULL,
      locale VARCHAR(100),
      priority VARCHAR(50),
      tracking_days VARCHAR(50),
      frequency VARCHAR(50),
      notes TEXT,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Ranking Orders Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ranking_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      engine VARCHAR(20) DEFAULT 'google',
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      website VARCHAR(255) NOT NULL,
      target_page VARCHAR(255) NOT NULL,
      keywords JSON NOT NULL,
      total_keywords INT NOT NULL,
      location VARCHAR(100),
      language VARCHAR(50),
      device VARCHAR(50),
      tracking_days VARCHAR(50),
      frequency VARCHAR(50),
      notes TEXT,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payment_intent_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 4. ChatGPT Recommendations Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chatgpt_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      website VARCHAR(255) NOT NULL,
      prompts JSON NOT NULL,
      total_prompts INT NOT NULL,
      competitors JSON,
      target_market VARCHAR(100),
      notes TEXT,
      trueranker_project_id VARCHAR(100) DEFAULT NULL,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payment_intent_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 5. Gemini Recommendations Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gemini_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      website VARCHAR(255) NOT NULL,
      prompts JSON NOT NULL,
      total_prompts INT NOT NULL,
      competitors JSON,
      target_market VARCHAR(100),
      notes TEXT,
      trueranker_project_id VARCHAR(100) DEFAULT NULL,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payment_intent_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 6. Knowledge Panel Orders Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS knowledge_panel_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      target_entity VARCHAR(255) NOT NULL,
      bio_links JSON,
      notes TEXT,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payment_intent_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 7. Knowledge Panel Reports Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS knowledge_panel_reports (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      kgid_generated BOOLEAN DEFAULT FALSE,
      kgid_url VARCHAR(255) DEFAULT NULL,
      bio_links_count INT DEFAULT 0,
      news_articles_count INT DEFAULT 0,
      wiki_articles_count INT DEFAULT 0,
      entity_score INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES knowledge_panel_orders(order_id) ON DELETE CASCADE
    )
  `);

  // 👇 8. Backlink Orders Table (NEW)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS backlink_orders (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      package_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(50) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      target_url VARCHAR(255) NOT NULL,
      notes TEXT,
      status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
      payment_intent_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 👇 9. Backlink Items Table (NEW)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS backlink_items (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      url VARCHAR(255) NOT NULL,
      domain_rating INT DEFAULT 0,
      traffic INT DEFAULT 0,
      anchor_text VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES backlink_orders(order_id) ON DELETE CASCADE
    )
  `);

  // 10. Safely Alter Tables for new columns
  
  // Alter Indexing Orders
  try {
    await pool.query(`
      ALTER TABLE google_indexing_orders 
      ADD COLUMN rapid_indexer_task_id VARCHAR(255) DEFAULT NULL,
      ADD COLUMN google_api_status VARCHAR(100) DEFAULT 'not_submitted',
      ADD COLUMN google_api_error TEXT DEFAULT NULL,
      ADD COLUMN payment_intent_id VARCHAR(255) DEFAULT NULL,
      ADD COLUMN engine VARCHAR(20) DEFAULT 'google'
    `);
    console.log('Columns added to google_indexing_orders');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      console.error('Error altering google_indexing_orders:', error.message);
    }
  }

  // Alter ChatGPT Orders
  try {
    await pool.query(`
      ALTER TABLE chatgpt_orders 
      ADD COLUMN trueranker_project_id VARCHAR(100) DEFAULT NULL,
      ADD COLUMN payment_intent_id VARCHAR(255) DEFAULT NULL
    `);
    console.log('Columns added to chatgpt_orders');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      console.error('Error altering chatgpt_orders:', error.message);
    }
  }

  // Alter Gemini Orders
  try {
    await pool.query(`
      ALTER TABLE gemini_orders 
      ADD COLUMN trueranker_project_id VARCHAR(100) DEFAULT NULL,
      ADD COLUMN payment_intent_id VARCHAR(255) DEFAULT NULL
    `);
    console.log('Columns added to gemini_orders');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      console.error('Error altering gemini_orders:', error.message);
    }
  }
  
  console.log('MySQL connected, tables ready');
}

module.exports = { pool, initDb };