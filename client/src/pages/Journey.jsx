import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, Navigation2, Target } from 'lucide-react';
import { API_BASE_URL } from '../config';
import useLocation from '../hooks/useLocation';
import { getDistanceFromLatLonInKm } from '../utils/distance';
import AlertPopup from '../components/AlertPopup';
import { calculateAdvancedRisk } from '../utils/riskEngine';
import { getDemoReports } from '../utils/demoData';

export default function Journey() {
  const [reports, setReports] = useState([]);
  const [risk, setRisk] = useState(20);
  const [prevRisk, setPrevRisk] = useState(20);
  const [message, setMessage] = useState("AI analyzing route...");
  const [reasons, setReasons] = useState([]);
  const [active, setActive] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  
  const { location, loading } = useLocation();

  useEffect(() => {
    let interval;
    if (active) {
      const fetchReports = async () => {
        if (loading || !location) return;
        try {
          const response = await fetch(`${API_BASE_URL}/reports?lat=${location[0]}&lng=${location[1]}`);
          const data = await response.json();
          
          const now = new Date();
          const recentData = data.filter(r => {
            const rTime = new Date(r.timestamp);
            return (now - rTime) <= (2 * 60 * 60 * 1000);
          });
          
          setReports(recentData);
          setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
          console.error("Failed to fetch reports:", error);
        }
      };
      
      fetchReports();
      interval = setInterval(fetchReports, 5000); // 5 sec live loop
    }
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (active && location) {
      // Demo fallback
      let finalData = reports;
      if (finalData.length === 0) {
        finalData = getDemoReports(location[0], location[1]);
      }

      const { score, reasons: insightReasons, nearbyReports } = calculateAdvancedRisk(location[0], location[1], finalData);

      setPrevRisk(risk);
      setRisk(score);
      setReasons(insightReasons);

      if (nearbyReports >= 3 || score > 60) {
        setMessage("🚨 Danger ahead. ➡️ Move to safer direction");
      } else if (nearbyReports >= 1 || score >= 20) {
        setRisk(50);
        setMessage("⚠️ Risky path");
      } else {
        setRisk(20);
        setMessage("Safe route");
      }

      // Trigger popups
      if (score > risk) {
        setAlertText("🚨 Risk level rising");
        setAlertVisible(true);
      } else if (nearbyReports >= 3 || score > 60) {
        setAlertText("⚠️ Danger ahead. ➡️ Move to safer direction");
        setAlertVisible(true);
      }
    }
  }, [location, reports, active]);

  const toggleJourney = () => {
    if (!active) {
      if (location) setStartLocation(location);
      setRisk(20);
      setMessage("Starting journey. AI monitoring active.");
    } else {
      setMessage("Journey ended.");
    }
    setActive(!active);
  };

  let riskColor = 'text-neon-green';
  let riskBg = 'bg-neon-green/20';
  let riskShadow = 'shadow-[0_0_15px_#39ff14]';
  if (risk >= 80) { riskColor = 'text-neon-red'; riskBg = 'bg-neon-red/20'; riskShadow = 'shadow-[0_0_15px_#ff3366]'; }
  else if (risk >= 40) { riskColor = 'text-neon-yellow'; riskBg = 'bg-neon-yellow/20'; riskShadow = 'shadow-[0_0_15px_#ffea00]'; }

  let displayDistance = '--';
  if (active && startLocation && location) {
    displayDistance = Math.floor(getDistanceFromLatLonInKm(startLocation[0], startLocation[1], location[0], location[1]) * 1000) + 'm';
  }

  return (
    <div className="p-6 pt-12 fade-in min-h-screen flex flex-col relative overflow-hidden">
      <AlertPopup message={alertText} visible={alertVisible} onClose={() => setAlertVisible(false)} />
      
      {/* Background Pulse indicating active journey */}
      {active && (
        <div className={`absolute inset-0 ${riskBg} opacity-10 animate-pulse -z-10 transition-colors duration-1000`} />
      )}

      <header className="mb-8 z-10">
        <h2 className="text-3xl font-bold flex items-center gap-2">Safety <span className="text-neon-blue">Journey</span></h2>
        <p className="text-gray-400 text-sm mt-1">Live active protection mode</p>
      </header>

      <div className="glass-card p-6 flex flex-col items-center flex-1 z-10 relative">
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/10">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-neon-green animate-ping' : 'bg-gray-500'}`} />
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{active ? 'Live Tracking' : 'Paused'}</span>
          </div>
          {active && lastUpdated && <span className="text-[9px] text-gray-500">Updated: {lastUpdated}</span>}
        </div>

        <div className="my-auto w-full flex flex-col items-center">
          <div className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 relative ${active ? riskShadow : ''} border-white/10`}>
            
            {/* The pulsing ring inside */}
            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${riskBg} blur-xl opacity-30`} />
            
            <Navigation2 
              size={48} 
              className={`mb-2 transition-colors duration-500 ${riskColor} ${active ? 'animate-bounce' : ''}`} 
            />
            <h3 className="text-4xl font-black">{displayDistance}</h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Status</span>
          </div>

          <div className="mt-12 w-full">
            <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wider mb-2">AI Route Insight</h4>
            <div className={`w-full p-4 rounded-xl border border-white/10 transition-colors ${riskBg} text-sm font-medium`}>
              {!active ? "Start journey to begin live tracking." : message}
              
              {active && reasons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <ul className="text-xs text-white/80 space-y-1">
                    {reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>•</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={toggleJourney}
          disabled={loading}
          className={`w-full mt-auto py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 flex justify-center items-center gap-2 ${active ? 'bg-white/10 text-white' : 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]'} ${loading ? 'opacity-50' : ''}`}
        >
          {active ? <RouteIcon size={20} /> : <Target size={20} />}
          {active ? 'End Journey' : 'Start Journey'}
        </button>

      </div>
    </div>
  );
}
