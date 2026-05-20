"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { io, type Socket } from "socket.io-client";
import { ArrowLeft, Eye, Swords } from "lucide-react";

const BATTLE_URL = process.env.NEXT_PUBLIC_BATTLE_URL || "http://localhost:3002";

interface Battle {
  id: string;
  mode: string;
  difficulty: string;
  challengeTitle: string | null;
  template: string | null;
  startedAt: string | null;
  creator: { id: number; name: string | null };
  opponent: { id: number; name: string | null };
}

interface CodeState { [userId: number]: string }

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<CodeState>({});
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [finished, setFinished] = useState<{ winnerId: number | null } | null>(null);
  const sockRef = useRef<Socket | null>(null);

  // Fetch the battle once (uses the replay endpoint which works for active too,
  // returning empty code fields when the participant hasn't submitted yet).
  useEffect(() => {
    fetch(`/api/db/battle?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) { setError(d.error || "Battle introuvable"); return; }
        setBattle({
          id,
          mode: d.battle.mode,
          difficulty: d.battle.difficulty,
          challengeTitle: d.challenge?.title || null,
          template: d.challenge?.template || null,
          startedAt: d.battle.started_at,
          creator: { id: d.creator.id, name: d.creator.displayName },
          opponent: d.opponent ? { id: d.opponent.id, name: d.opponent.displayName } : { id: 0, name: null },
        });
      })
      .catch((e) => setError(e.message));
  }, [id]);

  // Socket connection for live code-update events
  useEffect(() => {
    if (!battle) return;
    const sock = io(BATTLE_URL, { transports: ["websocket", "polling"] });
    sockRef.current = sock;
    sock.on("connect", () => {
      sock.emit("spectator-join", { battleId: id });
    });
    sock.on("code-update", (data: { userId: number; code: string }) => {
      setCodes((prev) => ({ ...prev, [data.userId]: data.code }));
    });
    sock.on("spectator-count", (data: { count: number }) => {
      setSpectatorCount(data.count);
    });
    sock.on("battle-finished", (data: { winnerId: number | null }) => {
      setFinished({ winnerId: data.winnerId });
    });
    return () => {
      sock.emit("spectator-leave", { battleId: id });
      sock.disconnect();
    };
  }, [battle, id]);

  if (error) return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <p className="text-xana-red">{error}</p>
    </main>
  );
  if (!battle) return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white/50">Chargement…</main>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-white">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/battle/watch" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Spectateur
        </Link>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Eye size={18} className="text-lyoko-blue" />
          {battle.challengeTitle || "Battle"}
        </h1>
        <span className="ml-auto rounded-full bg-lyoko-blue/15 px-3 py-1 text-xs text-lyoko-blue">
          <Eye size={11} className="mr-1 inline" />
          {spectatorCount} spectateur{spectatorCount > 1 ? "s" : ""}
        </span>
      </div>

      {finished && (
        <div className="mb-4 rounded-xl border border-lyoko-green/30 bg-lyoko-green/5 p-4 text-center">
          <p className="font-display text-lg text-lyoko-green">
            Battle terminée — {finished.winnerId === battle.creator.id ? battle.creator.name : battle.opponent.name} l'emporte
          </p>
          <Link href={`/battle/replay/${id}`} className="mt-2 inline-block text-xs text-lyoko-blue hover:underline">
            Voir le replay complet →
          </Link>
        </div>
      )}

      <p className="mb-4 text-xs text-white/40">
        <Swords size={11} className="mr-1 inline" />
        {battle.mode} · {battle.difficulty} · {battle.creator.name} vs {battle.opponent.name}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodePane name={battle.creator.name} code={codes[battle.creator.id] ?? null} />
        <CodePane name={battle.opponent.name} code={codes[battle.opponent.id] ?? null} />
      </div>
    </main>
  );
}

function CodePane({ name, code }: { name: string | null; code: string | null }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/5 px-4 py-2 text-sm font-semibold">{name || "—"}</div>
      <pre className="overflow-auto p-4 font-mono text-[0.75rem] leading-relaxed text-white/80" style={{ maxHeight: 520, minHeight: 200 }}>
{code ?? <span className="italic text-white/30">En attente du joueur…</span>}
      </pre>
    </div>
  );
}
