import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, CheckCircle, Zap, Plus, Trash2, Flame, Award } from 'lucide-react';

export default function DailyAuraApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [hunter, setHunter] = useState(() => {
    const saved = localStorage.getItem('dailyaura_hunter');
    return saved ? JSON.parse(saved) : {
      name: 'Shadow Monarch',
      rank: 'E-Rank Hunter',
      level: 1,
      xp: 120,
      maxXp: 500,
      streak: 5,
      aura: 450
    };
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('dailyaura_quests');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Walk 10,000 Steps', xp: 50, completed: false, category: 'Physical Discipline' },
      { id: 2, title: 'Read 20 Pages', xp: 40, completed: false, category: 'Mental Fortitude' },
    ];
  });

  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXp, setNewQuestXp] = useState('50');
  const [newQuestCategory, setNewQuestCategory] = useState('Physical');

  // Simulated activity heatmap data (past 28 days)
  const [heatmap] = useState([
    1, 2, 0, 3, 2, 1, 3,
    0, 1, 2, 2, 3, 1, 2,
    2, 3, 1, 0, 2, 3, 3,
    1, 2, 3, 2, 1, 2, 3
  ]);

  useEffect(() => {
    localStorage.setItem('dailyaura_hunter', JSON.stringify(hunter));
  }, [hunter]);

  useEffect(() => {
    localStorage.setItem('dailyaura_quests', JSON.stringify(quests));
  }, [quests]);

  const toggleQuest = (id: number) => {
    setQuests(prevQuests => {
      return prevQuests.map(q => {
        if (q.id === id) {
          const newCompleted = !q.completed;
          const xpChange = newCompleted ? q.xp : -q.xp;
          
          setHunter(prevHunter => {
            let updatedXp = prevHunter.xp + xpChange;
            let updatedLevel = prevHunter.level;
            let updatedMaxXp = prevHunter.maxXp;

            while (updatedXp >= updatedMaxXp) {
              updatedXp -= updatedMaxXp;
              updatedLevel += 1;
              updatedMaxXp += 150;
            }
            if (updatedXp < 0) updatedXp = 0;

            return { 
              ...prevHunter, 
              xp: updatedXp, 
              level: updatedLevel, 
              maxXp: updatedMaxXp,
              aura: prevHunter.aura + (newCompleted ? 15 : -15)
            };
          });

          return { ...q, completed: newCompleted };
        }
        return q;
      });
    });
  };

  const addQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    const newQuest = {
      id: Date.now(),
      title: newQuestTitle.trim(),
      xp: parseInt(newQuestXp) || 50,
      completed: false,
      category: newQuestCategory
    };

    setQuests([newQuest, ...quests]);
    setNewQuestTitle('');
  };

  const deleteQuest = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuests(quests.filter(q => q.id !== id));
  };

  return (
    <div style={{ backgroundColor: '#090a16', color: '#ffffff' }} className="min-h-screen bg-[#090a16] text-white flex flex-col max-w-md mx-auto relative pb-24 shadow-2xl border-x border-purple-950/40">
      
      {/* Top Header */}
      <header className="p-4 bg-gradient-to-br from-[#13112a] via-[#1a1638] to-[#090a16] backdrop-blur border-b border-purple-900/30 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">{hunter.rank}</span>
            <h1 className="text-xl font-black tracking-wide text-white mt-1">
              {hunter.name} 
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-900/40 text-purple-200 px-3 py-1 rounded-full border border-purple-700/50 font-bold flex items-center gap-1">
              <Flame size={13} className="text-amber-400 fill-amber-400" /> {hunter.streak}d
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-[#0b0c1c] p-3 rounded-2xl border border-purple-900/40 shadow-inner mt-2">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-purple-300 flex items-center gap-1"><Zap size={13} className="text-purple-400" /> XP Progress (Lv.{hunter.level})</span>
            <span className="text-purple-300 font-bold">{hunter.xp} / {hunter.maxXp} XP</span>
          </div>
          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-purple-950">
            <div 
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${Math.min(100, (hunter.xp / hunter.maxXp) * 100)}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            
            {/* Add Custom Quest Form */}
            <form onSubmit={addQuest} className="bg-[#121124] p-3.5 rounded-2xl border border-purple-900/30 space-y-3 shadow-lg">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add a new side quest..."
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  className="flex-1 bg-black/50 border border-purple-950 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-600"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="flex gap-2">
                <select 
                  value={newQuestCategory}
                  onChange={(e) => setNewQuestCategory(e.target.value)}
                  className="bg-black/50 border border-purple-950 rounded-xl px-2 py-1.5 text-xs text-purple-300 focus:outline-none"
                >
                  <option value="Physical">Physical</option>
                  <option value="Mental">Mental</option>
                  <option value="Discipline">Discipline</option>
                </select>
                <select 
                  value={newQuestXp}
                  onChange={(e) => setNewQuestXp(e.target.value)}
                  className="bg-black/50 border border-purple-950 rounded-xl px-2 py-1.5 text-xs text-purple-300 focus:outline-none"
                >
                  <option value="25">+25 XP</option>
                  <option value="50">+50 XP</option>
                  <option value="100">+100 XP</option>
                </select>
              </div>
            </form>

            {/* Active Quests Section */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase">Active Quests</h2>
                <span className="text-xs text-purple-400/80 font-medium">{quests.filter(q => q.completed).length}/{quests.length} Completed</span>
              </div>
              
              <div className="space-y-3">
                {quests.map(quest => (
                  <div 
                    key={quest.id}
                    onClick={() => toggleQuest(quest.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-lg ${
                      quest.completed 
                        ? 'bg-purple-950/40 border-purple-500/50 text-purple-200' 
                        : 'bg-[#121124] border-purple-900/30 text-white hover:border-purple-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        quest.completed ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'border-purple-800/80 bg-black/40'
                      }`}>
                        {quest.completed && <CheckCircle size={15} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${quest.completed ? 'line-through text-purple-400' : 'text-white'}`}>{quest.title}</p>
                        <span className="text-[10px] text-purple-300/80 font-semibold bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-800/30 mt-1 inline-block">{quest.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-800/40">+{quest.xp} XP</span>
                      <button 
                        onClick={(e) => deleteQuest(quest.id, e)}
                        className="text-purple-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guild' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase">Guild Hall</h2>
            <div className="bg-[#121124] p-6 rounded-2xl border border-purple-900/30 text-center py-12 shadow-xl">
              <Swords className="mx-auto text-purple-500 mb-3 animate-pulse" size={42} />
              <p className="text-purple-200 text-sm font-semibold">Global Hunter Board coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase">Hunter Profile</h2>
            
            {/* Stats Overview */}
            <div className="bg-[#121124] p-4 rounded-2xl border border-purple-900/30 space-y-3 shadow-xl">
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Hunter Name</span>
                <span className="font-bold text-white">{hunter.name}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Current Rank</span>
                <span className="font-bold text-purple-300">{hunter.rank}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Active Streak</span>
                <span className="font-bold text-amber-400 flex items-center gap-1"><Flame size={14} /> {hunter.streak} Days</span>
              </div>
              <div className="flex justify-between py-2.5 text-sm">
                <span className="text-purple-400">Total Aura Points</span>
                <span className="font-bold text-fuchsia-400">{hunter.aura}</span>
              </div>
            </div>

            {/* Consistency Heatmap Card */}
            <div className="bg-[#121124] p-4 rounded-2xl border border-purple-900/30 shadow-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Award size={15} className="text-purple-400" /> Consistency Heatmap
                </span>
                <span className="text-[10px] text-purple-400/70">Past 4 Weeks</span>
              </div>
              
              <div className="grid grid-cols-7 gap-2 pt-1">
                {heatmap.map((intensity, idx) => {
                  const bgColors = [
                    'bg-purple-950/30 border-purple-950',
                    'bg-purple-900/40 border-purple-800/40',
                    'bg-purple-700/60 border-purple-600/50',
                    'bg-fuchsia-500 border-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,0.5)]'
                  ];
                  return (
                    <div 
                      key={idx} 
                      className={`h-7 rounded-lg border transition-all ${bgColors[intensity]}`}
                    ></div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-[#090a16]/95 backdrop-blur border-t border-purple-900/30 flex justify-around p-3 z-10 shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-purple-500/60 hover:text-purple-300'}`}
        >
          <Shield size={20} />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('guild')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'guild' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-purple-500/60 hover:text-purple-300'}`}
        >
          <Swords size={20} />
          <span className="text-[10px] font-semibold">Guild Hall</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-purple-500/60 hover:text-purple-300'}`}
        >
          <User size={20} />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </nav>

    </div>
  );
}
