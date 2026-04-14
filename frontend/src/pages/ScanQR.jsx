import React, { useState } from 'react';
import { Scan } from 'lucide-react';

const ScanQR = () => {
  const [status, setStatus] = useState('Idle'); // Idle, Scanning, Location, Success, Failed

  const handleScanSimulation = () => {
    setStatus('Location');
    // Simulate getting geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          // Simulate backend processing
          setTimeout(() => setStatus('Success'), 1500);
        },
        (err) => {
          setStatus('Failed');
        }
      );
    } else {
      setStatus('Failed');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-[#6366F1] bg-clip-text text-transparent mb-2">Scan Attendance</h1>
        <p className="text-gray-400">Position the QR code within the frame.</p>
      </div>

      <div className="relative w-full aspect-square max-w-sm bg-black border-2 border-dashed border-[#6366F1]/50 rounded-2xl flex items-center justify-center overflow-hidden">
        {status === 'Idle' && (
          <button onClick={handleScanSimulation} className="flex flex-col items-center text-[#6366F1] hover:text-white transition-colors">
            <Scan className="w-16 h-16 mb-4" />
            <span>Tap to Scan (Simulate)</span>
          </button>
        )}
        {status === 'Location' && <p className="text-yellow-400 animate-pulse">Verifying Geofence...</p>}
        {status === 'Success' && <p className="text-green-400 font-bold text-xl">Attendance Marked!</p>}
        {status === 'Failed' && <p className="text-red-400 font-bold text-xl">Location Error</p>}
      </div>

      <div className="glass-card p-4 w-full">
         <h4 className="font-semibold mb-2">Instructions:</h4>
         <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
           <li>Ensure you are physically in class.</li>
           <li>Grant location permissions when asked.</li>
           <li>QR expires 60 seconds after generation.</li>
         </ul>
      </div>
    </div>
  );
};

export default ScanQR;
