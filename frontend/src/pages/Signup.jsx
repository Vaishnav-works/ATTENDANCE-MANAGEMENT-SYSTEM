import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Mail, Lock, User, GraduationCap, Building2, Calendar, Loader2, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    student_id: '',
    branch: '',
    year: '',
    role: 'Student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const branches = ['CSE', 'ECE', 'MECHANICAL', 'CIVIL', 'EEE'];
  const years = [1, 2, 3, 4];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branch || !formData.year) {
      setError('Please select both Branch and Year');
      return;
    }

    setLoading(true);
    setError('');

    // Generate a unique user_id for the database
    const payload = {
      ...formData,
      user_id: `USR-${Date.now()}`
    };

    const success = await signup(payload);
    setLoading(false);
    
    if (success) {
      navigate('/student-dashboard');
    } else {
      setError('Registration failed. Email might already be in use.');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 relative bg-[var(--bg-color)] overflow-hidden">
      
      {/* Isolated Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="scanova-bg"></div>
      </div>
      
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <QrCode className="text-white w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Join SCANOVA
          </h1>
          <p className="text-gray-400 font-medium italic">Create your academic profile to get started.</p>
        </div>

        <div className="glass-card p-1 relative overflow-hidden group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[1.25rem] blur opacity-30"></div>
          
          <div className="bg-[var(--glass-bg)] p-8 rounded-[1.1rem] relative z-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Info */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1 flex items-center gap-2">
                    <User size={10} /> Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1 flex items-center gap-2">
                    <Mail size={10} /> University Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@university.com"
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1 flex items-center gap-2">
                    <Lock size={10} /> Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-1 flex items-center gap-2">
                    <GraduationCap size={10} /> Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="ID-12345"
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-all text-sm font-medium"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-1 flex items-center gap-2">
                    <Building2 size={10} /> Branch
                  </label>
                  <select
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-gray-400 focus:outline-none focus:border-teal-500 transition-all text-sm font-medium appearance-none"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Branch</option>
                    {branches.map(b => <option key={b} value={b} className="bg-[#050504]">{b}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-1 flex items-center gap-2">
                    <Calendar size={10} /> Academic Year
                  </label>
                  <select
                    className="w-full h-11 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl px-4 text-gray-400 focus:outline-none focus:border-teal-500 transition-all text-sm font-medium appearance-none"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Year</option>
                    {years.map(y => <option key={y} value={y} className="bg-[#050504]">Year {y}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-[10px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full h-12 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
           <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
             Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1">Sign In</Link>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
