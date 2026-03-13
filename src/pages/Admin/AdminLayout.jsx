import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PackageOpen, PlusCircle, LogOut, Coffee, List, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-chocolate-800 text-white' : 'text-chocolate-200 hover:bg-chocolate-800 hover:text-white transition-colors';
  };

  return (
    <div className="flex min-h-screen bg-chocolate-50 w-full absolute top-0 left-0 z-50">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-chocolate-950 text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-chocolate-800 flex justify-between items-center">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white" onClick={() => setIsSidebarOpen(false)}>
              <Coffee className="w-8 h-8 text-chocolate-400" />
              <span className="font-serif text-2xl font-bold italic tracking-tight">ChocoDelight</span>
            </Link>
            <span className="text-xs text-chocolate-400 font-mono tracking-widest uppercase mt-2 block">Admin Portal</span>
          </div>
          <button className="lg:hidden text-chocolate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin')}`}>
            <PackageOpen className="w-5 h-5" /> Orders
          </Link>
          <Link to="/admin/inventory" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/inventory')}`}>
            <List className="w-5 h-5" /> Inventory
          </Link>
          <Link to="/admin/add-item" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/add-item')}`}>
            <PlusCircle className="w-5 h-5" /> Add Product
          </Link>
        </nav>

        <div className="p-4 border-t border-chocolate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-chocolate-200 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 w-full">
        <div className="lg:hidden mb-6 flex items-center justify-between pb-4 border-b border-chocolate-200">
          <div className="font-serif text-xl font-bold italic text-chocolate-900">Admin Portal</div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-md shadow-sm border border-chocolate-200 text-chocolate-800">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
