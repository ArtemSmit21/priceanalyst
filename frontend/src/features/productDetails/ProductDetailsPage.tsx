import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Product, PricePoint, ProductStatistics } from '@/types';

interface ProductDetailsResponse {
  product: Product;
  prices: PricePoint[];
  statistics: ProductStatistics;
}

const demoData = {
  product: {
    id: '1',
    name: 'Apple AirPods Pro 2nd Gen USB-C',
    marketplace: 'Wildberries',
    currentPrice: 19990,
    previousPrice: 22990,
    changePercent: -13.1,
    trend: 'down'
  },
  prices: [
    { date: '2025-12-17', price: 22990 },
    { date: '2025-12-18', price: 22700 },
    { date: '2025-12-19', price: 22450 },
    { date: '2025-12-20', price: 21990 },
    { date: '2025-12-21', price: 21490 },
    { date: '2025-12-22', price: 20990 },
    { date: '2025-12-23', price: 20490 },
    { date: '2025-12-24', price: 19990 },
  ],
  statistics: { min: 19990, max: 22990, avg: 21250 }
};

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setStatus('loading');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setData(demoData);
        setStatus('idle');
      } catch (error) {
        setStatus('failed');
      }
    };

    loadData();
  }, [id]);

  const formatPrice = (price: number) => price.toLocaleString('ru-RU') + '₽';

  if (status === 'loading' || !data) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="space-y-3">
                  <div className="h-8 w-3/4 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Товар не найден</h1>
          <p className="text-xl text-gray-600 mb-8">К сожалению, запрашиваемый товар не найден в вашей базе отслеживания.</p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-200"
            >
              ← Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { product, prices, statistics } = data;
  const changeClass = product.changePercent > 0 ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-lg font-semibold text-primary-700 hover:text-primary-800 transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div className="glass rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-800 text-sm font-bold rounded-2xl mb-4">
                    {product.marketplace}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl md:text-6xl font-black text-gray-900">
                      {formatPrice(product.currentPrice)}
                    </span>
                    <span className={`text-2xl font-bold ${changeClass}`}>
                      {product.changePercent >= 0 ? '+' : ''}{product.changePercent.toFixed(1)}%
                    </span>
                    <span className="text-xl text-gray-500 font-medium line-through">
                      {formatPrice(product.previousPrice)}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl text-2xl font-bold ${
                  product.trend === 'up' 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border-2 border-emerald-200/50'
                    : product.trend === 'down'
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border-2 border-red-200/50'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 text-gray-700 border-2 border-gray-200/50'
                }`}>
                  {product.trend === 'up' && '📈'}
                  {product.trend === 'down' && '📉'}
                  {product.trend === 'stable' && '➡️'}
                </div>
              </div>
            </div>

            {/* Price History */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                📊 История цен (30 дней)
              </h2>
              <div className="space-y-3">
                {prices.slice(-12).map((pricePoint, index) => (
                  <div key={pricePoint.date} className="flex justify-between items-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl hover:shadow-md transition-all group">
                    <span className="font-mono text-sm text-gray-600">{pricePoint.date}</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatPrice(pricePoint.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Статистика</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Минимум</span>
                  <span className="font-bold text-emerald-600 text-lg">{formatPrice(statistics.min)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Средняя</span>
                  <span className="font-bold text-blue-600 text-lg">{formatPrice(Math.round(statistics.avg))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Максимум</span>
                  <span className="font-bold text-red-600 text-lg">{formatPrice(statistics.max)}</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🔔 Уведомления</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl cursor-pointer group hover:shadow-md transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-500" defaultChecked />
                  <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    Уведомить при цене ниже минимума
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl cursor-pointer group hover:shadow-md transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    Уведомить при возврате к текущей цене
                  </span>
                </label>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">⚡ Быстрые действия</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                  Поделиться товаром
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                  Удалить из отслеживания
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
