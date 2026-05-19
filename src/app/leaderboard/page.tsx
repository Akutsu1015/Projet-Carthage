"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Trophy, Crown, Medal, ChevronUp, ChevronDown, Minus, Clock,
  Flame, Star, TrendingUp, Users, Globe, Shield,
} from "lucide-react";

/* ═══ TYPES ═══ */

interface LeagueMember {
  rank: number;
  userId: number;
  username: string;
  displayName: string;
  avatarType: string;
  avatarValue: string;
  avatarColor: string;
  weeklyXp: number;
  totalXp: number;
  level: number;
  league: string;
  promoted: number;
  demoted: number;
}

interface LeagueData {
  league: string;
  weekStart: string;
  weekEnd: string;
  members: LeagueMember[];
  userRank: number;
  daysLeft: number;
  promotionZone: number;
  demotionZone: number;
}

interface GlobalEntry {
  rank: number;
  userId: number;
  username: string;
  displayName: string;
  avatarType: string;
  avatarValue: string;
  avatarColor: string;
  xp: number;
  level: number;
  league: string;
  exerciseCount: number;
}

/* ═══ LEAGUE CONFIG ═══ */

const LEAGUE_META: Record<string, { name: string; color: string; icon: string; gradient: string }> = {
  bronze:    { name: "Bronze",     color: "#cd7f32", icon: "🥉", gradient: "from-[#cd7f32]/20 to-[#8b5e3c]/10" },
  silver:    { name: "Argent",     color: "#c0c0c0", icon: "🥈", gradient: "from-[#c0c0c0]/20 to-[#808080]/10" },
  gold:      { name: "Or",         color: "#ffd700", icon: "🥇", gradient: "from-[#ffd700]/20 to-[#b8960f]/10" },
  platinum:  { name: "Platine",    color: "#00d4ff", icon: "💎", gradient: "from-[#00d4ff]/20 to-[#0088aa]/10" },
  diamond:   { name: "Diamant",    color: "#a855f7", icon: "💠", gradient: "from-[#a855f7]/20 to-[#7c3aed]/10" },
  master:    { name: "Maître",     color: "#ff2244", icon: "🔥", gradient: "from-[#ff2244]/20 to-[#cc1133]/10" },
  legendary: { name: "Légendaire", color: "#fbbf24", icon: "👑", gradient: "from-[#fbbf24]/20 to-[#d4a017]/10" },
};

const ALL_LEAGUES = ["bronze", "silver", "gold", "platinum", "diamond", "master", "legendary"];

/* ═══ HELPERS ═══ */

function Avatar({ type, value, color, size = 40 }: { type: string; value: string; color: string; size?: number }) {
  if (type === "image") {
    return <img src={value} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {value || "??"}
    </div>
  );
}

function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

/* ═══ PODIUM ═══ */

