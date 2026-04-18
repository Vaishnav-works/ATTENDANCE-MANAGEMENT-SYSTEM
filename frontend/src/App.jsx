import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import SplashScreen from './components/SplashScreen';

// Import Pages
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ScanQR from './pages/ScanQR';
import StudentReports from './pages/StudentReports';
import ScanovaAI from './pages/ScanovaAI';
import FacultyDashboard from './pages/FacultyDashboard';
import QRGenerator from './pages/QRGenerator';
import FacultyReports from './pages/FacultyReports';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  // Normalize both for case-insensitive comparison
  const userRole = user.role?.toLowerCase();
  const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
  
  if (!isAllowed) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex bg-var(--bg-color) min-h-screen text-var(--text-color) relative">
      {/* Premium Background Elements */}
      <div className="scanova-bg"></div>
      <div className="scanova-blob w-[500px] h-[500px] bg-emerald-500/10 -top-48 -left-48"></div>
      <div className="scanova-blob w-[600px] h-[600px] bg-teal-500/10 -bottom-48 -right-48"></div>
      
      <Navigation />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 relative z-10">
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Safety fallback to ensure splash disappears even if component hangs
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace /> : <LandingPage />
      } />
      <Route path="/signup" element={
        user ? <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace /> : <Signup />
      } />
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace /> : <Login />
      } />
      
      {/* Student Routes */}
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/scan-qr" element={<ProtectedRoute allowedRoles={['Student']}><ScanQR /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['Student']}><StudentReports /></ProtectedRoute>} />
      <Route path="/scanova-ai" element={<ProtectedRoute allowedRoles={['Student']}><ScanovaAI /></ProtectedRoute>} />

      {/* Faculty Routes */}
      <Route path="/faculty-dashboard" element={<ProtectedRoute allowedRoles={['Faculty']}><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/generate-qr" element={<ProtectedRoute allowedRoles={['Faculty']}><QRGenerator /></ProtectedRoute>} />
      <Route path="/faculty-reports" element={<ProtectedRoute allowedRoles={['Faculty']}><FacultyReports /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


