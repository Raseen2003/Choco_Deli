import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Checkout = ({ cart, updateCartQuantity, clearCart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      totalPrice: total,
      items: cart.map(c => ({ item: c.item._id, quantity: c.quantity, price: c.item.price }))
    };

    try {
      await axios.post(`${API_URL}/orders`, orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 4000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to place order. Backend might be down.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-white p-8 rounded-2xl shadow-sm border border-chocolate-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-chocolate-950 mb-4">Order Placed!</h2>
        <p className="text-chocolate-600 mb-8">Thank you for your sweet purchase. Your exquisite chocolates will be prepared shortly.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-serif font-bold text-chocolate-900 mb-4">Your Cart is Empty</h2>
        <p className="text-chocolate-600 mb-8">Looks like you haven't made your selections yet.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-chocolate-500 hover:text-chocolate-800 transition-colors p-2 rounded-full hover:bg-chocolate-100"><ArrowLeft className="w-5 h-5"/></Link>
          <h1 className="text-3xl font-serif font-bold text-chocolate-950">Checkout</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-chocolate-100 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-chocolate-900 mb-6 border-b border-chocolate-100 pb-4">Customer Details</h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-chocolate-800 mb-1">Full Name</label>
              <input type="text" required className="input-field" placeholder="John Doe"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-800 mb-1">Email Address</label>
              <input type="email" required className="input-field" placeholder="john@example.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            {/* Payment element placeholders */}
            <div className="pt-4 border-t border-chocolate-100 mt-6">
              <label className="block text-sm font-medium text-chocolate-800 mb-3">Payment Method</label>
              <div className="p-4 border border-chocolate-200 rounded-md bg-chocolate-50 flex items-center gap-3 text-chocolate-700">
                <CreditCard className="w-5 h-5" /> <span>Card Payment (Simulated)</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-white rounded-xl shadow-sm border border-chocolate-100 p-6 sticky top-24">
          <h2 className="text-xl font-semibold text-chocolate-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
            {cart.map((c) => (
              <div key={c.item._id} className="flex gap-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-chocolate-100 border border-chocolate-100">
                  <img src={c.item.imageUrl} alt={c.item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-chocolate-900 line-clamp-1">{c.item.name}</h4>
                  <p className="text-chocolate-500 text-sm">${c.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-chocolate-900">${(c.price * c.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-2 border border-chocolate-200 rounded-md py-0.5 px-2 bg-chocolate-50">
                    <button type="button" onClick={() => updateCartQuantity(c.item._id, c.quantity - 1)} className="text-chocolate-600 hover:text-chocolate-900 font-bold px-1">−</button>
                    <span className="text-sm w-4 text-center">{c.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(c.item._id, c.quantity + 1)} className="text-chocolate-600 hover:text-chocolate-900 font-bold px-1" disabled={c.quantity >= c.item.amount}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-chocolate-200 pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-chocolate-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-chocolate-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-chocolate-950 pt-2 border-t border-chocolate-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={submitting}
            className="btn-primary w-full py-3.5 text-lg flex justify-center items-center gap-2"
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
