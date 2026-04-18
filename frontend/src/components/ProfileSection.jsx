import React from 'react';
import { User, Mail, Hash, Book, Calendar, ShieldCheck } from 'lucide-react';

const ProfileSection = ({ user }) => {
  if (!user) return null;

  const isStudent = user?.role?.toLowerCase() === 'student';
  const isFaculty = user?.role?.toLowerCase() === 'faculty';

  return (
    <div className="glass-card overflow-hidden border-white/5 relative group mb-8 bg-[var(--glass-bg)]">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent"></div>
      
      <div className="p-4 md:p-6 pt-10 md:pt-12 relative flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-white/10 dark:border-white/10 shadow-2xl group-hover:border-emerald-500/50 transition-all duration-500 bg-black/5 dark:bg-black/40">
            <img 
              src={user.photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-600 rounded-lg border border-white/10 shadow-lg text-white">
            {isStudent ? <User size={12} /> : <ShieldCheck size={12} />}
          </div>
        </div>

        {/* Identity Info */}
        <div className="flex-1 text-center md:text-left space-y-1 w-full overflow-hidden">
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-color)] tracking-tight truncate">{user.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 mt-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest truncate max-w-full">
              <Mail size={12} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {isStudent && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <Hash size={12} className="text-teal-400 flex-shrink-0" />
                Roll: {user.student_id}
              </div>
            )}
            {isFaculty && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <Hash size={12} className="text-emerald-400 flex-shrink-0" />
                Faculty ID: {user.faculty_id}
              </div>
            )}
          </div>
        </div>

        {/* Academic/Professional Tags */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-2 md:mt-0">
          {user.branch && (
            <div className="px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Book size={12} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-gray-600 dark:text-gray-300">
                {isFaculty ? 'Dept' : 'Branch'}: {user.branch}
              </span>
            </div>
          )}
          {isStudent && user.year && (
            <div className="px-2.5 py-1 bg-teal-500/5 border border-teal-500/10 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Calendar size={12} className="text-teal-400" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-gray-600 dark:text-gray-300">
                Year: {user.year}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

