import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, CheckCircle, Zap, Plus, Trash2, Flame, Award, LogOut, AlertTriangle, Sparkles } from 'lucide-react';

export default function DailyAuraApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dailyaura_auth') === 'true';
  });
  
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('joshuaosayande58@gmail.com');
  const [password, setPassword] = useState('********');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  
  const [hunter, setHunter] = useState(() => {
    const saved = localStorage.getItem('dailyaura_hunter');
    return saved ? JSON.parse(saved) : {
      name: 'Shadow Monarch',
      rank: 'E-Rank Hunter',
      level: 1,
      xp: 120,
      maxXp: 300,
      streak: 3,
      aura: 450,
      status: 'Focused'
    };
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('dailyaura_quests');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Complete 30 min deep focus work', xp: 100, completed: false, category: 'Deep Work' },
      { id: 2, title: 'Hydrate & step away from screen', xp: 30, completed: false, category: 'Health' },
      { id: 3, title: 'Review daily goals & clear inbox', xp: 50, completed: false, category: 'Strategy' },
    ];
  });

  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXp, setNewQuestXp] = useState('50');
  const [newQuestCategory, setNewQuestCategory] = useState('Discipline');

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

  const triggerSystemAlert = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    localStorage.setItem('dailyaura_auth', 'true');
    triggerSystemAlert('System Initialized: Welcome back, Monarch.');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dailyaura_auth');
  };

  const toggleQuest = (id: number) => {
    setQuests(prevQuests => {
      return prevQuests.map(q => {
        if (q.id === id) {
          const newCompleted = !q.completed;
          const xpChange = newCompleted ? q.xp : -q.xp;
          
          if (newCompleted) {
            triggerSystemAlert(`[Quest Cleared] +${q.xp} XP Gained!`);
          }

          setHunter(prevHunter => {
            let updatedXp = prevHunter.xp + xpChange;
            let updatedLevel = prevHunter.level;
            let updatedMaxXp = prevHunter.maxXp;
            let updatedRank = prevHunter.rank;

            while (updatedXp >= updatedMaxXp) {
              updatedXp -= updatedMaxXp;
              updatedLevel += 1;
              updatedMaxXp += 200;
              triggerSystemAlert(`[LEVEL UP!] You have reached Level ${updatedLevel}!`);
              
              if (updatedLevel >= 3) updatedRank = 'D-Rank Hunter';
              if (updatedLevel >= 5) updatedRank = 'C-Rank Hunter';
            }
            if (updatedXp < 0) updatedXp = 0;

            return { 
              ...prevHunter, 
              xp: updatedXp, 
              level: updatedLevel, 
              maxXp: updatedMaxXp,
              rank: updatedRank,
              aura: prevHunter.aura + (newCompleted ? 25 : -25)
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
    triggerSystemAlert('[New Quest Generated]');
  };

  const deleteQuest = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuests(quests.filter(q => q.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#090a16', color: '#ffffff' }} className="min-h-screen bg-[#090a16] text-white flex flex-col justify-between p-5 max-w-md mx-auto relative shadow-2xl border-x border-purple-950/40">
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles size={12} /> System v2.5 Online
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Gamify Your Life.<br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Conquer Procrastination.
              </span>
            </h1>
            <p className="text-xs text-purple-300/80 leading-relaxed pt-1">
              Transform daily tasks into RPG quests, earn experience points, level up your consistency, and keep phone addiction in check with built-in session guardians.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121124] p-3.5 rounded-2xl border border-purple-900/30 shadow-lg">
              <h3 className="text-sm font-bold text-fuchsia-400 mb-1">RPG Stats</h3>
              <p className="text-[11px] text-purple-300/70">Level progression & XP rewards for every task.</p>
            </div>
            <div className="bg-[#121124] p-3.5 rounded-2xl border border-purple-900/30 shadow-lg">
              <h3 className="text-sm font-bold text-amber-400 mb-1">Session Guard</h3>
              <p className="text-[11px] text-purple-300/70">Break free from excessive phone and gaming loops.</p>
            </div>
          </div>

          <div className="bg-[#121124] p-5 rounded-3xl border border-purple-900/40 shadow-xl space-y-4">
            <div className="flex bg-black/50 p-1 rounded-2xl border border-purple-950">
              <button 
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400'}`}
              >
                Create Account
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'signin' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400'}`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-purple-400 mb-1">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-purple-950 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-purple-400 mb-1">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-purple-950 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-600"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-900/50 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                {authMode === 'signup' ? 'Initialize Hero Account' : 'Enter Hunter Realm'}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center pb-2">
          <p className="text-[11px] text-purple-400/60">Start your consistency streak today.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#090a16', color: '#ffffff' }} className="min-h-screen bg-[#090a16] text-white flex flex-col max-w-md mx-auto relative pb-24 shadow-2xl border-x border-purple-950/40">
      
      {/* System Hologram Notification Popup */}
      {notification && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-purple-900/90 border border-purple-400 text-purple-100 px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.6)] backdrop-blur text-xs font-bold text-center animate-bounce">
          {notification}
        </div>
      )}

      {/* Top Header */}
      <header className="p-4 bg-gradient-to-br from-[#13112a] via-[#1a1638] to-[#090a16] backdrop-blur border-b border-purple-900/30 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">{hunter.rank}</span>
              <span className="text-xs bg-purple-900/40 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-700/50 font-bold">
                LVL {hunter.level}
              </span>
            </div>
            <h1 className="text-lg font-black tracking-wide text-white mt-1">
              {email.split('@')[0]} 
            </h1>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-800/50 flex items-center gap-1 transition-all"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-[#0b0c1c] p-3 rounded-2xl border border-purple-900/40 shadow-inner mt-2">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-purple-300 flex items-center gap-1"><Zap size={13} className="text-purple-400" /> XP Progress</span>
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
                  <Plus size={14} /> Add Quest
                </button>
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

            {/* Consistency Heatmap Card on Dashboard */}
            <div className="bg-[#121124] p-4 rounded-2xl border border-purple-900/30 shadow-xl space-y-3 mt-4">
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
            
            <div className="bg-[#121124] p-4 rounded-2xl border border-purple-900/30 space-y-3 shadow-xl">
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Hunter Account</span>
                <span className="font-bold text-white">{email}</span>
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
     