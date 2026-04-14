import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';

// Import Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ScanQR from './pages/ScanQR';
import StudentReports from './pages/StudentReports';
import FacultyDashboard from './pages/FacultyDashboard';
import QRGenerator from './pages/QRGenerator';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex bg-[#050505] min-h-screen text-white">
      <Navigation />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}-dashboard` : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Student Routes */}
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/scan-qr" element={<ProtectedRoute allowedRoles={['Student']}><ScanQR /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['Student']}><StudentReports /></ProtectedRoute>} />

      {/* Faculty Routes */}
      <Route path="/faculty-dashboard" element={<ProtectedRoute allowedRoles={['Faculty']}><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/generate-qr" element={<ProtectedRoute allowedRoles={['Faculty']}><QRGenerator /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
