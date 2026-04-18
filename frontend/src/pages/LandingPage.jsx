import { Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Bot, BarChart3, ArrowRight, Zap, Globe, Lock, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      title: "Smart QR Attendance",
      description: "Generate dynamic, time-limited QR codes that students can scan in seconds. No more manual roll calls.",
      icon: QrCode,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Geo-Fencing Security",
      description: "Ensure academic integrity by verifying that students are physically present in the classroom during the scan.",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "SCANOVA AI Assistant",
      description: "Your personal academic twin. Ask about attendance trends, class schedules, or study tips anytime.",
      icon: Bot,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Live Analytics",
      description: "Real-time dashboards for faculty and students. Track progress with beautiful, interactive visualizations.",
      icon: BarChart3,
      color: "text-teal-400",
      bg: "bg-teal-500/10"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-emerald-500/30">
      {/* Background Elements */}
      <div className="scanova-bg"></div>
      <div className="scanova-blob w-[500px] h-[500px] bg-emerald-500/20 -top-48 -left-48"></div>
      <div className="scanova-blob w-[600px] h-[600px] bg-teal-500/10 -bottom-48 -right-48"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <QrCode className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              SCANOVA
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">Security</a>
            <Link to="/login" className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Content */}
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Zap size={14} className="animate-pulse" /> Next-Gen Attendance Management
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                Smart Attendance. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-200 bg-clip-text text-transparent italic">
                  SCANOVA Driven.
                </span>
              </h1>
              <p className="max-w-xl text-gray-400 text-lg md:text-xl font-medium mb-12">
                Location-verified attendance with integrated academic AI. Secure your classes and track your progress instantly with SCANOVA.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/login" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                  Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-center">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Column: Visual Anchor (Prevents Black Void) */}
            <div className="hidden lg:flex justify-center relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Glowing Core */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-[80px] animate-pulse"></div>
                
                {/* Geometric Shield Pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border-2 border-emerald-500/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                  <div className="absolute w-4/5 h-4/5 border border-teal-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                  <div className="absolute w-3/5 h-3/5 border-2 border-emerald-500/20 rounded-full animate-pulse"></div>
                  
                  {/* Floating Icon Badges */}
                  <div className="absolute top-[10%] left-[20%] glass-card p-4 border-emerald-500/30 animate-bounce delay-700">
                    <ShieldCheck className="text-emerald-400 w-8 h-8" />
                  </div>
                  <div className="absolute bottom-[20%] right-[10%] glass-card p-4 border-teal-500/30 animate-bounce">
                    <MapPin className="text-teal-400 w-8 h-8" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-3xl backdrop-blur-3xl border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                    <QrCode className="text-emerald-400 w-24 h-24" />
                    <div className="absolute -inset-2 bg-emerald-500/20 blur-xl opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Engineered for Excellence</h2>
            <p className="text-gray-400">Modern tools for the future of education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-8 hover:border-emerald-500/30 transition-all hover:-translate-y-2 group">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`${f.color} w-7 h-7`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Functional Intro */}
      <section id="about" className="py-20 px-6 relative overflow-hidden">
        <div className="scanova-blob w-[400px] h-[400px] bg-teal-500/5 -top-20 -right-20"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                System Brief
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight italic">
                How it Works. <br />
                <span className="text-gray-500">Fast. Secure. AI.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                SCANOVA transforms the manual attendance process into a sleek, automated experience. No apps to install—just pure web intelligence.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
                      <span className="text-emerald-400 font-bold">01</span>
                   </div>
                   <div>
                     <h4 className="text-lg font-bold mb-1">Dynamic Scanning</h4>
                     <p className="text-sm text-gray-500">Students scan a time-limited QR code generated by the faculty dashboard.</p>
                   </div>
                </div>
                <div className="flex gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-green-500/50 transition-colors">
                      <span className="text-green-400 font-bold">02</span>
                   </div>
                   <div>
                     <h4 className="text-lg font-bold mb-1">Geo-Spatial Lock</h4>
                     <p className="text-sm text-gray-500">Our platform validates the physical location of the device within 40m of the classroom.</p>
                   </div>
                </div>
                <div className="flex gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-teal-500/50 transition-colors">
                      <span className="text-teal-400 font-bold">03</span>
                   </div>
                   <div>
                     <h4 className="text-lg font-bold mb-1">SCANOVA Insights</h4>
                     <p className="text-sm text-gray-500">Every record is analyzed by our AI to provide attendance trends and academic nudges.</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative group">
               {/* Premium Glow Backdrops */}
               <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

               <div className="glass-card p-4 bg-black/40 border-white/5 aspect-square rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-3xl min-w-[320px] md:min-w-[400px]">
                  {/* Internal Step Logic (Animated via CSS) */}
                  <div className="demo-step-container flex flex-col items-center justify-center">
                     
                     {/* Step 1: Scanner (Default) */}
                     <div className="demo-step demo-step-1">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[2rem] border-2 border-emerald-500/20 flex items-center justify-center overflow-hidden bg-white/5">
                           <QrCode className="text-white/20 w-32 h-32" />
                           <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_#10B981] animate-demo-scan shadow-lg"></div>
                           <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
                        </div>
                        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-emerald-400 animate-pulse">Scanning Secure QR...</p>
                     </div>

                     {/* Step 2: Location Pulse (Floating icons) */}
                     <div className="demo-step demo-step-2 absolute">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                           <div className="absolute w-full h-full rounded-full border border-emerald-500/20 animate-ping"></div>
                           <div className="absolute w-2/3 h-2/3 rounded-full border border-teal-500/20 animate-ping delay-500"></div>
                           <div className="bg-emerald-600/20 p-8 rounded-full border border-emerald-500/50 relative z-10">
                              <MapPin className="text-emerald-400 w-16 h-16 animate-bounce" />
                           </div>
                        </div>
                        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Verifying Geo-Fence...</p>
                     </div>

                     {/* Step 3: Success */}
                     <div className="demo-step demo-step-3 absolute">
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-green-500/10 border-4 border-green-500/30 flex items-center justify-center animate-in zoom-in-50 duration-500">
                           <CheckCircle className="text-green-400 w-24 h-24" />
                        </div>
                        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-green-400">Attendance Recorded</p>
                     </div>
                  </div>

                  {/* Operational Badge */}
                  <div className="absolute bottom-10 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">SCANOVA Operational</span>
                  </div>
               </div>

               {/* CSS for Landing Demo Animation Loop */}
               <style>{`
                 .demo-step-container { height: 300px; position: relative; width: 100%; border-radius: 2rem; overflow: hidden; }
                 .demo-step { transition: all 1s ease-in-out; display: flex; flex-direction: column; items-center; justify-content: center; width: 100%; }
                 
                 /* Animation Loop */
                 .demo-step-1 { animation: step1 15s infinite; }
                 .demo-step-2 { animation: step2 15s infinite; opacity: 0; transform: scale(0.8); }
                 .demo-step-3 { animation: step3 15s infinite; opacity: 0; transform: scale(0.8); }

                 @keyframes step1 { 0%, 25%, 90%, 100% { opacity: 1; transform: scale(1); } 30%, 85% { opacity: 0; transform: scale(1.1); } }
                 @keyframes step2 { 0%, 25%, 65%, 100% { opacity: 0; transform: scale(0.8); } 30%, 55% { opacity: 1; transform: scale(1); } }
                 @keyframes step3 { 0%, 55%, 95%, 100% { opacity: 0; transform: scale(0.8); } 60%, 85% { opacity: 1; transform: scale(1); } }
                 
                 @keyframes demo-scan { 0% { top: 0; } 100% { top: 100%; } }
               `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-emerald-600/5 border-y border-emerald-500/10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Integrity at the Core.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Lock className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Encrypted Sessions</h4>
                    <p className="text-sm text-gray-400">Every QR code session is uniquely salted and expires automatically.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Globe className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Universal Access</h4>
                    <p className="text-sm text-gray-400">Works on any smartphone or laptop without needing a dedicated app.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="glass-card p-8 bg-emerald-600/20 border-emerald-500/30 text-center">
            <h3 className="text-4xl font-black mb-2 tracking-tighter">99.9%</h3>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Accuracy Rate</p>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">Our geo-fencing algorithm reduces attendance fraud significantly compared to manual systems.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <QrCode className="w-6 h-6" />
            <span className="text-lg font-bold tracking-tighter italic uppercase">SCANOVA</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">© 2026 SCANOVA Technologies. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-gray-500">
             <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
             <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
