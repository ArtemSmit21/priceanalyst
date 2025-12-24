import React from 'react';
import { Link } from 'react-router-dom';

const comparisonData = [
  { name: 'Sony WH-1000XM4', price: 8999, change: -12, marketplace: 'Wildberries' },
  { name: 'Bose QC45', price: 12499, change: 5, marketplace: 'Ozon' },
  { name: 'Sennheiser Momentum 4', price: 14999, change: 0, marketplace: 'Яндекс Маркет' }
];

export const ComparePage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-12 gap-4">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xl font-bold text-primary-700 hover:text-primary-800 mb-2 group transition-colors"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </Link>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent">
              Сравнение аналогов
            </h1>
            <p className="text-xl text-gray-600 mt-2">Sony WH-1000XM4 · Беспроводные наушники</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm">
                  <th className="px-6 py-4 text-left font-bold text-gray-900 border-b border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50 z-10">
                    Характеристика
                  </th>
                  {comparisonData.map((product, index) => (
                    <th key={index} className="px-6 py-4 text-left font-bold text-gray-900 border-b border-white/50">
                      <div className="font-bold text-lg">{product.name}</div>
                      <div className="text-primary-700 font-bold text-2xl">{product.price.toLocaleString('ru-RU')}₽</div>
                      <div className="text-xs text-gray-500">{product.marketplace}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                <tr className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 border-r border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50">
                    Изменение цены
                  </td>
                  {comparisonData.map((product, index) => (
                    <td key={index} className="px-6 py-4 font-bold">
                      <span className={product.change < 0 ? 'text-emerald-600' : product.change > 0 ? 'text-red-600' : 'text-gray-500'}>
                        {product.change === 0 ? '→ Стабильно' : `${product.change > 0 ? '↑' : '↓'} ${Math.abs(product.change)}%`}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 border-r border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50">
                    Качество звука
                  </td>
                  <td className="px-6 py-4">★★★★★</td>
                  <td className="px-6 py-4">★★★★☆</td>
                  <td className="px-6 py-4">★★★★★</td>
                </tr>
                <tr className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 border-r border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50">
                    ANC (шумоподавление)
                  </td>
                  <td className="px-6 py-4">Отличное</td>
                  <td className="px-6 py-4">Отличное</td>
                  <td className="px-6 py-4">Хорошее</td>
                </tr>
                <tr className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 border-r border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50">
                    Время работы
                  </td>
                  <td className="px-6 py-4">30ч / 24ч ANC</td>
                  <td className="px-6 py-4">24ч / 20ч ANC</td>
                  <td className="px-6 py-4">60ч / 50ч ANC</td>
                </tr>
                <tr className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 border-r border-white/50 sticky left-0 bg-gradient-to-r from-white/70 to-white/50">
                    Лучшая цена (30 дней)
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">8 499₽</td>
                  <td className="px-6 py-4 text-gray-600">11 999₽</td>
                  <td className="px-6 py-4 text-gray-600">14 499₽</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/30 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Рекомендация</h3>
              <p className="text-lg text-emerald-700 font-semibold bg-emerald-100 px-4 py-2 rounded-xl inline-block">
                🎯 Sony WH-1000XM4 — Лучшее соотношение цены и качества
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 whitespace-nowrap">
              Отслеживать все 3 товара
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
