import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, TrendingUp } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

export default function Dashboard() {
  const [dangerScore, setDangerScore] = useState(0);
  const [insight, setInsight] = useState("Loading AI insights...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Mock Data for frontend static deployment
      setTimeout(() => {
        const currentHour = new Date().getHours();
        let currentScore = 30;
        let pInsight = "AI predicts stable conditions.";

        if (currentHour >= 18 && currentHour <= 22) {
          currentScore = 85;
          pInsight = "AI predicts increased risk after 9 PM. High probability of incidents.";
        } else if (currentHour < 6) {
          currentScore = 60;
          pInsight = "AI predicts moderate risk due to late hours.";
        } else {
          currentScore = 35;
          pInsight = "AI predicts relatively safe conditions for the next few hours.";
        }

        setDangerScore(currentScore);
        setInsight(pInsight);
        setLoading(false);
      }, 600);
    };

    fetchData();
  }, []);

  let colorClass = 'text-neon-green';
  let blurClass = 'bg-neon-green/20';
  let strokeColor = '#39ff14';
  if (dangerScore >= 80) { colorClass = 'text-neon-red'; blurClass = 'bg-neon-red/20'; strokeColor = '#ff3366'; }
  else if (dangerScore >= 40) { colorClass = 'text-neon-yellow'; blurClass = 'bg-neon-yellow/20'; strokeColor = '#ffea00'; }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dangerScore / 100) * circumference;

  return (
    <div className="p-6 pt-12 fade-in">
      <header className="mb-8">
        <p className="text-gray-400 text-sm">Hello, {localStorage.getItem('safe_id')} 👁️</p>
        <h2 className="text-3xl font-bold">Safety <span className="text-neon-blue">Overview</span></h2>
      </header>

      {/* Danger Score Ring */}
      <div className="relative flex justify-center items-center mb-10 mt-12">
        <div className={`absolute w-48 h-48 rounded-full blur-[50px] ${blurClass}`} />
        
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
      <div className="glass-card p-5 mb-6 border-l-4 border-l-neon-blue">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-neon-blue/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neon-blue mb-1">AI Prediction Insight</h3>
            <p className="text-sm text-gray-300 leading-snug">{insight}</p>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col items-center text-center">
          <ShieldAlert className={`w-8 h-8 mb-2 ${colorClass}`} />
          <span className="text-2xl font-bold">Safe</span>
          <span className="text-xs text-gray-400 mt-1">Current Zone</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center">
          <Users className="w-8 h-8 mb-2 text-neon-green drop-shadow-[0_0_8px_#39ff14]" />
          <span className="text-2xl font-bold">2</span>
          <span className="text-xs text-gray-400 mt-1">Helpers Nearby</span>
        </div>
      </div>

    </div>
  );
}
