(function() {
  'use strict';
  
  function extractProductInfo() {
    let title = 'Товар без названия';
    let price = 0;
    let marketplace = '';

    // Wildberries
    if (location.hostname.includes('wildberries')) {
      title = document.querySelector('h1.product__title')?.textContent?.trim() || 
              document.querySelector('[data-link="productName"]')?.textContent?.trim() ||
              document.title.split(' - ')[0];
      
      const priceEl = document.querySelector('.price-block__final-price') || 
                     document.querySelector('[data-link="productPrice"]');
      if (priceEl) {
        const priceText = priceEl.textContent?.match(/\\d+(?:[\\s\\d]*\\d)?/)?.[0];
        price = priceText ? parseInt(priceText.replace(/\\s/g, '')) : 0;
      }
      marketplace = 'Wildberries';
    }
    
    // Ozon  
    else if (location.hostname.includes('ozon')) {
      title = document.querySelector('h1[data-test-id="product-title"]')?.textContent?.trim() ||
              document.querySelector('.o5q5ikr')?.textContent?.trim() ||
              document.title.split(' - ')[0];
      
      const priceEl = document.querySelector('[data-test-id="tile-price"]') ||
                     document.querySelector('.a10a6y3q');
      if (priceEl) {
        const priceText = priceEl.textContent?.match(/\\d+(?:[\\s\\d]*\\d)?/)?.[0];
        price = priceText ? parseInt(priceText.replace(/\\s/g, '')) : 0;
      }
      marketplace = 'Ozon';
    }

    return {
      title: title.slice(0, 100),
      price: Math.max(price, 0),
      marketplace,
      url: location.href
    };
  }

  window.__PRICEANALYST_PRODUCT__ = extractProductInfo();
  
  // Show badge if product detected
  if (window.__PRICEANALYST_PRODUCT__.price > 0) {
    chrome.runtime.sendMessage({ type: 'PRODUCT_FOUND' });
  }
})();
