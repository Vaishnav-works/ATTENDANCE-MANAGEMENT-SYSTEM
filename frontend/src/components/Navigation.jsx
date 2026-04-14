import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, QrCode, ClipboardList, LogOut, Scan, ShieldCheck } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    if (!user) return [];
    if (user.role === 'Student') {
      return [
        { name: 'Dashboard', path: '/student-dashboard', icon: Home },
        { name: 'Scan QR', path: '/scan-qr', icon: Scan },
        { name: 'Reports', path: '/reports', icon: ClipboardList },
      ];
    }
    if (user.role === 'Faculty') {
      return [
        { name: 'Dashboard', path: '/faculty-dashboard', icon: Home },
        { name: 'Generate QR', path: '/generate-qr', icon: QrCode },
      ];
    }
    if (user.role === 'Admin') {
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
      <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-t-0 border-l-0 border-b-0 p-6 z-50">
        <div className="flex items-center gap-3 mb-10 text-xl font-bold text-indigo-400">
          <QrCode className="w-8 h-8" />
          AuraAI Attendance
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/5 text-gray-300'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-white/5 rounded-lg mt-auto transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-none border-l-0 border-r-0 border-b-0 p-3 z-50 flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-indigo-400' : 'text-gray-400'
              }`
            }
          >
            <link.icon className="w-6 h-6" />
            <span className="text-[10px]">{link.name}</span>
          </NavLink>
        ))}
        <button onClick={logout} className="flex flex-col items-center gap-1 p-2 text-red-400">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px]">Logout</span>
        </button>
      </div>
    </>
  );
};

export default Navigation;
