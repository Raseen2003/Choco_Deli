import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageOpen, PlusCircle, CheckCircle, Package, List, Edit, Trash2, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ initialTab = 'orders' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' or 'add-item'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // New Item State
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    amount: '',
    imageUrl: ''
  });
  const [addingItem, setAddingItem] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Inventory State
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      // Fallback for visual demo
      setOrders([
        { _id: 'o1', customerName: 'John Doe', customerEmail: 'john@example.com', totalPrice: 24.50, status: 'Completed', createdAt: new Date().toISOString(), items: [{item: {name: 'Dark Truffle'}, quantity: 2}, {item: {name: 'Caramel Sea Salt'}, quantity: 4}] },
        { _id: 'o2', customerName: 'Jane Smith', customerEmail: 'jane@example.com', totalPrice: 15.00, status: 'Pending', createdAt: new Date(Date.now() - 86400000).toISOString(), items: [{item: {name: 'White Raspberry'}, quantity: 3}] }
      ]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialTab === 'orders') {
      fetchOrders();
    } else if (initialTab === 'inventory') {
      fetchItems();
    }
  }, [initialTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      // Optimistic update for demo
      setOrders(orders.map(o => o._id === orderId ? {...o, status: newStatus} : o));
    }
  };

  const handeSubmitNewItem = async (e) => {
    e.preventDefault();
    setAddingItem(true);
    try {
      await axios.post(`${API_URL}/items`, {
        ...newItem,
        price: parseFloat(newItem.price),
        amount: parseInt(newItem.amount)
      });
      setSuccessMsg('Item added successfully!');
      setNewItem({ name: '', description: '', price: '', amount: '', imageUrl: '' });
      if (initialTab === 'inventory') fetchItems();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to add item. Check backend connection.');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item.");
    }
  };

  const handeSubmitEditItem = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/items/${editingItem._id}`, {
        ...editingItem,
        price: parseFloat(editingItem.price),
        amount: parseInt(editingItem.amount)
      });
      setSuccessMsg('Item updated successfully!');
      setEditingItem(null);
      fetchItems();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update item. Check backend connection.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-chocolate-950 mb-2">Admin Dashboard</h1>
        <p className="text-chocolate-600">Manage orders and inventory</p>
      </div>

      <div className="flex gap-4 mb-4 pb-2 border-b border-chocolate-200">
        <h2 className="text-xl font-semibold text-chocolate-800 flex items-center gap-2">
          {activeTab === 'orders' && <><PackageOpen className="w-5 h-5"/> Manage Orders</>}
          {activeTab === 'inventory' && <><List className="w-5 h-5"/> Product Inventory</>}
          {activeTab === 'add-item' && <><PlusCircle className="w-5 h-5"/> Add Product</>}
        </h2>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-10 text-chocolate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-chocolate-100">
              <Package className="w-12 h-12 text-chocolate-300 mx-auto mb-3" />
              <p className="text-chocolate-600 font-medium">No orders found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-chocolate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                <thead>
                  <tr className="bg-chocolate-50 text-chocolate-800 border-b border-chocolate-100">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Items</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chocolate-50">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-chocolate-50/50 transition-colors">
                      <td className="p-4 text-sm font-mono text-chocolate-500">{order._id.substring(0,8)}...</td>
                      <td className="p-4">
                        <div className="font-medium text-chocolate-900">{order.customerName}</div>
                        <div className="text-xs text-chocolate-500">{order.customerEmail}</div>
                      </td>
                      <td className="p-4 text-sm">
                        <ul className="list-disc pl-4">
                          {order.items.map((i, idx) => (
                            <li key={idx} className="text-chocolate-700">{i.quantity}x {i.item?.name || 'Unknown Item'}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          className="input-field py-1 px-2 text-sm bg-white"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'inventory' ? (
        <div className="space-y-4">
          {successMsg && (
            <div className="mb-4 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="w-5 h-5"/> {successMsg}
            </div>
          )}
          {loadingItems ? (
            <div className="text-center py-10 text-chocolate-500">Loading products...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-chocolate-100">
              <Package className="w-12 h-12 text-chocolate-300 mx-auto mb-3" />
              <p className="text-chocolate-600 font-medium">No products found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-chocolate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-chocolate-50 text-chocolate-800 border-b border-chocolate-100">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chocolate-50">
                  {items.map(item => (
                    <tr key={item._id} className="hover:bg-chocolate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md border border-chocolate-100" />
                          <div>
                            <div className="font-medium text-chocolate-900">{item.name}</div>
                            <div className="text-xs text-chocolate-500 truncate max-w-xs">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.amount > 0 ? `${item.amount} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-xl shadow-lg border border-chocolate-100 max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setEditingItem(null)} className="absolute top-4 right-4 text-chocolate-400 hover:text-chocolate-800">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-serif font-bold text-chocolate-900 mb-6">Edit Product</h2>
                <form onSubmit={handeSubmitEditItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-chocolate-800 mb-1">Product Name</label>
                    <input type="text" required className="input-field" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-800 mb-1">Description</label>
                    <textarea required className="input-field min-h-[80px]" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-chocolate-800 mb-1">Price ($)</label>
                      <input type="number" step="0.01" min="0" required className="input-field" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-chocolate-800 mb-1">Stock Amount</label>
                      <input type="number" min="0" required className="input-field" value={editingItem.amount} onChange={e => setEditingItem({...editingItem, amount: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-800 mb-1">Image URL</label>
                    <input type="url" required className="input-field" value={editingItem.imageUrl} onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})} />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border border-chocolate-200 text-chocolate-700 rounded-lg hover:bg-chocolate-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-chocolate-800 text-white rounded-lg hover:bg-chocolate-900">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-sm border border-chocolate-100">
          <h2 className="text-2xl font-serif font-bold text-chocolate-900 mb-6">Add New Chocolate</h2>
          
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="w-5 h-5"/> {successMsg}
            </div>
          )}

          <form onSubmit={handeSubmitNewItem} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-chocolate-800 mb-1">Product Name</label>
              <input type="text" required className="input-field" placeholder="e.g. Raspberry Truffle"
                value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-chocolate-800 mb-1">Description</label>
              <textarea required className="input-field min-h-[100px]" placeholder="Delicious chocolate..."
                value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-chocolate-800 mb-1">Price ($)</label>
                <input type="number" step="0.01" min="0" required className="input-field" placeholder="4.50"
                  value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-800 mb-1">Initial Stock</label>
                <input type="number" min="0" required className="input-field" placeholder="50"
                  value={newItem.amount} onChange={e => setNewItem({...newItem, amount: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate-800 mb-1">Image URL</label>
              <input type="url" required className="input-field" placeholder="https://images.unsplash.com/..."
                value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} />
              <p className="text-xs text-chocolate-500 flex items-center gap-1 mt-1">Hint: Use an Unsplash link for beautiful photos.</p>
            </div>

            <button type="submit" disabled={addingItem} className="btn-primary w-full flex justify-center items-center py-3 text-lg font-medium mt-4">
              {addingItem ? 'Adding...' : 'Add to Inventory'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
