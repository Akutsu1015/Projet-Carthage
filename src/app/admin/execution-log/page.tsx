"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, AlertTriangle, Terminal, Filter } from "lucide-react";

interface Row {
  id: number;
  user_id: number | null;
  username: string | null;
  ip: string | null;
  language: string;
  exit_code: number | null;
  code_len: number;
  duration_ms: number;
  error: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  last24h: number;
  errors: number;
  byLanguage: { language: string; count: number }[];
  topUsers: { user_id: number; username: string | null; count: number }[];
  topIps: { ip: string; count: number }[];
}

export default function ExecutionLogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [language, setLanguage] = useState("");
  const [errorsOnly, setErrorsOnly] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 100;

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/");
  }, [loading, user, router]);

  const load = useCallback(async () => {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (language) qs.set("language", language);
    if (errorsOnly) qs.set("errors", "1");
    const res = await fetch(`/api/db/admin/execution-log?${qs}`);
    const data = await res.json();
    if (data.success) {
      setRows(data.rows);
      setStats(data.stats);
    }
  }, [offset, language, errorsOnly]);

  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);

  if (loading) return <div className="p-8 text-white/40">Chargement...</div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Admin
        </Link>
        <h1 className="font-display text-2xl font-bold">Journal des exécutions</h1>
      </div>

      {stats && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Total" value={stats.total.toLocaleString()} icon={<Terminal size={18} />} />
          <StatCard label="Dernières 24h" value={stats.last24h.toLocaleString()} icon={<Terminal size={18} />} />
          <StatCard
            label="Erreurs"
            value={`${stats.errors.toLocaleString()} (${stats.total > 0 ? Math.round(stats.errors / stats.total * 100) : 0}%)`}
            icon={<AlertTriangle size={18} className="text-xana-red" />}
          />
        </div>
      )}

      {stats && (
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card title="Par langage">
            {stats.byLanguage.map((r) => (
              <Row2 key={r.language} left={r.language} right={r.count} />
            ))}
          </Card>
          <Card title="Top 10 users (7j)">
            {stats.topUsers.length === 0 && <p className="text-xs text-white/30">Aucun</p>}
            {stats.topUsers.map((r) => (
              <Row2 key={r.user_id} left={r.username || `#${r.user_id}`} right={r.count} />
            ))}
          </Card>
          <Card title="Top 10 IPs (24h)">
            {stats.topIps.length === 0 && <p className="text-xs text-white/30">Aucune</p>}
            {stats.topIps.map((r) => (
              <Row2 key={r.ip} left={r.ip} right={r.count} />
            ))}
          </Card>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <Filter size={16} className="text-white/40" />
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); setOffset(0); }}
          className="rounded-lg border border-white/10 bg-dark-bg px-3 py-1.5 text-sm"
        >
          <option value="">Tous langages</option>
          {stats?.byLanguage.map((r) => (
            <option key={r.language} value={r.language}>{r.language} ({r.count})</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={errorsOnly} onChange={(e) => { setErrorsOnly(e.target.checked); setOffset(0); }} />
          Erreurs uniquement
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase text-white/40">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">Langage</th>
              <th className="px-3 py-2">Exit</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Durée</th>
              <th className="px-3 py-2">Erreur</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-xs text-white/60">{r.created_at}</td>
                <td className="px-3 py-2">{r.username || (r.user_id ? `#${r.user_id}` : <span className="text-white/30">guest</span>)}</td>
                <td className="px-3 py-2 font-mono text-xs text-white/50">{r.ip || "-"}</td>
                <td className="px-3 py-2">{r.language}</td>
                <td className={`px-3 py-2 font-mono ${r.exit_code === 0 ? "text-lyoko-green" : "text-xana-red"}`}>{r.exit_code ?? "-"}</td>
                <td className="px-3 py-2 text-white/50">{r.code_len}o</td>
                <td className="px-3 py-2 text-white/50">{r.duration_ms}ms</td>
                <td className="px-3 py-2 text-xs text-xana-red">{r.error ? r.error.slice(0, 60) : "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-white/30">Aucune exécution enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-30"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setOffset(offset + limit)}
          disabled={rows.length < limit}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm disabled:opacity-30"
        >
          Suivant →
        </button>
        <span className="self-center text-xs text-white/40">offset {offset}</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase text-white/40">{icon} {label}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase text-white/40">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row2({ left, right }: { left: string | null; right: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-1 text-sm last:border-0">
      <span className="text-white/70">{left}</span>
      <span className="font-mono text-xs text-white/40">{right}</span>
    </div>
  );
}
