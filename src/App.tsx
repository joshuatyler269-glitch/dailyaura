import React, { useEffect, useState } from "react";
import {
  Shield,
  Swords,
  User,
  Zap,
  Flame,
  Trophy,
  Timer,
  Play,
  Pause,
  Plus,
  Check,
  Trash2,
  LogOut,
  Sparkles,
  Target,
  CalendarDays,
  ChevronRight,
  Crown,
  CircleUserRound,
} from "lucide-react";

type Quest = {
  id: number;
  title: string;
  category: string;
  xp: number;
  completed: boolean;
};

const INITIAL_QUESTS: Quest[] = [
  {
    id: 1,
    title: "Complete your morning routine",
    category: "DISCIPLINE",
    xp: 50,
    completed: false,
  },
  {
    id: 2,
    title: "Read or study for 20 minutes",
    category: "MENTAL",
    xp: 40,
    completed: false,
  },
  {
    id: 3,
    title: "Complete a focused work session",
    category: "FOCUS",
    xp: 100,
    completed: false,
  },
  {
    id: 4,
    title: "Review today's goals",
    category: "PLANNING",
    xp: 30,
    completed: false,
  },
];

const STORAGE_KEY = "daily_aura_rebuild_demo";

function getSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getRank(level: number) {
  if (level >= 50) return "S-RANK";
  if (level >= 35) return "A-RANK";
  if (level >= 20) return "B-RANK";
  if (level >= 10) return "C-RANK";
  if (level >= 5) return "D-RANK";
  return "E-RANK";
}

