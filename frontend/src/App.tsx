import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { ProductsList } from '@/features/products/components/ProductsList';
import { ProductDetailsPage } from '@/features/productDetails/ProductDetailsPage';
import { ComparePage } from '@/features/compare/ComparePage';
import Auth from '@/features/Auth/Auth';

interface User {
  username: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
    setInitialized(true);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl font-semibold text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route 
            path="/" 
            element={user ? <ProductsList username={user.username} /> : <Navigate to="/login" />} 
          />
          {/* ✅ КРИТИЧНЫЙ ФИКС - username передается */}
          <Route 
            path="/product/:id" 
            element={user ? <ProductDetailsPage username={user.username} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/compare" 
            element={user ? <ComparePage username={user.username} /> : <Navigate to="/login" />} 
          />
        </Route>
        
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export { App };
