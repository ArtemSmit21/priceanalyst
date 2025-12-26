const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/products/:userId', (req, res) => {
  res.json([
    { id: '1', name: 'Apple AirPods Pro 2', marketplace: 'Wildberries', currentPrice: 19990, previousPrice: 22990, changePercent: -13.1, trend: 'down' },
    { id: '2', name: 'Samsung Galaxy S24 Ultra', marketplace: 'Ozon', currentPrice: 89990, previousPrice: 94990, changePercent: -5.3, trend: 'down' },
    { id: '3', name: 'MacBook Air M2 13"', marketplace: 'Яндекс Маркет', currentPrice: 124990, previousPrice: 119990, changePercent: 4.2, trend: 'up' },
    { id: '4', name: 'Sony WH-1000XM5', marketplace: 'Wildberries', currentPrice: 28990, previousPrice: 29990, changePercent: -3.3, trend: 'down' },
    { id: '5', name: 'iPhone 15 Pro Max', marketplace: 'M.Video', currentPrice: 119990, previousPrice: 119990, changePercent: 0, trend: 'stable' },
    { id: '6', name: 'ASUS ROG Strix G16', marketplace: 'DNS', currentPrice: 159990, previousPrice: 169990, changePercent: -5.8, trend: 'down' }
  ]);
});

app.get('/api/products/:id', (req, res) => {
  res.json({ 
    id: req.params.id, 
    name: 'Apple AirPods Pro 2', 
    currentPrice: 19990,
    previousPrice: 22990,
    changePercent: -13.1,
    marketplace: 'Wildberries'
  });
});

app.get('/api/products/:id/prices', (req, res) => {
  res.json([
    { date: '2025-12-20', price: 22990 },
    { date: '2025-12-21', price: 22500 },
    { date: '2025-12-22', price: 21000 },
    { date: '2025-12-23', price: 19990 },
    { date: '2025-12-24', price: 19990 }
  ]);
});

app.get('/api/products/:id/statistics', (req, res) => {
  res.json({ min: 19990, max: 22990, avg: 21290 });
});

app.listen(4000, () => {
  console.log('🚀 Backend: http://localhost:4000');
  console.log('✅ API готово!');
});
