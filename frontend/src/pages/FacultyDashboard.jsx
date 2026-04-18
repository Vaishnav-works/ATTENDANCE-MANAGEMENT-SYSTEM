import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import API from '../api/api';
import ProfileSection from '../components/ProfileSection';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filtering states
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  
  // Student list states
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Today's actual scans/marks
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all subjects for this faculty
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get('/subjects');
        setSubjects(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchSubjects();
  }, []);

  const fetchAttendance = async () => {
    if (!selectedSubjectId) return;
    try {
      const res = await API.get(`/attendance/subject/${selectedSubjectId}`);
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  // Fetch students and attendance when subject changes
  useEffect(() => {
    if (selectedSubjectId) {
      const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
          const res = await API.get(`/enroll/subject/${selectedSubjectId}/students`);
          setStudents(res.data);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoadingStudents(false);
        }
      };
      
      fetchStudents();
      fetchAttendance();
      
      // Auto-refresh every 5 seconds while subject is selected
      const interval = setInterval(fetchAttendance, 5000);
      return () => clearInterval(interval);
    } else {
      setStudents([]);
      setAttendanceRecords([]);
    }
  }, [selectedSubjectId]);

  // Derived filtering logic
  const branches = [...new Set(subjects.map(s => s.branch))];
  const years = [...new Set(subjects.filter(s => s.branch === selectedBranch).map(s => s.year))];
  const filteredSubjects = subjects.filter(s => s.branch === selectedBranch && s.year === parseInt(selectedYear));

  const markManual = async (studentId) => {
    setMarkingId(studentId);
    try {
      const res = await API.post('/attendance/manual', {
        student_id: studentId,
        subject_id: selectedSubjectId,
        status: 'Present'
      });

      if (res.status === 200 || res.status === 201) {
        setMessage('Attendance Marked Successfully!');
        fetchAttendance(); // Refresh live status
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error marking attendance');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setMarkingId(null);
    }
  };

  const downloadCSV = () => {
    if (!students.length) return alert("Register must have students to export.");
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student ID,Full Name,Email,Status,Time of Class\n";
    
    // Rows
    const subject = subjects.find(s => s._id === selectedSubjectId);
    students.forEach(student => {
      const row = [
        student.student_id || student._id,
        student.name,
        student.email,
        "PRESENT (MANUAL)",
        subject?.class_time || "TBD"
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${subject?.subject_code}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadActivityReport = async () => {
    if (!selectedSubjectId) return;
    try {
      const res = await API.get(`/attendance/subject/${selectedSubjectId}`);
      const data = res.data;
      
      if (!data.length) return alert("No attendance records found for today yet.");

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Student Name,Student ID,Email,Scan Time,Distance (m),Status\n";

      data.forEach(att => {
        const row = [
          att.student_id?.name || 'Unknown',
          att.student_id?.student_id || 'N/A',
          att.student_id?.email || 'N/A',
          new Date(att.timestamp).toLocaleTimeString(),
          att.distance_from_class ? Math.ceil(att.distance_from_class) : 'Manual',
          att.status
        ].join(",");
        csvContent += row + "\n";
      });

      const subject = subjects.find(s => s._id === selectedSubjectId);
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Activity_Report_${subject?.subject_code}_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Error generating activity report");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ProfileSection user={user} />
      
      <header className="hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-200 bg-clip-text text-transparent">
             SCANOVA Faculty Portal
           </h1>
           <p className="text-gray-400 mt-2 font-medium">Precision attendance management with dynamic filtering.</p>
        </div>
        <div className="flex gap-4">
           {selectedSubjectId && (
             <>
               <button 
                 onClick={downloadActivityReport}
                 className="glass-card px-4 py-2 flex items-center gap-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all text-emerald-400 font-bold text-xs uppercase shadow-lg shadow-emerald-500/10"
               >
                  Generate Activity Report
               </button>
               <button 
                 onClick={downloadCSV}
                 className="glass-card px-4 py-2 flex items-center gap-2 border-green-500/20 hover:border-green-500/50 transition-all text-green-400 font-bold text-xs uppercase"
               >
                  Download Registry (CSV)
               </button>
             </>
           )}
           <div className="glass-card px-4 py-2 flex items-center gap-2 border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">System Online</span>
           </div>
        </div>
      </header>

      {/* 3-Step Filter UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="glass-card p-6 border-b-2 border-b-emerald-500/30">
            <label className="text-xs font-bold text-emerald-400 uppercase mb-4 block tracking-tighter">Step 1: Discipline</label>
            <select 
               value={selectedBranch}
               onChange={(e) => { setSelectedBranch(e.target.value); setSelectedYear(''); setSelectedSubjectId(''); }}
               className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white focus:border-emerald-500 outline-none transition-all"
            >
               <option value="">Select Branch...</option>
               {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
         </div>

         <div className={`glass-card p-6 border-b-2 border-b-teal-500/30 transition-all ${!selectedBranch ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <label className="text-xs font-bold text-teal-400 uppercase mb-4 block tracking-tighter">Step 2: Academic Year</label>
            <select 
               value={selectedYear}
               onChange={(e) => { setSelectedYear(e.target.value); setSelectedSubjectId(''); }}
               className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white focus:border-teal-500 outline-none transition-all"
            >
               <option value="">Select Year...</option>
               {years.map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
         </div>

         <div className={`glass-card p-6 border-b-2 border-b-emerald-500/30 font-bold transition-all ${!selectedYear ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <label className="text-xs font-bold text-emerald-300 uppercase mb-4 block tracking-tighter">Step 3: Course Module</label>
            <select 
               value={selectedSubjectId}
               onChange={(e) => setSelectedSubjectId(e.target.value)}
               className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white focus:border-emerald-500 outline-none transition-all"
            >
               <option value="">Select Subject...</option>
               {filteredSubjects.map(s => <option key={s._id} value={s._id}>{s.subject_name} ({s.subject_code})</option>)}
            </select>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* Manual Registry Table */}
         <div className="xl:col-span-3">
            <div className="glass-card min-h-[400px] flex flex-col relative overflow-hidden border-white/5">
               {/* Decorative background glow */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

               <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/5 gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <Users className="text-emerald-400" size={24} />
                     <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Manual Attendance Registry</h2>
                        {selectedSubjectId && (
                           <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mt-1">
                              Time: {subjects.find(s=>s._id===selectedSubjectId)?.class_time || 'No Schedule Set'}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Search Bar */}
                  {selectedSubjectId && (
                    <div className="relative w-full md:w-64 group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                       <input 
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-2 pl-9 rounded-xl text-sm text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                       />
                    </div>
                  )}

                  {message && (
                    <div className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-xs font-bold border border-green-500/30 animate-bounce">
                       {message}
                    </div>
                  )}
               </div>

               <div className="flex-1 overflow-x-auto">
                  {!selectedSubjectId ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Search className="text-gray-500" size={32} />
                       </div>
                       <p className="text-gray-500 max-w-xs">Complete the 3-step filtering above to view the student registry.</p>
                    </div>
                  ) : loadingStudents ? (
                    <div className="p-12 text-center animate-pulse text-emerald-400 font-bold uppercase tracking-widest">
                       Accessing Enrollment Database...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No students enrolled in this subject.</div>
                  ) : (
                    <table className="w-full text-left">
                       <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-widest">
                          <tr>
                             <th className="p-4">Student ID</th>
                             <th className="p-4">Full Name</th>
                             <th className="p-4">Email Address</th>
                             <th className="p-4 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {students
                            .filter(student => 
                               student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (student.student_id && student.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
                            )
                            .map(student => {
                             const attendance = attendanceRecords.find(a => a.student_id?._id === student._id);
                             const isPresent = !!attendance;
                             
                             return (
                               <tr key={student._id} className={`hover:bg-white/5 transition-colors group ${isPresent ? 'bg-emerald-500/5' : ''}`}>
                                  <td className="p-4 text-emerald-300 font-mono text-sm">{student.student_id || 'STU-' + student._id.slice(-4)}</td>
                                  <td className="p-4">
                                     <div className="font-semibold text-white">{student.name}</div>
                                     {isPresent && (
                                       <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">
                                          Scanned at {new Date(attendance.timestamp).toLocaleTimeString()}
                                       </div>
                                     )}
                                  </td>
                                  <td className="p-4 text-gray-400 text-sm italic">{student.email}</td>
                                  <td className="p-4 text-right">
                                     {isPresent ? (
                                       <div className="flex items-center justify-end gap-2 text-green-400 font-black text-xs uppercase italic tracking-widest animate-in fade-in zoom-in duration-500">
                                          <ShieldCheck size={14} /> Present
                                       </div>
                                     ) : (
                                       <button 
                                          onClick={() => markManual(student._id)}
                                          disabled={markingId === student._id}
                                          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition-all 
                                            ${markingId === student._id 
                                              ? 'bg-gray-500 cursor-not-allowed' 
                                              : 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20'}`}
                                       >
                                          {markingId === student._id ? 'Processing...' : 'Mark Present'}
                                       </button>
                                     )}
                                  </td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                  )}
               </div>
            </div>
         </div>

         {/* Registry Summary */}
         <div className="space-y-4">
            <div className="glass-card p-6 border-l-4 border-l-emerald-500">
               <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                  <Users size={16} /> Class Summary
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-400">Enrolled Students</span>
                     <span className="text-white font-black text-lg">{students.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-400">Mark Today</span>
                     <span className="text-green-400 font-bold">{attendanceRecords.length} Present</span>
                  </div>
                  {students.length > 0 && (
                     <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                           <span className="uppercase tracking-widest font-bold">Attendance Rate</span>
                           <span className="font-black text-white">{Math.round((attendanceRecords.length / students.length) * 100) || 0}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                           <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${Math.round((attendanceRecords.length / students.length) * 100) || 0}%` }}
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="glass-card p-5 bg-emerald-500/5 border border-emerald-500/15 text-center">
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Live QR Scan Counter</p>
               <p className="text-xs text-gray-500 leading-relaxed">
                  Go to <span className="text-emerald-400 font-bold">Generate QR</span> in the sidebar to see real-time student scans during an active session.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
};

export default FacultyDashboard;

