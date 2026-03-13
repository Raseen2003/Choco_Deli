import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Shop = ({ addToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchItems = async (isInitial = false) => {
      try {
        const response = await axios.get(`${API_URL}/items`);
        if (isMounted) {
          setItems(response.data);
          if (isInitial) setLoading(false);
        }
      } catch (err) {
        if (isMounted && isInitial) {
          setError('Failed to load items. Is the backend running?');
          setLoading(false);
        }
      }
    };

    fetchItems(true);

    const intervalId = setInterval(() => {
      fetchItems(false);
    }, 3000); // Poll every 3 seconds for near real-time updates

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Simple hardcoded fallback for visual demonstration if backend isn't up
  const displayItems = items.length > 0 ? items : (loading ? [] : [
    { _id: '1', name: 'Dark Truffle', description: 'Rich 70% dark chocolate with a velvety ganache center.', price: 4.5, amount: 20, imageUrl: 'https://images.unsplash.com/photo-1548883354-94cbcc6ab053?auto=format&fit=crop&q=80&w=400&h=300' },
    { _id: '2', name: 'Caramel Sea Salt', description: 'Milk chocolate dome filled with gooey salted caramel.', price: 3.75, amount: 15, imageUrl: 'https://images.unsplash.com/photo-1614088685112-c2b64dd4e0fc?auto=format&fit=crop&q=80&w=400&h=300' },
    { _id: '3', name: 'White Raspberry', description: 'Creamy white chocolate infused with tart raspberry freeze-dried pieces.', price: 5.0, amount: 8, imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=400&h=300' },
    { _id: '4', name: 'Hazelnut Praline', description: 'Crispy wafer and creamy hazelnut filling enrobed in milk chocolate.', price: 4.0, amount: 0, imageUrl: 'https://images.unsplash.com/photo-1511381939415-e440c9c36ec3?auto=format&fit=crop&q=80&w=400&h=300' },
    { _id: '5', name: 'Orange Zest Noir', description: 'Intense dark chocolate with candied orange peel.', price: 4.25, amount: 12, imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=400&h=300' },
    { _id: '6', name: 'Pistachio Dream', description: 'White chocolate cup filled with smooth Iranian pistachio cream.', price: 6.5, amount: 4, imageUrl: 'https://images.unsplash.com/photo-1550605658-9be5c3abccdb?auto=format&fit=crop&q=80&w=400&h=300' }
  ]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-chocolate-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-chocolate-950">Artisan Chocolates</h1>
        <p className="text-chocolate-600 max-w-2xl mx-auto text-lg">Handcrafted with premium cocoa beans and the finest ingredients from around the world. Treat yourself or someone special.</p>
      </div>
      
      {error && items.length === 0 && (
         <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8 border border-red-200 text-center">
            {error} Showing demo items instead.
         </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {displayItems.map(item => (
          <ItemCard 
            key={item._id} 
            item={item} 
            onAddToCart={addToCart} 
            inCartQuantity={0} // To be connected via complete cart state if needed per-item
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
