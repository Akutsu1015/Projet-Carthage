"use client";

import { useEffect, useRef, useState } from "react";

type Level = "INFO" | "WARN" | "ERR" | "OK";

type Entry = { ts: string; level: Level; src: string; msg: string };

const POOL: Omit<Entry, "ts">[] = [
  { level: "OK", src: "auth", msg: "operator handshake validated // sha-256 ok" },
  { level: "INFO", src: "kernel", msg: "module javascript-part4 loaded into vm sandbox" },
  { level: "INFO", src: "range", msg: "range-04 broadcast started // 12 operators online" },
  { level: "OK", src: "xp", msg: "operator #2391 awarded +120 xp // exercise solved" },
  { level: "INFO", src: "battle", msg: "elo recompute triggered for cohort fr-rk-01" },
  { level: "WARN", src: "watcher", msg: "rate-limit threshold approached on ingress-03" },
  { level: "INFO", src: "sync", msg: "leaderboard delta merged // 1.2k rows" },
  { level: "OK", src: "viewport", msg: "core ring stable // latency 18ms" },
  { level: "ERR", src: "range", msg: "range-04 packet drop // retransmit issued" },
  { level: "INFO", src: "kernel", msg: "compiler thread csharp-part5 spawned" },
  { level: "OK", src: "auth", msg: "session refresh ok // 1.4k tokens rotated" },
  { level: "INFO", src: "ai", msg: "jeremie hint engine warm // p95 320ms" },
];

function ts() {
  const d = new Date();
  return `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")}`;
}

const LEVEL_COLOR: Record<Level, string> = {
  OK: "var(--carthage-ok)",
  INFO: "var(--carthage-muted)",
  WARN: "var(--carthage-steel)",
  ERR: "var(--carthage-alert)",
};

export function Terminal() {
  const [lines, setLines] = useState<Entry[]>([]);
  const idx = useRef(0);

  useEffect(() => {
    const seed: Entry[] = Array.from({ length: 6 }, (_, i) => ({
      ts: ts(),
      ...POOL[(i * 3) % POOL.length],
    }));
    setLines(seed);
    idx.current = seed.length;

    const id = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, { ts: ts(), ...POOL[idx.current % POOL.length] }];
        idx.current += 1;
        return next.slice(-12);
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-mono text-[11px] leading-[1.7]">
      <div className="flex items-center justify-between border-b border-[var(--carthage-line)] px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-[var(--carthage-faint)]">
        <span>terminal // sys.log</span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-[var(--carthage-ok)] blink" />
          streaming
        </span>
      </div>
      <div className="px-5 py-3 max-h-[260px] overflow-hidden">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3 whitespace-pre">
            <span className="text-[var(--carthage-faint)]">{l.ts}</span>
            <span style={{ color: LEVEL_COLOR[l.level], width: 36 }}>
              {l.level.padEnd(4, " ")}
            </span>
            <span className="text-[var(--carthage-muted)]" style={{ width: 72 }}>
              {l.src.padEnd(8, " ")}
            </span>
            <span className="text-[var(--carthage-text)]">{l.msg}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[var(--carthage-faint)]">{ts()}</span>
          <span className="text-[var(--carthage-text)]">{">"}</span>
          <span className="inline-block h-3 w-1.5 bg-[var(--carthage-text)] blink" />
        </div>
      </div>
    </div>
  );
}
