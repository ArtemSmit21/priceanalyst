import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { ProductsList } from '@/features/products/components/ProductsList';
import { ProductDetailsPage } from '@/features/productDetails/ProductDetailsPage';
import { ComparePage } from '@/features/compare/ComparePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProductsList />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { App };
