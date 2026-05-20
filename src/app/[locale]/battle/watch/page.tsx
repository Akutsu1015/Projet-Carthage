"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Swords, Clock } from "lucide-react";

interface Row {
  id: string;
  mode: string;
  difficulty: string;
  challenge_title: string | null;
  creator_id: number;
  creator_name: string | null;
  creator_avatar_color: string | null;
  opponent_id: number | null;
  opponent_name: string | null;
  opponent_avatar_color: string | null;
  started_at: string | null;
}

export default function WatchListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      fetch("/api/db/battle/active")
        .then((r) => r.json())
        .then((d) => { if (d.success) setRows(d.battles); })
        .finally(() => setLoading(false));
    load();
    const id = setInterval(load, 10_000); // refresh every 10s
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/battle" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Battles
        </Link>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Eye size={20} className="text-lyoko-blue" />
          Spectateur
        </h1>
        <span className="ml-auto text-xs text-white/40">{rows.length} en cours</span>
      </div>

      {loading && <p className="text-sm text-white/40">Chargement…</p>}
      {!loading && rows.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <Swords size={32} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm text-white/40">Aucune battle en cours. Reviens dans quelques minutes !</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`/battle/watch/${r.id}`}
            className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-lyoko-blue/30"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${r.mode === "ranked" ? "bg-carthage-gold/15 text-carthage-gold" : "bg-white/5 text-white/50"}`}>
                {r.mode}
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] text-white/50 capitalize">
                {r.difficulty}
              </span>
              <span className="ml-auto flex items-center gap-1 text-[0.65rem] text-white/30">
                <Clock size={10} />
                {r.started_at ? new Date(r.started_at + "Z").toLocaleTimeString("fr-FR") : "—"}
              </span>
            </div>
            <h3 className="mb-3 truncate text-sm font-semibold text-white">
              {r.challenge_title || "Battle en cours"}
            </h3>
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: r.creator_avatar_color || "#00d4ff" }}
                />
                {r.creator_name}
              </div>
              <Swords size={12} className="text-lyoko-purple" />
              <div className="flex items-center gap-2">
                {r.opponent_name}
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: r.opponent_avatar_color || "#a855f7" }}
                />
              </div>
            </div>
            <div className="mt-3 text-right text-xs text-lyoko-blue opacity-0 transition-opacity group-hover:opacity-100">
              Regarder →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
