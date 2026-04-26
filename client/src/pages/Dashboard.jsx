import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';
import useLocation from '../hooks/useLocation';
import { getDistanceFromLatLonInKm } from '../utils/distance';
import { calculateAdvancedRisk } from '../utils/riskEngine';
import { getDemoReports } from '../utils/demoData';

const SAFE_ZONES = [
  { name: 'Police Station', lat: 20.6050, lng: 78.9700 },
  { name: 'Hospital', lat: 20.5850, lng: 78.9500 },
  { name: 'Public Area', lat: 20.5900, lng: 78.9650 }
];

export default function Dashboard() {
  const [dangerScore, setDangerScore] = useState(0);
  const [insight, setInsight] = useState("Loading AI insights...");
  const [reasons, setReasons] = useState([]);
  const [nearbyCount, setNearbyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { location } = useLocation();

  useEffect(() => {
    let interval;
    const fetchData = async () => {
      if (!location) return;
      try {
        const response = await fetch(`${API_BASE_URL}/reports?lat=${location[0]}&lng=${location[1]}`);
        const data = await response.json();
        
        const now = new Date();
        const recentData = data.filter(r => {
          const rTime = new Date(r.timestamp);
          return (now - rTime) <= (2 * 60 * 60 * 1000);
        });

        // Demo fallback
        let finalData = recentData;
        if (finalData.length === 0) {
          finalData = getDemoReports(location[0], location[1]);
        }

        const { score, reasons, nearbyReports } = calculateAdvancedRisk(location[0], location[1], finalData);

        let pInsight = "AI predicts stable conditions.";
        if (score >= 80) pInsight = "AI predicts increased risk based on recent activity.";
        else if (score >= 40) pInsight = "AI predicts moderate risk in the area.";
        else pInsight = "AI predicts relatively safe conditions.";

        setDangerScore(score);
        setReasons(reasons);
        setNearbyCount(nearbyReports);
        setInsight(pInsight);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching danger score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [location]);

  let colorClass = 'text-neon-green';
  let blurClass = 'bg-neon-green/20';
  let strokeColor = '#39ff14';
  if (dangerScore >= 80) { colorClass = 'text-neon-red'; blurClass = 'bg-neon-red/20'; strokeColor = '#ff3366'; }
  else if (dangerScore >= 40) { colorClass = 'text-neon-yellow'; blurClass = 'bg-neon-yellow/20'; strokeColor = '#ffea00'; }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dangerScore / 100) * circumference;

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour <= 5;

  const tips = isNight ? [
    "Avoid isolated areas at night",
    "Stay in well-lit locations",
    "Share your live location with a contact"
  ] : [
    "Be aware of your surroundings",
    "Keep your belongings secure",
    "Stay hydrated and alert"
  ];

  return (
    <div className="p-6 pt-12 fade-in">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">Hello, {localStorage.getItem('safe_id')} 👁️</p>
          <h2 className="text-3xl font-bold">Safety <span className="text-neon-blue">Overview</span></h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 bg-neon-green/10 px-2 py-1 rounded border border-neon-green/30">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-[10px] text-neon-green font-bold tracking-widest uppercase">Live Monitoring</span>
          </div>
          {lastUpdated && <span className="text-[10px] text-gray-500 mt-1">Updated: {lastUpdated}</span>}
        </div>
      </header>

      {/* Danger Score Ring */}
      <div className="relative flex justify-center items-center mb-10 mt-12">
        <div className={`absolute w-48 h-48 rounded-full blur-[50px] transition-all duration-1000 ${blurClass}`} />
        
        <svg className="w-48 h-48 transform -rotate-90 relative z-10">
          <circle cx="96" cy="96" r={radius} className="stroke-white/10" strokeWidth="12" fill="none" />
          <circle 
            cx="96" cy="96" r={radius} 
            stroke={strokeColor} strokeWidth="12" fill="none" 
            strokeDasharray={circumference} strokeDashoffset={loading ? circumference : strokeDashoffset} 
            strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_currentColor]"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center z-20">
          <span className="text-5xl font-black">{loading ? '--' : dangerScore}</span>
          <span className="text-xs uppercase tracking-widest text-gray-400 mt-1">Risk Score</span>
        </div>
      </div>

      {/* AI Banner */}
      <div className="glass-card p-5 mb-6 border-l-4 border-l-neon-blue transition-all duration-500">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-neon-blue/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neon-blue mb-1">AI Prediction Insight</h3>
            <p className="text-sm text-gray-300 leading-snug mb-2">{insight}</p>
            
            <div className="mt-3 pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold text-gray-400 mb-2">WHY RISK?</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-neon-blue">•</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-4 flex flex-col items-center text-center transition-all duration-500">
          <ShieldAlert className={`w-8 h-8 mb-2 ${colorClass}`} />
          <span className="text-2xl font-bold">{nearbyCount}</span>
          <span className="text-xs text-gray-400 mt-1">Reports Nearby</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center">
          <Users className="w-8 h-8 mb-2 text-neon-green drop-shadow-[0_0_8px_#39ff14]" />
          <span className="text-2xl font-bold">{isNight ? "Night" : "Day"}</span>
          <span className="text-xs text-gray-400 mt-1">Peak Time Activity</span>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          Safety <span className="text-neon-yellow">Tips</span>
        </h3>
        <ul className="glass-card p-4 space-y-2 text-sm text-gray-300">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-neon-yellow">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Nearby Safe Zones */}
      <div className="mb-24">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          Nearby Safe <span className="text-neon-green">Zones</span>
        </h3>
        <div className="grid gap-3">
          {SAFE_ZONES.map((zone, idx) => {
            const dist = getDistanceFromLatLonInKm(location[0], location[1], zone.lat, zone.lng);
            return (
              <div key={idx} className="glass-card p-3 flex justify-between items-center">
                <span className="text-sm font-semibold">{zone.name}</span>
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-md">{dist.toFixed(1)} km</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
