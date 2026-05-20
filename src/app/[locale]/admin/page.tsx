"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Users, Trophy, Flame, Shield, Search, ChevronLeft, ChevronRight,
  Trash2, UserCog, Mail, Calendar, Star, Activity, Swords, Award,
  TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowLeft,
  Eye, Ban, UserPlus, Globe, BarChart3, Timer, FileText,
} from "lucide-react";
import Link from "next/link";

/* ═══ TYPES ═══ */

interface AdminStats {
  totalUsers: number; totalExercises: number; totalBattles: number;
  totalBadges: number; totalXp: number; todayLogins: number;
  newUsersToday: number; verifiedUsers: number;
}

interface AnalyticsData {
  totalViews: number; todayViews: number; totalSessions: number;
  todaySessions: number; avgDuration: number; avgPages: number;
}

interface TopPage { path: string; views: number; unique_visitors: number; }
interface DailyView { date: string; views: number; visitors: number; }
interface RecentVisit { path: string; created_at: string; duration_ms: number; pages: number; username: string | null; display_name: string | null; }

interface AdminUser {
  id: number; username: string; email: string; display_name: string;
  xp: number; level: number; streak: number; role: string;
  auth_provider: string; email_verified: number; created_at: string;
  last_login: string; exercises_completed: number;
}

interface BannedIp { id: number; ip: string; reason: string; created_at: string; banned_by_name: string | null; }

type Tab = "overview" | "analytics" | "users" | "bans" | "create";

