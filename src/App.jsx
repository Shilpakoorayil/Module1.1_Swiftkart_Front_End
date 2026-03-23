import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Customer Pages
import Home from './pages/customer/Home';
import Login from './pages/customer/Login';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import ProductDetails from './pages/customer/ProductDetails';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes with Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>

        {/* Admin Routes with Admin Layout */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route 
            path="dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="products" 
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            } 
          />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
