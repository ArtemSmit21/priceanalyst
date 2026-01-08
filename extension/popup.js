document.addEventListener('DOMContentLoaded', async () => {
  const userInput = document.getElementById('user-input');
  const addBtn = document.getElementById('add-btn');
  const statusEl = document.getElementById('status');
  
  userInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
      const username = userInput.value.trim();
      if (username) {
        selectUser(username);
      }
    }
  };
  
  await parseCurrentPage();
});

let currentProduct = null;
let selectedUsername = '';

function selectUser(username) {
  selectedUsername = username;
  document.getElementById('user-input').value = username;
  document.getElementById('add-btn').disabled = !currentProduct;
  
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = `
    👤 <strong>${username}</strong> выбран<br>
    ${currentProduct ? `💰 Готово к сохранению` : 'WB/Ozon товар'}
  `;
}

async function parseCurrentPage() {
  const statusEl = document.getElementById('status');
  const addBtn = document.getElementById('add-btn');
  
  statusEl.innerHTML = '🔍 Ищем цену...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: universalSpaParser
    });
    
    currentProduct = results[0].result;
    
    if (currentProduct && currentProduct.price && currentProduct.price > 100) {
      statusEl.innerHTML = `
        <div class="price">${currentProduct.price.toLocaleString()} ₽</div>
        <div class="marketplace">${currentProduct.marketplace}</div>
        <div>${currentProduct.name.substring(0, 50)}${currentProduct.name.length > 50 ? '...' : ''}</div>
        <small>Введи логин → Enter</small>
      `;
      addBtn.style.display = 'block';
      addBtn.disabled = !selectedUsername;
      addBtn.onclick = () => addProductToUsers(currentProduct);
    } else {
      statusEl.innerHTML = `
        ❌ Цена не найдена<br>
        <small>WB/Ozon + полная загрузка страницы</small>
      `;
    }
  } catch (error) {
    statusEl.innerHTML = `❌ ${error.message}`;
  }
}

async function addProductToUsers(product) {
  const statusEl = document.getElementById('status');
  const addBtn = document.getElementById('add-btn');
  
  if (!selectedUsername) {
    statusEl.innerHTML = '❌ Введи логин!';
    return;
  }
  
  addBtn.disabled = true;
  statusEl.innerHTML = '⏳ Сохраняем...';
  
  try {
    await fetch(`http://localhost:4000/api/guest/products/demo-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        marketplace: product.marketplace,
        currentPrice: product.price,
        url: product.url
      })
    });
    
    const response = await fetch(`http://localhost:4000/api/guest/products/${selectedUsername}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        marketplace: product.marketplace,
        currentPrice: product.price,
        url: product.url
      })
    });
    
    const result = await response.json();
    
    statusEl.innerHTML = `
      ✅ <strong>${product.name.substring(0,40)}...</strong><br>
      💰 ${product.price.toLocaleString()}₽<br>
      👤 ${selectedUsername} + demo-user (Cron)<br>
      🔄 Обнови localhost:3000/
    `;
  } catch (error) {
    statusEl.innerHTML = `❌ ${error.message}<br><small>Backend: npm run dev</small>`;
  } finally {
    addBtn.disabled = false;
  }
}

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
                price, marketplace: 'Wildberries', url,
                name: document.title.replace(/[-—].*/, '').trim()
              });
            }
          }
        }
      }
      
      if (url.includes('ozon.ru/product')) {
        const selectors = ['[data-qa="product-price"]', '[class*="price"]', '.oe9q70a', '.css-1xx17dy'];
        for (let selector of selectors) {
          const els = document.querySelectorAll(selector);
          for (let el of els) {
            const text = (el.textContent || el.innerText || '').trim();
            const priceMatch = text.match(/(\d{1,3}(?:\s?\d{3})*)\s*₽/i);
            if (priceMatch) {
              const price = parseInt(priceMatch[1].replace(/\s/g, ''));
              if (price > 100 && price < 1000000) {
                return resolve({
                  price, marketplace: 'Ozon', url,
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
                price, marketplace: 'Ozon', url,
                name: document.title.split('|')[0]?.trim() || document.title
              });
            }
          }
        }
      }
      
      if (attempts < maxAttempts) setTimeout(findPrice, 100);
      else resolve({ price: null, marketplace: 'Timeout', url });
    };

    const observer = new MutationObserver(findPrice);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(findPrice, 2000);
  });
}
