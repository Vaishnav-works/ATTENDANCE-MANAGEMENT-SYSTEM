import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, Download, Filter, Calendar, Search, CheckCircle, Clock, MapPin } from 'lucide-react';
import API from '../api/api';

const FacultyReports = () => {
  const { user } = useAuth();
  
  // Data State
  const [subjects, setSubjects] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering States
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [dateRange, setDateRange] = useState('today'); // today, yesterday, week, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Initial Data Load
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

  const filteredSubjects = subjects.filter(s => 
    (!selectedBranch || s.branch === selectedBranch) && 
    (!selectedYear || s.year === parseInt(selectedYear))
  );

  const fetchReport = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    try {
      const params = {};

      const today = new Date();
      if (dateRange === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(0,0,0,0);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23,59,59,999);
        params.startDate = yesterday.toISOString();
        params.endDate = endOfYesterday.toISOString();
      } else if (dateRange === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        params.startDate = lastWeek.toISOString();
      } else if (dateRange === 'custom' && customStartDate) {
        params.startDate = new Date(customStartDate).toISOString();
        if (customEndDate) params.endDate = new Date(customEndDate).toISOString();
      }

      const res = await API.get(`/attendance/subject/${selectedSubjectId}`, { params });
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (reportData.length === 0) return;
    
    const headers = ["Student Name", "ID", "Email", "Date", "Time", "Status", "Distance (m)"];
    const rows = reportData.map(att => [
      att.student_id?.name || 'Unknown',
      att.student_id?.student_id || 'N/A',
      att.student_id?.email || 'N/A',
      new Date(att.timestamp).toLocaleDateString(),
      new Date(att.timestamp).toLocaleTimeString(),
      att.status,
      att.distance_from_class ? Math.ceil(att.distance_from_class) : 'Manual'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Report_${selectedSubjectId}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-100 via-emerald-400 to-teal-500 bg-clip-text text-transparent italic tracking-tighter uppercase">
            SCANOVA Reporting Hub
          </h1>
          <p className="text-gray-500 font-medium italic mt-1">Generate and export historical attendance insights.</p>
        </div>
        <button 
          onClick={downloadCSV}
          disabled={reportData.length === 0}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Main Filter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-emerald-500 space-y-4">
            <h3 className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">
              <Filter size={16} /> Data Selection
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Course Selection</label>
                <select 
                  value={selectedSubjectId} 
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm appearance-none"
                >
                  <option value="" className="bg-neutral-900">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id} value={s._id} className="bg-neutral-900">{s.subject_name} ({s.subject_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Time Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {['today', 'yesterday', 'week', 'custom'].map(range => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border ${
                        dateRange === range 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {range === 'week' ? 'Last 7 Days' : range}
                    </button>
                  ))}
                </div>
              </div>

              {dateRange === 'custom' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <input 
                    type="date" 
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <input 
                    type="date" 
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>
              )}

              <button 
                onClick={fetchReport}
                disabled={!selectedSubjectId || (dateRange === 'custom' && !customStartDate)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 group"
              >
                {loading ? <Clock className="animate-spin" size={16} /> : <Search size={16} className="group-hover:scale-110 transition-transform" /> }
                Generate Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview Table */}
        <div className="lg:col-span-3">
          <div className="glass-card h-[600px] flex flex-col overflow-hidden relative border-t-4 border-t-emerald-500/50">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-emerald-400 font-bold animate-pulse text-xs tracking-widest uppercase">Fetching Historical Data...</p>
              </div>
            ) : reportData.length > 0 ? (
              <>
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Activity Preview ({reportData.length} records found)</h4>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/10">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Student Info</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Date & Time</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Verification</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-emerald-400 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reportData.map((att, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{att.student_id?.name || 'Unknown'}</div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-tighter">{att.student_id?.student_id || 'N/A'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs text-gray-300 font-medium">{new Date(att.timestamp).toLocaleDateString()}</div>
                            <div className="text-[10px] text-emerald-400/70 font-mono">{new Date(att.timestamp).toLocaleTimeString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                               <MapPin size={12} className={att.distance_from_class ? 'text-emerald-400' : 'text-gray-600'} />
                               <span className="text-[10px] font-bold text-gray-400 italic">
                                 {att.distance_from_class ? `${Math.ceil(att.distance_from_class)}m dev` : 'Faculty Manual'}
                               </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                             <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/20 uppercase">
                               {att.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 <div className="bg-white/5 p-8 rounded-full mb-6 border border-white/5">
                    <ClipboardList size={64} className="text-gray-700" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-2 italic">Ready for Analysis</h2>
                 <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                   Select a subject and date range on the left to pull historical attendance reports.
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyReports;

