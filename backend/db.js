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
    if (!fs.existsSync(this.file)) {
      const initialData = { users: {} };
      fs.writeFileSync(this.file, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    return JSON.parse(fs.readFileSync(this.file, 'utf8'));
  }

  saveData() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  getUserProducts(userId) {
    return this.data.users[userId]?.products || [];
  }

  addUserProduct(userId, productData) {
    if (!this.data.users[userId]) {
      this.data.users[userId] = { id: userId, name: userId, products: [] };
    }
    
    const newProduct = {
      id: Date.now().toString(),
      name: productData.name,
      marketplace: productData.marketplace,
      url: productData.url,
      currentPrice: productData.currentPrice,
      previousPrice: productData.currentPrice,
      changePercent: 0,
      trend: 'stable',
      addedAt: new Date().toISOString()
    };
    
    this.data.users[userId].products.unshift(newProduct);
    this.saveData();
    return newProduct;
  }

  deleteUserProduct(userId, productId) {
    if (this.data.users[userId]) {
      this.data.users[userId].products = 
        this.data.users[userId].products.filter(p => p.id !== productId);
      this.saveData();
      return true;
    }
    return false;
  }

  getProductById(userId, productId) {
    const user = this.data.users[userId];
    return user?.products.find(p => p.id === productId) || null;
  }

  updateProductPrice(userId, productId, newPrice) {
    const user = this.data.users[userId];
    if (user) {
      const product = user.products.find(p => p.id === productId);
      if (product) {
        product.previousPrice = product.currentPrice;
        product.currentPrice = newPrice;
        product.changePercent = ((newPrice - product.previousPrice) / product.previousPrice * 100).toFixed(1);
        product.trend = newPrice > product.previousPrice ? 'up' : newPrice < product.previousPrice ? 'down' : 'stable';
        product.updatedAt = new Date().toISOString();
        this.saveData();
        return product;
      }
    }
    return null;
  }
}

module.exports = new Database();
