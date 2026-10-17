import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, CheckCircle, Zap, Trophy, Flame } from 'lucide-react';

export default function DailyAuraApp() {
  // State with Local Storage persistence so progress isn't lost on refresh
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [hunter, setHunter] = useState(() => {
    const saved = localStorage.getItem('dailyaura_hunter');
    return saved ? JSON.parse(saved) : {
      name: 'Shadow Monarch',
      rank: 'E-Rank Hunter',
      level: 1,
      xp: 120,
      maxXp: 500,
      streak: 3,
      aura: 450
    };
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('dailyaura_quests');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Morning Hydration (500ml water)', xp: 50, completed: false, category: 'Health' },
      { id: 2, title: 'Read 10 Pages of a Book', xp: 100, completed: false, category: 'Mind' },
      { id: 3, title: 'Bodyweight Workout (20 Pushups)', xp: 150, completed: false, category: 'Strength' },
    ];
  });

  // Save changes to local storage automatically
  useEffect(() => {
    localStorage.setItem('dailyaura_hunter', JSON.stringify(hunter));
  }, [hunter]);

  useEffect(() => {
    localStorage.setItem('dailyaura_quests', JSON.stringify(quests));
  }, [quests]);

  const toggleQuest = (id: number) => {
    setQuests(quests.map(q => {
      if (q.id === id) {
        const newCompleted = !q.completed;
        const xpChange = newCompleted ? q.xp : -q.xp;
        
        // Update hunter XP
        setHunter(prev => {
          let updatedXp = prev.xp + xpChange;
          let updatedLevel = prev.level;
          let updatedMaxXp = prev.maxXp;

          if (updatedXp >= updatedMaxXp) {
            updatedXp -= updatedMaxXp;
            updatedLevel += 1;
            updatedMaxXp += 200; // Increase threshold per level
          } else if (updatedXp < 0) {
            updatedXp = 0;
          }

          return { ...prev, xp: updatedXp, level: updatedLevel, maxXp: updatedMaxXp };
        });

        return { ...q, completed: newCompleted };
      }
      return q;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col max-w-md mx-auto relative pb-20 shadow-2xl border-x border-slate-800">
      
      {/* Top Header / Status Bar */}
      <header className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">{hunter.rank}</span>
          <h1 className="text-lg font-black tracking-wide flex items-center gap-1.5">
            {hunter.name} <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">Lv.{hunter.level}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Flame size={14} className="fill-amber-400" />
            <span className="font-bold">{hunter.streak}d</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* XP Progress Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-10px] text-cyan-500/5">
                <Trophy size={120} />
              </div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-slate-400 flex items-center gap-1"><Zap size={14} className="text-cyan-400" /> Experience Progress</span>
                <span className="text-cyan-400 font-bold">{hunter.xp} / {hunter.maxXp} XP</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(hunter.xp / hunter.maxXp) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Daily Quests Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-md font-bold tracking-wide text-slate-200">Daily Quests</h2>
                <span className="text-xs text-slate-400">{quests.filter(q => q.completed).length}/{quests.length} Completed</span>
              </div>
              
              <div className="space-y-2.5">
                {quests.map(quest => (
                  <div 
                    key={quest.id}
                    onClick={() => toggleQuest(quest.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      quest.completed 
                        ? 'bg-cyan-950/20 border-cyan-500/30 text-slate-400' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        quest.completed ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-800'
                      }`}>
                        {quest.completed && <CheckCircle size={16} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${quest.completed ? 'line-through text-slate-500' : ''}`}>{quest.title}</p>
                        <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded">{quest.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+{quest.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUILD HALL */}
        {activeTab === 'guild' && (
          <div className="space-y-4">
            <h2 className="text-md font-bold tracking-wide text-slate-200">Guild Hall</h2>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center py-10">
              <Swords className="mx-auto text-slate-600 mb-2" size={40} />
              <p className="text-slate-400 text-sm">Global Hunter Board coming soon.</p>
              <p className="text-xs text-slate-600 mt-1">Compete with other hunters worldwide.</p>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-md font-bold tracking-wide text-slate-200">Hunter Profile</h2>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-800/60 text-sm">
                <span className="text-slate-400">Hunter Name</span>
                <span className="font-bold">{hunter.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60 text-sm">
                <span className="text-slate-400">Current Rank</span>
                <span className="font-bold text-cyan-400">{hunter.rank}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60 text-sm">
                <span className="text-slate-400">Total Aura Points</span>
                <span className="font-bold text-amber-400">{hunter.aura}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur border-t border-slate-800 flex justify-around p-2.5 z-10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Shield size={20} />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('guild')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'guild' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Swords size={20} />
          <span className="text-[10px] font-semibold">Guild Hall</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User size={20} />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </nav>

    </div>
  );
}
