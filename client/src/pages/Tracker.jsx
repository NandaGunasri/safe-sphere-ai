import React, { useEffect, useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, History } from 'lucide-react';

import { API_BASE_URL } from '../config';

export default function Tracker() {
  const [reports, setReports] = useState([]);
  const safeId = localStorage.getItem('safe_id');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports`);
        const data = await response.json();
        // Filter for user's reports if needed, but for demo show all or user specific
        const userReports = data.filter(r => r.userId === safeId || r.userId === 'ANONYMOUS');
        setReports(userReports.reverse());
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };
    fetchReports();
  }, [safeId]);

  return (
    <div className="p-6 pt-12 fade-in min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Report <span className="text-neon-blue">Tracker</span></h2>
        <p className="text-gray-400 text-sm mt-1">ID: {safeId}</p>
      </header>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <History size={48} className="mb-4 opacity-50" />
          <p>No active reports found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-24">
          {reports.map((report, idx) => (
            <div key={idx} className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{report.category}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">{new Date(report.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-neon-blue">
                  {report.status || 'Under Review'}
                </div>
              </div>
              <p className="text-sm text-gray-300 bg-black/30 p-3 rounded-xl border border-white/5">{report.description}</p>
              
              {/* Timeline UI Simulated */}
              <div className="mt-6 flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10 transform -translate-y-1/2" />
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-blue flex items-center justify-center shadow-[0_0_10px_#00f3ff]">
                    <CheckCircle2 size={16} className="text-black" />
                  </div>
                  <span className="text-[10px] text-neon-blue font-bold">Submitted</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-yellow flex items-center justify-center shadow-[0_0_10px_#ffea00] animate-pulse">
                    <Clock size={16} className="text-black" />
                  </div>
                  <span className="text-[10px] text-neon-yellow font-bold">Review</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center text-gray-500 relative">
                     {/* No icon just empty dot or shield */}
                    <ShieldAlert size={16} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">Verified</span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
