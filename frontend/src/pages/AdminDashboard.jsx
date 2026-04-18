import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, ShieldCheck, X, Server } from 'lucide-react';
import API from '../api/api';
import ProfileSection from '../components/ProfileSection';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [message, setMessage] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0 });
  const [loading, setLoading] = useState(false);

  // Form States - User
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPassword, setUPassword] = useState('SCANOVA123'); // Default password
  const [uRole, setURole] = useState('Student');
  const [uStudentId, setUStudentId] = useState('');
  const [uFacultyId, setUFacultyId] = useState('');
  const [uBranch, setUBranch] = useState('');
  const [uYear, setUYear] = useState('');

  // Form States - Subject
  const [sCode, setSCode] = useState('');
  const [sName, setSName] = useState('');
  const [sBranch, setSBranch] = useState('');
  const [sYear, setSYear] = useState('');
  const [sSemester, setSSemester] = useState('Fall');
  const [sTime, setSTime] = useState('');

  // Filter States
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load backend data on mount
  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, statsRes, studentsRes] = await Promise.all([
        API.get('/subjects'),
        API.get('/users/stats'),
        API.get('/users/students')
      ]);
      setSubjects(subjRes.data);
      setStats(statsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       const payload = {
          user_id: `USR-${Date.now()}`,
          name: uName,
          email: uEmail,
          password: uPassword,
          role: uRole,
          student_id: uRole === 'Student' ? uStudentId : undefined,
          faculty_id: uRole === 'Faculty' ? uFacultyId : undefined,
          branch: uRole === 'Student' ? uBranch : undefined,
          year: uRole === 'Student' ? parseInt(uYear) : undefined,
          device_id: `device-${Date.now()}` // Default for admin-created users
       };

       await API.post('/auth/register', payload);
       
       setMessage(`Successfully created ${uRole}: ${uName}`);
       setShowUserModal(false);
       
       // Reset form
       setUName('');
       setUEmail('');
       setUStudentId('');
       setUFacultyId('');
       setUBranch('');
       setUYear('');
       
       fetchData(); // Refresh stats
       setTimeout(() => setMessage(''), 3000);
    } catch (err) {
       setMessage(`Error: ${err.response?.data?.message || 'Failed to create user'}`);
       setTimeout(() => setMessage(''), 5000);
    } finally {
       setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    console.log("Admin initiating subject registration...");
    try {
       const newSubject = {
          subject_id: sCode,
          subject_code: sCode,
          subject_name: sName,
          branch: sBranch.toUpperCase(),
          year: parseInt(sYear),
          semester: sSemester,
          class_time: sTime
       };

       const res = await API.post('/subjects', newSubject);

       if (res.status === 200 || res.status === 201) {
          setMessage(`Successfully registered: ${sName}`);
          setShowSubjectModal(false);
          setSCode('');
          setSName('');
          setSBranch('');
          setSYear('');
          fetchData(); 
          setTimeout(() => setMessage(''), 5000);
       } else {
          setMessage(`Error: ${res.data?.message || 'Failed to save subject'}`);
          setTimeout(() => setMessage(''), 5000);
       }
    } catch (err) {
       console.error("Browser Fetch Error:", err);
       setMessage(`System Error: ${err.response?.data?.message || err.message}`);
       setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6 relative">
      <ProfileSection user={user} />

      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-2xl z-[100] border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
           message.startsWith('Error') || message.startsWith('System') 
           ? 'bg-red-500/20 border-red-500 text-red-200' 
           : 'bg-green-500/20 border-green-500 text-green-200'
        }`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${message.startsWith('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
             <p className="font-bold tracking-wide">{message}</p>
          </div>
        </div>
      )}

      <header className="hidden">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-[#10B981] bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-gray-400 mt-2">Manage all system users, classes, and site-wide metadata.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between border-t-4 border-t-emerald-500">
           <div className="flex justify-between items-start">
             <p className="text-gray-400">Total Students</p>
             <Users className="w-6 h-6 text-emerald-500" />
           </div>
           <h3 className="text-3xl font-bold mt-4">{stats.totalStudents}</h3>
        </div>
        <div className="glass-card p-6 flex flex-col justify-between border-t-4 border-t-teal-500">
           <div className="flex justify-between items-start">
             <p className="text-gray-400">Total Faculty</p>
             <ShieldCheck className="w-6 h-6 text-teal-500" />
           </div>
           <h3 className="text-3xl font-bold mt-4">{stats.totalFaculty}</h3>
        </div>
        <div className="md:col-span-2 glass-card p-6 flex flex-col justify-between border-t-4 border-t-emerald-400 bg-emerald-500/5">
           <div className="flex justify-between items-start mb-2">
             <p className="text-emerald-300 font-semibold">Total Subjects Semester-wise</p>
             <Server className="w-6 h-6 text-emerald-500" />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-2 border-t border-emerald-500/20 pt-4">
               <div>
                   <p className="text-xs text-gray-400 uppercase tracking-wider">Fall Semester</p>
                   <p className="text-2xl font-bold text-white">{subjects.filter(s => s.semester === 'Fall').length} <span className="text-sm font-normal text-gray-500">active</span></p>
               </div>
               <div>
                   <p className="text-xs text-gray-400 uppercase tracking-wider">Spring Semester</p>
                   <p className="text-2xl font-bold text-white">{subjects.filter(s => s.semester === 'Spring').length} <span className="text-sm font-normal text-gray-500">active</span></p>
               </div>
           </div>
        </div>
      </div>
      
      <div className="glass-card p-6 mt-8">
         <h2 className="text-xl font-semibold mb-4 text-white">System Actions</h2>
         <div className="flex gap-4 flex-wrap">
            <button onClick={() => setShowUserModal(true)} className="primary-button bg-white/10 hover:bg-white/20 text-white border border-white/20">Add New User</button>
            <button onClick={() => setShowSubjectModal(true)} className="primary-button bg-white/10 hover:bg-white/20 text-white border border-white/20">Register Subject (Branch/Year)</button>
         </div>
      </div>

      {/* Registered Students Segment */}
      <div className="glass-card p-6 mt-8 border-t-4 border-t-emerald-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Registered Students
            </h2>
            <p className="text-sm text-gray-400 mt-1">Found {students.length} students in the system.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select 
               value={filterBranch} 
               onChange={e => setFilterBranch(e.target.value)}
               className="bg-[#0A0A09] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none min-w-[120px]"
             >
                <option value="">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECHANICAL">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="EEE">EEE</option>
             </select>

             <select 
               value={filterYear} 
               onChange={e => setFilterYear(e.target.value)}
               className="bg-[#0A0A09] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none min-w-[100px]"
             >
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
             </select>

             <div className="relative group/search flex-1 md:w-64">
                <input 
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0A0A09] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                />
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/search:text-emerald-500 transition-colors" />
             </div>

             <button onClick={fetchData} className="px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors">
               Refresh
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student Name</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student ID</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Branch / Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">Loading student data...</td>
                </tr>
              ) : (!filterBranch || !filterYear) && !searchQuery ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/10">
                          <Users className="w-6 h-6 text-emerald-500/40" />
                       </div>
                       <p className="text-gray-500 text-sm font-medium italic underline decoration-emerald-500/20 underline-offset-4">Select Branch & Year OR use the Search Bar to find students.</p>
                    </div>
                  </td>
                </tr>
              ) : (() => {
                  const filteredList = students.filter(s => {
                    const studentBranch = s.branch || '';
                    const studentYear = s.year ? s.year.toString() : '';
                    
                    const matchesBranch = !filterBranch || studentBranch.toLowerCase() === filterBranch.toLowerCase();
                    const matchesYear = !filterYear || studentYear === filterYear;
                    const matchesSearch = !searchQuery || 
                                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                          (s.student_id && s.student_id.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    return matchesBranch && matchesYear && matchesSearch;
                  });

                  if (filteredList.length === 0) {
                    return (
                      <tr>
                        <td colSpan="4" className="py-16 text-center text-gray-500 italic">No matching records found. Try adjusting filters or using the search bar.</td>
                      </tr>
                    );
                  }

                  return filteredList.map((student) => (
                    <tr key={student._id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50">
                            <span className="text-xs font-bold text-emerald-300">{(student.name || 'U').charAt(0)}</span>
                          </div>
                          <span className="font-medium text-white">{student.name || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300 font-mono text-sm">{student.student_id || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-400">{student.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20">
                          {student.branch || 'GENERAL'} {student.year ? `- Year ${student.year}` : ''}
                        </span>
                      </td>
                    </tr>
                  ));
              })()}
              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500 italic">No students registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-2xl relative border-emerald-500/50 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowUserModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent italic tracking-tighter uppercase">
              Register New System User
            </h2>

            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* identity group */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-500/20 pb-2">Identity Details</h4>
                <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                   <input type="text" required value={uName} onChange={e=>setUName(e.target.value)} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                   <input type="email" required value={uEmail} onChange={e=>setUEmail(e.target.value)} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Access Role</label>
                   <select value={uRole} onChange={e=>setURole(e.target.value)} className="w-full p-2.5 bg-[#050504] border border-white/10 rounded-xl text-white focus:border-emerald-500 outline-none">
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Admin">Admin</option>
                   </select>
                </div>
              </div>

              {/* profile group */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-teal-500/20 pb-2">Academic Profile</h4>
                
                {uRole === 'Student' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Student ID</label>
                       <input type="text" required value={uStudentId} onChange={e=>setUStudentId(e.target.value.toUpperCase())} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch</label>
                        <select value={uBranch} onChange={e=>setUBranch(e.target.value)} className="w-full p-2.5 bg-[#050504] border border-white/10 rounded-xl text-white focus:border-teal-500 outline-none">
                           <option value="">Select</option>
                           <option value="CSE">CSE</option>
                           <option value="ECE">ECE</option>
                           <option value="MECHANICAL">MECH</option>
                           <option value="CIVIL">CIVIL</option>
                           <option value="EEE">EEE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Year</label>
                        <select value={uYear} onChange={e=>setUYear(e.target.value)} className="w-full p-2.5 bg-[#050504] border border-white/10 rounded-xl text-white focus:border-teal-500 outline-none">
                           <option value="">Select</option>
                           <option value="1">Y1</option>
                           <option value="2">Y2</option>
                           <option value="3">Y3</option>
                           <option value="4">Y4</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {uRole === 'Faculty' && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Faculty ID</label>
                    <input type="text" required value={uFacultyId} onChange={e=>setUFacultyId(e.target.value.toUpperCase())} className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-teal-500 outline-none" />
                  </div>
                )}

                {uRole === 'Admin' && (
                  <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-center">
                    <p className="text-[10px] text-gray-500 italic uppercase">Standard Admin privileges will be assigned.</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <p className="text-[9px] text-gray-600 italic">User will be assigned default access key: "SCANOVA123"</p>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-50">
                  {loading ? 'Processing...' : 'Verify & Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal with Branch, Year and Semester */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg relative border-teal-500/50 shadow-2xl">
            <button onClick={() => setShowSubjectModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-6 text-emerald-300 border-b border-white/10 pb-2">Register Subject</h2>
            
            <form onSubmit={handleAddSubject} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Subject Code</label>
                    <input type="text" placeholder="e.g. CS101" required value={sCode} onChange={e=>setSCode(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors shadow-inner" />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Semester</label>
                    <select required value={sSemester} onChange={e=>setSSemester(e.target.value)} className="w-full p-2.5 bg-black/60 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors">
                       <option value="Fall">Fall Semester</option>
                       <option value="Spring">Spring Semester</option>
                       <option value="Summer">Summer Term</option>
                    </select>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-gray-300 mb-1">Full Subject Name</label>
                 <input type="text" placeholder="Introduction to Computer Science" required value={sName} onChange={e=>setSName(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors shadow-inner" />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-teal-500/5 p-4 border border-teal-500/20 rounded-lg">
                 <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Academic Branch</label>
                    <input list="branches" placeholder="Type or select branch..." required value={sBranch} onChange={e=>setSBranch(e.target.value.toUpperCase())} className="w-full p-2.5 bg-black/40 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors" />
                    <datalist id="branches">
                       <option value="CSE" label="Computer Science" />
                       <option value="ECE" label="Electronics & Comm." />
                       <option value="MECHANICAL" label="Mechanical" />
                       <option value="CIVIL" label="Civil Engineering" />
                       <option value="EEE" label="Electrical & Electronics" />
                    </datalist>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Class Time</label>
                    <input type="text" placeholder="e.g. 10:00 AM - 11:30 AM" required value={sTime} onChange={e=>setSTime(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors shadow-inner" />
                 </div>

                 <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Year of Study</label>
                    <input list="years" placeholder="Select Year (1-4)" required type="number" min="1" max="4" value={sYear} onChange={e=>setSYear(e.target.value)} className="w-full p-2.5 bg-black/40 border border-white/10 rounded text-white focus:border-teal-500 outline-none transition-colors" />
                    <datalist id="years">
                       <option value="1" />
                       <option value="2" />
                       <option value="3" />
                       <option value="4" />
                    </datalist>
                 </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all outline-none mt-6">
                 Submit New Class to Database
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

