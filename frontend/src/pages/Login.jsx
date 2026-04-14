import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) setError('Invalid credentials or server error');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-4 text-white">
      <div className="w-full max-w-md glass-card p-8 text-center border-[#6366F1]/30">
        <div className="inline-block p-4 rounded-full bg-[#6366F1]/10 mb-6">
           <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-transparent bg-clip-text">AuraAI</h2>
        </div>
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#6366F1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#6366F1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full primary-button py-3 mt-4">
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6">
           <p className="text-sm text-gray-400 mb-4">Or Quick Login for Testing:</p>
           <div className="flex gap-2 justify-center">
              <button 
                 onClick={() => { setEmail('student@example.com'); setPassword('password123'); }}
                 className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-md border border-white/10 transition-colors"
              >
                 Student
              </button>
              <button 
                 onClick={() => { setEmail('faculty@example.com'); setPassword('password123'); }}
                 className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-md border border-white/10 transition-colors"
              >
                 Faculty
              </button>
              <button 
                 onClick={() => { setEmail('admin@example.com'); setPassword('password123'); }}
                 className="text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded-md border border-white/10 transition-colors"
              >
                 Admin
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
