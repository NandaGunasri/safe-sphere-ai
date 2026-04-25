import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import ReportForm from './pages/ReportForm';
import Tracker from './pages/Tracker';
import Journey from './pages/Journey';
import { AlertTriangle, Map, LayoutDashboard, Route as RouteIcon, PlusCircle, Link2Off } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [offline, setOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleSOS = async () => {
    alert("🚨 EMERGENCY ALERT SENT! Locating nearest help...");
    
    // Mock SOS Logging for purely static deployment
    setTimeout(() => {
      console.log("SOS Alert stored locally or sent to mock dispatcher.");
    }, 500);
  };

  const showNav = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-deep-black text-white relative pb-20 overflow-x-hidden">
      {offline && (
        <div className="bg-yellow-500/90 text-black px-4 py-2 text-sm flex items-center justify-center font-medium sticky top-0 z-50">
          <Link2Off className="w-4 h-4 mr-2" />
          No internet? Syncing paused.
        </div>
      )}

      <main className="h-full">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/journey" element={<Journey />} />
        </Routes>
      </main>

      {/* Floating SOS Button */}
      {showNav && (
        <button 
          onClick={handleSOS}
          className="fixed bottom-24 right-4 w-16 h-16 bg-neon-red rounded-full flex items-center justify-center shadow-[0_0_20px_#ff3366] sos-pulse border-2 border-white/20 z-50 active:scale-95 transition-transform"
        >
          <AlertTriangle className="w-8 h-8 text-white relative z-10" />
        </button>
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 w-full h-20 glass-card rounded-t-3xl rounded-b-none border-b-0 border-x-0 !bg-[#121215]/80 flex justify-around items-center px-4 z-40">
          <NavItem icon={<LayoutDashboard />} label="Home" active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')} />
          <NavItem icon={<Map />} label="Map" active={location.pathname === '/map'} onClick={() => navigate('/map')} />
          <div className="relative -top-6">
            <button 
              onClick={() => navigate('/report')}
              className="w-14 h-14 bg-neon-blue rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-transform active:scale-95"
            >
              <PlusCircle className="w-8 h-8 text-black" />
            </button>
          </div>
          <NavItem icon={<RouteIcon />} label="Journey" active={location.pathname === '/journey'} onClick={() => navigate('/journey')} />
          <NavItem icon={<AlertTriangle className="w-5 h-5" />} label="Tracker" active={location.pathname === '/tracker'} onClick={() => navigate('/tracker')} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${active ? 'text-neon-blue' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
