const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/products/:userId', (req, res) => {
  const products = db.getUserProducts(req.params.userId);
  res.json(products);
});

app.post('/api/products/:userId', (req, res) => {
  try {
    const newProduct = db.addUserProduct(req.params.userId, req.body);
    console.log('✅ Новый товар:', newProduct.name);
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:userId/:productId', (req, res) => {
  const success = db.deleteUserProduct(req.params.userId, req.params.productId);
  if (success) {
    console.log('🗑️ Товар удален:', req.params.productId);
  }
  res.json({ success });
});

app.get('/api/products/:userId/:productId', (req, res) => {
  const product = db.getProductById(req.params.userId, req.params.productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.post('/api/products/:userId/:productId/price', (req, res) => {
  const { price } = req.body;
  if (!price || price < 10) {
    return res.status(400).json({ error: 'Некорректная цена' });
  }
  
  const updated = db.updateProductPrice(req.params.userId, req.params.productId, price);
  if (updated) {
    console.log(`💰 Цена обновлена: ${updated.name} → ${price}₽ (${updated.changePercent}%)`);
    res.json({ success: true, product: updated });
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.post('/api/parse-price', async (req, res) => {
  const { url } = req.body;
  console.log('🌐 Парсим чистый URL:', url.split('?')[0]);
  
  // ИМБА: используем cloudflare bypass
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url.split('?')[0])}`;
  
  try {
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
  console.log('🕐 CRON: Обновляем все цены...');
  const products = db.getUserProducts('demo-user');
  
  for (const product of products) {
    try {
      const response = await fetch(product.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      const match = html.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/);
      
      if (match) {
        const newPrice = parseInt(match[1].replace(/\s/g, ''));
        if (newPrice > 100 && newPrice !== product.currentPrice) {
          db.updateProductPrice('demo-user', product.id, newPrice);
          console.log(`✅ CRON ${product.name}: ${newPrice}₽`);
        }
      }
    } catch (error) {
      console.log(`❌ CRON ${product.name}: ошибка`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}, 5 * 60 * 1000);

app.listen(4000, () => {
  console.log('🚀 Backend: http://localhost:4000');
  console.log('✅ Extension + Frontend + Парсер + Cron готовы!');
});
