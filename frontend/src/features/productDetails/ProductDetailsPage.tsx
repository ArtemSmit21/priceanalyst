import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProductCard } from '../products/components/ProductCard';

const USER_ID = 'demo-user';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/products/${USER_ID}/${id}`);
      if (!response.ok) throw new Error('Товар не найден');
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePriceReal = async () => {
    setLoading(true);
    try {
      console.log('🔍 Парсим реальную цену...');
      
      const parseResponse = await fetch('http://localhost:4000/api/parse-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: product.url })
      });
      
      const parseResult = await parseResponse.json();
      
      if (parseResult.success && parseResult.price) {
        console.log(`✅ Парсер нашел: ${parseResult.price}₽`);
        
        const updateResponse = await fetch(`http://localhost:4000/api/products/${USER_ID}/${id}/price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: parseResult.price })
        });
        
        const updateResult = await updateResponse.json();
        if (updateResult.success) {
          setProduct(updateResult.product);
          console.log(`💰 Цена обновлена в БД: ${parseResult.price}₽`);
        }
      } else {
        console.log('❌ Парсер не нашел цену');
      }
    } catch (error) {
      console.error('Ошибка парсинга:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Парсим цену...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md">
          <h1 className="text-3xl font-black text-gray-900 mb-4">❌ Товар не найден</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700"
          >
            ← Все товары
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-12 text-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Все товары
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ProductCard product={product} showLink={false} />
            </div>
            
            <div className="flex flex-col gap-4 lg:w-64">
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-center hover:from-blue-600 hover:to-indigo-700 shadow-xl"
              >
                🛒 Открыть товар
              </a>
              
              <button 
                onClick={updatePriceReal}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 shadow-xl disabled:opacity-50"
              >
                {loading ? '⏳ Парсим...' : '🔍 Проверить цену'}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-4">📈 Динамика</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600">{product.currentPrice?.toLocaleString()}₽</div>
                <div className="text-sm text-gray-600 mt-1">Текущая</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-600">{product.previousPrice?.toLocaleString()}₽</div>
                <div className="text-sm text-gray-600 mt-1">Было</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${product.changePercent < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.changePercent}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Изменение</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">🕐 Автообновление</h3>
          <p className="text-blue-800 mb-4">Backend cron каждые 24ч (тот же парсер)</p>
          <p className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-xl inline-block">
            Последнее: {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'Никогда'}
          </p>
        </div>
      </div>
    </div>
  );
};
