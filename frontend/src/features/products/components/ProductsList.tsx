import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectProducts, 
  selectProductsStatus, 
  fetchProductsByUser 
} from '@/features/products/productsSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => selectProducts(state));
  const status = useSelector((state: RootState) => selectProductsStatus(state));

  useEffect(() => {
    dispatch(fetchProductsByUser('demo-user'));
  }, [dispatch]);

  const demoProducts = [
    {
      id: '1',
      name: 'Apple AirPods Pro 2nd Gen USB-C',
      marketplace: 'Wildberries',
      currentPrice: 19990,
      previousPrice: 22990,
      changePercent: -13.1,
      trend: 'down' as const
    },
    {
      id: '2', 
      name: 'Samsung Galaxy S24 Ultra 256GB',
      marketplace: 'Ozon',
      currentPrice: 89990,
      previousPrice: 94990,
      changePercent: -5.3,
      trend: 'down' as const
    },
    {
      id: '3',
      name: 'MacBook Air M2 13" 16GB 512GB',
      marketplace: 'Яндекс Маркет',
      currentPrice: 124990,
      previousPrice: 119990,
      changePercent: 4.2,
      trend: 'up' as const
    },
    {
      id: '4',
      name: 'Sony WH-1000XM5 Wireless',
      marketplace: 'Wildberries',
      currentPrice: 28990,
      previousPrice: 29990,
      changePercent: -3.3,
      trend: 'down' as const
    },
    {
      id: '5',
      name: 'iPhone 15 Pro Max 256GB Natural Titanium',
      marketplace: 'M.Video',
      currentPrice: 119990,
      previousPrice: 119990,
      changePercent: 0,
      trend: 'stable' as const
    },
    {
      id: '6',
      name: 'ASUS ROG Strix G16 RTX 4070',
      marketplace: 'DNS',
      currentPrice: 159990,
      previousPrice: 169990,
      changePercent: -5.8,
      trend: 'down' as const
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Отслеживаемые товары
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              {products.length || demoProducts.length} товаров в мониторинге
            </p>
          </div>
          <Link 
            to="/compare" 
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-0"
          >
            Сравнить аналоги
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Загружаем ваши товары...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Ошибка загрузки</h3>
            <p className="text-gray-600 mb-6">Не удалось загрузить товары. Попробуйте обновить страницу.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Обновить
            </button>
          </div>
        )}

        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${Math.min(4, demoProducts.length)} transition-all duration-300 ${
          status !== 'failed' ? 'animate-fadeInUp' : ''
        }`}>
          {(products.length ? products : demoProducts).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {(!products.length && status === 'idle') && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7V1a1 1 0 00-1-1H8a1 1 0 00-1 1v6H15zM6 13a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Начните отслеживать товары</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Добавьте товары с Wildberries, Ozon или используйте Telegram бота для мониторинга цен.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="#"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-lg"
              >
                Установить расширение
              </a>
              <a 
                href="#"
                className="px-8 py-4 border-2 border-primary-200 text-primary-700 font-bold rounded-2xl hover:bg-primary-50 hover:shadow-lg transition-all duration-200 text-lg"
              >
                Telegram бот
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
