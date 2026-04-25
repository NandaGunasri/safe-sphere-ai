import React, { useState } from 'react';
import { Mic, FileWarning, EyeOff, Send, CheckCircle2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

export default function ReportForm() {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Suspicious Activity');
  const [recording, setRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleMic = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setDesc(prev => prev + (prev ? ' ' : '') + 'There is a suspicious group gathering near the alleyway.');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc) return;

    // Mock submission for static deployment
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => navigate('/tracker'), 2000);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center fade-in">
        <CheckCircle2 className="w-24 h-24 text-neon-green mb-6 drop-shadow-[0_0_15px_#39ff14]" />
        <h2 className="text-3xl font-bold mb-2">Report Submited</h2>
        <p className="text-gray-400">Your anonymous report has been securely registered.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 fade-in min-h-screen flex flex-col">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">New <span className="text-neon-blue">Report</span></h2>
        <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
          <EyeOff size={14} /> 100% Anonymous
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        
        <div className="glass-card p-5">
          <label className="text-xs font-semibold text-neon-blue uppercase tracking-wider mb-3 block">Category</label>
          <div className="grid grid-cols-2 gap-3">
            {['Suspicious Activity', 'Harassment', 'Theft', 'Unsafe Area'].map(cat => (
              <div 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl border text-center text-sm cursor-pointer transition-all ${category === cat ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 relative">
          <label className="text-xs font-semibold text-neon-blue uppercase tracking-wider mb-3 block">Description</label>
          
          <div className="relative">
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the incident..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors min-h-[120px]"
            />
            
            <button 
              type="button"
              onClick={handleMic}
              className={`absolute bottom-3 right-3 p-3 rounded-full flex items-center justify-center transition-all ${recording ? 'bg-neon-red shadow-[0_0_15px_#ff3366] animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Mic size={18} className={recording ? 'text-white' : 'text-neon-blue'} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
          <MapPin size={16} className="text-neon-green" /> 
          Auto-detected: <span className="text-white">5th Avenue</span>
        </div>

        <button 
          type="submit"
          className="mt-auto mb-24 w-full bg-neon-blue text-black font-bold text-lg py-4 rounded-2xl flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-95 transition-transform"
        >
          <Send size={20} /> Submit Securely
        </button>

      </form>
    </div>
  );
}
