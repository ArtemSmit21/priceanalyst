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
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const currentPrice = product.currentPrice || 0;
  const previousPrice = product.previousPrice || 0;
  const changePercent = product.changePercent || 0;
  
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const absPercent = Math.abs(changePercent);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative glass rounded-2xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-gradient-to-br from-white/80 to-white/50 hover:from-white hover:to-white/80 border-0"
    >
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 text-xs font-medium rounded-full backdrop-blur-sm">
          {product.marketplace || 'Маркетплейс'}
        </span>
      </div>
      
      <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2 text-gray-900 group-hover:text-gray-800">
        {product.name || 'Товар'}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-2xl font-black text-gray-900">
          {currentPrice.toLocaleString('ru-RU')}₽
        </div>
        <div className="text-sm text-gray-500 line-through">
          {previousPrice.toLocaleString('ru-RU')}₽
        </div>
      </div>
      
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
  );
};
