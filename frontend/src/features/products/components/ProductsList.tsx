import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  marketplace: string;
  currentPrice?: number;
  previousPrice?: number;
  changePercent?: number;
  trend?: string;
  url?: string;
}

interface ProductsListProps {
  username: string;
}

export const ProductsList: React.FC<ProductsListProps> = ({ username }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    fetchProducts();
  }, [username]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/products/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      setStatus('success');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setStatus('error');
    }
  };

  const addDemoProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/products/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Тестовый товар WB',
          marketplace: 'Wildberries',
          currentPrice: 2399,
          previousPrice: 2499,
          url: 'https://www.wildberries.ru/catalog/12345678/detail.aspx'
        })
      });
      
      if (response.ok) {
        fetchProducts(); // Обновить список
      }
    } catch (error) {
      console.error('Ошибка добавления:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Загружаем твои товары...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Твои товары ({products.length})
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              {username} · Добавленные через расширение
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              🔄 Обновить
            </button>
            <button 
              onClick={addDemoProduct}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              ➕ Демо товар
            </button>
          </div>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
            <h3 className="text-xl font-bold text-red-900 mb-2">Backend недоступен</h3>
            <p className="text-gray-600 mb-6">
              Проверь: <code className="bg-gray-100 px-2 py-1 rounded text-sm">cd backend && npm run dev</code>
            </p>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {products.length === 0 && status === 'success' && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Товары не найдены</h3>
            <p className="text-xl text-gray-600 mb-6">Добавь первый товар через Chrome Extension или кнопку выше</p>
            <button 
              onClick={addDemoProduct}
              className="px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl hover:bg-emerald-700 transition-all shadow-xl"
            >
              ✨ Добавить демо товар
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              username={username}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
