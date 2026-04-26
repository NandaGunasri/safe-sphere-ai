import React, { useEffect } from 'react';

export default function AlertPopup({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, message, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] fade-in pointer-events-none w-11/12 max-w-sm">
      <div className="bg-black/90 border-2 border-neon-red text-white px-6 py-4 rounded-xl shadow-[0_0_30px_#ff3366] flex items-center justify-center gap-3">
        <span className="text-3xl animate-pulse">🚨</span>
        <span className="font-bold tracking-wide text-neon-red text-center">{message}</span>
      </div>
    </div>
  );
}
