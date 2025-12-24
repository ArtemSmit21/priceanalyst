import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

const dbPath = path.join(__dirname, 'priceanalyst.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    marketplace TEXT,
    current_price INTEGER,
    previous_price INTEGER,
    change_percent REAL,
    trend TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    timestamp TEXT,
    price INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    product_id TEXT,
    condition TEXT,
    threshold INTEGER,
    is_active INTEGER DEFAULT 1
  )`);
});

// Insert demo data
db.serialize(() => {
  const demoProducts = [
    ['1', 'demo-user', 'Apple AirPods Pro 2nd Gen USB-C', 'Wildberries', 19990, 22990, -13.1, 'down', new Date().toISOString()],
    ['2', 'demo-user', 'Samsung Galaxy S24 Ultra 256GB', 'Ozon', 89990, 94990, -5.3, 'down', new Date().toISOString()],
    ['3', 'demo-user', 'MacBook Air M2 13" 16GB 512GB', 'Яндекс Маркет', 124990, 119990, 4.2, 'up', new Date().toISOString()],
    ['4', 'demo-user', 'Sony WH-1000XM5 Wireless', 'Wildberries', 28990, 29990, -3.3, 'down', new Date().toISOString()],
    ['5', 'demo-user', 'iPhone 15 Pro Max 256GB Natural Titanium', 'M.Video', 119990, 119990, 0, 'stable', new Date().toISOString()],
    ['6', 'demo-user', 'ASUS ROG Strix G16 RTX 4070', 'DNS', 159990, 169990, -5.8, 'down', new Date().toISOString()]
  ];

  db.run('DELETE FROM products WHERE user_id = ?', ['demo-user'], function(err) {
    if (err) console.error(err);
    
    demoProducts.forEach(product => {
      db.run(
        `INSERT OR REPLACE INTO products 
         (id, user_id, name, marketplace, current_price, previous_price, change_percent, trend, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product
      );
    });
  });
});

app.get('/api/products/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(
    'SELECT * FROM products WHERE user_id = ? ORDER BY current_price ASC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  db.get(
    'SELECT * FROM products WHERE id = ?',
    [productId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) return res.status(404).json({ error: 'Product not found' });
      res.json(row);
    }
  );
});

app.get('/api/products/:productId/prices', (req, res) => {
  const { productId } = req.params;
  db.all(
    'SELECT timestamp as date, price FROM prices WHERE product_id = ? ORDER BY timestamp DESC LIMIT 30',
    [productId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.get('/api/products/:productId/statistics', (req, res) => {
  const { productId } = req.params;
  db.get(
    `SELECT 
      MIN(price) as min, 
      MAX(price) as max, 
      ROUND(AVG(price), 0) as avg 
     FROM prices WHERE product_id = ?`,
    [productId],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(row || { min: 0, max: 0, avg: 0 });
    }
  );
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Demo data loaded for user 'demo-user'`);
});
