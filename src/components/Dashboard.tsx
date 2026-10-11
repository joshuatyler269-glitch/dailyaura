import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Quest {
  id: string;
  title: string;
  completed: boolean;
  xp_reward: number;
}

export const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const maxXp = 300;

  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestTitle, setNewQuestTitle] = useState('');

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchQuests();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('level, xp')
      .eq('id', user.id)
      .single();

    if (data) {
      setLevel(data.level);
      setXp(data.xp);
    } else if (error && error.code === 'PGRST116') {
      await supabase.from('user_profiles').insert([{ id: user.id, level: 1, xp: 0 }]);
    }
  };

  const fetchQuests = async () => {
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setQuests(data);
    } else if (!data || data.length === 0) {
      const defaultQuests = [
        { user_id: user.id, title: 'Clear Inbox Zero (Urgent)', completed: false, xp_reward: 50 },
        { user_id: user.id, title: '30 Min Deep Work Session', completed: false, xp_reward: 100 },
        { user_id: user.id, title: 'Hydrate & Stretch', completed: false, xp_reward: 30 },
      ];
      const { data: inserted } = await supabase.from('quests').insert(defaultQuests).select();
      if (inserted) setQuests(inserted);
    }
  };

  const updateProfileInDb = async (newLevel: number, newXp: number) => {
    await supabase
      .from('user_profiles')
      .upsert({ id: user.id, level: newLevel, xp: newXp, updated_at: new Date() });
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setAlarmTriggered(true);
      playAlarmSound();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleQuest = async (id: string, xpReward: number, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    const xpChange = nextCompleted ? xpReward : -xpReward;

    let updatedXp = xp + xpChange;
    let updatedLevel = level;
    if (updatedXp >= maxXp) {
      updatedLevel += 1;
      updatedXp -= maxXp;
    } else if (updatedXp < 0) {
      updatedXp = 0;
    }

    setXp(updatedXp);
    setLevel(updatedLevel);
    setQuests(quests.map((q) => (q.id === id ? { ...q, completed: nextCompleted } : q)));

    await supabase.from('quests').update({ completed: nextCompleted }).eq('id', id);
    await updateProfileInDb(updatedLevel, updatedXp);
  };

  const addQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    const newQuest = {
      user_id: user.id,
      title: newQuestTitle,
      completed: false,
      xp_reward: 50,
    };

    const { data } = await supabase.from('quests').insert([newQuest]).select();
    if (data && data[0]) {
      setQuests([data[0], ...quests]);
      setNewQuestTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-red-950/40 border border-purple-500/30 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-wide text-purple-400">HERO DASHBOARD</h1>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-bold">
                  LVL {level}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl transition"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>XP Progress</span>
              <span>{xp} / {maxXp} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`bg-slate-900 border p-6 rounded-3xl shadow-2xl text-center space-y-4 transition duration-500 ${alarmTriggered ? 'border-red-600 animate-pulse bg-red-950/20' : 'border-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest text-red-500">⚡ DOOMSDAY FOCUS TIMER</span>
            {alarmTriggered && <span className="text-xs text-red-400 font-bold animate-bounce">⚠️ TIME EXPIRED!</span>}
          </div>

          <div className="text-5xl md:text-6xl font-extrabold tracking-widest text-red-500 font-mono py-2">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setIsTimerActive(!isTimerActive);
                setAlarmTriggered(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition shadow-lg ${
                isTimerActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isTimerActive ? 'PAUSE DOOMSDAY' : 'START COUNTDOWN'}
            </button>
            <button
              onClick={() => {
                setIsTimerActive(false);
                setTimeLeft(25 * 60);
                setAlarmTriggered(false);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-200">Active Quests</h2>
            <span className="text-xs text-slate-400">Complete tasks to earn XP</span>
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

          <div className="space-y-2 pt-2">
            {quests.map((quest) => (
              <div
                key={quest.id}
                onClick={() => toggleQuest(quest.id, quest.xp_reward, quest.completed)}
                className={`flex justify-between items-center p-3.5 rounded-2xl border transition cursor-pointer ${
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
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg border border-purple-500/30 font-bold">
                  +{quest.xp_reward} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
