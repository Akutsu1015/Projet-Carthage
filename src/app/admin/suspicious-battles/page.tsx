"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, AlertTriangle, Swords } from "lucide-react";

interface Row {
  id: string;
  mode: string;
  difficulty: string;
  status: string;
  creator_id: number;
  creator_name: string | null;
  creator_time: number | null;
  creator_flags: string | null;
  opponent_id: number | null;
  opponent_name: string | null;
  opponent_time: number | null;
  opponent_flags: string | null;
  winner_id: number | null;
  started_at: string | null;
  finished_at: string | null;
}

function parseFlags(json: string | null): string[] {
  if (!json) return [];
  try {
    const obj = JSON.parse(json);
    const out: string[] = [];
    if (obj.tabSwitches > 0) out.push(`tabs:${obj.tabSwitches}`);
    if (obj.largePastes > 0) out.push(`pastes:${obj.largePastes}`);
    if (obj.devToolsOpened) out.push("devtools");
    if (obj.suspiciousSpeed) out.push("fast");
    if (obj.flagged) out.push("FLAGGED");
    return out;
  } catch { return ["?"]; }
}

export default function SuspiciousBattlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/");
  }, [loading, user, router]);

  const load = useCallback(async () => {
    const res = await fetch("/api/db/admin/suspicious-battles");
    const data = await res.json();
    if (data.success) setRows(data.rows);
  }, []);

  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);

  if (loading) return <div className="p-8 text-white/40">Chargement...</div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Admin
        </Link>
        <h1 className="font-display text-2xl font-bold">Battles suspectes</h1>
      </div>

      <p className="mb-4 text-sm text-white/40">
        <AlertTriangle size={14} className="mr-1 inline text-carthage-gold" />
        Battles avec drapeaux anti-cheat (tab switches, paste, devtools) ou temps de résolution {"<"} 5 s.
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase text-white/40">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Mode</th>
              <th className="px-3 py-2">Diff.</th>
              <th className="px-3 py-2">Créateur</th>
              <th className="px-3 py-2">Adversaire</th>
              <th className="px-3 py-2">Gagnant</th>
              <th className="px-3 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const cFlags = parseFlags(r.creator_flags);
              const oFlags = parseFlags(r.opponent_flags);
              return (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-3 py-2 font-mono text-xs text-white/60">{r.started_at?.slice(0, 16) ?? "-"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] ${r.mode === "ranked" ? "bg-carthage-gold/15 text-carthage-gold" : "bg-white/5 text-white/50"}`}>
                      {r.mode}
                    </span>
                  </td>
                  <td className="px-3 py-2 capitalize text-white/60">{r.difficulty}</td>
                  <td className="px-3 py-2">
                    <div className="text-sm">{r.creator_name || `#${r.creator_id}`}</div>
                    <div className="font-mono text-[0.65rem] text-white/40">{r.creator_time ?? "-"}ms</div>
                    {cFlags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {cFlags.map((f) => (
                          <span key={f} className={`rounded px-1.5 py-0.5 text-[0.6rem] ${f === "FLAGGED" ? "bg-xana-red/20 text-xana-red" : "bg-carthage-gold/15 text-carthage-gold"}`}>{f}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">{r.opponent_name || (r.opponent_id ? `#${r.opponent_id}` : "-")}</div>
                    <div className="font-mono text-[0.65rem] text-white/40">{r.opponent_time ?? "-"}ms</div>
                    {oFlags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {oFlags.map((f) => (
                          <span key={f} className={`rounded px-1.5 py-0.5 text-[0.6rem] ${f === "FLAGGED" ? "bg-xana-red/20 text-xana-red" : "bg-carthage-gold/15 text-carthage-gold"}`}>{f}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Swords size={12} className="mr-1 inline text-lyoko-purple" />
                    {r.winner_id === r.creator_id ? r.creator_name : r.winner_id === r.opponent_id ? r.opponent_name : "-"}
                  </td>
                  <td className="px-3 py-2 text-xs text-white/50">{r.status}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-white/30">Aucune battle suspecte 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
