import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const QRGenerator = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [token, setToken] = useState(null);

  const generateNewQR = () => {
    // In real app: call API to generate short-lived token
    setToken(Math.random().toString(36).substring(2, 15));
    setTimeLeft(60);
  };

  useEffect(() => {
    if (timeLeft > 0 && token) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setToken(null);
    }
  }, [timeLeft, token]);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-[#6366F1] bg-clip-text text-transparent mb-2">QR Session</h1>
        <p className="text-gray-400">Students have 60 seconds to scan.</p>
      </div>

      {!token ? (
        <button onClick={generateNewQR} className="primary-button text-lg px-8 py-4">
          Start Session
        </button>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center relative">
          {/* Mock QR graphic */}
          <div className="w-64 h-64 bg-white p-4 rounded-xl flex items-center justify-center">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${token}`} alt="QR Code" />
          </div>

          {/* Countdown SVG Circle */}
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
              <circle cx="30" cy="30" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
              <circle 
                cx="30" cy="30" r={radius} 
                stroke={timeLeft > 10 ? "#6366F1" : "#ef4444"} 
                strokeWidth="4" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute font-bold">{timeLeft}s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