/* ═══ STAT CARD ═══ */

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: any; label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600/50 transition-colors">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white font-[family-name:var(--font-orbitron)]">{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

/* ═══ USER ROW ═══ */

function UserRow({ user, onRoleChange, onDelete, currentAdminId }: {
  user: AdminUser; onRoleChange: (id: number, role: string) => void; onDelete: (id: number) => void; currentAdminId: number;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isSelf = user.id === currentAdminId;
  const roleColors: Record<string, string> = {
    admin: "bg-red-500/20 text-red-400 border-red-500/30",
    moderator: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    user: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <tr className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
            {user.display_name?.substring(0, 2).toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.display_name || user.username}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-400">{user.email}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${roleColors[user.role] || roleColors.user}`}>
          {user.role}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-white font-[family-name:var(--font-orbitron)]">{user.xp.toLocaleString()}</td>
      <td className="py-3 px-4 text-sm text-gray-400">Lv.{user.level}</td>
      <td className="py-3 px-4 text-sm text-gray-400">{user.exercises_completed}</td>
      <td className="py-3 px-4">
        {user.email_verified ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-yellow-400" />}
      </td>
      <td className="py-3 px-4 text-xs text-gray-500">{new Date(user.last_login).toLocaleDateString("fr-FR")}</td>
      <td className="py-3 px-4">
        {!isSelf && (
          <div className="flex items-center gap-1">
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.id, e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="user">user</option>
              <option value="moderator">moderator</option>
              <option value="admin">admin</option>
            </select>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={() => { onDelete(user.id); setConfirmDelete(false); }} className="p-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs">Oui</button>
                <button onClick={() => setConfirmDelete(false)} className="p-1 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs">Non</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors" title="Supprimer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

/* ═══ MAIN PAGE ═══ */

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [bannedIps, setBannedIps] = useState<BannedIp[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [loadingData, setLoadingData] = useState(true);
  const pageSize = 25;

  // Ban form
  const [banIpInput, setBanIpInput] = useState("");
  const [banReason, setBanReason] = useState("");

  // Create user form
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [createMsg, setCreateMsg] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.replace("/dashboard");
  }, [isLoading, user, router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/db/admin?action=stats", { credentials: "include" });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      if (search) {
        const res = await fetch(`/api/db/admin?action=search&q=${encodeURIComponent(search)}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) { setUsers(data.users); setTotalUsers(data.users.length); }
      } else {
        const res = await fetch(`/api/db/admin?action=users&limit=${pageSize}&offset=${page * pageSize}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) { setUsers(data.users); setTotalUsers(data.total); }
      }
    } catch {}
    setLoadingData(false);
  }, [search, page]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/db/admin?action=analytics", { credentials: "include" });
      const data = await res.json();
      if (data.success) { setAnalytics(data.analytics); setTopPages(data.topPages); setDailyViews(data.dailyViews); setRecentVisits(data.recentVisits); }
    } catch {}
  }, []);

  const fetchBannedIps = useCallback(async () => {
    try {
      const res = await fetch("/api/db/admin?action=bannedIps", { credentials: "include" });
      const data = await res.json();
      if (data.success) setBannedIps(data.ips);
    } catch {}
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchStats();
      if (tab === "users") fetchUsers();
      if (tab === "analytics") fetchAnalytics();
      if (tab === "bans") fetchBannedIps();
    }
  }, [user, tab, fetchStats, fetchUsers, fetchAnalytics, fetchBannedIps]);

  const handleRoleChange = async (userId: number, role: string) => {
    const res = await fetch("/api/db/admin", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action: "setRole", userId, role }) });
    const data = await res.json();
    if (data.success) fetchUsers();
  };

  const handleDelete = async (userId: number) => {
    const res = await fetch("/api/db/admin", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action: "deleteUser", userId }) });
    const data = await res.json();
    if (data.success) { fetchUsers(); fetchStats(); }
  };

  const handleBanIp = async () => {
    if (!banIpInput) return;
    const res = await fetch("/api/db/admin", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action: "banIp", ip: banIpInput, reason: banReason }) });
    const data = await res.json();
    if (data.success) { setBanIpInput(""); setBanReason(""); fetchBannedIps(); }
  };

  const handleUnbanIp = async (ip: string) => {
    const res = await fetch("/api/db/admin", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action: "unbanIp", ip }) });
    const data = await res.json();
    if (data.success) fetchBannedIps();
  };

  const handleCreateUser = async () => {
    setCreateMsg("");
    const res = await fetch("/api/db/admin", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action: "createUser", username: newUsername, email: newEmail, password: newPassword, displayName: newDisplayName, role: newRole }) });
    const data = await res.json();
    if (data.success) {
      setCreateMsg(`Utilisateur "${data.user.username}" créé avec le rôle ${data.user.role}`);
      setNewUsername(""); setNewEmail(""); setNewPassword(""); setNewDisplayName(""); setNewRole("user");
      fetchStats();
    } else {
      setCreateMsg(data.error || "Erreur");
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="animate-pulse text-cyan-400 font-[family-name:var(--font-orbitron)]">Chargement...</div></div>;
  }

  const totalPages = Math.ceil(totalUsers / pageSize);
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: Activity },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "users", label: "Utilisateurs", icon: Users },
    { key: "bans", label: "Ban IP", icon: Ban },
    { key: "create", label: "Créer un utilisateur", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-cyan-400 flex items-center gap-3">
                <Shield className="w-7 h-7" /> Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">Projet Carthage — Panneau d&apos;administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-medium">ADMIN</span>
            <span>{user.displayName}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800/40 p-1 rounded-lg overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${tab === key ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {tab === "overview" && stats && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Utilisateurs" value={stats.totalUsers} color="bg-cyan-500/20 text-cyan-400" sub={`${stats.newUsersToday} aujourd'hui`} />
              <StatCard icon={Trophy} label="Exercices" value={stats.totalExercises.toLocaleString()} color="bg-green-500/20 text-green-400" />
              <StatCard icon={Swords} label="Batailles" value={stats.totalBattles} color="bg-purple-500/20 text-purple-400" />
              <StatCard icon={Award} label="Badges" value={stats.totalBadges} color="bg-yellow-500/20 text-yellow-400" />
              <StatCard icon={TrendingUp} label="XP Total" value={stats.totalXp.toLocaleString()} color="bg-orange-500/20 text-orange-400" />
              <StatCard icon={Clock} label="Logins aujourd'hui" value={stats.todayLogins} color="bg-blue-500/20 text-blue-400" />
              <StatCard icon={CheckCircle2} label="Emails vérifiés" value={stats.verifiedUsers} color="bg-emerald-500/20 text-emerald-400" sub={`${stats.totalUsers ? Math.round(stats.verifiedUsers / stats.totalUsers * 100) : 0}%`} />
              <StatCard icon={Flame} label="Nouveaux aujourd'hui" value={stats.newUsersToday} color="bg-pink-500/20 text-pink-400" />
            </div>
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" />Résumé</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div><p className="text-gray-400 mb-1">Moyenne XP / utilisateur</p><p className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-cyan-400">{stats.totalUsers ? Math.round(stats.totalXp / stats.totalUsers) : 0}</p></div>
                <div><p className="text-gray-400 mb-1">Moyenne exercices / utilisateur</p><p className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-green-400">{stats.totalUsers ? (stats.totalExercises / stats.totalUsers).toFixed(1) : "0"}</p></div>
                <div><p className="text-gray-400 mb-1">Taux de vérification email</p><p className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-emerald-400">{stats.totalUsers ? Math.round(stats.verifiedUsers / stats.totalUsers * 100) : 0}%</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {tab === "analytics" && analytics && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon={Eye} label="Vues totales" value={analytics.totalViews.toLocaleString()} color="bg-cyan-500/20 text-cyan-400" sub={`${analytics.todayViews} aujourd'hui`} />
              <StatCard icon={Globe} label="Sessions totales" value={analytics.totalSessions.toLocaleString()} color="bg-blue-500/20 text-blue-400" sub={`${analytics.todaySessions} aujourd'hui`} />
              <StatCard icon={Timer} label="Durée moyenne / session" value={formatDuration(analytics.avgDuration)} color="bg-purple-500/20 text-purple-400" />
              <StatCard icon={FileText} label="Pages / session" value={analytics.avgPages} color="bg-green-500/20 text-green-400" />
            </div>

            {/* Daily views chart */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-cyan-400" />Vues par jour (14 derniers jours)</h2>
              <div className="flex items-end gap-1 h-40">
                {dailyViews.map((d) => {
                  const maxViews = Math.max(...dailyViews.map(x => x.views), 1);
                  const h = Math.max(4, (d.views / maxViews) * 140);
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.views} vues, ${d.visitors} visiteurs`}>
                      <span className="text-[10px] text-gray-400">{d.views}</span>
                      <div className="w-full bg-cyan-500/60 rounded-t" style={{ height: h }} />
                      <span className="text-[9px] text-gray-500">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top pages */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Pages les plus visitées</h2>
              <div className="space-y-2">
                {topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3 text-sm">
                    <span className="w-6 text-gray-500 text-right">{i + 1}.</span>
                    <span className="flex-1 text-white font-mono">{p.path}</span>
                    <span className="text-cyan-400 font-[family-name:var(--font-orbitron)]">{p.views}</span>
                    <span className="text-gray-500 text-xs">vues</span>
                    <span className="text-gray-400">{p.unique_visitors}</span>
                    <span className="text-gray-500 text-xs">uniques</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent visits */}
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Visites récentes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b border-gray-700/30">
                      <th className="py-2 px-3">Page</th><th className="py-2 px-3">Utilisateur</th><th className="py-2 px-3">Durée</th><th className="py-2 px-3">Pages</th><th className="py-2 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.map((v, i) => (
                      <tr key={i} className="border-b border-gray-700/20">
                        <td className="py-2 px-3 font-mono text-white">{v.path}</td>
                        <td className="py-2 px-3 text-gray-400">{v.display_name || v.username || "Anonyme"}</td>
                        <td className="py-2 px-3 text-gray-400">{v.duration_ms ? formatDuration(v.duration_ms) : "—"}</td>
                        <td className="py-2 px-3 text-gray-400">{v.pages || "—"}</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">{new Date(v.created_at).toLocaleString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {tab === "users" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Rechercher par nom, email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
              </div>
              <span className="text-xs text-gray-500">{totalUsers} utilisateur{totalUsers !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto bg-gray-800/30 border border-gray-700/30 rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Utilisateur</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Rôle</th><th className="py-3 px-4">XP</th><th className="py-3 px-4">Niveau</th><th className="py-3 px-4">Exercices</th><th className="py-3 px-4">Vérifié</th><th className="py-3 px-4">Dernier login</th><th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingData ? (
                    <tr><td colSpan={9} className="py-8 text-center text-gray-500 animate-pulse">Chargement...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={9} className="py-8 text-center text-gray-500">Aucun utilisateur trouvé</td></tr>
                  ) : users.map((u) => (
                    <UserRow key={u.id} user={u} onRoleChange={handleRoleChange} onDelete={handleDelete} currentAdminId={Number(user.id)} />
                  ))}
                </tbody>
              </table>
            </div>
            {!search && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm text-gray-400">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        )}

        {/* ═══ BAN IP ═══ */}
        {tab === "bans" && (
          <div>
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Ban className="w-5 h-5 text-red-400" />Bannir une adresse IP</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Adresse IP (ex: 192.168.1.1)" value={banIpInput} onChange={(e) => setBanIpInput(e.target.value)} className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
                <input type="text" placeholder="Raison (optionnel)" value={banReason} onChange={(e) => setBanReason(e.target.value)} className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
                <button onClick={handleBanIp} disabled={!banIpInput} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors">Bannir</button>
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">IPs bannies ({bannedIps.length})</h2>
              {bannedIps.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune IP bannie</p>
              ) : (
                <div className="space-y-2">
                  {bannedIps.map((b) => (
                    <div key={b.id} className="flex items-center justify-between bg-gray-800/60 border border-gray-700/30 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-mono text-white">{b.ip}</p>
                        <p className="text-xs text-gray-500">{b.reason} — par {b.banned_by_name || "système"} le {new Date(b.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <button onClick={() => handleUnbanIp(b.ip)} className="px-3 py-1 bg-gray-700 hover:bg-green-600 rounded text-xs transition-colors">Débannir</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ CREATE USER ═══ */}
        {tab === "create" && (
          <div className="max-w-lg">
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-cyan-400" />Créer un utilisateur</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nom d&apos;utilisateur *</label>
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email *</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Mot de passe * (min. 6 caractères)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nom affiché</label>
                  <input type="text" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rôle</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500">
                    <option value="user">Utilisateur</option>
                    <option value="moderator">Modérateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button onClick={handleCreateUser} disabled={!newUsername || !newEmail || !newPassword} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors">
                  Créer le compte
                </button>
                {createMsg && (
                  <p className={`text-sm ${createMsg.startsWith("Utilisateur") ? "text-green-400" : "text-red-400"}`}>{createMsg}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
