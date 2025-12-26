chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'parsePrice') {
    sendResponse(parseCurrentPage());
  }
});

function parseCurrentPage() {
  const url = window.location.href;
  
  if (url.includes('wildberries.ru')) {
    const selectors = [
      '[data-testid="price-current"]',
      '.price-block__final-price',
      '.product-price__current-price'
    ];
    
    for (let selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const priceText = el.textContent?.replace(/[^\d]/g, '') || '';
        const price = parseInt(priceText);
        if (price > 100) {
          return {
            price,
            marketplace: 'Wildberries',
            url,
            name: document.title.replace(' - Wildberries.ru', '').replace(/^\d+\.\s*/, '')
          };
        }
      }
    }
  }
  
  if (url.includes('ozon.ru')) {
    const selectors = [
      '[data-qa="product-price"]',
      '.oe9q70a',
      '[class*="price"]'
    ];
    
    for (let selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const priceText = el.textContent?.replace(/[^\d]/g, '') || '';
        const price = parseInt(priceText);
        if (price > 100) {
          return {
            price,
            marketplace: 'Ozon',
            url,
            name: document.title.split(' | ')[0]
          };
        }
      }
    }
  }
  
  return { price: null, marketplace: 'Неизвестно', url };
}
