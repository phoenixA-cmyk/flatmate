import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Discover from './pages/Discover.jsx';
import Matches from './pages/Matches.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './pages/Profile.jsx';

function Protected({ children, needsProfile = true }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (needsProfile && !user.profileComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/signup';
  return (
    <>
      {!hideNav && user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/discover" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/discover" replace /> : <Auth mode="login" />} />
        <Route path="/signup" element={user ? <Navigate to="/onboarding" replace /> : <Auth mode="register" />} />
        <Route path="/onboarding" element={<Protected needsProfile={false}><Onboarding /></Protected>} />
        <Route path="/discover" element={<Protected><Discover /></Protected>} />
        <Route path="/matches" element={<Protected><Matches /></Protected>} />
        <Route path="/chat/:id" element={<Protected><Chat /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
