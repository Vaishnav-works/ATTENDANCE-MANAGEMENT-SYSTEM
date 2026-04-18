import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Clock, CheckCircle, QrCode, BookOpen, Users, Wifi } from 'lucide-react';
import API from '../api/api';

const QRGenerator = () => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live scan tracking
  const [scannedStudents, setScannedStudents] = useState([]);
  const pollRef = useRef(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get('/subjects');
        setSubjects(res.data);
      } catch (err) { console.error('Error fetching subjects:', err); }
    };
    fetchSubjects();
  }, []);

  const branches = [...new Set(subjects.map(s => s.branch))];
  const years = [...new Set(subjects.filter(s => s.branch === selectedBranch).map(s => s.year))];
  const filteredSubjects = subjects.filter(s => s.branch === selectedBranch && s.year === parseInt(selectedYear));

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && session) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && session) {
      setSession(null);
      setScannedStudents([]);
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [timeLeft, session]);

  // Poll for QR scans while session is active
  const fetchScans = async (subjectId) => {
    try {
      const res = await API.get(`/attendance/subject/${subjectId}`);
      // Filter only QR scans (not manual — distance_from_class will be present for QR)
      const qrScans = res.data.filter(a => a.distance_from_class !== undefined && a.distance_from_class !== null);
      setScannedStudents(qrScans);
    } catch (err) { console.error('Error fetching scans:', err); }
  };

  useEffect(() => {
    if (session && selectedSubject) {
      fetchScans(selectedSubject._id);
      pollRef.current = setInterval(() => fetchScans(selectedSubject._id), 4000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [session]);

  const startSession = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError('');
    setScannedStudents([]);

    const generate = async (lat, lng) => {
      try {
        const res = await API.post('/qr/generate', { subject_id: selectedSubject._id, latitude: lat, longitude: lng });
        setSession(res.data); 
        setTimeLeft(60);
      } catch (err) { 
        setError(err.response?.data?.message || 'Network error. Check if backend is running.'); 
      }
      finally { setLoading(false); }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => generate(pos.coords.latitude, pos.coords.longitude),
        () => { 
          setError('Location access is required to define the classroom boundary.'); 
          setLoading(false); 
        },
        { enableHighAccuracy: true }
      );
    } else { 
      setError('Geolocation not supported.'); 
      setLoading(false); 
    }
  };

  const simulateLocation = () => {
    setLoading(true);
    setError('');
    // Use default coordinates (from seed.js) for simulation
    setTimeout(() => {
      const lat = 12.9716;
      const lng = 77.5946;
      
      const generate = async (lat, lng) => {
        try {
          const res = await API.post('/qr/generate', { subject_id: selectedSubject._id, latitude: lat, longitude: lng });
          setSession(res.data); 
          setTimeLeft(60);
        } catch (err) { 
          setError(err.response?.data?.message || 'Network error. Check if backend is running.'); 
        }
        finally { setLoading(false); }
      };
      
      generate(lat, lng);
    }, 800);
  };

  const reset = () => {
    setSession(null);
    setScannedStudents([]);
    setSelectedBranch('');
    setSelectedYear('');
    setSelectedSubject(null);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const circumference = 2 * Math.PI * 26;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  // ── ACTIVE SESSION VIEW ──────────────────────────
  if (session) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent italic tracking-tighter uppercase">SCANOVA Session Live</h1>
          <p className="text-gray-500 mt-1 text-sm italic">
            {selectedSubject?.subject_name} · {selectedBranch} Y{selectedYear}
            {selectedSubject?.class_time && ` · ${selectedSubject.class_time}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Card */}
          <div className="glass-card p-10 flex flex-col items-center relative border-emerald-500/40 shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black flex items-center gap-2 shadow-lg">
              <Clock size={12} /> EXPIRES IN {timeLeft}S
            </div>
            <svg className="absolute top-4 right-4 opacity-30" width="56" height="56">
              <circle cx="28" cy="28" r="26" fill="none" stroke="#10B981" strokeWidth="3"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" transform="rotate(-90 28 28)" />
            </svg>

            <div className="w-64 h-64 bg-white p-5 rounded-2xl flex items-center justify-center shadow-inner">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=230x230&data=${session.qr_token}`} alt="QR Code" />
            </div>

            <div className="mt-6 text-center space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                <CheckCircle size={18} className="text-green-400" /> Session Active
              </h3>
              
              <div className="flex flex-col items-center gap-2 mt-2">
                <p className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
                   SESSION TOKEN: <span className="text-emerald-300 select-all">{session.qr_token}</span>
                </p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(session.qr_token);
                    alert("Token copied to clipboard!");
                  }}
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 rounded transition-all"
                >
                  Copy Token for Testing
                </button>
              </div>
            </div>

            <button onClick={reset} className="mt-5 text-xs text-gray-600 hover:text-gray-400 transition-colors underline">
              Cancel & start new session
            </button>
          </div>

          {/* Live Scan Counter */}
          <div className="glass-card p-6 flex flex-col border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                <Wifi size={14} className="animate-pulse" /> Live QR Scans
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-4xl font-black text-green-400">{scannedStudents.length}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4 font-bold">
              Students scanned in this session · updates every 4s
            </p>

            {scannedStudents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <Users size={40} className="text-gray-700 mb-3" />
                <p className="text-gray-600 text-sm italic">Waiting for students to scan...</p>
                <p className="text-gray-700 text-xs mt-1">Show the QR on screen and ask students to scan.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto space-y-2">
                {scannedStudents.map((att, i) => (
                  <div key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15 animate-in slide-in-from-right-4 duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-black text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{att.student_id?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{new Date(att.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SETUP VIEW ──────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent italic tracking-tighter uppercase">Generate QR</h1>
        <p className="text-gray-500 mt-1 text-sm italic">Select your class to start a live attendance session.</p>
      </div>

      {/* STEP 1: BRANCH */}
      <div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
          Select Branch
        </p>
        <div className="flex flex-wrap gap-3">
          {branches.length === 0 && <p className="text-gray-600 text-sm italic">No subjects found. Ask admin to create subjects.</p>}
          {branches.map(b => (
            <button key={b}
              onClick={() => { setSelectedBranch(b); setSelectedYear(''); setSelectedSubject(null); }}
              className={`px-6 py-3 rounded-xl border font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 ${
                selectedBranch === b ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: YEAR */}
      {selectedBranch && (
        <div className="animate-in slide-in-from-left-4 duration-300">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
            Select Year
          </p>
          <div className="flex flex-wrap gap-3">
            {years.map(y => (
              <button key={y}
                onClick={() => { setSelectedYear(String(y)); setSelectedSubject(null); }}
                className={`px-6 py-3 rounded-xl border font-black tracking-widest text-sm transition-all hover:scale-105 active:scale-95 ${
                  selectedYear === String(y) ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}>
                Year {y}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: SUBJECT */}
      {selectedYear && (
        <div className="animate-in slide-in-from-left-4 duration-300">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
            Select Subject
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSubjects.map(sub => (
              <button key={sub._id}
                onClick={() => setSelectedSubject(sub)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${
                  selectedSubject?._id === sub._id ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}>
                <div className="font-bold text-white text-sm">{sub.subject_name}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 flex gap-3">
                  <span className="text-emerald-400/70">{sub.subject_code}</span>
                  {sub.class_time && <span>🕐 {sub.class_time}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM CARD: Summary + Generate */}
      {selectedSubject && (
        <div className="glass-card p-6 space-y-4 border-t-4 border-t-emerald-500/60 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <BookOpen size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{selectedSubject.subject_name}</p>
              <p className="text-[10px] text-gray-400 font-mono">
                {selectedBranch} · Year {selectedYear} · {selectedSubject.subject_code}
                {selectedSubject.class_time && ` · ${selectedSubject.class_time}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="space-y-3">
              <div className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle size={14} /> {error}
              </div>
              <button 
                onClick={simulateLocation}
                className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500/20 transition-all"
              >
                Simulate Location for Testing
              </button>
            </div>
          )}

          <button
            onClick={startSession}
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <QrCode size={18} />
            {loading ? 'Initializing Geofence...' : 'Generate Secure QR'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;

