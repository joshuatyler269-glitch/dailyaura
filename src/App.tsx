import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, CheckCircle, Zap, Plus, Trash2, Flame, Award, LogOut, Sparkles, Trophy, Timer, Play, Square, CheckSquare, AlertOctagon, RefreshCw } from 'lucide-react';

const QUEST_POOL = [
  { title: 'Morning Bodyweight Circuit (20 Pushups/Squats)', xp: 60, category: 'Physical', requiresSensor: true },
  { title: 'Read 15 Pages of a Non-Fiction Book', xp: 45, category: 'Mental', requiresSensor: false },
  { title: 'Drink 500ml Water Upon Waking', xp: 25, category: 'Health', requiresSensor: false },
  { title: '30 Minutes Deep Focus Code Session', xp: 100, category: 'Deep Work', requiresSensor: false },
  { title: 'Walk 10,000 Steps (itel / Smartwatch Sync)', xp: 80, category: 'Physical', requiresSensor: true },
  { title: 'Review Termux Git Repos & Backup Code', xp: 50, category: 'Development', requiresSensor: false },
];

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
      status: 'Normal',
      penaltyActive: false
    };
  });

  // Robust Daily Rollover & Two-Box Quest Engine State
  const [quests, setQuests] = useState(() => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('dailyaura_quest_date');
    const savedQuests = localStorage.getItem('dailyaura_twobox_quests');

    if (savedDate !== todayStr || !savedQuests) {
      const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
      const dailySelection = shuffled.slice(0, 4).map((q, idx) => ({
        id: Date.now() + idx,
        title: q.title,
        xp: q.xp,
        status: 'available', // 'available' -> 'active' -> 'completed'
        category: q.category,
        requiresSensor: q.requiresSensor
      }));
      localStorage.setItem('dailyaura_quest_date', todayStr);
      localStorage.setItem('dailyaura_twobox_quests', JSON.stringify(dailySelection));
      return dailySelection;
    }

    return JSON.parse(savedQuests);
  });

  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestCategory, setNewQuestCategory] = useState('Discipline');

  const [isFocusActive, setIsFocusActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFocusActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isFocusActive) {
      setIsFocusActive(false);
      triggerSystemAlert('[Dungeon Cleared!] +150 XP Awarded for Deep Focus.');
      setHunter((prev: { xp: number; aura: number; }) => ({ 
        ...prev, 
        xp: prev.xp + 150, 
        aura: prev.aura + 50,
        status: 'Normal',
        penaltyActive: false
      }));
      setTimeLeft(1500);
    }
    return () => clearInterval(timer);
  }, [isFocusActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [guildMembers] = useState([
    { id: 1, name: 'Shadow Monarch (You)', level: hunter.level, rank: hunter.rank, aura: hunter.aura, active: true },
    { id: 2, name: 'Jin-Woo', level: 12, rank: 'S-Rank Hunter', aura: 3420, active: false },
    { id: 3, name: 'Cha Hae-In', level: 9, rank: 'A-Rank Hunter', aura: 2890, active: true },
  ]);

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
    localStorage.setItem('dailyaura_twobox_quests', JSON.stringify(quests));
  }, [quests]);

  const triggerSystemAlert = (msg: string) => {
    setNotification(msg);
    // Trigger mobile browser vibration if supported (haptic feedback)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
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

  // Box 1: Accept contract into active log
  const acceptQuest = (id: number) => {
    setQuests(quests.map((q: { id: number; }) => q.id === id ? { ...q, status: 'active' } : q));
    triggerSystemAlert('[Contract Accepted] Quest added to active log.');
  };

  // Box 2: Verify sensor / manual completion & grant reward
  const verifyAndCompleteQuest = (id: number) => {
    setQuests((prevQuests: any[]) => {
      return prevQuests.map(q => {
        if (q.id === id) {
          if (q.requiresSensor) {
            triggerSystemAlert('[Telemetry Sync] Pinging itel Device / Smartwatch Sensors...');
          }

          const multiplier = hunter.penaltyActive ? 0.5 : 1.0;
          const finalXp = Math.floor(q.xp * multiplier);

          triggerSystemAlert(`[Quest Cleared] +${finalXp} XP Verified & Claimed!`);

          setHunter((prevHunter: { xp: number; level: any; maxXp: any; rank: any; aura: number; }) => {
            let updatedXp = prevHunter.xp + finalXp;
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

            return { 
              ...prevHunter, 
              xp: updatedXp, 
              level: updatedLevel, 
              maxXp: updatedMaxXp,
              rank: updatedRank,
              aura: prevHunter.aura + 25
            };
          });

          return { ...q, status: 'completed' };
        }
        return q;
      });
    });
  };

  const addCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    const customQuest = {
      id: Date.now(),
      title: newQuestTitle.trim(),
      xp: 50,
      status: 'active',
      category: newQuestCategory,
      requiresSensor: false
    };

    setQuests([customQuest, ...quests]);
    setNewQuestTitle('');
    triggerSystemAlert('[Custom Contract Generated & Active]');
  };

  const triggerPenaltySimulation = () => {
    setHunter((prev: { penaltyActive: any; }) => ({
      ...prev,
      penaltyActive: !prev.penaltyActive,
      status: !prev.penaltyActive ? 'PENALTY ZONE (Debuff Active)' : 'Normal'
    }));
    triggerSystemAlert(!hunter.penaltyActive ? '[WARNING] System Penalty Triggered! XP gains halved.' : '[CLEARED] Penalty Lifted!');
  };

  const deleteQuest = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuests(quests.filter((q: { id: number; }) => q.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#090a16', color: '#ffffff' }} className="min-h-screen bg-[#090a16] text-white flex flex-col justify-between p-5 max-w-md mx-auto relative shadow-2xl border-x border-purple-950/40">
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles size={12} /> System v3.2 Running Web App
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Gamify Your Life.<br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Conquer Procrastination.
              </span>
            </h1>
          </div>

          <div className="bg-[#121124] p-5 rounded-3xl border border-purple-900/40 shadow-xl space-y-4">
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
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-900/50"
              >
                Enter Hunter Realm
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#090a16', color: '#ffffff' }} className="min-h-screen bg-[#090a16] text-white flex flex-col max-w-md mx-auto relative pb-24 shadow-2xl border-x border-purple-950/40">
      
      {notification && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-purple-900/90 border border-purple-400 text-purple-100 px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.6)] backdrop-blur text-xs font-bold text-center animate-bounce">
          {notification}
        </div>
      )}

      <header className="p-4 bg-gradient-to-br from-[#13112a] via-[#1a1638] to-[#090a16] backdrop-blur border-b border-purple-900/30 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">{hunter.rank}</span>
              <span className="text-xs bg-purple-900/40 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-700/50 font-bold">
                LVL {hunter.level}
              </span>
            </div>
            <h1 className="text-lg font-black tracking-wide text-white mt-1">{email.split('@')[0]}</h1>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-800/50 flex items-center gap-1 transition-all"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {hunter.penaltyActive && (
          <div className="bg-red-950/80 border border-red-600/60 p-2.5 rounded-xl mb-3 flex items-center justify-between text-xs text-red-200 animate-pulse">
            <span className="flex items-center gap-1.5 font-bold">
              <AlertOctagon size={14} className="text-red-400" /> PENALTY ZONE: Debuff Active (-50% XP)
            </span>
            <button onClick={triggerPenaltySimulation} className="bg-red-900 hover:bg-red-800 px-2 py-1 rounded text-[10px] font-bold text-white">
              Lift Penalty
            </button>
          </div>
        )}

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

      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            
            {/* Focus Timer Widget */}
            <div className="bg-gradient-to-br from-purple-950/50 via-[#121124] to-black p-4 rounded-2xl border border-purple-800/40 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Timer size={13} /> Session Guard / Focus Dungeon
                </span>
                <h3 className="text-2xl font-black text-white mt-1 tracking-wider">{formatTime(timeLeft)}</h3>
                <p className="text-[10px] text-purple-300/70">Clear dungeon to earn +150 XP</p>
              </div>
              <button 
                onClick={() => {
                  setIsFocusActive(!isFocusActive);
                  triggerSystemAlert(isFocusActive ? 'Dungeon Paused.' : 'Dungeon Gate Opened: Focus Active.');
                }}
                className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all ${
                  isFocusActive ? 'bg-amber-600 text-white' : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white'
                }`}
              >
                {isFocusActive ? <Square size={14} /> : <Play size={14} />}
                {isFocusActive ? 'Pause' : 'Enter Gate'}
              </button>
            </div>

            {/* Custom Quest Form */}
            <form onSubmit={addCustomQuest} className="bg-[#121124] p-3.5 rounded-2xl border border-purple-900/30 space-y-3 shadow-lg">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add a custom personal quest..."
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  className="flex-1 bg-black/50 border border-purple-950 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-600"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </form>

            {/* TWO-BOX WORKFLOW SECTION */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1">
                  <CheckSquare size={15} className="text-purple-400" /> Automated Daily Quests (Two-Box)
                </h2>
                <span className="text-xs text-purple-400/80 font-medium">Accept & Verify</span>
              </div>
              
              <div className="space-y-3">
                {quests.map((quest: any) => (
                  <div 
                    key={quest.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 shadow-lg ${
                      quest.status === 'completed' 
                        ? 'bg-purple-950/30 border-purple-500/30 text-purple-300 opacity-75' 
                        : quest.status === 'active'
                        ? 'bg-[#15132d] border-purple-500/60 text-white'
                        : 'bg-[#121124] border-purple-900/30 text-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${quest.status === 'completed' ? 'line-through text-purple-400' : 'text-white'}`}>
                          {quest.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/40 px-2 py-0.5 rounded border border-purple-800/30">
                            {quest.category}
                          </span>
                          {quest.requiresSensor && (
                            <span className="text-[9px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                              itel / Sensor Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-800/40">
                        +{quest.xp} XP
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                        Status: <span className="text-white">{quest.status}</span>
                      </span>

                      <div className="flex gap-2">
                        {quest.status === 'available' && (
                          <button 
                            onClick={() => acceptQuest(quest.id)}
                            className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all"
                          >
                            Box 1: Accept Contract
                          </button>
                        )}

                        {quest.status === 'active' && (
                          <button 
                            onClick={() => verifyAndCompleteQuest(quest.id)}
                            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:opacity-90 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1"
                          >
                            <CheckCircle size={13} /> Box 2: Verify & Claim
                          </button>
                        )}

                        {quest.status === 'completed' && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> Cleared
                          </span>
                        )}

                        <button 
                          onClick={(e) => deleteQuest(quest.id, e)}
                          className="text-purple-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  return <div key={idx} className={`h-7 rounded-lg border transition-all ${bgColors[intensity]}`}></div>;
                })}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'guild' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1.5">
              <Trophy size={16} className="text-amber-400" /> Guild Hall Leaderboard
            </h2>
            <div className="space-y-2.5">
              {guildMembers.map((member, index) => (
                <div key={member.id} className="p-3.5 rounded-2xl border bg-[#121124] border-purple-900/30 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center text-xs font-black">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <span className="text-[10px] text-purple-300/70">{member.rank} • Lv.{member.level}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-fuchsia-400">{member.aura} Aura</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase">Hunter Profile</h2>
            <div className="bg-[#121124] p-4 rounded-2xl border border-purple-900/30 space-y-3 shadow-xl">
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Hunter Status</span>
                <span className="font-bold text-purple-300">{hunter.status}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-purple-900/30 text-sm">
                <span className="text-purple-400">Current Rank</span>
                <span className="font-bold text-purple-300">{hunter.rank}</span>
              </div>
              <div className="flex justify-between py-2.5 text-sm">
                <span className="text-purple-400">Total Aura Points</span>
                <span className="font-bold text-fuchsia-400">{hunter.aura}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      <nav className="absolute bottom-0 left-0 right-0 bg-[#090a16]/95 backdrop-blur border-t border-purple-900/30 flex justify-around p-3 z-10 shadow-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-purple-400' : 'text-purple-500/60'}`}>
          <Shield size={20} /><span className="text-[10px] font-semibold">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('guild')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'guild' ? 'text-purple-400' : 'text-purple-500/60'}`}>
          <Swords size={20} /><span className="text-[10px] font-semibold">Guild Hall</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors
