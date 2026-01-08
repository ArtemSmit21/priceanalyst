import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  marketplace: string;
  currentPrice: number;
  previousPrice?: number;
  changePercent?: string;
  trend?: string;
  url: string;
  addedAt: string;
  updatedAt: string;
}

interface ProductDetailsPageProps {
  username: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ username }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username && id) {
      const token = localStorage.getItem('token');
      console.log('🔍 Загружаем карточку:', username, id);
      
      fetch(`http://localhost:4000/api/products/${username}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: Product) => {
          console.log('✅ Получен товар:', data);
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Ошибка карточки:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [username, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Загрузка товара...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">❌ Товар не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
          <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {product.name}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Цена */}
            <div className="space-y-6">
              <div className="text-6xl font-black text-gray-900">
                {product.currentPrice.toLocaleString('ru-RU')}₽
              </div>
              {product.previousPrice && (
                <div className="text-2xl text-gray-500 line-through">
                  {product.previousPrice.toLocaleString('ru-RU')}₽
                </div>
              )}
              <div className={`text-2xl font-bold ${
                product.trend === 'up' ? 'text-emerald-600' :
                product.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {product.changePercent}% {product.trend}
              </div>
            </div>

            {/* Инфо */}
            <div className="space-y-4 text-lg">
              <div>
                <span className="font-semibold text-gray-700">🏪 Маркетплейс:</span>
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 rounded-full text-sm">
                  {product.marketplace}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">🔗 Ссылка:</span>
                <a 
                  href={product.url} 
                  target="_blank" 
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Открыть товар
                </a>
              </div>
              <div>
                <span className="font-semibold text-gray-700">📅 Добавлен:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(product.addedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">🔄 Обновлен:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(product.updatedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
