const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.file = path.join(__dirname, 'data', 'users.json');
    this.ensureDataDir();
    this.data = this.loadData();
  }

  ensureDataDir() {
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (!fs.existsSync(this.file)) {
        const initialData = {};
        fs.writeFileSync(this.file, JSON.stringify(initialData, null, 2));
        return initialData;
      }
      return JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch (error) {
      console.error('❌ DB load error:', error.message);
      return {};
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('❌ DB save error:', error.message);
    }
  }

  getUserProducts(userId) {
    return this.data[userId]?.products || [];
  }

  addUserProduct(userId, productData) {
    if (!this.data[userId]) {
      this.data[userId] = { 
        username: userId, 
        products: [] 
      };
    }

    const existingProduct = this.data[userId].products.find(p => p.url === productData.url);
    if (existingProduct) {
      console.log(`⏭️ Дубликат: ${productData.name}`);
      existingProduct.currentPrice = productData.currentPrice;
      existingProduct.updatedAt = new Date().toISOString();
      this.saveData();
      return existingProduct;
    }

    const newProduct = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: productData.name || 'Без названия',
      marketplace: productData.marketplace || 'Unknown',
      url: productData.url || '',
      currentPrice: productData.currentPrice || 0,
      previousPrice: productData.currentPrice || 0,
      changePercent: 0,
      trend: 'stable',
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data[userId].products.unshift(newProduct);
    
    try {
      this.saveData();
      console.log(`✅ Добавлен товар: ${newProduct.name} → ${userId}`);
      return newProduct;
    } catch (error) {
      console.error('❌ DB SAVE ERROR:', error.message);
      return null;
    }
  }

  deleteUserProduct(userId, productId) {
    if (!this.data[userId]?.products) return false;

    const beforeLength = this.data[userId].products.length;
    this.data[userId].products = this.data[userId].products.filter(p => p.id !== productId);
    
    if (this.data[userId].products.length < beforeLength) {
      this.saveData();
      console.log(`🗑️ Удален товар: ${productId}`);
      return true;
    }
    return false;
  }

  getProductById(userId, productId) {
    const products = this.data[userId]?.products || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
      console.log(`✅ Найден товар: ${product.name}`);
      return product;
    }
    
    console.log(`❌ Товар не найден: ${productId} у ${userId}`);
    return null;
  }

  updateProductPrice(userId, productId, newPrice) {
    const products = this.data[userId]?.products || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.log(`❌ Товар для обновления не найден: ${productId}`);
      return null;
    }

    product.previousPrice = product.currentPrice || 0;
    product.currentPrice = newPrice;
    product.changePercent = product.previousPrice ? 
      ((newPrice - product.previousPrice) / product.previousPrice * 100).toFixed(1) : '0';
    product.trend = newPrice > (product.previousPrice || 0) ? 'up' : 
                   newPrice < (product.previousPrice || 0) ? 'down' : 'stable';
    product.updatedAt = new Date().toISOString();
    
    this.saveData();
    console.log(`💰 Обновлена цена: ${product.name} → ${newPrice}₽`);
    return product;
  }
}

module.exports = new Database();
