"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function ConnectionStatus() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const stamp = now
    ? `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}T${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}Z`
    : "----------T--:--:--Z";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--carthage-muted)]">
      <span className="flex items-center gap-2">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-[var(--carthage-ok)] blink" />
        </span>
        <span className="text-[var(--carthage-text)]">link / secure</span>
      </span>
      <span>node // par-07-fr</span>
      <span>uplink // 2.4 gbps</span>
      <span className="text-[var(--carthage-faint)]">{stamp}</span>
    </div>
  );
}
