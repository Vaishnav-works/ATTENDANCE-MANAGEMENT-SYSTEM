import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, ShieldCheck, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [message, setMessage] = useState('');

  // Form States
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState('Student');

  const [sCode, setSCode] = useState('');
  const [sName, setSName] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    // Simulate API Call success
    setMessage(`Successfully created ${uRole}: ${uName}`);
    setShowUserModal(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    // Simulate API Call success
    setMessage(`Successfully registered Subject: ${sName}`);
    setShowSubjectModal(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {message && (
        <div className="absolute top-0 right-0 bg-green-500/20 text-green-300 border border-green-500 p-3 rounded shadow-lg z-50">
          {message}
        </div>
      )}

      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-[#6366F1] bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-gray-400 mt-2">Manage all system users, classes, and site-wide metadata.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-blue-500">
           <div>
             <p className="text-gray-400">Total Students</p>
             <h3 className="text-2xl font-bold">142</h3>
           </div>
           <Users className="w-10 h-10 text-blue-500/50" />
        </div>
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-green-500">
           <div>
             <p className="text-gray-400">Total Faculty</p>
             <h3 className="text-2xl font-bold">18</h3>
           </div>
           <ShieldCheck className="w-10 h-10 text-green-500/50" />
        </div>
        <div className="glass-card p-6 flex items-center justify-between border-l-4 border-l-purple-500">
           <div>
             <p className="text-gray-400">Active Subjects</p>
             <h3 className="text-2xl font-bold">24</h3>
           </div>
           <BookOpen className="w-10 h-10 text-purple-500/50" />
        </div>
      </div>
      
      <div className="glass-card p-6 mt-8">
         <h2 className="text-xl font-semibold mb-4 text-white">System Actions</h2>
         <div className="flex gap-4 flex-wrap">
            <button onClick={() => setShowUserModal(true)} className="primary-button bg-white/10 hover:bg-white/20 text-white border border-white/20">Add New User</button>
            <button onClick={() => setShowSubjectModal(true)} className="primary-button bg-white/10 hover:bg-white/20 text-white border border-white/20">Register Subject</button>
            <button className="primary-button bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 cursor-not-allowed opacity-50">System Audit Log (Locked)</button>
         </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md relative border-[#6366F1]/50">
            <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                 <input type="text" required value={uName} onChange={e=>setUName(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white focus:border-[#6366F1] outline-none" />
              </div>
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Email</label>
                 <input type="email" required value={uEmail} onChange={e=>setUEmail(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white focus:border-[#6366F1] outline-none" />
              </div>
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Role</label>
                 <select value={uRole} onChange={e=>setURole(e.target.value)} className="w-full p-2 bg-[#121212] border border-white/10 rounded text-white focus:border-[#6366F1] outline-none">
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                 </select>
              </div>
              <button type="submit" className="w-full primary-button mt-4">Create User</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md relative border-purple-500/50">
            <button onClick={() => setShowSubjectModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-4">Register Subject</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Subject Code</label>
                 <input type="text" placeholder="e.g. CS101" required value={sCode} onChange={e=>setSCode(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Subject Name</label>
                 <input type="text" required value={sName} onChange={e=>setSName(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white focus:border-purple-500 outline-none" />
              </div>
              <button type="submit" className="w-full primary-button !bg-purple-600 hover:!bg-purple-500 mt-4">Create Subject</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
