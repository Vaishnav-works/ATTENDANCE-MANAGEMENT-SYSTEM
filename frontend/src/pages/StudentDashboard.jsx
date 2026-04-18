import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, MapPin, Clock } from 'lucide-react';
import ProfileSection from '../components/ProfileSection';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Mock data representing the student's enrolled subjects
  const enrolledSubjects = [
     {
        code: 'CS101',
        name: 'Introduction to Computer Science',
        faculty: 'Dr. John Doe',
        attendance: 85,
        totalClasses: 20,
        attendedClasses: 17,
        location: 'Room 304 (Tech Building)',
        status: 'On Track'
     },
     {
        code: 'MATH202',
        name: 'Advanced Calculus',
        faculty: 'Prof. Alan Turing',
        attendance: 72,
        totalClasses: 22,
        attendedClasses: 16,
        location: 'Room 101 (Main Hall)',
        status: 'Warning'
     }
  ];

  return (
    <div className="space-y-6">
      <ProfileSection user={user} />
      
      <header className="hidden">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome, {user?.name || 'Student'}
        </h1>
        <p className="text-gray-400 mt-2">Ready to mark today's attendance?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 flex flex-col justify-between">
           <h3 className="text-xl font-semibold mb-2">Upcoming Classes</h3>
           <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-4">
               <div className="bg-emerald-500 p-3 rounded-lg text-white">
                  <Clock size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-white">Advanced Calculus</h4>
                  <p className="text-sm text-gray-400">Starts in 45 mins • Room 101</p>
               </div>
           </div>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
           {/* Decorative background element */}
           <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
           
           <h3 className="text-xl font-semibold text-white mb-2 z-10">Overall Attendance</h3>
           <div className="z-10 mt-2">
              <div className="flex items-end gap-3">
                 <p className="text-4xl font-bold text-emerald-400">82%</p>
                 <span className="text-sm font-medium text-emerald-500/80 mb-1 bg-emerald-500/10 px-2 py-1 rounded">On Track!</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                 <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Attended</p>
                    <p className="text-lg font-semibold text-white">33 <span className="text-sm text-gray-500 font-normal">classes</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-semibold text-white">42 <span className="text-sm text-gray-500 font-normal">classes</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Enrolled Subjects List Section */}
      <h2 className="text-xl font-bold text-white mt-10 mb-4 flex items-center gap-2">
         <BookOpen size={24} className="text-emerald-400" />
         My Subjects & Details
      </h2>
      <div className="grid grid-cols-1 gap-4">
         {enrolledSubjects.map((sub, idx) => (
            <div key={idx} className="glass-card p-5 border border-white/5 hover:border-white/10 transition-colors">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  {/* Subject Info */}
                  <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/20 text-emerald-300 font-mono text-xs px-2 py-1 rounded border border-emerald-500/30">{sub.code}</span>
                        <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                     </div>
                     <p className="text-sm text-gray-400 flex items-center gap-1">
                        Lecturer: <span className="text-gray-300">{sub.faculty}</span>
                     </p>
                     <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
                        <MapPin size={14} className="text-teal-400" />
                        {sub.location}
                     </p>
                  </div>

                  {/* Attendance Breakdown */}
                  <div className="flex flex-col items-end min-w-[200px] border-l border-white/10 pl-6">
                     <div className="flex justify-between w-full mb-1">
                        <span className="text-sm text-gray-400">Class Attendance</span>
                        <span className={`text-sm font-bold ${sub.attendance >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                           {sub.attendance}%
                        </span>
                     </div>
                     
                     {/* Custom Progress Bar */}
                     <div className="w-full h-2 bg-white/10 rounded-full mb-2 overflow-hidden shadow-inner">
                        <div 
                           className={`h-full rounded-full ${sub.attendance >= 75 ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-1000`} 
                           style={{ width: `${sub.attendance}%` }}
                        ></div>
                     </div>
                     
                     <div className="flex justify-between w-full text-xs text-gray-500">
                        <span>{sub.attendedClasses} Attended</span>
                        <span>{sub.totalClasses} Total</span>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

