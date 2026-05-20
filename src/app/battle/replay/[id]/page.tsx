"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Swords, Clock, Trophy } from "lucide-react";

interface Replay {
  id: string;
  mode: string;
  difficulty: string;
  status: string;
  challengeTitle: string | null;
  template: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  winnerId: number | null;
  creator: { id: number; name: string | null; code: string | null; timeMs: number | null };
  opponent: { id: number; name: string | null; code: string | null; timeMs: number | null };
}

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Replay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/db/battle/replay/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.battle); else setError(d.error); })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="mx-auto max-w-3xl px-4 py-10 text-white"><p className="text-xana-red">{error}</p></div>;
  if (!data) return <div className="mx-auto max-w-3xl px-4 py-10 text-white/50">Chargement…</div>;

  const winnerName = data.winnerId === data.creator.id ? data.creator.name : data.winnerId === data.opponent.id ? data.opponent.name : null;
  const duration = data.startedAt && data.finishedAt ? Math.round((new Date(data.finishedAt + "Z").getTime() - new Date(data.startedAt + "Z").getTime()) / 1000) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/battle" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Battles
        </Link>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Swords size={18} className="text-lyoko-purple" />
          Replay {data.challengeTitle ? `· ${data.challengeTitle}` : ""}
        </h1>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Trophy size={16} className="text-carthage-gold" />} label="Gagnant" value={winnerName || "—"} />
        <Stat icon={<Clock size={16} className="text-lyoko-blue" />} label="Durée" value={duration != null ? `${duration}s` : "—"} />
        <Stat icon={<Swords size={16} className="text-lyoko-purple" />} label="Mode" value={`${data.mode} · ${data.difficulty}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlayerCode
          name={data.creator.name}
          timeMs={data.creator.timeMs}
          isWinner={data.winnerId === data.creator.id}
          code={data.creator.code}
        />
        <PlayerCode
          name={data.opponent.name}
          timeMs={data.opponent.timeMs}
          isWinner={data.winnerId === data.opponent.id}
          code={data.opponent.code}
        />
      </div>

      {data.template && (
        <details className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <summary className="cursor-pointer text-sm text-white/60">Voir le template de départ</summary>
          <pre className="mt-3 overflow-auto rounded-lg bg-dark-bg p-3 font-mono text-xs text-white/70">{data.template}</pre>
        </details>
      )}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase text-white/40">{icon} {label}</div>
      <div className="font-display text-lg font-bold">{value}</div>
    </div>
  );
}

function PlayerCode({ name, timeMs, isWinner, code }: { name: string | null; timeMs: number | null; isWinner: boolean; code: string | null }) {
  return (
    <div className={`overflow-hidden rounded-xl border ${isWinner ? "border-carthage-gold/40 bg-carthage-gold/5" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          {isWinner && <Trophy size={13} className="text-carthage-gold" />}
          <span className="text-sm font-semibold">{name || "—"}</span>
        </div>
        <span className="text-xs text-white/40">{timeMs != null ? `${(timeMs / 1000).toFixed(1)}s` : "—"}</span>
      </div>
      <pre className="overflow-auto p-4 font-mono text-[0.75rem] leading-relaxed text-white/80" style={{ maxHeight: 500 }}>
{code || <span className="italic text-white/30">Pas de soumission</span>}
      </pre>
    </div>
  );
}
