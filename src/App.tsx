import React, { useState } from 'react';

interface Quest {
  id: string;
  title: string;
  completed: boolean;
  xp_reward: number;
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(120);
  const maxXp = 300;

  const [quests, setQuests] = useState<Quest[]>([
    { id: '1', title: 'Complete 30 min deep focus work', completed: false, xp_reward: 100 },
    { id: '2', title: 'Hydrate & step away from screen', completed: true, xp_reward: 30 },
    { id: '3', title: 'Review daily goals & clear inbox', completed: false, xp_reward: 50 },
  ]);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showGuardian, setShowGuardian] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsLoggedIn(true);
  };

  const toggleQuest = (id: string, xpReward: number, completed: boolean) => {
    const nextCompleted = !completed;
    const xpChange = nextCompleted ? xpReward : -xpReward;
    
    let updatedXp = xp + xpChange;
    let updatedLevel = level;
    if (updatedXp >= maxXp) {
      updatedLevel += 1;
      updatedXp -= maxXp;
      setShowLevelUp(true);
    } else if (updatedXp < 0) {
      updatedXp = 0;
    }

    setXp(updatedXp);
    setLevel(updatedLevel);
    setQuests(quests.map(q => q.id === id ? { ...q, completed: nextCompleted } : q));
  };

  const addQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    setQuests([{
      id: Date.now().toString(),
      title: newQuestTitle,
      completed: false,
      xp_reward: 50
    }, ...quests]);
    setNewQuestTitle('');
  };

  const deleteQuest = (id: string) => {
    setQuests(quests.filter(q => q.id !== id));
  };

  // Professional Landing & Auth Gateway
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 md:p-8 font-sans">
        {/* Top Branding Header */}
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-extrabold tracking-widest">
              ⚡ DAILY AURA
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden md:block">
            Mobile-First Gamified Productivity Engine
          </div>
        </div>

        {/* Hero Section & Auth Card Grid */}
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Gamify Your Life. <span className="text-purple-400">Conquer Procrastination.</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Transform daily tasks into RPG quests, earn experience points, level up your consistency, and keep phone addiction in check with built-in session guardians.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-purple-400 font-extrabold text-base">RPG Stats</span>
                <p className="text-[11px] text-slate-400 mt-1">Level progression & XP rewards for every task.</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-red-400 font-extrabold text-base">Session Guard</span>
                <p className="text-[11px] text-slate-400 mt-1">Break free from excessive phone and gaming loops.</p>
              </div>
            </div>
          </div>

          {/* Auth Card with Mode Selector */}
          <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                  authMode === 'signup' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                  authMode === 'signin' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="hero@dailyaura.app"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg transition"
              >
                {authMode === 'signup' ? 'INITIALIZE HERO ACCOUNT' : 'ENTER DASHBOARD'}
              </button>
            </form>

            <div className="text-center">
              <span className="text-[10px] text-slate-500">
                {authMode === 'signup' ? 'Start your consistency streak today.' : 'Welcome back, hero.'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-4xl mx-auto w-full text-center py-4 text-[11px] text-slate-500">
          Daily Aura &bull; Built for extreme focus and digital wellbeing.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header / Hero Stats */}
        <div className="bg-gradient-to-r from-purple-900/50 via-slate-900 to-indigo-950/50 border border-purple-500/40 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-wider text-purple-400">DAILY AURA</h1>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-bold">
                  LVL {level}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">{emailInput}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGuardian(true)}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs rounded-xl transition font-bold"
              >
                Test Guard
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>XP Progress</span>
              <span>{xp} / {maxXp} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-200">Active Quests</h2>
            <span className="text-xs text-slate-400">Complete tasks to gain XP</span>
          </div>

          <form onSubmit={addQuest} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new side quest..."
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
            >
              Add Quest
            </button>
          </form>

          <div className="space-y-2.5 pt-2">
            {quests.map((quest) => (
              <div
                key={quest.id}
                onClick={() => toggleQuest(quest.id, quest.xp_reward, quest.completed)}
                className={`flex justify-between items-center p-4 rounded-2xl border transition cursor-pointer ${
                  quest.completed
                    ? 'bg-purple-950/20 border-purple-500/30 text-slate-400 line-through'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={quest.completed}
                    onChange={() => {}}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-medium">{quest.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-500/30 font-bold">
                    +{quest.xp_reward} XP
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteQuest(quest.id); }}
                    className="text-slate-500 hover:text-red-400 p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consistency Heatmap */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-200">Consistency Heatmap</h2>
            <span className="text-xs text-slate-400">Past 4 Weeks</span>
          </div>
          <div className="grid grid-cols-7 gap-2 pt-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const active = i % 2 === 0 || i % 5 === 0;
              return (
                <div
                  key={i}
                  className={`h-8 rounded-xl transition border ${
                    active 
                      ? 'bg-purple-600/80 border-purple-400 shadow-lg shadow-purple-900/30' 
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}
                  title={`Day ${i + 1}: ${active ? 'Active' : 'Rest'}`}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Level Up Modal */}
        {showLevelUp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-purple-900/90 via-slate-900 to-slate-950 border border-purple-500/50 p-8 rounded-3xl shadow-2xl text-center space-y-6 max-w-sm w-full animate-bounce">
              <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 font-extrabold tracking-widest">
                🎉 ACHIEVEMENT UNLOCKED
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-wide">LEVEL UP!</h2>
              <span className="text-6xl font-black text-purple-400 font-mono">LVL {level}</span>
              <button
                onClick={() => setShowLevelUp(false)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
              >
                CONTINUE QUEST
              </button>
            </div>
          </div>
        )}

        {/* Session Guardian / Phone Addiction Warning Modal */}
        {showGuardian && (
          <div className="fixed inset-0 bg-red-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-red-600 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center space-y-6 max-w-sm w-full animate-pulse">
              <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/40 font-extrabold tracking-widest">
                🚨 DOOMSDAY PROTOCOL: OVERLOAD
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-wide">4+ HOURS ON PHONE</h2>
              <p className="text-slate-400 text-xs">
                Heavy gaming or screen time detected on your device. Your real-world goals are waiting!
              </p>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => alert('Session aborted. Go touch grass!')}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  STOP PLAYING & TAKE A BREAK
                </button>
                <button
                  onClick={() => setShowGuardian(false)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
                >
                  Risky Bypass (Continue Anyway)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
