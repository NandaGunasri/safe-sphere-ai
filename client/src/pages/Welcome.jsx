import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // If already generated, we might want to let them pass, or keep it welcome.
    // For demo, we just stay on welcome till they click.
  }, []);

  const handleStart = () => {
    let id = localStorage.getItem('safe_id');
    if (!id) {
      id = 'SAFE-' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('safe_id', id);
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-deep-black to-[#0a0f18] relative overflow-hidden">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-neon-blue/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-neon-red/10 rounded-full blur-[100px]" />

      <div className="fade-in flex flex-col items-center z-10 w-full max-w-sm">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
          <ShieldCheck className="w-24 h-24 text-neon-blue relative z-10" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">SafeSphere <span className="text-neon-blue">AI</span></h1>
        <p className="text-gray-400 text-sm mb-12">Next-generation premium safety intelligence.</p>

        <button 
          onClick={handleStart}
          className="w-full relative group bg-gradient-to-r from-neon-blue/20 to-blue-600/20 border border-neon-blue/50 text-white rounded-2xl py-4 font-semibold text-lg hover:border-neon-blue transition-all active:scale-95 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-2">
            Start Anonymously <ArrowRight className="w-5 h-5" />
          </span>
        </button>

        <p className="mt-6 text-xs text-gray-500 font-medium">100% Anonymous | Auto-deletes in 7 days</p>
      </div>
    </div>
  );
}
