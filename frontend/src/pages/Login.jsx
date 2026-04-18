import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Mail, Lock, Loader2, ArrowRight, Fingerprint, ShieldCheck, Users, GraduationCap, UserCheck, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (user) {
    return <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const userString = localStorage.getItem('user');
      const currentUser = userString ? JSON.parse(userString) : null;
      if (currentUser) {
        navigate(`/${currentUser.role.toLowerCase()}-dashboard`);
      }
    }
  };

  const quickRoles = [
    { name: 'Student', email: 'student1@aura.com', icon: GraduationCap, color: 'text-emerald-500' },
    { name: 'Faculty', email: 'faculty1@aura.com', icon: UserCheck, color: 'text-teal-500' },
    { name: 'Admin', email: 'admin1@aura.com', icon: LayoutDashboard, color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen grid place-items-center p-6 relative bg-[var(--bg-color)] overflow-hidden">
      
      {/* Isolated Background Layer (Non-interfering) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="scanova-bg"></div>
        <div className="scanova-blob w-[400px] h-[400px] bg-emerald-500/10 -top-20 -left-20"></div>
        <div className="scanova-blob w-[400px] h-[400px] bg-teal-500/10 -bottom-20 -right-20"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-110 transition-transform">
            <QrCode className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            SCANOVA Portal
          </h1>
          <p className="text-gray-400 font-medium">Welcome back. Authenticate to continue.</p>
        </div>

        <div className="glass-card p-1 relative overflow-hidden group mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[1.25rem] blur opacity-30"></div>
          
          <div className="bg-[var(--glass-bg)] p-7 rounded-[1.1rem] relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1">Identity</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-emerald-400 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="University Email"
                    className="w-full h-12 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl pl-12 pr-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 ml-1">Access Key</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-emerald-400 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 bg-black/5 dark:bg-black/20 border border-white/5 dark:border-white/10 rounded-xl pl-12 pr-4 text-[var(--text-color)] placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-[10px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-3 gap-3 mb-10">
           {quickRoles.map((role) => (
             <button
               key={role.name}
               onClick={() => { setEmail(role.email); setPassword('aura123'); }}
               className="glass-card p-4 flex flex-col items-center gap-2 border-white/5 hover:border-emerald-500/30 transition-all group hover:-translate-y-1"
             >
               <role.icon className={`${role.color} w-5 h-5 group-hover:scale-110 transition-transform`} />
               <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 group-hover:text-[var(--text-color)]">{role.name}</span>
             </button>
           ))}
        </div>

        <div className="text-center space-y-4">
           <button 
             onClick={() => navigate('/')} 
             className="text-[10px] font-black text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto"
           >
             ← Return to Landing
           </button>
           <p className="text-[9px] text-gray-600 font-medium max-w-xs mx-auto opacity-60">
             Smart Attendance System v1.0. Hosted on secure campus networks.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