export default function App() {
  const saved = getSavedData();

  const [authenticated, setAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [quests, setQuests] = useState<Quest[]>(
    saved?.quests ?? INITIAL_QUESTS
  );
  const [xp, setXp] = useState(saved?.xp ?? 120);
  const [level, setLevel] = useState(saved?.level ?? 1);
  const [streak, setStreak] = useState(saved?.streak ?? 3);
  const [tab, setTab] = useState<"dashboard" | "guild" | "profile">(
    "dashboard"
  );
  const [newQuest, setNewQuest] = useState("");
  const [timer, setTimer] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [notice, setNotice] = useState("");
  const [heatmap] = useState<number[]>(
    saved?.heatmap ??
      Array.from({ length: 28 }, () => Math.floor(Math.random() * 4))
  );

  const rank = getRank(level);
  const xpNeeded = level * 300;
  const progress = Math.min(100, (xp / xpNeeded) * 100);
  const completedCount = quests.filter((q) => q.completed).length;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ quests, xp, level, streak, heatmap })
    );
  }, [quests, xp, level, streak, heatmap]);

  useEffect(() => {
    if (!timerActive) return;

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setTimerActive(false);
          setXp((currentXp) => currentXp + 150);
          setNotice("FOCUS DUNGEON CLEARED · +150 XP");
          return 25 * 60;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainder
    ).padStart(2, "0")}`;
  };

  const claimQuest = (id: number) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;

    setQuests((current) =>
      current.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );

    setXp((current) => current + quest.xp);
    setNotice(`QUEST CLEARED · +${quest.xp} XP`);
  };

  const addQuest = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newQuest.trim()) return;

    setQuests((current) => [
      {
        id: Date.now(),
        title: newQuest.trim(),
        category: "CUSTOM",
        xp: 50,
        completed: false,
      },
      ...current,
    ]);

    setNewQuest("");
    setNotice("NEW QUEST CREATED · +50 XP AVAILABLE");
  };

  const signOut = () => {
    setAuthenticated(false);
    setTab("dashboard");
  };

  // DEMO LOGIN — real account authentication will be connected later.
  const handleDemoLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setAuthenticated(true);
    setNotice("WELCOME TO THE HUNTER SYSTEM");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#070611] text-white flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/30 bg-violet-950/40 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
              <Shield size={38} className="text-violet-300" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.45em] text-violet-400 font-bold">
              Your personal hunter system
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              DAILY <span className="text-violet-400">AURA</span>
            </h1>

            <p className="mt-3 text-sm text-violet-200/50">
              Build discipline. Complete quests. Level up.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-900/50 bg-[#100d20] p-6 shadow-2xl">
            <div className="mb-6 flex rounded-xl bg-black/30 p-1">
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${
                  authMode === "signup"
                    ? "bg-violet-700 text-white"
                    : "text-violet-300/50"
                }`}
              >
                CREATE HUNTER
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${
                  authMode === "login"
                    ? "bg-violet-700 text-white"
                    : "text-violet-300/50"
                }`}
              >
                SIGN IN
              </button>
            </div>

            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-violet-300/70">
                  Hunter email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-violet-900/50 bg-black/40 px-4 py-3.5 text-sm outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-violet-300/70">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter a demo password"
                  required
                  className="w-full rounded-xl border border-violet-900/50 bg-black/40 px-4 py-3.5 text-sm outline-none transition focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-700 py-4 text-xs font-black tracking-widest shadow-lg shadow-violet-950/40 transition hover:brightness-110"
              >
                <Sparkles size={16} />
                ENTER THE HUNTER SYSTEM
              </button>
            </form>

            <p className="mt-5 text-center text-[10px] leading-relaxed text-violet-300/30">
              DEMO MODE · Accounts and passwords are not yet saved or verified.
            </p>
          </div>

          <p className="mt-6 text-center text-[10px] tracking-widest text-violet-300/20">
            DAILY AURA SYSTEM · BUILD 001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] text-white">
      <div className="mx-auto min-h-screen max-w-lg border-x border-violet-950/30 bg-[#090815] pb-28">
        {notice && (
          <div className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-lg rounded-xl border border-violet-400/50 bg-violet-950 px-4 py-3 text-center text-xs font-bold text-violet-100 shadow-xl">
            {notice}
          </div>
        )}

        <header className="border-b border-violet-900/30 bg-gradient-to-b from-[#17112d] to-[#090815] px-5 pb-5 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-violet-400" />
              <span className="text-sm font-black tracking-[0.18em]">
                DAILY <span className="text-violet-400">AURA</span>
              </span>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg border border-violet-900/40 bg-black/20 px-3 py-2 text-[10px] font-bold text-violet-300/70"
            >
              <LogOut size={13} /> SIGN OUT
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-violet-700/40 bg-gradient-to-br from-[#24154a] via-[#15102d] to-[#0b0a18] p-5 shadow-[0_0_35px_rgba(124,58,237,0.08)]">
            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-violet-400/30 bg-violet-400/10 px-2 py-1 text-[9px] font-black tracking-widest text-violet-300">
                    {rank}
                  </span>
                  <span className="text-[10px] font-bold text-violet-200/50">
                    HUNTER STATUS: ACTIVE
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-black tracking-tight">
                  {email.split("@")[0] || "New Hunter"}
                </h1>

                <p className="mt-1 text-xs text-violet-200/50">
                  The system recognizes your potential.
                </p>
              </div>

              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-violet-400/40 bg-violet-950/50 shadow-[0_0_25px_rgba(139,92,246,0.2)]">
                <Crown size={21} className="text-violet-300" />
                <span className="mt-1 text-[9px] font-black tracking-wider text-violet-200">
                  LVL {level}
                </span>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-violet-300/70">
                  <Zap size={13} /> EXPERIENCE
                </span>
                <span className="text-violet-200">
                  {xp} <span className="text-violet-300/30">/ {xpNeeded} XP</span>
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full border border-violet-950 bg-black/50 p-[2px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-300 shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Stat label="LEVEL" value={level} icon={<Crown size={14} />} />
              <Stat label="AURA" value={xp} icon={<Zap size={14} />} />
              <Stat label="STREAK" value={`${streak}D`} icon={<Flame size={14} />} />
            </div>
          </div>
        </header>

        <main className="space-y-6 px-4 pt-5">
          {tab === "dashboard" && (
            <>
              <section className="rounded-2xl border border-violet-900/40 bg-[#100d20] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-fuchsia-300">
                      <Timer size={14} /> FOCUS DUNGEON
                    </div>
                    <p className="mt-2 text-3xl font-black tracking-widest">
                      {formatTime(timer)}
                    </p>
                    <p className="mt-1 text-[10px] text-violet-300/40">
                      Clear the dungeon · Reward +150 XP
                    </p>
                  </div>

                  <button
                    onClick={() => setTimerActive((current) => !current)}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition ${
                      timerActive
                        ? "bg-amber-600 text-white"
                        : "bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white"
                    }`}
                  >
                    {timerActive ? <Pause size={22} /> : <Play size={22} />}
                  </button>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-violet-400">
                      DAILY CONTRACTS
                    </p>
                    <h2 className="mt-1 text-lg font-black">Active Quests</h2>
                  </div>

                  <span className="rounded-lg border border-violet-900/40 bg-violet-950/30 px-3 py-2 text-[10px] font-bold text-violet-300">
                    {completedCount}/{quests.length} CLEARED
                  </span>
                </div>

                <form onSubmit={addQuest} className="mb-4 flex gap-2">
                  <input
                    value={newQuest}
                    onChange={(event) => setNewQuest(event.target.value)}
                    placeholder="Create a new quest..."
                    className="min-w-0 flex-1 rounded-xl border border-violet-900/40 bg-[#100d20] px-3 py-3 text-xs outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-xl bg-violet-700 px-3 text-xs font-bold"
                  >
                    <Plus size={15} /> ADD
                  </button>
                </form>

                <div className="space-y-3">
                  {quests.map((quest) => (
                    <div
                      key={quest.id}
                      className={`rounded-2xl border p-4 transition ${
                        quest.completed
                          ? "border-violet-900/20 bg-[#0d0b17] opacity-60"
                          : "border-violet-900/40 bg-[#100d20]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => claimQuest(quest.id)}
                          disabled={quest.completed}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                            quest.completed
                              ? "border-violet-500 bg-violet-700 text-white"
                              : "border-violet-700/60 bg-black/30 text-transparent hover:border-violet-400"
                          }`}
                        >
                          <Check size={14} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-sm font-bold leading-snug ${
                              quest.completed
                                ? "text-violet-300/50 line-through"
                                : "text-white"
                            }`}
                          >
                            {quest.title}
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-md bg-violet-950/50 px-2 py-1 text-[9px] font-black tracking-wider text-violet-300/70">
                              {quest.category}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-fuchsia-300">
                              <Zap size={11} /> +{quest.xp} XP
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setQuests((current) =>
                              current.filter((q) => q.id !== quest.id)
                            )
                          }
                          className="rounded-lg p-1 text-violet-300/20 transition hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {quest.completed && (
                        <p className="mt-3 border-t border-violet-900/20 pt-2 text-[9px] font-black tracking-widest text-violet-400">
                          QUEST CLEARED
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-violet-900/40 bg-[#100d20] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-violet-400">
                      YOUR JOURNEY
                    </p>
                    <h2 className="mt-1 text-lg font-black">Consistency</h2>
                  </div>
                  <CalendarDays size={20} className="text-violet-400" />
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {heatmap.map((intensity, index) => (
                    <div
                      key={index}
                      title={`Day ${index + 1}`}
                      className={`aspect-square rounded-md border ${
                        intensity === 0
                          ? "border-violet-950/40 bg-black/20"
                          : intensity === 1
                          ? "border-violet-900/50 bg-violet-950/60"
                          : intensity === 2
                          ? "border-violet-700/60 bg-violet-700/70"
                          : "border-fuchsia-400/50 bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.25)]"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-violet-300/30">
                  <span>LESS</span>
                  <div className="flex gap-1.5">
                    <span className=
