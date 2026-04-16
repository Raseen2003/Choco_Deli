import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { X } from 'lucide-react';
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

      {/* Cart Slide-out / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end transition-all">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-full max-w-sm h-full relative z-10 shadow-2xl flex flex-col border-l border-chocolate-100 animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-chocolate-100 bg-chocolate-50">
              <h2 className="text-xl font-serif font-bold text-chocolate-900">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-chocolate-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-chocolate-50/30">
              {cart.length === 0 ? (
                <div className="text-center text-chocolate-500 py-10 font-medium">Your cart is completely empty.</div>
              ) : (
                cart.map(c => (
                  <div key={c.item._id} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-chocolate-100 shadow-sm">
                    <img src={c.item.imageUrl?.startsWith('/') ? `http://localhost:5000${c.item.imageUrl}` : c.item.imageUrl} alt={c.item.name} className="w-16 h-16 object-cover rounded-lg border border-chocolate-50" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-chocolate-900 line-clamp-1">{c.item.name}</h3>
                      <p className="text-sm font-semibold text-chocolate-600">${c.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 border border-chocolate-200 rounded-lg py-1 px-1 bg-chocolate-50 shadow-inner">
                      <button onClick={() => updateCartQuantity(c.item._id, c.quantity - 1)} className="text-chocolate-700 font-black px-2 hover:text-red-500 transition-colors">−</button>
                      <span className="text-sm font-bold w-4 text-center select-none text-chocolate-900">{c.quantity}</span>
                      <button onClick={() => updateCartQuantity(c.item._id, c.quantity + 1)} className="text-chocolate-700 font-black px-2 hover:text-green-600 transition-colors" disabled={c.quantity >= c.item.amount}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-chocolate-100 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center font-black text-xl mb-5 text-chocolate-950">
                  <span>Subtotal</span>
                  <span>${cart.reduce((s, c) => s + (c.price * c.quantity), 0).toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary w-full flex justify-center py-4 text-lg font-bold shadow-md hover:shadow-lg transition-all rounded-xl">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected General User Routes with standard Navbar */}
          <Route element={<ProtectedRoute adminOnly={false} />}>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Shop addToCart={addToCart} cart={cart} />} />
              <Route 
                path="/checkout" 
                element={<Checkout cart={cart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />} 
              />
            </Route>
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
