"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Flame, Check, ChevronRight } from "lucide-react";

interface DailyData {
  success: boolean;
  challenge: { day: string; module_id: string; exercise_id: string };
  completed: boolean;
  streak: number;
}

/**
 * Compact banner showing today's daily challenge + streak.
 * Renders nothing if the API fails (defensive — never blocks the dashboard).
 */
export function DailyChallengeBanner() {
  const [data, setData] = useState<DailyData | null>(null);

  useEffect(() => {
    fetch("/api/db/daily")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.success) setData(d); })
      .catch(() => { /* silent */ });
  }, []);

  if (!data) return null;
  const { challenge, completed, streak } = data;

  return (
    <Link
      href={`/exercises/${challenge.module_id}?daily=${challenge.day}`}
      className={`group block rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${
        completed
          ? "border-lyoko-green/30 bg-lyoko-green/5"
          : "border-carthage-gold/30 bg-gradient-to-br from-carthage-gold/10 to-transparent"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
          completed ? "bg-lyoko-green/15 text-lyoko-green" : "bg-carthage-gold/15 text-carthage-gold"
        }`}>
          {completed ? <Check size={22} /> : <Calendar size={22} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-white">
              {completed ? "Défi du jour terminé !" : "Défi du jour"}
            </h3>
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-xana-red/15 px-2 py-0.5 text-xs font-semibold text-xana-red">
                <Flame size={11} /> {streak}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-white/50">
            Module <span className="font-semibold capitalize text-white/70">{challenge.module_id}</span>
            {completed ? " — reviens demain pour conserver ton streak." : " — résous-le pour +50 XP bonus."}
          </p>
        </div>
        {!completed && (
          <ChevronRight size={20} className="text-white/40 transition-transform group-hover:translate-x-1" />
        )}
      </div>
    </Link>
  );
}
