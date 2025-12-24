document.getElementById('addBtn').addEventListener('click', async () => {
  const btn = document.getElementById('addBtn');
  const statusEl = document.getElementById('status');
  
  btn.disabled = true;
  btn.textContent = 'Добавляем...';
  
  statusEl.style.display = 'none';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error('Tab not found');
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__PRICEANALYST_PRODUCT__
    });
    
    const product = results[0]?.result;
    if (!product || !product.price || product.price === 0) {
      throw new Error('Товар не найден на странице');
    }
    
    const userId = 'extension-user';
    const productId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await fetch('http://localhost:4000/api/products/' + productId + '/' + userId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.title,
        marketplace: product.marketplace,
        price: product.price
      })
    });
    
    statusEl.textContent = `✅ "${product.title.substring(0, 30)}..." добавлен!`;
    statusEl.className = 'status success';
    statusEl.style.display = 'block';
    
  } catch (error) {
    console.error(error);
    statusEl.textContent = '❌ Ошибка: ' + (error.message || 'Не удалось добавить товар');
    statusEl.className = 'status error';
    statusEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ Добавить товар в отслеживание';
  }
});
