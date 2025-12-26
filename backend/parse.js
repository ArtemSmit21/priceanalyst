const puppeteer = require('puppeteer');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

async function parsePrice(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wildberries
    let price = await page.evaluate(() => {
      let el = document.querySelector('[data-testid="price-current"]') || 
               document.querySelector('.price-block__final-price');
      return el ? parseInt(el.textContent.replace(/[^\d]/g, '')) : null;
    });
    
    if (!price) {
      // Ozon
      price = await page.evaluate(() => {
        let el = document.querySelector('[data-qa="product-price"]') || 
                 document.querySelector('.oe9q70a');
        return el ? parseInt(el.textContent.replace(/[^\d]/g, '')) : null;
      });
    }
    
    if (!price) {
      // Yandex Market
      price = await page.evaluate(() => {
        let el = document.querySelector('.VNRxI') || 
                 document.querySelector('[data-auto="mainPriceBlock"]');
        return el ? parseInt(el.textContent.replace(/[^\d]/g, '')) : null;
      });
    }
    
    await browser.close();
    return price;
    
  } catch (error) {
    await browser.close();
    console.error('Ошибка парсинга:', error);
    return null;
  }
}

async function updateProductPrice(productId) {
  const product = db.findProductById(productId);
  if (!product) return;
  
  console.log(`🔄 Парсим ${product.name}: ${product.url}`);
  const newPrice = await parsePrice(product.url);
  
  if (newPrice) {
    product.currentPrice = newPrice;
    product.updatedAt = new Date().toISOString();
    product.previousPrice = product.currentPrice;
    db.write();
    console.log(`✅ ${product.name}: ${newPrice}₽`);
  }
}

async function parseAllProducts() {
  console.log('🚀 Запуск парсера цен...');
  const users = db.getAllUsers();
  
  for (const user of Object.values(users)) {
    for (const product of user.products) {
      await updateProductPrice(product.id);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log('✅ Парсинг завершен!');
}

parseAllProducts();
