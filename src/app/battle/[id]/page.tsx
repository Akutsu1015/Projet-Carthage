"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBattleSocket } from "@/lib/use-battle-socket";
import { useAntiCheat } from "@/lib/use-anti-cheat";
import { flexValueEqual } from "@/lib/flexible-compare";
import {
  Swords, Clock, Play, Check, X, Trophy, ArrowLeft,
  Loader2, Shield, Target, Flame, Copy, Share2, Zap,
  Flag, Crown, TrendingUp, TrendingDown, AlertTriangle, Eye,
} from "lucide-react";

const DIFF_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  easy: { label: "Facile", color: "#00ff88", icon: Shield },
  medium: { label: "Moyen", color: "#fbbf24", icon: Target },
  hard: { label: "Difficile", color: "#ff2244", icon: Flame },
};

export default function BattleArenaPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const socket = useBattleSocket();

  const [battle, setBattle] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [winner, setWinner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<{ pass: boolean; input: string; expected: string; got: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [opponentDone, setOpponentDone] = useState(false);
  const [finishData, setFinishData] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const antiCheat = useAntiCheat(battle?.status === "active" && !submitted);

  const fetchBattle = useCallback(async () => {
    try {
      const res = await fetch(`/api/db/battle?id=${id}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setBattle(data.battle);
        setChallenge(data.challenge);
        setCreator(data.creator);
        setOpponent(data.opponent);
        setWinner(data.winner);
        if (data.challenge && !code) {
          setCode(data.challenge.template || "");
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [id, code]);

  useEffect(() => { fetchBattle(); }, [fetchBattle]);

  // Join socket room for this battle
  useEffect(() => {
    if (socket.connected && id) {
      socket.joinBattleRoom(id);
    }
  }, [socket.connected, id, socket.joinBattleRoom]);

  // Listen for opponent submitted via socket
  useEffect(() => {
    if (socket.opponentSubmitted) {
      setOpponentDone(true);
    }
  }, [socket.opponentSubmitted]);

  // Listen for battle finished via socket
  useEffect(() => {
    if (socket.battleFinished && socket.battleFinished.battleId === id) {
      setFinishData(socket.battleFinished);
      // Refresh battle data from API
      setTimeout(fetchBattle, 500);
    }
  }, [socket.battleFinished, id, fetchBattle]);

  // Poll for opponent joining (friends mode waiting state only)
  useEffect(() => {
    if (!battle) return;
    if (battle.status === "waiting") {
      const interval = setInterval(fetchBattle, 3000);
      return () => clearInterval(interval);
    }
    // Also poll if submitted and no socket finish yet
    if (battle.status === "active" && submitted && !finishData) {
      const interval = setInterval(fetchBattle, 3000);
      return () => clearInterval(interval);
    }
  }, [battle, submitted, finishData, fetchBattle]);

  // Timer: countdown from time limit
  useEffect(() => {
    if (battle?.status === "active" && !submitted && !timerRef.current) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - startTimeRef.current);
      }, 100);
    }
    if ((battle?.status === "finished" || submitted) && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [battle?.status, submitted]);

  // Auto-forfeit when time runs out
  const autoForfeitRef = useRef(false);
  useEffect(() => {
    if (!challenge || !battle || battle.status !== "active" || submitted || autoForfeitRef.current) return;
    const timeLimitMs = (challenge.time_limit || 180) * 1000;
    if (timeElapsed >= timeLimitMs) {
      autoForfeitRef.current = true;
      handleForfeit();
    }
  }, [timeElapsed, challenge, battle, submitted]);

  const runTests = useCallback(() => {
    if (!challenge) return [];
    const tests = JSON.parse(challenge.tests || "[]");
    const results: { pass: boolean; input: string; expected: string; got: string }[] = [];

    for (const test of tests) {
      try {
        const fn = new Function("return (" + code + "\n)");
        const userFn = fn();
        let result;
        if (typeof userFn === "function") {
          const args = test.input.split(",").map((a: string) => {
            try { return JSON.parse(a.trim()); } catch { return a.trim(); }
          });
          result = userFn(...args);
        } else {
          const fnName = code.match(/function\s+(\w+)/)?.[1];
          if (fnName) {
            const wrappedFn = new Function(code + `\nreturn ${fnName}(${test.input});`);
            result = wrappedFn();
          }
        }
        const got = typeof result === "object" ? JSON.stringify(result) : String(result);
        results.push({ pass: flexValueEqual(got, test.expected), input: test.input, expected: test.expected, got });
      } catch (e: any) {
        results.push({ pass: false, input: test.input, expected: test.expected, got: `Erreur: ${e.message}` });
      }
    }
    setTestResults(results);
    return results;
  }, [code, challenge]);

  const handleSubmit = async () => {
    const results = runTests();
    const allPass = results.length > 0 && results.every(r => r.pass);
    if (!allPass) return;

    setSubmitting(true);
    const timeMs = Date.now() - startTimeRef.current;

    // Check anti-cheat flags at submission time
    const cheatFlags = antiCheat.checkSubmitSpeed();

    // Notify opponent via socket (no DB write)
    socket.submitSolution(id, code, timeMs, true);

    // Submit via API — first correct submission wins immediately
    try {
      const res = await fetch("/api/db/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "submit", battleId: id, code, timeMs, antiCheat: cheatFlags }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setBattle(data.battle);
        // Relay battle-finished to socket room so opponent gets notified
        if (data.battle.status === "finished") {
          socket.relayFinish({
            battleId: id,
            winnerId: data.battle.winner_id,
            loserId: data.battle.winner_id === data.battle.creator_id ? data.battle.opponent_id : data.battle.creator_id,
            rankedDelta: data.battle.ranked_delta || 0,
            mode: data.battle.mode,
          });
        }
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleForfeit = async () => {
    try {
      const res = await fetch("/api/db/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "forfeit", battleId: id }),
      });
      const data = await res.json();
      if (data.success && data.battle) {
        setBattle(data.battle);
        // Relay to socket room so opponent gets notified
        socket.relayFinish({
          battleId: id,
          winnerId: data.battle.winner_id,
          loserId: data.battle.winner_id === data.battle.creator_id ? data.battle.opponent_id : data.battle.creator_id,
          rankedDelta: data.battle.ranked_delta || 0,
          mode: data.battle.mode,
          forfeit: true,
        });
      }
    } catch { /* ignore */ }
    await fetchBattle();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/battle/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    try {
      await fetch("/api/db/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "cancel", battleId: id }),
      });
      router.push("/battle");
    } catch { /* ignore */ }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${m}:${sec.toString().padStart(2, "0")}.${tenths}`;
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-xana-red" />
      </div>
    );
  }

  if (!battle || !challenge) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Swords className="h-16 w-16 text-white/10" />
        <p className="text-white/40">Battle introuvable</p>
        <Link href="/battle" className="text-sm text-xana-red hover:underline">← Retour au lobby</Link>
      </div>
    );
  }

  const diff = DIFF_META[challenge.difficulty] || DIFF_META.easy;
  const isCreator = user && String(battle.creator_id) === user.id;
  const isOpponent = user && String(battle.opponent_id) === user.id;
  const isParticipant = isCreator || isOpponent;
  const myTime = isCreator ? battle.creator_time : battle.opponent_time;
  const theirTime = isCreator ? battle.opponent_time : battle.creator_time;
  const iWon = user && String(battle.winner_id) === user.id;
  const modeLabel = battle.mode === "ranked" ? "Ranked" : battle.mode === "friends" ? "Friends" : "Casual";
  const modeColor = battle.mode === "ranked" ? "#a855f7" : battle.mode === "friends" ? "#fbbf24" : "#00d4ff";

  // ═══ WAITING STATE ═══
  if (battle.status === "waiting") {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center lg:px-8">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-xana-red/30 bg-xana-red/10">
            <Swords size={36} className="text-xana-red" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-extrabold text-white">En attente d&apos;un adversaire...</h1>
          <p className="mb-1 text-sm text-white/50">
            {battle.mode === "friends" ? "Partagez le code pour inviter un ami" : "Matchmaking en cours..."}
          </p>
          <span className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold" style={{ color: modeColor, background: `${modeColor}15` }}>
            {modeLabel}
          </span>

          {/* Challenge info */}
          <div className="mb-6 mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ color: diff.color, background: `${diff.color}15` }}>{diff.label}</span>
              <span className="text-xs text-white/30"><Clock size={12} className="mr-1 inline" />{challenge.time_limit}s</span>
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">{challenge.title}</h3>
            <p className="text-sm text-white/60">{challenge.description}</p>
          </div>

          {/* Share code for friends mode */}
          {battle.mode === "friends" && (
            <div className="mb-6">
              <p className="mb-2 text-xs text-white/40">Code d&apos;invitation :</p>
              <div className="flex items-center justify-center gap-2">
                <code className="rounded-lg border border-carthage-gold/30 bg-dark-bg px-6 py-2.5 font-mono text-lg text-carthage-gold">
                  {id}
                </code>
                <button onClick={handleCopyLink} className="flex items-center gap-1.5 rounded-lg bg-lyoko-blue/15 px-3 py-2 text-xs font-semibold text-lyoko-blue hover:bg-lyoko-blue/25">
                  {copied ? <><Check size={13} /> Copié !</> : <><Copy size={13} /> Copier lien</>}
                </button>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-xana-red" />
            <span className="text-sm text-white/40">Recherche d&apos;adversaire...</span>
          </div>

          {isCreator && (
            <button onClick={handleCancel} className="text-sm text-white/30 hover:text-xana-red">
              Annuler la battle
            </button>
          )}

          {!isParticipant && user && (
            <button
              onClick={async () => {
                const res = await fetch("/api/db/battle", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ action: "join", battleId: id }),
                });
                const data = await res.json();
                if (data.success) fetchBattle();
              }}
              className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-xana-red to-carthage-gold px-8 py-3 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5"
            >
              <Swords size={16} /> Rejoindre cette Battle
            </button>
          )}
        </div>
      </div>
    );
  }

  // ═══ FINISHED STATE ═══
  if (battle.status === "finished") {
    const rankedDelta = finishData?.rankedDelta || battle.ranked_delta || 0;
    const isRanked = battle.mode === "ranked";

    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <Link href="/battle" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70">
            <ArrowLeft size={14} /> Retour au lobby
          </Link>

          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">{iWon ? "🏆" : isParticipant ? "💀" : "⚔️"}</div>
            <h1 className="mb-2 font-display text-3xl font-extrabold">
              {iWon ? (
                <span className="text-lyoko-green">Victoire !</span>
              ) : isParticipant ? (
                <span className="text-xana-red">Défaite</span>
              ) : (
                <span className="text-white">Battle terminée</span>
              )}
            </h1>
            <p className="text-sm text-white/50">
              {challenge.title} · {diff.label}
              <span className="ml-2 rounded-full px-2 py-0.5 text-xs" style={{ color: modeColor, background: `${modeColor}15` }}>{modeLabel}</span>
            </p>

            {/* Ranked delta */}
            {isRanked && rankedDelta > 0 && isParticipant && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2" style={{ background: iWon ? "rgba(0,255,136,0.1)" : "rgba(255,34,68,0.1)" }}>
                {iWon ? <TrendingUp size={16} className="text-lyoko-green" /> : <TrendingDown size={16} className="text-xana-red" />}
                <span className={`text-lg font-bold ${iWon ? "text-lyoko-green" : "text-xana-red"}`}>
                  {iWon ? `+${rankedDelta}` : `-${rankedDelta}`} pts
                </span>
              </div>
            )}
          </div>

          {/* Players comparison */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {[
              { player: creator, time: battle.creator_time, isWinner: String(battle.winner_id) === String(battle.creator_id), isMe: user && String(battle.creator_id) === user.id },
              { player: opponent, time: battle.opponent_time, isWinner: String(battle.winner_id) === String(battle.opponent_id), isMe: user && String(battle.opponent_id) === user.id },
            ].map(({ player, time, isWinner, isMe }, i) => (
              <div key={i} className={`rounded-2xl border p-5 text-center ${isWinner ? "border-lyoko-green/30 bg-lyoko-green/5" : "border-white/8 bg-white/[0.02]"}`}>
                {isWinner && <Trophy size={20} className="mx-auto mb-2 text-carthage-gold" />}
                {isMe && <span className="mb-1 inline-block rounded-full bg-lyoko-blue/15 px-2 py-0.5 text-[0.6rem] font-semibold text-lyoko-blue">Vous</span>}
                <div
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: player?.avatarColor || "#555" }}
                >
                  {player ? (player.avatarType === "initials" ? player.avatarValue : player.displayName?.substring(0, 2).toUpperCase()) : "?"}
                </div>
                <p className="text-sm font-semibold text-white">{player?.displayName || "Adversaire"}</p>
                <p className="text-xs text-white/40">Nv. {player?.level || "?"}</p>
                <p className="mt-2 font-display text-2xl font-extrabold" style={{ color: isWinner ? "#00ff88" : "#ff2244" }}>
                  {!isWinner && !time && battle.creator_time !== null && battle.opponent_time !== null ? "Forfait" : time ? `${(time / 1000).toFixed(1)}s` : "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/battle" className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:bg-white/5">
              <ArrowLeft size={14} /> Lobby
            </Link>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-lg border border-lyoko-blue/30 bg-lyoko-blue/10 px-5 py-2.5 text-sm text-lyoko-blue hover:bg-lyoko-blue/20"
            >
              {copied ? <><Check size={14} /> Copié !</> : <><Share2 size={14} /> Partager</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ ACTIVE STATE — CODING ARENA ═══
  const timeLimit = challenge.time_limit * 1000;
  const timeRemaining = Math.max(0, timeLimit - timeElapsed);
  const timePercent = (timeRemaining / timeLimit) * 100;
  const isOvertime = timeRemaining <= 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-dark-surface px-4 py-2">
        <Swords size={16} className="text-xana-red" />
        <span className="text-sm font-semibold text-white">{challenge.title}</span>
        <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ color: diff.color, background: `${diff.color}15` }}>{diff.label}</span>
        <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ color: modeColor, background: `${modeColor}15` }}>{modeLabel}</span>
        <div className="flex-1" />

        {/* Players */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
            <div className="h-5 w-5 rounded-full" style={{ background: creator?.avatarColor || "#00d4ff" }} />
            <span className="text-xs text-white/70">{creator?.displayName}</span>
          </div>
          <Zap size={14} className="text-carthage-gold" />
          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1">
            <div className="h-5 w-5 rounded-full" style={{ background: opponent?.avatarColor || "#00d4ff" }} />
            <span className="text-xs text-white/70">{opponent?.displayName}</span>
            {opponentDone && <Check size={12} className="text-lyoko-green" />}
          </div>
        </div>

        <div className="flex-1" />

        {/* Timer — countdown */}
        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${isOvertime ? "bg-xana-red/20 text-xana-red animate-pulse" : timePercent < 25 ? "bg-carthage-gold/15 text-carthage-gold" : "bg-white/5 text-white/70"}`}>
          <Clock size={14} />
          {formatTime(submitted ? Math.max(0, timeLimit - (myTime || timeElapsed)) : timeRemaining)}
        </div>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${timePercent}%`,
              background: isOvertime ? "#ff2244" : timePercent < 25 ? "#fbbf24" : "#00d4ff",
            }}
          />
        </div>

        {/* Anti-cheat warning */}
        {antiCheat.flags.flagged && (
          <div className="flex items-center gap-1 rounded-lg bg-xana-red/10 px-2 py-1 text-xs text-xana-red" title={`Flags: ${antiCheat.flags.flags.join(", ")}`}>
            <AlertTriangle size={12} />
            <span>Triche détectée</span>
          </div>
        )}
        {!antiCheat.flags.flagged && antiCheat.flags.tabSwitches > 0 && (
          <div className="flex items-center gap-1 rounded-lg bg-carthage-gold/10 px-2 py-1 text-xs text-carthage-gold" title={`${antiCheat.flags.tabSwitches} changement(s) d'onglet`}>
            <Eye size={12} />
            <span>{antiCheat.flags.tabSwitches}</span>
          </div>
        )}

        {/* Forfeit */}
        {!submitted && (
          <button
            onClick={handleForfeit}
            className="ml-2 flex items-center gap-1 rounded-lg border border-xana-red/20 px-2.5 py-1 text-xs text-xana-red/60 hover:bg-xana-red/10 hover:text-xana-red"
          >
            <Flag size={11} /> Abandonner
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Problem description */}
        <div className="w-[380px] flex-shrink-0 overflow-y-auto border-r border-white/5 bg-dark-bg p-5">
          <h2 className="mb-3 font-display text-lg font-bold text-white">{challenge.title}</h2>
          <p className="mb-4 text-sm leading-relaxed text-white/60">{challenge.description}</p>

          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Tests</h3>
          <div className="space-y-2">
            {JSON.parse(challenge.tests || "[]").map((t: any, i: number) => {
              const result = testResults[i];
              return (
                <div key={i} className={`rounded-lg border p-3 text-xs font-mono ${
                  result ? (result.pass ? "border-lyoko-green/30 bg-lyoko-green/5" : "border-xana-red/30 bg-xana-red/5") : "border-white/8 bg-white/[0.02]"
                }`}>
                  <div className="flex items-center gap-2">
                    {result && (result.pass ? <Check size={12} className="text-lyoko-green" /> : <X size={12} className="text-xana-red" />)}
                    <span className="text-white/50">Entrée:</span>
                    <span className="text-white/80">{t.input}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-white/50">Attendu:</span>
                    <span className="text-lyoko-green">{t.expected}</span>
                  </div>
                  {result && !result.pass && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-white/50">Obtenu:</span>
                      <span className="text-xana-red">{result.got}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Opponent done notification */}
          {opponentDone && !submitted && (
            <div className="mt-4 rounded-xl border border-carthage-gold/30 bg-carthage-gold/10 p-3 text-center">
              <p className="text-xs font-semibold text-carthage-gold">⚡ L&apos;adversaire a terminé !</p>
              <p className="text-[0.65rem] text-white/40">
                en {socket.opponentSubmitted ? `${(socket.opponentSubmitted.timeMs / 1000).toFixed(1)}s` : "—"}
              </p>
            </div>
          )}

          {submitted && (
            <div className="mt-4 rounded-xl border border-lyoko-green/30 bg-lyoko-green/10 p-4 text-center">
              <Check size={20} className="mx-auto mb-1 text-lyoko-green" />
              <p className="text-sm font-semibold text-lyoko-green">Solution soumise !</p>
              <p className="text-xs text-white/40">En attente de l&apos;adversaire...</p>
              <Loader2 size={14} className="mx-auto mt-2 animate-spin text-white/30" />
            </div>
          )}
        </div>

        {/* Right — Code editor */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-4 py-1.5">
            <span className="font-mono text-[0.7rem] text-white/40">solution.js</span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-xana-red/60" />
              <div className="h-2 w-2 rounded-full bg-carthage-gold/60" />
              <div className="h-2 w-2 rounded-full bg-lyoko-green/60" />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitted}
            spellCheck={false}
            className="flex-1 resize-none bg-dark-bg p-4 font-mono text-[0.8rem] leading-relaxed text-white/90 placeholder:text-white/20 focus:outline-none disabled:opacity-50"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runTests();
              }
              if (e.key === "Tab") {
                e.preventDefault();
                const t = e.currentTarget;
                const s = t.selectionStart;
                setCode(code.substring(0, s) + "  " + code.substring(t.selectionEnd));
                setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2; }, 0);
              }
            }}
          />

          {/* Bottom actions */}
          <div className="flex items-center gap-3 border-t border-white/5 bg-dark-surface px-4 py-2.5">
            <button
              onClick={runTests}
              disabled={submitted}
              className="flex items-center gap-2 rounded-lg border border-lyoko-blue/30 bg-lyoko-blue/10 px-4 py-2 text-sm font-medium text-lyoko-blue transition-all hover:bg-lyoko-blue/20 disabled:opacity-40"
            >
              <Play size={14} /> Tester (Ctrl+Enter)
            </button>
            <div className="flex-1" />
            {testResults.length > 0 && (
              <span className={`text-xs font-medium ${testResults.every(r => r.pass) ? "text-lyoko-green" : "text-xana-red"}`}>
                {testResults.filter(r => r.pass).length}/{testResults.length} tests passés
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitted || submitting || testResults.length === 0 || !testResults.every(r => r.pass)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-lyoko-green to-lyoko-blue px-6 py-2 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {submitting ? "Envoi..." : "Soumettre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
