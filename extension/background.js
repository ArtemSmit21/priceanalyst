chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__PRICEANALYST_PRODUCT__
    });

    const product = results[0]?.result;
    if (!product || !product.price) {
      chrome.action.setBadgeText({ text: '!' });
      setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2000);
      return;
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

    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2000);
    
    chrome.tabs.sendMessage(tab.id, { type: 'PRODUCT_ADDED', product });
  } catch (error) {
    console.error('Extension error:', error);
    chrome.action.setBadgeText({ text: '!' });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2000);
  }
});
