import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-purple-400 bg-clip-text text-transparent">
          Faculty Control Panel
        </h1>
        <p className="text-gray-400 mt-2">Manage sessions and generate QR codes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-[#6366F1]">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Subjects</h2>
          <div className="space-y-4">
            <div onClick={() => navigate('/generate-qr')} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#6366F1] transition-colors cursor-pointer group">
               <h3 className="text-lg font-bold group-hover:text-[#6366F1]">Introduction to Computer Science</h3>
               <p className="text-gray-400">CS101 • 142 Enrolled Students</p>
               <p className="text-xs text-indigo-400 mt-2 font-semibold">Click to Start Session</p>
            </div>
            <div onClick={() => navigate('/generate-qr')} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#6366F1] transition-colors cursor-pointer group">
               <h3 className="text-lg font-bold group-hover:text-[#6366F1]">Data Structures & Algorithms</h3>
               <p className="text-gray-400">CS201 • 89 Enrolled Students</p>
               <p className="text-xs text-indigo-400 mt-2 font-semibold">Click to Start Session</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-teal-500">
           <h2 className="text-2xl font-semibold text-white mb-4">Quick Stats</h2>
           <div className="space-y-4">
             <div className="flex justify-between items-center pb-2 border-b border-white/10">
               <span className="text-gray-400">Total Classes Conducted</span>
               <span className="font-bold text-xl">14</span>
             </div>
             <div className="flex justify-between items-center pb-2 border-b border-white/10">
               <span className="text-gray-400">Average Attendance</span>
               <span className="font-bold text-xl text-teal-400">88%</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
