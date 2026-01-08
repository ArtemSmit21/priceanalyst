import React from 'react';
import { Link } from 'react-router-dom';

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

interface ProductCardProps {
  product: Product;
  username: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, username }) => {
  const currentPrice = product.currentPrice || 0;
  const previousPrice = product.previousPrice || 0;
  const changePercent = product.changePercent || 0;
  
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const absPercent = Math.abs(changePercent);

  const updatePrice = async () => {
    if (product.url) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/api/products/${username}/${product.id}/price`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            price: currentPrice, 
            url: product.url, 
            source: product.marketplace 
          })
        });
        
        if (res.ok) {
          console.log('✅ Цена обновлена!');
        }
      } catch (error) {
        console.log('❌ Ошибка обновления:', error);
      }
    }
  };

  return (
    <div className="group relative glass rounded-2xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-gradient-to-br from-white/80 to-white/50 hover:from-white hover:to-white/80 border-0">
      
      <Link
        to={`/product/${product.id}`}
        className="block h-full"
      >
        {/* Тренд индикатор */}
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Marketplace badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 text-xs font-medium rounded-full backdrop-blur-sm">
            {product.marketplace || 'Маркетплейс'}
          </span>
        </div>
        
        {/* Название товара */}
        <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2 text-gray-900 group-hover:text-gray-800">
          {product.name || 'Товар'}
        </h3>
        
        {/* Цены */}
        <div className="space-y-2 mb-4">
          <div className="text-2xl font-black text-gray-900">
            {currentPrice.toLocaleString('ru-RU')}₽
          </div>
          {previousPrice > 0 && (
            <div className="text-sm text-gray-500 line-through">
              {previousPrice.toLocaleString('ru-RU')}₽
            </div>
          )}
        </div>
        
        {/* Тренд */}
        <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 ${
          isPositive 
            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border border-emerald-200/50' 
            : isNegative 
              ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-700 border border-red-200/50'
              : 'bg-gradient-to-r from-gray-500/10 to-gray-400/10 text-gray-600 border border-gray-200/50'
        }`}>
          {isPositive && '📈'}
          {isNegative && '📉'}
          {!isPositive && !isNegative && '➡️'}
          <span>{isPositive ? '+' : ''}{absPercent.toFixed(1)}%</span>
          <span className="text-gray-500 font-normal">за 7 дней</span>
        </div>
      </Link>

      {/* Кнопка обновления цены */}
      {product.url && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updatePrice();
          }}
          className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          title="🔍 Обновить цену"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M4.661 4.182l-1.504 5.658m.468-5.658l2.652 9.95a3.852 3.852 0 0 1-2.148 5.011m.468-5.658l-.297 1.117m1.188-6.614l4.332 15.405a3.852 3.852 0 0 1 2.584 4.899" />
          </svg>
        </button>
      )}
    </div>
  );
};
