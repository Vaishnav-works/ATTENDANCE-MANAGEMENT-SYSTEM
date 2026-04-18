import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState('entering'); // entering -> content -> finishing

  useEffect(() => {
    // Stage-based timing
    const contentTimer = setTimeout(() => setStage('content'), 100);
    const finishingTimer = setTimeout(() => setStage('finishing'), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(finishingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#050504] transition-all duration-700 ease-in-out ${
      stage === 'finishing' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="scanova-bg opacity-30"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] transition-transform duration-[2000ms] ${
          stage === 'content' ? 'scale-150' : 'scale-50'
        }`} />
      </div>

      <div className="relative z-10 text-center">
        {/* Animated Logo Container */}
        <div className={`mb-8 transform transition-all duration-1000 ease-out flex justify-center ${
          stage === 'entering' ? 'opacity-0 scale-50 translate-y-10' : 'opacity-100 scale-100 translate-y-0'
        }`}>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden group">
            <QrCode className="text-white w-12 h-12 md:w-16 md:h-16 animate-pulse" />
            
            {/* Glossy sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        {/* Brand Text */}
        <div className={`space-y-4 transition-all duration-1000 delay-300 ${
          stage === 'entering' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-emerald-400 via-teal-400 to-white bg-clip-text text-transparent">
            SCANOVA
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-8 bg-emerald-500/30"></div>
              <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.4em]">
                Intelligent Scanning
              </p>
             <div className="h-[1px] w-8 bg-emerald-500/30"></div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-[2000ms] ease-out ${
              stage === 'entering' ? 'w-0' : 'w-full'
            }`} />
          </div>
        </div>
      </div>

      {/* Finishing Flash */}
      <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 ${
        stage === 'finishing' ? 'opacity-5' : 'opacity-0'
      }`} />
    </div>
  );
};

export default SplashScreen;
