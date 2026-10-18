import React, { useState, useEffect } from 'react';
import { Shield, Swords, User, CheckCircle, Zap, Plus, Trash2, Flame, Award, LogOut, Sparkles, Trophy, Timer, Play, Square, RefreshCw, CheckSquare } from 'lucide-react';

const QUEST_POOL = [
  { title: 'Morning Bodyweight Circuit (20 Pushups/Squats)', xp: 60, category: 'Physical', requiresSensor: true },
  { title: 'Read 15 Pages of a Non-Fiction Book', xp: 45, category: 'Mental', requiresSensor: false },
  { title: 'Drink 500ml Water Upon Waking', xp: 25, category: 'Health', requiresSensor: false },
  { title: '30 Minutes Deep Focus Code Session', xp: 100, category: 'Deep Work', requiresSensor: false },
  { title: 'Walk 10,000 Steps (itel / Smartwatch Sync)', xp: 80, category: 'Physical', requiresSensor: true },
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
      status: 'Focused'
    };
  });

  // Two-Box Quest State: 'available' -> 'active' -> 'completed'
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('dailyaura_twobox_quests');
    if (saved) return JSON.parse(saved);
    
    return [
      { id: 1, title: 'Walk 10,000 Steps (Sensor Sync)', xp: 80, status: 'available', category: 'Physical', requiresSensor: true },
      { id: 2, title: 'Complete 30 min deep focus work', xp: 100, status: 'active', category: 'Deep Work', requiresSensor: false },
      { id: 3, title: 'Review daily goals & clear inbox', xp: 50, status: 'available', category: 'Strategy', requiresSensor: false },
    ];
  });

  const [isFocusActive, setIsFocusActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFocusActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isFocusActive) {
      setIsFocusActive(false);
      triggerSystemAlert('[Dungeon Cleared!] +150 XP Awarded for Deep Focus.');
      setHunter(prev => ({ ...prev, xp: prev.xp + 150, aura: prev.aura + 50 }));
      setTimeLeft(1500);
    }
    return () => clearInterval(timer);
  }, [isFocusActive, timeLeft]);

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
          // If sensor-based, simulate telemetry check (e.g. checking itel device steps / pulse API)
          if (q.requiresSensor) {
            triggerSystemAlert('[Telemetry Sync] Pinging itel Device / Smartwatch Sensors...');
          }

          const xpChange = q.xp;
          triggerSystemAlert(`[Quest Cleared] +${q.xp} XP Verified & Claimed!`);

          setHunter((prevHunter: { xp: number; level: any; maxXp: any; rank: any; aura: number; }) => {
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
              <Sparkles size={12} /> System v2.8 Online
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

            {/* TWO-BOX WORKFLOW SECTION */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-bold tracking-wider text-purple-200 uppercase flex items-center gap-1">
                  <CheckSquare size={15} className="text-purple-400" /> Two-Box Quest Engine
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

                    {/* BOX 1 & BOX 2 BUTTON CONTROLS */}
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

            {/* Consistency Heatmap Card */}
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
                      <span className="text-[10px] text-purple-300/70">{member.rank} • Lv.{
