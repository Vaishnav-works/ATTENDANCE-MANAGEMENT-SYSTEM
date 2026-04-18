import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, QrCode, ClipboardList, LogOut, Scan, ShieldCheck, Bot, Sun, Moon } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getLinks = () => {
    if (!user || !user.role) return [];
    
    const role = user.role.toLowerCase();
    
    if (role === 'student') {
      return [
        { name: 'Dashboard', path: '/student-dashboard', icon: Home },
        { name: 'Scan QR', path: '/scan-qr', icon: Scan },
        { name: 'Reports', path: '/reports', icon: ClipboardList },
        { name: 'SCANOVA AI', path: '/scanova-ai', icon: Bot },
      ];
    }
    if (role === 'faculty') {
      return [
        { name: 'Dashboard', path: '/faculty-dashboard', icon: Home },
        { name: 'Generate QR', path: '/generate-qr', icon: QrCode },
        { name: 'Reports', path: '/faculty-reports', icon: ClipboardList },
      ];
    }
    if (role === 'admin') {
      return [
        { name: 'Admin Hub', path: '/admin-dashboard', icon: ShieldCheck },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-t-0 border-l-0 border-b-0 p-6 z-50 bg-[var(--sidebar-bg)]">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <QrCode className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase inline-block group-hover:scale-105 transition-transform">SCANOVA</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-emerald-600/10 text-emerald-500 shadow-sm' 
                    : 'hover:bg-emerald-500/5 text-gray-500 hover:text-emerald-400'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/5 text-gray-500 transition-all font-medium"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-emerald-600" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 glass-card rounded-2xl border-white/10 p-2 z-50 flex justify-around items-center h-16 shadow-2xl">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                isActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400'
              }`
            }
          >
            <link.icon className="w-6 h-6" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{link.name}</span>
          </NavLink>
        ))}
        
        <button 
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-gray-400"
        >
          {theme === 'dark' ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-emerald-600" />}
          <span className="text-[9px] font-bold uppercase tracking-tighter">Theme</span>
        </button>

        <button onClick={logout} className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-red-400">
          <LogOut className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">Exit</span>
        </button>
      </div>
    </>
  );
};

export default Navigation;


