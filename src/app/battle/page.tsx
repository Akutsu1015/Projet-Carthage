"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBattleSocket } from "@/lib/use-battle-socket";
import {
  Swords, Clock, Users, Zap, Trophy, ChevronRight,
  Loader2, Shield, Target, Flame, ArrowRight, LogIn,
  Crown, UserPlus, Copy, Check, Search, TrendingUp,
  Award, BarChart3, Wifi, WifiOff,
} from "lucide-react";

const DIFF_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  easy: { label: "Facile", color: "#00ff88", icon: Shield },
  medium: { label: "Moyen", color: "#fbbf24", icon: Target },
  hard: { label: "Difficile", color: "#ff2244", icon: Flame },
};

const MODE_META: Record<string, { label: string; desc: string; color: string; icon: React.ElementType }> = {
  ranked: { label: "Ranked", desc: "Matchmaking auto · Points ELO · Classement", color: "#a855f7", icon: Crown },
  casual: { label: "Casual", desc: "Matchmaking auto · Sans impact classement", color: "#00d4ff", icon: Users },
  friends: { label: "Battle Friends", desc: "Invitez un ami avec un code", color: "#fbbf24", icon: UserPlus },
};

export default function BattleLobbyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const socket = useBattleSocket();

  const [tab, setTab] = useState<"ranked" | "casual" | "friends" | "leaderboard" | "history">("ranked");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [stats, setStats] = useState<any>(null);
  const [challengeCount, setChallengeCount] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [friendCode, setFriendCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [friendBattleId, setFriendBattleId] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState(0);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch stats + challenge count on mount
  useEffect(() => {
    async function load() {
      try {
        const [statsRes, countRes] = await Promise.all([
          fetch("/api/db/battle?action=stats", { credentials: "include" }),
          fetch("/api/db/battle?action=challenge-count"),
        ]);
        const statsData = await statsRes.json();
        const countData = await countRes.json();
        if (statsData.success) setStats(statsData.stats);
        if (countData.success) setChallengeCount(countData);
      } catch {}
    }
    load();
  }, []);

  // Fetch leaderboard when tab changes
  useEffect(() => {
    if (tab !== "leaderboard") return;
    fetch("/api/db/battle?action=ranked-leaderboard")
      .then(r => r.json())
      .then(d => { if (d.success) setLeaderboard(d.leaderboard); })
      .catch(() => {});
  }, [tab]);

  // Fetch history when tab changes
  useEffect(() => {
    if (tab !== "history" || !user) return;
    fetch("/api/db/battle?action=history", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setHistory(d.history); })
      .catch(() => {});
  }, [tab, user]);

  // Search timer
  useEffect(() => {
    if (socket.inQueue) {
      setSearchTime(0);
      searchTimerRef.current = setInterval(() => setSearchTime(t => t + 1), 1000);
    } else {
      if (searchTimerRef.current) clearInterval(searchTimerRef.current);
      setSearchTime(0);
    }
    return () => { if (searchTimerRef.current) clearInterval(searchTimerRef.current); };
  }, [socket.inQueue]);

  // Navigate to arena when match found
  useEffect(() => {
    if (socket.matchData) {
      router.push(`/battle/${socket.matchData.battleId}`);
    }
  }, [socket.matchData, router]);

  const handleQueue = () => {
    if (!user) { router.push("/login"); return; }
    if (socket.inQueue) {
      socket.leaveQueue();
    } else {
      const mode = tab === "ranked" ? "ranked" : "casual";
      socket.joinQueue(mode, difficulty);
    }
  };

  const handleCreateFriend = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const res = await fetch("/api/db/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", difficulty, mode: "friends" }),
      });
      const data = await res.json();
      if (data.success && data.battle) {
        setFriendBattleId(data.battle.id);
      }
    } catch {}
    setCreating(false);
  };

  const handleJoinFriend = async () => {
    if (!user || !friendCode.trim()) return;
    try {
      const res = await fetch("/api/db/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "join", battleId: friendCode.trim() }),
      });
      const data = await res.json();
      if (data.success) router.push(`/battle/${friendCode.trim()}`);
    } catch {}
  };

  const copyCode = () => {
    if (!friendBattleId) return;
    navigator.clipboard.writeText(friendBattleId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rankTier = (pts: number) => {
    if (pts >= 2000) return { name: "Maître", color: "#ff2244", icon: "🔥" };
    if (pts >= 1600) return { name: "Diamant", color: "#a855f7", icon: "💠" };
    if (pts >= 1300) return { name: "Or", color: "#ffd700", icon: "🥇" };
    if (pts >= 1100) return { name: "Argent", color: "#c0c0c0", icon: "🥈" };
    return { name: "Bronze", color: "#cd7f32", icon: "🥉" };
  };

  const myTier = stats ? rankTier(stats.ranked_points) : rankTier(1000);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="border-b border-xana-red/15 bg-gradient-to-br from-dark-surface to-dark-bg py-8">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-xana-red/30 bg-xana-red/10 px-4 py-1.5 text-sm font-semibold text-xana-red">
                <Swords size={16} /> Code Battle
              </div>
              <h1 className="mb-2 font-display text-2xl font-extrabold md:text-3xl">
                <span className="bg-gradient-to-r from-xana-red to-carthage-gold bg-clip-text text-transparent">
                  Affrontez d&apos;autres codeurs
                </span>
              </h1>
              <p className="max-w-lg text-sm text-white/50">
                {challengeCount ? `${challengeCount.total} défis` : "500 défis"} · 3 niveaux de difficulté · Matchmaking en temps réel
              </p>
            </div>

            {/* Stats card */}
            {user && stats && (
              <div className="flex gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                  <p className="text-2xl font-bold" style={{ color: myTier.color }}>{myTier.icon} {stats.ranked_points}</p>
                  <p className="text-[0.65rem] text-white/40">{myTier.name} · Rang #{stats.rank || "—"}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                  <p className="text-lg font-bold text-white">{stats.battle_wins}<span className="text-white/30">/{stats.battle_wins + stats.battle_losses}</span></p>
                  <p className="text-[0.65rem] text-white/40">Victoires</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
                  <p className="text-sm font-medium" style={{ color: socket.connected ? "#00ff88" : "#ff2244" }}>
                    {socket.connected ? <Wifi size={16} className="inline" /> : <WifiOff size={16} className="inline" />}
                  </p>
                  <p className="text-[0.65rem] text-white/40">{socket.connected ? "En ligne" : "Hors ligne"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        {/* Mode Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
          {(Object.entries(MODE_META) as [string, typeof MODE_META[string]][]).map(([key, { label, icon: Icon, color }]) => (
            <button
              key={key}
              onClick={() => { setTab(key as any); socket.leaveQueue(); setFriendBattleId(null); }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === key ? "text-white" : "text-white/40 hover:text-white/60"
              }`}
              style={tab === key ? { background: `${color}15`, color } : {}}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={() => setTab("leaderboard")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "leaderboard" ? "bg-carthage-gold/15 text-carthage-gold" : "text-white/40 hover:text-white/60"}`}
          >
            <TrendingUp size={15} /> Classement
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === "history" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
          >
            <BarChart3 size={15} /> Historique
          </button>
        </div>

        {/* ═══ RANKED / CASUAL TAB ═══ */}
        {(tab === "ranked" || tab === "casual") && (
          <div className="space-y-6">
            {!user && !isLoading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <LogIn className="mx-auto mb-3 h-10 w-10 text-white/20" />
                <p className="mb-3 text-sm text-white/50">Connectez-vous pour jouer en {tab === "ranked" ? "Ranked" : "Casual"}</p>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-lyoko-blue/20 px-5 py-2 text-sm font-semibold text-lyoko-blue hover:bg-lyoko-blue/30">
                  <LogIn size={14} /> Se connecter
                </Link>
              </div>
            )}

            {user && (
              <>
                {/* Mode info */}
                <div className="rounded-2xl border p-6" style={{ borderColor: `${MODE_META[tab].color}30`, background: `${MODE_META[tab].color}05` }}>
                  <div className="mb-4 flex items-center gap-3">
                    {(() => { const Icon = MODE_META[tab].icon; return <Icon size={24} style={{ color: MODE_META[tab].color }} />; })()}
                    <div>
                      <h2 className="font-display text-lg font-bold text-white">{MODE_META[tab].label}</h2>
                      <p className="text-xs text-white/50">{MODE_META[tab].desc}</p>
                    </div>
                  </div>

                  {/* Difficulty selector */}
                  <p className="mb-2 text-xs font-medium text-white/40">Difficulté :</p>
                  <div className="mb-5 flex gap-2">
                    {(["easy", "medium", "hard"] as const).map(d => {
                      const m = DIFF_META[d];
                      const Icon = m.icon;
                      const count = challengeCount ? challengeCount[d] : "?";
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          disabled={socket.inQueue}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                            difficulty === d ? "border-current" : "border-white/10 text-white/50 hover:border-white/20"
                          }`}
                          style={difficulty === d ? { color: m.color, borderColor: m.color, background: `${m.color}10` } : {}}
                        >
                          <Icon size={14} /> {m.label}
                          <span className="ml-1 text-[0.65rem] opacity-50">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Queue button */}
                  {socket.inQueue ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-dark-bg/50 p-4">
                        <div className="relative">
                          <Loader2 size={28} className="animate-spin" style={{ color: MODE_META[tab].color }} />
                          <div className="absolute inset-0 animate-ping rounded-full opacity-20" style={{ background: MODE_META[tab].color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">Recherche d&apos;un adversaire...</p>
                          <p className="text-xs text-white/40">
                            {tab === "ranked" ? "Ranked" : "Casual"} · {DIFF_META[difficulty].label} · {searchTime}s
                          </p>
                        </div>
                        <button
                          onClick={() => socket.leaveQueue()}
                          className="rounded-lg border border-xana-red/30 bg-xana-red/10 px-4 py-2 text-sm font-medium text-xana-red hover:bg-xana-red/20"
                        >
                          Annuler
                        </button>
                      </div>
                      {socket.queueInfo && (
                        <p className="text-center text-xs text-white/30">
                          {(() => {
                            const q = tab === "ranked" ? socket.queueInfo.ranked : socket.queueInfo.casual;
                            return `${(q as any)[difficulty]} joueur(s) en file d'attente`;
                          })()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleQueue}
                      className="flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-bold text-dark-bg transition-all hover:-translate-y-0.5"
                      style={{ background: `linear-gradient(135deg, ${MODE_META[tab].color}, ${MODE_META[tab].color}cc)` }}
                    >
                      <Search size={16} /> Trouver un adversaire
                    </button>
                  )}
                </div>

                {/* Queue info */}
                {socket.queueInfo && !socket.inQueue && (
                  <div className="grid grid-cols-3 gap-3">
                    {(["easy", "medium", "hard"] as const).map(d => {
                      const q = tab === "ranked" ? socket.queueInfo!.ranked : socket.queueInfo!.casual;
                      const count = (q as any)[d];
                      return (
                        <div key={d} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                          <p className="text-lg font-bold" style={{ color: DIFF_META[d].color }}>{count}</p>
                          <p className="text-[0.65rem] text-white/40">en file {DIFF_META[d].label}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══ FRIENDS TAB ═══ */}
        {tab === "friends" && (
          <div className="space-y-6">
            {!user && !isLoading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <LogIn className="mx-auto mb-3 h-10 w-10 text-white/20" />
                <p className="mb-3 text-sm text-white/50">Connectez-vous pour jouer avec vos amis</p>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-lyoko-blue/20 px-5 py-2 text-sm font-semibold text-lyoko-blue">
                  <LogIn size={14} /> Se connecter
                </Link>
              </div>
            )}

            {user && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Create */}
                <div className="rounded-2xl border border-carthage-gold/20 bg-carthage-gold/5 p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
                    <Zap size={18} className="text-carthage-gold" /> Créer une Battle
                  </h3>

                  <p className="mb-3 text-xs font-medium text-white/40">Difficulté :</p>
                  <div className="mb-4 flex gap-2">
                    {(["easy", "medium", "hard"] as const).map(d => {
                      const m = DIFF_META[d];
                      const Icon = m.icon;
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                            difficulty === d ? "border-current" : "border-white/10 text-white/50"
                          }`}
                          style={difficulty === d ? { color: m.color, borderColor: m.color, background: `${m.color}10` } : {}}
                        >
                          <Icon size={12} /> {m.label}
                        </button>
                      );
                    })}
                  </div>

                  {friendBattleId ? (
                    <div className="space-y-3">
                      <p className="text-xs text-white/50">Partagez ce code avec votre ami :</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg border border-carthage-gold/30 bg-dark-bg px-4 py-2.5 font-mono text-sm text-carthage-gold">
                          {friendBattleId}
                        </code>
                        <button onClick={copyCode} className="rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 p-2.5 text-carthage-gold hover:bg-carthage-gold/20">
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <Link
                        href={`/battle/${friendBattleId}`}
                        className="flex items-center justify-center gap-2 rounded-lg bg-carthage-gold/20 py-2 text-sm font-semibold text-carthage-gold hover:bg-carthage-gold/30"
                      >
                        <ArrowRight size={14} /> Aller dans l&apos;arène
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleCreateFriend}
                      disabled={creating}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-carthage-gold to-xana-red px-6 py-2.5 text-sm font-bold text-dark-bg hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {creating ? <Loader2 size={16} className="animate-spin" /> : <Swords size={16} />}
                      Créer la Battle
                    </button>
                  )}
                </div>

                {/* Join */}
                <div className="rounded-2xl border border-lyoko-blue/20 bg-lyoko-blue/5 p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
                    <UserPlus size={18} className="text-lyoko-blue" /> Rejoindre une Battle
                  </h3>
                  <p className="mb-3 text-xs text-white/50">Entrez le code d&apos;invitation de votre ami :</p>
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={friendCode}
                      onChange={e => setFriendCode(e.target.value)}
                      placeholder="Code de la battle..."
                      className="flex-1 rounded-lg border border-white/10 bg-dark-bg px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:border-lyoko-blue/40 focus:outline-none"
                    />
                    <button
                      onClick={handleJoinFriend}
                      disabled={!friendCode.trim()}
                      className="flex items-center gap-2 rounded-lg bg-lyoko-blue/20 px-5 py-2.5 text-sm font-semibold text-lyoko-blue hover:bg-lyoko-blue/30 disabled:opacity-40"
                    >
                      <ArrowRight size={14} /> Rejoindre
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ LEADERBOARD TAB ═══ */}
        {tab === "leaderboard" && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
              <Award size={20} className="text-carthage-gold" /> Classement Ranked
            </h2>
            {leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
                <Trophy className="mx-auto mb-3 h-12 w-12 text-white/10" />
                <p className="text-sm text-white/40">Aucun joueur classé pour le moment</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((p: any, i: number) => {
                  const tier = rankTier(p.ranked_points);
                  const isMe = user && String(p.id) === user.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-4 rounded-xl border p-3.5 transition-all ${
                        isMe ? "border-lyoko-purple/30 bg-lyoko-purple/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        i === 0 ? "bg-carthage-gold/20 text-carthage-gold" : i === 1 ? "bg-white/10 text-white/70" : i === 2 ? "bg-orange-500/15 text-orange-400" : "text-white/30"
                      }`}>
                        {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                      </div>
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: p.avatar_color || "#00d4ff" }}
                      >
                        {p.avatar_type === "initials" ? p.avatar_value : p.display_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{p.display_name} {isMe && <span className="text-xs text-lyoko-purple">(vous)</span>}</p>
                        <p className="text-xs text-white/40">@{p.username} · Nv.{p.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: tier.color }}>{tier.icon} {p.ranked_points}</p>
                        <p className="text-[0.65rem] text-white/30">{p.battle_wins}W / {p.battle_losses}L</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ HISTORY TAB ═══ */}
        {tab === "history" && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
              <BarChart3 size={20} className="text-lyoko-blue" /> Historique des Battles
            </h2>
            {!user ? (
              <p className="py-8 text-center text-sm text-white/40">Connectez-vous pour voir votre historique.</p>
            ) : history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
                <Trophy className="mx-auto mb-3 h-12 w-12 text-white/10" />
                <p className="text-sm text-white/40">Aucune battle terminée</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h: any) => {
                  const isCreator = user && String(h.creator_id) === user.id;
                  const won = user && String(h.winner_id) === user.id;
                  const opponentName = isCreator ? h.opponent_name : h.creator_name;
                  const myTime = isCreator ? h.creator_time : h.opponent_time;
                  const theirTime = isCreator ? h.opponent_time : h.creator_time;
                  const diff = DIFF_META[h.challenge_difficulty] || DIFF_META.easy;

                  return (
                    <Link
                      key={h.id}
                      href={`/battle/${h.id}`}
                      className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all hover:border-white/15"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${won ? "bg-lyoko-green/15 text-lyoko-green" : "bg-xana-red/15 text-xana-red"}`}>
                        {won ? "🏆" : "💀"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {h.challenge_title}
                          <span className="ml-2 text-xs font-normal" style={{ color: diff.color }}>{diff.label}</span>
                          {h.mode === "ranked" && <span className="ml-2 text-xs text-lyoko-purple">Ranked</span>}
                        </p>
                        <p className="text-xs text-white/40">
                          vs {opponentName || "?"} · {myTime ? `${(myTime / 1000).toFixed(1)}s` : "—"} vs {theirTime ? `${(theirTime / 1000).toFixed(1)}s` : "—"}
                          {h.ranked_delta > 0 && h.mode === "ranked" && (
                            <span className={won ? "ml-2 text-lyoko-green" : "ml-2 text-xana-red"}>
                              {won ? `+${h.ranked_delta}` : `-${h.ranked_delta}`} pts
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${won ? "bg-lyoko-green/15 text-lyoko-green" : "bg-xana-red/15 text-xana-red"}`}>
                        {won ? "Victoire" : "Défaite"}
                      </span>
                      <ChevronRight size={16} className="text-white/20" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
