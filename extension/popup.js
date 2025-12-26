document.addEventListener('DOMContentLoaded', async () => {
  const addBtn = document.getElementById('add');
  const statusEl = document.getElementById('status');
  
  statusEl.innerHTML = '⏳ Ждем SPA загрузки...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: universalSpaParser
    });
    
    const product = results[0].result;
    
    if (product.price && product.price > 100) {
      statusEl.innerHTML = `
        💰 <strong>${product.price.toLocaleString()} ₽</strong><br>
        🏪 <strong>${product.marketplace}</strong><br>
        📄 ${product.name.substring(0, 40)}...
      `;
      addBtn.style.display = 'block';
      addBtn.onclick = () => addProduct(product);
    } else {
      statusEl.innerHTML = `
        ❌ Цена не найдена<br>
        <small>Подожди полной загрузки или обнови страницу</small>
      `;
    }
  } catch (error) {
    statusEl.innerHTML = `❌ ${error.message}`;
  }
});

function universalSpaParser() {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 100;

    const findPrice = () => {
      attempts++;
      const url = window.location.href;
      
      if (url.includes('wildberries.ru/catalog') && url.includes('detail.aspx')) {
        const allElements = Array.from(document.querySelectorAll('*'));
        for (let el of allElements) {
          const text = (el.textContent || el.innerText || '').trim();
          const priceMatch = text.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/i);
          if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(/\s/g, ''));
            if (price > 100 && price < 1000000) {
              return resolve({
                price,
                marketplace: 'Wildberries',
                url,
                name: document.title.replace(/[-—].*/, '').trim()
              });
            }
          }
        }
      }
      
      if (url.includes('ozon.ru/product')) {
        const selectors = [
          '[data-qa="product-price"]',
          '[class*="price"]',
          '.oe9q70a',
          '.css-1xx17dy'
        ];
        
        for (let selector of selectors) {
          const els = document.querySelectorAll(selector);
          for (let el of els) {
            const text = (el.textContent || el.innerText || '').trim();
            const priceMatch = text.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/i);
            if (priceMatch) {
              const price = parseInt(priceMatch[1].replace(/\s/g, ''));
              if (price > 100 && price < 1000000) {
                return resolve({
                  price,
                  marketplace: 'Ozon',
                  url,
                  name: document.title.split('|')[0]?.trim() || document.title
                });
              }
            }
          }
        }
        
        const allElements = Array.from(document.querySelectorAll('*'));
        for (let el of allElements) {
          const text = (el.textContent || el.innerText || '').trim();
          const priceMatch = text.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/i);
          if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(/\s/g, ''));
            if (price > 100 && price < 1000000) {
              return resolve({
                price,
                marketplace: 'Ozon',
                url,
                name: document.title.split('|')[0]?.trim() || document.title
              });
            }
          }
        }
      }
      
      if (attempts < maxAttempts) {
        setTimeout(findPrice, 100);
      } else {
        resolve({ price: null, marketplace: 'Timeout', url });
      }
    };

    const observer = new MutationObserver(findPrice);
    observer.observe(document.body, { childList: true, subtree: true });
    
    setTimeout(findPrice, 2000);
  });
}

async function addProduct(product) {
  const statusEl = document.getElementById('status');
  const userId = 'demo-user';
  
  try {
    const response = await fetch(`http://localhost:4000/api/products/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        marketplace: product.marketplace,
        currentPrice: product.price,
        previousPrice: product.price * 1.1,
        changePercent: 0,
        url: product.url
      })
    });
    
    const result = await response.json();
    statusEl.innerHTML = result.success 
      ? `✅ <strong>${product.name.substring(0,30)}...</strong><br>💰 ${product.price}₽<br>🔄 Обнови localhost:3000`
      : `❌ ${result.error}`;
  } catch (error) {
    statusEl.innerHTML = `❌ Backend: ${error.message}`;
  }
}
