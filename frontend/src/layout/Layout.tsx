import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="glass shadow-xl sticky top-0 z-50 backdrop-blur-xl border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 rounded-2xl shadow-xl flex items-center justify-center group-hover:shadow-2xl group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
                  PriceAnalyst
                </span>
                <span className="text-xs font-medium text-gray-600 tracking-wide">Отслеживание цен маркетплейсов</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 text-lg font-semibold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-primary-100'
                  }`
                }
              >
                📱 Товары
              </NavLink>
              <NavLink
                to="/compare"
                className={({ isActive }) =>
                  `px-4 py-2 text-lg font-semibold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-primary-100'
                  }`
                }
              >
                ⚖️ Сравнение
              </NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/compare"
                className="p-2 text-gray-600 hover:text-primary-700 hover:bg-primary-100 rounded-xl transition-all duration-200 md:hidden"
                title="Сравнение"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="glass border-t border-white/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-900">PriceAnalyst</span>
              <span>Итоговый проект · React 18 + TypeScript</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900">Технологии</span>
              <span>React · Redux Toolkit · TailwindCSS · Vite</span>
            </div>
            <div className="flex flex-col gap-1 md:text-right">
              <span className="font-semibold text-gray-900">Интеграции</span>
              <span>Telegram Bot · Chrome Extension · SQLite</span>
            </div>
          </div>
          <div className="border-t border-gray-200/50 mt-8 pt-6 text-xs text-gray-500">
            <p>&copy; 2025 PriceAnalyst. Все права защищены. Сделано с ❤️ в России.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
