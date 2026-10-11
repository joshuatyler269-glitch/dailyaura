import React, { useState, useEffect } from 'react';

export const SessionGuardian: React.FC = () => {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [warningTriggered, setWarningTriggered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Track session time (simulating continuous phone/gaming usage)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1;
        // Trigger warning at 4 hours (or configurable for testing)
        // For demonstration/testing, you can lower this, but 4 hours = 14400s
        if (next >= 14400 && !dismissed) {
          setWarningTriggered(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dismissed]);

  const formatSessionTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  if (!warningTriggered) return null;

  return (
    <div className="fixed inset-0 bg-red-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-pulse">
      <div className="bg-slate-900 border-2 border-red-600 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center space-y-6 max-w-sm w-full">
        <div className="space-y-2">
          <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/40 font-extrabold tracking-widest">
            🚨 DOOMSDAY PROTOCOL: OVERLOAD
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-wide pt-2">4+ HOURS DETECTED</h2>
          <p className="text-slate-400 text-xs">
            You've been locked into your device session for <span className="text-red-400 font-bold">{formatSessionTime(sessionSeconds)}</span>. Your real-world quests are waiting!
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              window.location.href = 'about:blank'; // Or minimize / safe exit option
            }}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition"
          >
            ABORT SESSION & TOUCH GRASS
          </button>
          <button
            onClick={() => {
              setWarningTriggered(false);
              setDismissed(true); // Allows temporary bypass
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
          >
            Risky Bypass (Continue Anyway)
          </button>
        </div>
      </div>
    </div>
  );
};
