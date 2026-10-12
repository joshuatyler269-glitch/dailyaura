import React from 'react';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-purple-900/80 via-slate-900 to-slate-950 border border-purple-500/50 p-8 rounded-3xl shadow-2xl text-center space-y-6 max-w-sm w-full animate-bounce">
        <div className="space-y-2">
          <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-extrabold tracking-widest">
            🎉 ACHIEVEMENT UNLOCKED
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-wide pt-2">LEVEL UP!</h2>
          <p className="text-slate-400 text-xs">Your consistency is paying off. You have ascended to:</p>
        </div>

        <div className="py-4">
          <span className="text-6xl font-black text-purple-400 font-mono drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            LVL {level}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition"
        >
          CONTINUE QUEST
        </button>
      </div>
    </div>
  );
};
