import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import API from '../api/api';

const ScanQR = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('Idle'); // Idle, Scanning, Validating, Success, Failed
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedToken, setScannedToken] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Cleanup Error:", err));
      }
    };
  }, []);

  const startScanner = async () => {
    setStatus('Scanning');
    setErrorMessage('');
    
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await scanner.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
           // Success! Stop scanner and proceed to geolocation
           stopScanner();
           handleScannedToken(decodedText);
        },
        (errorMessage) => {
           // Silently continue scanning
        }
      );
    } catch (err) {
      console.error("Scanner Start Error:", err);
      setStatus('Failed');
      setErrorMessage('Camera access denied or device not found.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Stop Error:", err);
      }
    }
  };

  const handleScannedToken = (token) => {
    setScannedToken(token);
    setStatus('Validating');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          submitAttendance(token, position.coords.latitude, position.coords.longitude);
        },
        (err) => {
           setStatus('Failed');
           setErrorMessage('Location permission required for geofence check.');
        },
        { enableHighAccuracy: true }
      );
    } else {
       setStatus('Failed');
       setErrorMessage('Geolocation not supported.');
    }
  };

  const submitAttendance = async (token, lat, lng) => {
    try {
      const response = await API.post('/attendance/mark', {
        qr_token: token,
        latitude: lat,
        longitude: lng,
        device_id: user.device_id,
        attendance_id: `ATT-${Date.now()}`
      });

      if (response.status === 200 || response.status === 201) {
        setStatus('Success');
      } else {
        setStatus('Failed');
        setErrorMessage(response.data?.message || 'Verification Failed');
      }
    } catch (err) {
      setStatus('Failed');
      setErrorMessage(err.response?.data?.message || 'Network error. Database unreachable.');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2 italic tracking-tighter uppercase">SCANOVA Real-Time Scan</h1>
        <p className="text-gray-400">Secure QR verification system with active geofencing.</p>
      </div>

      <div className={`relative w-full aspect-square max-w-sm glass-card border-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 bg-black/40 ${
        status === 'Success' ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
        status === 'Failed' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
        'border-emerald-500/30'
      }`}>
        
        {status === 'Idle' && (
          <button onClick={startScanner} className="flex flex-col items-center group">
            <div className="bg-emerald-500/10 p-6 rounded-full group-hover:bg-emerald-500/20 transition-all mb-4 border border-emerald-500/20">
               <Camera className="w-16 h-16 text-emerald-500" />
            </div>
            <span className="text-xl font-bold text-white mb-2">Open Secure Camera</span>
            <p className="text-sm text-gray-400">Alignment within classroom required</p>
          </button>
        )}

        <div id="reader" className={`w-full h-full ${status === 'Scanning' ? 'block' : 'hidden'}`}></div>
        
        {status === 'Scanning' && (
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-emerald-500 rounded-2xl animate-pulse relative">
                 <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_#10B981] animate-scan-line"></div>
              </div>
           </div>
        )}

        {status === 'Validating' && (
           <div className="flex flex-col items-center">
              <Loader2 className="w-20 h-20 text-emerald-400 animate-spin mb-4" />
              <p className="text-white font-bold text-lg animate-pulse tracking-widest">VERIFYING LOCATION...</p>
           </div>
        )}

        {status === 'Success' && (
           <div className="flex flex-col items-center text-center p-6 bg-emerald-500/10 w-full h-full justify-center">
              <CheckCircle className="w-20 h-20 text-emerald-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase">Verified!</h2>
              <p className="text-gray-400 text-sm">Attendance recorded successfully.</p>
           </div>
        )}

        {status === 'Failed' && (
           <div className="flex flex-col items-center text-center p-6 bg-red-500/10 w-full h-full justify-center">
              <XCircle className="w-20 h-20 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase">Access Denied</h2>
              <p className="text-red-400 font-mono text-xs">{errorMessage}</p>
              <button 
                onClick={() => {
                   setStatus('Idle');
                   setShowManualEntry(false);
                   setManualToken('');
                }} 
                className="mt-6 text-sm underline text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Try Again
              </button>
           </div>
        )}
      </div>

      <div className="glass-card p-6 w-full border-white/5 bg-white/5 backdrop-blur-md">
         <h4 className="font-bold mb-4 text-emerald-400 flex items-center gap-2 text-sm uppercase tracking-widest">
            <MapPin size={16} /> Security Logs
         </h4>
         <div className="space-y-4">
            <div className="flex items-start gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
               <p className="text-xs text-gray-400 leading-relaxed italic">Point camera directly at the Faculty QR code. Handshake will occur upon successful decryption.</p>
            </div>
         </div>
      </div>
      
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default ScanQR;

