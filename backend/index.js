const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'priceanalyst-2026-secret';

app.use(cors());
app.use(express.json());

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен обязателен' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Неверный токен' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password || password.length < 3) {
    return res.status(400).json({ error: 'Логин и пароль (минимум 3 символа) обязательны' });
  }
  
  const usersFile = path.join(__dirname, 'data', 'users.json');
  let users;
  
  try {
    const data = await fs.readFile(usersFile, 'utf8');
    users = JSON.parse(data);
  } catch {
    users = {};
  }
  
  if (users[username]) {
    return res.status(400).json({ error: 'Пользователь уже существует' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = {
    username,
    password: hashedPassword,
    products: []
  };
  
  await fs.mkdir(path.dirname(usersFile), { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { username } });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const usersFile = path.join(__dirname, 'data', 'users.json');
  
  let users;
  try {
    const data = await fs.readFile(usersFile, 'utf8');
    users = JSON.parse(data);
  } catch {
    return res.status(401).json({ error: 'Пользователи не найдены' });
  }
  
  const user = users[username];
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { username } });
});

app.get('/api/products/:username', authMiddleware, async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: 'Нет доступа к чужим товарам' });
  }
  const products = db.getUserProducts(req.params.username);
  res.json(products);
});

app.post('/api/products/:username', authMiddleware, async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: 'Нет доступа' });
  }
  const newProduct = db.addUserProduct(req.params.username, req.body);
  if (newProduct) {
    console.log('✅ Frontend: Новый товар:', newProduct.name);
    res.json({ success: true, product: newProduct });
  } else {
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

app.get('/api/products/:username/:productId', authMiddleware, async (req, res) => {
  console.log(`🔍 Карточка: ${req.params.username}/${req.params.productId}`);
  
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: 'Нет доступа' });
  }
  
  const product = db.getProductById(req.params.username, req.params.productId);
  if (product) {
    console.log(`✅ Найден: ${product.name}`);
    res.json(product);
  } else {
    console.log(`❌ НЕ НАЙДЕН: ${req.params.productId}`);
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.delete('/api/products/:username/:productId', authMiddleware, async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: 'Нет доступа' });
  }
  const success = db.deleteUserProduct(req.params.username, req.params.productId);
  if (success) {
    console.log('🗑️ Frontend: Товар удален:', req.params.productId);
  }
  res.json({ success });
});

app.post('/api/guest/products/:username', async (req, res) => {
  const newProduct = db.addUserProduct(req.params.username, req.body);
  if (newProduct) {
    console.log(`✅ Extension: Новый товар: ${newProduct.name} (${req.params.username})`);
    res.json({ success: true, product: newProduct });
  } else {
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

app.post('/api/guest/products/:username/:productId/price', async (req, res) => {
  const { price } = req.body;
  if (!price || price < 10) {
    return res.status(400).json({ error: 'Некорректная цена' });
  }
  
  const updated = db.updateProductPrice(req.params.username, req.params.productId, price);
  if (updated) {
    console.log(`💰 Extension: ${updated.name} → ${price}₽ (${updated.changePercent}%)`);
    res.json({ success: true, product: updated });
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.post('/api/parse-price', async (req, res) => {
  const { url } = req.body;
  console.log('🌐 Парсим URL:', url.split('?')[0]);
  
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url.split('?')[0])}`;
    const response = await fetch(proxyUrl);
    const html = await response.text();
    
    const priceMatch = html.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(/\s/g, ''));
      if (price > 100) {
        console.log(`✅ ЦЕНА: ${price}₽`);
        return res.json({ success: true, price });
      }
    }
    res.json({ success: false, error: 'Не найдено' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

setInterval(async () => {
  console.log('🕐 CRON: Обновляем цены...');
  const usersFile = path.join(__dirname, 'data', 'users.json');
  
  try {
    const data = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(data);
    
    for (const [username, user] of Object.entries(users)) {
      for (const product of user.products || []) {
        if (product.url) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(product.url, {
              headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
              },
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const html = await response.text();
            const match = html.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/);
            
            if (match) {
              const newPrice = parseInt(match[1].replace(/\s/g, ''));
              if (newPrice > 100 && newPrice !== product.currentPrice) {
                db.updateProductPrice(username, product.id, newPrice);
                console.log(`✅ CRON ${username}/${product.name}: ${newPrice}₽`);
              }
            }
          } catch (error) {
            // Тихо пропускаем ошибки парсинга
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  } catch (error) {
    console.log('❌ CRON:', error.message);
  }
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log('🚀 Backend: http://localhost:4000');
  console.log('✅ Auth(Frontend) + Guest(Extension) + Парсер + Cron');
});
