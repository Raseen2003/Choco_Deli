import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-chocolate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-chocolate-100 p-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chocolate-100 text-chocolate-600 mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-chocolate-950">Admin Log In</h2>
          <p className="text-chocolate-600 mt-2">Access the ChocoDelight dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-chocolate-800 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="input-field py-3 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-chocolate-800 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="input-field py-3 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 text-lg flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
            ) : (
              <><Lock className="w-5 h-5" /> Sign In</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
