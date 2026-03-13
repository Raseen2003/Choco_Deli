import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import Dashboard from './pages/Admin/Dashboard';
import AdminLayout from './pages/Admin/AdminLayout';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        if (existing.quantity >= item.amount) return prev; // Cannot add more than stock
        return prev.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, price: item.price }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(i => i.item._id !== itemId));
      return;
    }
    setCart(prev => prev.map(i => {
      if (i.item._id === itemId) {
        return { ...i, quantity: Math.min(newQuantity, i.item.amount) };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  // Layout for standard user facing pages
  const UserLayout = () => (
    <div className="min-h-screen flex flex-col relative w-full">
      <Navbar cartItemCount={cart.reduce((acc, curr) => acc + curr.quantity, 0)} onCartClick={() => setIsCartOpen(!isCartOpen)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-chocolate-900 text-chocolate-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif italic text-lg mb-2">ChocoDelight</p>
          <p className="text-sm opacity-75">Premium Chocolate Desserts &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with standard Navbar */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Shop addToCart={addToCart} />} />
            <Route 
              path="/checkout" 
              element={<Checkout cart={cart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />} 
            />
          </Route>
          
          {/* Standalone Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes with separate Admin Sidebar Layout */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard initialTab="orders" />} />
              <Route path="inventory" element={<Dashboard initialTab="inventory" />} />
              <Route path="add-item" element={<Dashboard initialTab="add-item" />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
