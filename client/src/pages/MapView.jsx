import React, { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Navigation } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

export default function MapView() {
  const [isNight, setIsNight] = useState(new Date().getHours() >= 18 || new Date().getHours() < 6);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Mock locations for pure frontend deployment
    setTimeout(() => {
      setReports([
        { location: '5th Avenue', type: 'Suspicious Activity' },
        { location: 'Central Park', type: 'Unsafe Area' }
      ]);
    }, 500);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden fade-in bg-[#111]">
      
      {/* Fake Map Background */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          isNight ? 'bg-[#0a0f18] opacity-100' : 'bg-[#e0e5ec] opacity-100'
        }`}
      >
        {/* Abstract grid to simulate map roads */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px', color: isNight ? '#00f3ff' : '#000' }} />
        
        {/* Heatmap blur based on time */}
        <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[100px] transition-all duration-1000 ${isNight ? 'bg-neon-red/40' : 'bg-neon-yellow/20'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] transition-all duration-1000 ${isNight ? 'bg-neon-blue/30' : 'bg-neon-green/20'}`} />

        {/* Demo Markers */}
        <div className="absolute top-1/3 left-1/3 text-neon-red drop-shadow-[0_0_10px_#ff3366] animate-bounce">
          <MapPin size={32} />
        </div>
        <div className="absolute top-1/2 right-1/4 text-neon-yellow drop-shadow-[0_0_10px_#ffea00] animate-pulse">
          <MapPin size={24} />
        </div>
        
        {/* User Location */}
        <div className="absolute bottom-1/3 left-1/2 text-neon-blue drop-shadow-[0_0_15px_#00f3ff]">
          <div className="relative">
            <div className="absolute -inset-2 bg-neon-blue/30 rounded-full animate-ping" />
            <Navigation size={28} className="fill-current transform rotate-45" />
          </div>
        </div>
      </div>

      {/* Floating Header Actions */}
      <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-10">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14] animate-pulse" />
          <span className={`text-sm font-semibold ${!isNight ? 'text-black' : 'text-white'}`}>Live Map</span>
        </div>

        <button 
          onClick={() => setIsNight(!isNight)}
          className="glass-card p-3 rounded-full hover:bg-white/10 transition flex items-center justify-center border border-white/20"
        >
          {isNight ? <Moon size={20} className="text-neon-blue" /> : <Sun size={20} className="text-yellow-500" />}
        </button>
      </div>

      {/* Warning Overlay Box */}
      {isNight && (
        <div className="absolute top-28 left-4 right-4 glass-card bg-neon-red/10 border-neon-red/30 p-4 border flex items-start gap-3 fade-in">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="text-neon-red font-bold text-sm mb-1">3 incidents reported nearby</h4>
            <p className="text-white/80 text-xs">AI predicts higher risk after 9 PM. Proceed with caution.</p>
          </div>
        </div>
      )}

    </div>
  );
}
