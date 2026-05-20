"use client";

import { useEffect, useState } from "react";
import { Zap, Calendar, ArrowRight, Check, Flame } from "lucide-react";
import { MODULES } from "@/lib/constants";
import { useTranslation } from "@/lib/translation-context";
import Link from "next/link";

function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyExercise() {
    // Deterministic selection based on day of year
    const now = new Date();
    const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const availableModules = MODULES.filter((m) => m.available);
    const mod = availableModules[dayOfYear % availableModules.length];
    // Pick an exercise index within the module
    const exIndex = (dayOfYear * 7 + 3) % mod.levels;
    return { mod, exIndex: exIndex + 1 }; // 1-based
}

export function DailyChallenge() {
    const { lang } = useTranslation();
    const [completed, setCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [serverMod, setServerMod] = useState<string | null>(null);
    const fallback = getDailyExercise();
    const mod = serverMod ? (MODULES.find((m) => m.id === serverMod) ?? fallback.mod) : fallback.mod;
    const exIndex = fallback.exIndex;
    const todayKey = getTodayKey();
    const storageKey = `daily_challenge_${todayKey}`;

    // Sync state with the server (works cross-device); fall back to localStorage offline.
    useEffect(() => {
        let cancelled = false;
        fetch("/api/db/daily")
            .then((r) => r.ok ? r.json() : null)
            .then((d) => {
                if (cancelled || !d?.success) return;
                setCompleted(!!d.completed);
                setStreak(d.streak || 0);
                if (d.challenge?.module_id) setServerMod(d.challenge.module_id);
            })
            .catch(() => {
                try { setCompleted(localStorage.getItem(storageKey) === "done"); } catch { /* ignore */ }
            });
        return () => { cancelled = true; };
    }, [storageKey]);

    return (
        <div className="mb-8 overflow-hidden rounded-2xl border border-carthage-gold/25 bg-gradient-to-br from-carthage-gold/[0.07] to-transparent">
            <div className="flex items-center gap-3 border-b border-carthage-gold/15 px-5 py-3">
                <Calendar size={16} className="text-carthage-gold" />
                <span className="font-display text-sm font-bold text-carthage-gold">
                    {lang === "fr" ? "Défi du Jour" : "Daily Challenge"}
                </span>
                {streak > 0 && (
                    <span className="rounded-full bg-xana-red/15 px-2 py-0.5 text-[0.65rem] font-bold text-xana-red">
                        <Flame size={10} className="mr-1 inline" />{streak}
                    </span>
                )}
                <span className="ml-auto rounded-full border border-carthage-gold/30 bg-carthage-gold/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-carthage-gold">
                    +50 XP
                </span>
            </div>

            <div className="flex items-center gap-4 px-5 py-4">
                {/* Module color dot */}
                <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30`, color: mod.color }}
                >
                    <Zap size={22} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-0.5">
                        {mod.name} · {lang === "fr" ? "Exercice #" : "Exercise #"}{exIndex}
                    </p>
                    <h3 className="font-display text-sm font-bold text-white truncate">
                        {lang === "fr" ? "Relève le défi quotidien !" : "Take on the daily challenge!"}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                        {completed
                            ? (lang === "fr" ? "✅ Défi complété aujourd'hui !" : "✅ Daily challenge completed today!")
                            : (lang === "fr" ? "Double ton XP sur cet exercice" : "Double your XP on this exercise")}
                    </p>
                </div>

                {completed ? (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-lyoko-green/40 bg-lyoko-green/15">
                        <Check size={16} className="text-lyoko-green" />
                    </div>
                ) : (
                    <Link
                        href={mod.href}
                        onClick={() => {
                            try { localStorage.setItem(storageKey, "done"); } catch { /* ignore */ }
                            // Optimistic UI; the actual server-side completion
                            // is triggered when the user solves the exercise
                            // (POST /api/db/daily from the exercise client).
                            setCompleted(true);
                        }}
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-carthage-gold/40 bg-carthage-gold/10 px-4 py-2 text-xs font-semibold text-carthage-gold transition-all hover:bg-carthage-gold/20 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]"
                    >
                        {lang === "fr" ? "Jouer" : "Play"} <ArrowRight size={13} />
                    </Link>
                )}
            </div>
        </div>
    );
}
