import React from 'react';
import { Plus, Check } from 'lucide-react';

const ItemCard = ({ item, onAddToCart, inCartQuantity }) => {
  const availableStock = item.amount - (inCartQuantity || 0);
  const isOutOfStock = availableStock <= 0;

  return (
    <div className="card group flex flex-col h-full bg-white relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-chocolate-100">
        <img 
          src={item.imageUrl || "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400&h=300"} 
          alt={item.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {item.amount <= 5 && item.amount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            Only {item.amount} left!
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-chocolate-900 text-white font-bold py-2 px-6 rounded-full shadow-lg transform -rotate-12 outline outline-2 outline-white">OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold font-serif text-chocolate-950 line-clamp-1">{item.name}</h3>
          <span className="font-semibold text-chocolate-700 bg-chocolate-100 px-2 py-1 rounded text-sm">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-chocolate-600 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-chocolate-500">{item.amount > 0 ? `${availableStock} available` : 'Sold out'}</span>
          <button 
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock}
            className={`btn-primary px-3 py-1.5 flex items-center gap-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {inCartQuantity > 0 ? (
              <><Check className="w-4 h-4" /> Add More</>
            ) : (
              <><Plus className="w-4 h-4" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
