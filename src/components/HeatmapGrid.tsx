import React from 'react';

export const HeatmapGrid: React.FC = () => {
  // Generate a mock grid of 28 days for consistency tracking
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.4,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-200">Consistency Heatmap</h2>
        <span className="text-xs text-slate-400">Past 4 Weeks</span>
      </div>
      <div className="grid grid-cols-7 gap-2 pt-2">
        {days.map((d, index) => (
          <div
            key={index}
            className={`h-8 rounded-xl transition border ${
              d.active
                ? 'bg-purple-600/80 border-purple-400 shadow-lg shadow-purple-900/30'
                : 'bg-slate-800/50 border-slate-700/50'
            }`}
            title={`Day ${d.day}: ${d.active ? 'Active' : 'Rest'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
