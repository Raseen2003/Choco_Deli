import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartItemCount, onCartClick }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'text-chocolate-800 font-semibold' : 'text-chocolate-600 hover:text-chocolate-800 transition-colors';
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-chocolate-100 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-chocolate-900 overflow-hidden">
          <Coffee className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-chocolate-600" />
          <span className="font-serif text-xl sm:text-2xl font-bold italic tracking-tight truncate">ChocoDelight</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className={`${isActive('/')}`}>Shop</Link>
          {user && user.role === 'admin' ? (
            <Link to="/admin" className={`flex items-center gap-1 ${isActive('/admin')}`}>
              <ShieldCheck className="w-4 h-4" /> Dashboard
            </Link>
          ) : (
            <Link to="/login" className={`flex items-center gap-1 text-sm text-chocolate-400 hover:text-chocolate-600 transition-colors`}>
               {/* Admin Login */}
            </Link>
          )}
          <Link to="/checkout" className="relative group p-2 hover:bg-chocolate-50 rounded-full transition-colors cursor-pointer" onClick={onCartClick}>
            <ShoppingCart className="w-6 h-6 text-chocolate-700 group-hover:text-chocolate-900" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-chocolate-600 border-2 border-white rounded-full -top-1 -right-1">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
