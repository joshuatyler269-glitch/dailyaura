import React, { useState } from 'react';

interface AiDecomposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubQuests: (quests: string[]) => void;
}

export const AiDecomposerModal: React.FC<AiDecomposerModalProps> = ({ isOpen, onClose, onAddSubQuests }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleDecompose = () => {
    if (!goal.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // Simulate AI breakdown based on prompt
      setSuggestedTasks([
        `Research & outline requirements for: ${goal}`,
        `Draft core structural implementation`,
        `Test and debug primary execution flow`,
        `Final deployment and validation`
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleAccept = () => {
    onAddSubQuests(suggestedTasks);
    setSuggestedTasks([]);
    setGoal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl shadow-2xl space-y-5 max-w-md w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-extrabold text-purple-400 tracking-wider">🤖 AI TASK DECOMPOSER</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>

        <p className="text-slate-400 text-xs">Enter a massive goal, and the AI will slice it down into bite-sized daily side quests.</p>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="e.g., Build a full-stack SaaS product..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {suggestedTasks.length === 0 ? (
            <button
              onClick={handleDecompose}
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
            >
              {loading ? 'Decomposing Goal...' : 'Decompose with AI'}
            </button>
          ) : (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suggested Quests:</span>
              {suggestedTasks.map((task, i) => (
                <div key={i} className="p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200">
                  {task}
                </div>
              ))}
              <button
                onClick={handleAccept}
                className="w-full mt-2 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl transition"
              >
                Add All to Active Quests
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
