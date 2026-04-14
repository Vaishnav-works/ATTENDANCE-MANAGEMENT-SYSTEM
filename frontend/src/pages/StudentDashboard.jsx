import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome, {user?.name || 'Student'}
        </h1>
        <p className="text-gray-400 mt-2">Ready to mark today's attendance?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex flex-col justify-between">
           <h3 className="text-xl font-semibold mb-2">Upcoming Classes</h3>
           <p className="text-gray-400">No upcoming classes in the next hour.</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
           {/* Decorative background element */}
           <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
           
           <h3 className="text-xl font-semibold text-white mb-2 z-10">Overall Attendance</h3>
           <div className="z-10 mt-2">
              <div className="flex items-end gap-3">
                 <p className="text-4xl font-bold text-green-400">82%</p>
                 <span className="text-sm font-medium text-green-500/80 mb-1 bg-green-500/10 px-2 py-1 rounded">On Track!</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                 <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Attended</p>
                    <p className="text-lg font-semibold text-white">34 <span className="text-sm text-gray-500 font-normal">classes</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-semibold text-white">42 <span className="text-sm text-gray-500 font-normal">classes</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