function Podium({ members, userId }: { members: LeagueMember[]; userId: number }) {
  const top3 = members.slice(0, 3);
  if (top3.length === 0) return null;

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = [100, 140, 80];
  const podiumColors = ["#c0c0c0", "#ffd700", "#cd7f32"];
  const podiumLabels = ["2e", "1er", "3e"];

  return (
    <div className="mb-6 flex items-end justify-center gap-3 pt-8">
      {podiumOrder.map((member, i) => {
        if (!member) return <div key={i} className="w-24" />;
        const isUser = member.userId === userId;
        const isFirst = i === 1;
        return (
          <div key={member.userId} className="flex flex-col items-center">
            {/* Crown for #1 */}
            {isFirst && <Crown size={24} className="mb-1 text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />}

            {/* Avatar */}
            <div className={`relative mb-2 ${isUser ? "ring-2 ring-[#00d4ff] ring-offset-2 ring-offset-dark-bg" : ""} rounded-full`}>
              <Avatar type={member.avatarType} value={member.avatarValue} color={member.avatarColor} size={isFirst ? 56 : 44} />
              <div
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                style={{ background: podiumColors[i] }}
              >
                {member.rank}
              </div>
            </div>

            {/* Name */}
            <p className={`max-w-[80px] truncate text-xs font-semibold ${isUser ? "text-[#00d4ff]" : "text-white/80"}`}>
              {member.displayName}
            </p>

            {/* XP */}
            <p className="mb-1 text-[0.65rem] text-white/50">{formatXp(member.weeklyXp)} XP</p>

            {/* Podium bar */}
            <div
              className="w-20 rounded-t-lg"
              style={{
                height: heights[i],
                background: `linear-gradient(to top, ${podiumColors[i]}33, ${podiumColors[i]}11)`,
                borderTop: `3px solid ${podiumColors[i]}`,
              }}
            >
              <p className="pt-2 text-center text-sm font-bold" style={{ color: podiumColors[i] }}>
                {podiumLabels[i]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ LEAGUE ROW ═══ */

function LeagueRow({
  member, userId, totalMembers, promotionZone, demotionZone,
}: {
  member: LeagueMember; userId: number; totalMembers: number; promotionZone: number; demotionZone: number;
}) {
  const isUser = member.userId === userId;
  const isPromotion = member.rank <= promotionZone && promotionZone > 0;
  const isDemotion = demotionZone > 0 && member.rank > totalMembers - demotionZone;

  let zoneColor = "";
  let ZoneIcon = Minus;
  if (isPromotion) { zoneColor = "text-green-400"; ZoneIcon = ChevronUp; }
  if (isDemotion) { zoneColor = "text-red-400"; ZoneIcon = ChevronDown; }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        isUser
          ? "border border-[#00d4ff]/30 bg-[#00d4ff]/5 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
          : "border border-transparent hover:bg-white/[0.02]"
      }`}
    >
      {/* Rank */}
      <div className="flex w-8 flex-shrink-0 items-center justify-center">
        {member.rank <= 3 ? (
          <span className="text-lg">{member.rank === 1 ? "🥇" : member.rank === 2 ? "🥈" : "🥉"}</span>
        ) : (
          <span className={`text-sm font-bold ${isUser ? "text-[#00d4ff]" : "text-white/40"}`}>{member.rank}</span>
        )}
      </div>

      {/* Zone indicator */}
      <div className="w-4 flex-shrink-0">
        {(isPromotion || isDemotion) && <ZoneIcon size={14} className={zoneColor} />}
      </div>

      {/* Avatar */}
      <Avatar type={member.avatarType} value={member.avatarValue} color={member.avatarColor} size={36} />

      {/* Name & Level */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isUser ? "text-[#00d4ff]" : "text-white/80"}`}>
          {member.displayName}
          {isUser && <span className="ml-1.5 text-[0.6rem] text-[#00d4ff]/60">(vous)</span>}
        </p>
        <p className="text-[0.65rem] text-white/30">Nv. {member.level}</p>
      </div>

      {/* Weekly XP */}
      <div className="flex items-center gap-1 text-right">
        <Flame size={12} className="text-[#fbbf24]" />
        <span className={`text-sm font-bold ${isUser ? "text-[#00d4ff]" : "text-white/70"}`}>
          {formatXp(member.weeklyXp)}
        </span>
        <span className="text-[0.6rem] text-white/30">XP</span>
      </div>
    </div>
  );
}

/* ═══ GLOBAL ROW ═══ */

function GlobalRow({ entry, userId }: { entry: GlobalEntry; userId: number }) {
  const isUser = entry.userId === userId;
  const meta = LEAGUE_META[entry.league] || LEAGUE_META.bronze;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
        isUser
          ? "border border-[#00d4ff]/30 bg-[#00d4ff]/5 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
          : "border border-transparent hover:bg-white/[0.02]"
      }`}
    >
      {/* Rank */}
      <div className="flex w-8 flex-shrink-0 items-center justify-center">
        {entry.rank <= 3 ? (
          <span className="text-lg">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
        ) : (
          <span className={`text-sm font-bold ${isUser ? "text-[#00d4ff]" : "text-white/40"}`}>{entry.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <Avatar type={entry.avatarType} value={entry.avatarValue} color={entry.avatarColor} size={36} />

      {/* Name & League badge */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={`truncate text-sm font-medium ${isUser ? "text-[#00d4ff]" : "text-white/80"}`}>
            {entry.displayName}
            {isUser && <span className="ml-1.5 text-[0.6rem] text-[#00d4ff]/60">(vous)</span>}
          </p>
          <span className="text-xs">{meta.icon}</span>
        </div>
        <p className="text-[0.65rem] text-white/30">
          Nv. {entry.level} &middot; {entry.exerciseCount} exercices
        </p>
      </div>

      {/* Total XP */}
      <div className="flex items-center gap-1 text-right">
        <Star size={12} className="text-[#fbbf24]" />
        <span className={`text-sm font-bold ${isUser ? "text-[#00d4ff]" : "text-white/70"}`}>
          {formatXp(entry.xp)}
        </span>
      </div>
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */

export default function LeaderboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"league" | "global">("league");
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [globalData, setGlobalData] = useState<GlobalEntry[]>([]);
  const [globalUserRank, setGlobalUserRank] = useState<number | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/db/leaderboard?tab=${tab}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUserId(data.userId);
          if (data.tab === "league") {
            setLeagueData(data.data);
          } else {
            setGlobalData(data.data);
            setGlobalUserRank(data.userRank);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [user, tab]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00d4ff] border-t-transparent" />
      </div>
    );
  }

  const meta = leagueData ? LEAGUE_META[leagueData.league] || LEAGUE_META.bronze : LEAGUE_META.bronze;
  const currentLeagueIdx = leagueData ? ALL_LEAGUES.indexOf(leagueData.league) : 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className={`absolute inset-0 bg-gradient-to-b ${meta.gradient} opacity-50`} />
        <div className="relative mx-auto max-w-2xl px-4 pb-6 pt-10 text-center">
          <h1 className="mb-2 font-display text-2xl font-extrabold tracking-wider text-white">
            <Trophy className="mb-1 mr-2 inline-block" size={24} style={{ color: meta.color }} />
            CLASSEMENT
          </h1>
          <p className="text-sm text-white/40">
            Gagnez de l&apos;XP pour monter dans les ligues
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Tab switcher */}
        <div className="mb-6 flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setTab("league")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              tab === "league"
                ? "bg-white/[0.06] text-white shadow-inner"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Shield size={16} />
            Ligue hebdo
          </button>
          <button
            onClick={() => setTab("global")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              tab === "global"
                ? "bg-white/[0.06] text-white shadow-inner"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Globe size={16} />
            Classement global
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00d4ff] border-t-transparent" />
          </div>
        ) : tab === "league" && leagueData ? (
          <>
            {/* League info card */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="p-5">
                {/* League progression bar */}
                <div className="mb-4 flex items-center justify-between">
                  {ALL_LEAGUES.map((l, i) => {
                    const lm = LEAGUE_META[l];
                    const isCurrent = i === currentLeagueIdx;
                    const isPast = i < currentLeagueIdx;
                    return (
                      <div key={l} className="flex flex-1 flex-col items-center gap-1">
                        <span
                          className={`text-lg transition-all ${isCurrent ? "scale-125 drop-shadow-lg" : isPast ? "opacity-60" : "opacity-25 grayscale"}`}
                          style={isCurrent ? { filter: `drop-shadow(0 0 8px ${lm.color}80)` } : {}}
                        >
                          {lm.icon}
                        </span>
                        {i < ALL_LEAGUES.length - 1 && (
                          <div className="absolute" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Current league name */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{meta.icon}</span>
                  <h2 className="font-display text-xl font-bold" style={{ color: meta.color }}>
                    Ligue {meta.name}
                  </h2>
                </div>

                {/* Stats */}
                <div className="mt-4 flex justify-center gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={12} className="text-white/40" />
                      <span className="text-lg font-bold text-white">{leagueData.daysLeft}</span>
                    </div>
                    <p className="text-[0.65rem] text-white/40">jours restants</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Users size={12} className="text-white/40" />
                      <span className="text-lg font-bold text-white">{leagueData.members.length}</span>
                    </div>
                    <p className="text-[0.65rem] text-white/40">participants</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp size={12} className="text-white/40" />
                      <span className="text-lg font-bold text-[#00d4ff]">#{leagueData.userRank}</span>
                    </div>
                    <p className="text-[0.65rem] text-white/40">votre rang</p>
                  </div>
                </div>
              </div>

              {/* Promotion/demotion legend */}
              <div className="flex gap-4 border-t border-white/[0.04] px-5 py-2.5">
                {leagueData.promotionZone > 0 && (
                  <div className="flex items-center gap-1.5 text-[0.65rem] text-green-400/70">
                    <ChevronUp size={12} />
                    <span>Top {leagueData.promotionZone} promus</span>
                  </div>
                )}
                {leagueData.demotionZone > 0 && (
                  <div className="flex items-center gap-1.5 text-[0.65rem] text-red-400/70">
                    <ChevronDown size={12} />
                    <span>Derniers {leagueData.demotionZone} relégués</span>
                  </div>
                )}
              </div>
            </div>

            {/* Podium */}
            {leagueData.members.length >= 3 && (
              <Podium members={leagueData.members} userId={userId} />
            )}

            {/* Member list */}
            <div className="space-y-1">
              {leagueData.members.map(member => (
                <LeagueRow
                  key={member.userId}
                  member={member}
                  userId={userId}
                  totalMembers={leagueData.members.length}
                  promotionZone={leagueData.promotionZone}
                  demotionZone={leagueData.demotionZone}
                />
              ))}
              {leagueData.members.length === 0 && (
                <div className="py-16 text-center">
                  <Users size={40} className="mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/40">Aucun participant cette semaine</p>
                  <p className="text-xs text-white/25">Complétez des exercices pour rejoindre la ligue !</p>
                </div>
              )}
            </div>
          </>
        ) : tab === "global" ? (
          <>
            {/* Global header */}
            {globalUserRank && (
              <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                <p className="text-xs text-white/40">Votre classement mondial</p>
                <p className="font-display text-3xl font-bold text-[#00d4ff]">#{globalUserRank}</p>
              </div>
            )}

            {/* Global list */}
            <div className="space-y-1">
              {globalData.map(entry => (
                <GlobalRow key={entry.userId} entry={entry} userId={userId} />
              ))}
              {globalData.length === 0 && (
                <div className="py-16 text-center">
                  <Globe size={40} className="mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/40">Le classement est vide</p>
                  <p className="text-xs text-white/25">Soyez le premier !</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
