import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, MapPin, Navigation2, Target } from 'lucide-react';

export default function Journey() {
  const [distance, setDistance] = useState(1000); // meters to destination
  const [risk, setRisk] = useState(20);
  const [message, setMessage] = useState("Route is clear ahead.");
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => {
        setDistance((prev) => {
          const newDist = Math.max(0, prev - 50);
          
          if (newDist <= 0) {
            setActive(false);
            setMessage("Destination reached safely.");
            setRisk(0);
            return 0;
          }

          // Simulate increasing risk as they approach a specific zone (e.g. 500m away)
          if (newDist === 600) {
            setRisk(60);
          } else if (newDist === 400) {
            setRisk(85);
            setMessage("⚠️ Risk increasing ahead in next 200m based on recent reports.");
          } else if (newDist === 200) {
            setRisk(40);
            setMessage("You have passed the high-risk zone.");
          }

          return newDist;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [active]);

  const toggleJourney = () => {
    if (!active && distance === 0) {
      setDistance(1000);
      setRisk(20);
      setMessage("Starting new journey. AI monitoring active.");
    }
    setActive(!active);
  };

  let riskColor = 'text-neon-green';
  let riskBg = 'bg-neon-green/20';
  let riskShadow = 'shadow-[0_0_15px_#39ff14]';
  if (risk >= 80) { riskColor = 'text-neon-red'; riskBg = 'bg-neon-red/20'; riskShadow = 'shadow-[0_0_15px_#ff3366]'; }
  else if (risk >= 40) { riskColor = 'text-neon-yellow'; riskBg = 'bg-neon-yellow/20'; riskShadow = 'shadow-[0_0_15px_#ffea00]'; }

  return (
    <div className="p-6 pt-12 fade-in min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Background Pulse indicating active journey */}
      {active && (
        <div className={`absolute inset-0 ${riskBg} opacity-10 animate-pulse -z-10`} />
      )}

      <header className="mb-8 z-10">
        <h2 className="text-3xl font-bold flex items-center gap-2">Safety <span className="text-neon-blue">Journey</span></h2>
        <p className="text-gray-400 text-sm mt-1">Live active protection mode</p>
      </header>

      <div className="glass-card p-6 flex flex-col items-center flex-1 z-10 relative">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-neon-green animate-ping' : 'bg-gray-500'}`} />
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{active ? 'Live Tracking' : 'Paused'}</span>
        </div>

        <div className="my-auto w-full flex flex-col items-center">
          <div className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 relative ${active ? riskShadow : ''} border-white/10`}>
            
            {/* The pulsing ring inside */}
            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${riskBg} blur-xl opacity-30`} />
            
            <Navigation2 
              size={48} 
              className={`mb-2 transition-colors duration-500 ${riskColor} ${active ? 'animate-bounce' : ''}`} 
            />
            <h3 className="text-4xl font-black">{distance}m</h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">to destination</span>
          </div>

          <div className="mt-12 w-full">
            <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wider mb-2">AI Route Insight</h4>
            <div className={`w-full p-4 rounded-xl border border-white/10 transition-colors ${riskBg} text-sm font-medium`}>
              {message}
            </div>
          </div>
        </div>

        <button 
          onClick={toggleJourney}
          className={`w-full mt-auto py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 flex justify-center items-center gap-2 ${active ? 'bg-white/10 text-white' : 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]'}`}
        >
          {active ? <RouteIcon size={20} /> : <Target size={20} />}
          {active ? 'End Journey' : 'Start Journey'}
        </button>

      </div>
    </div>
  );
}
