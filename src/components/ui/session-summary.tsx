"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import { Trophy, Flame, BookOpen, Star, Clock, X, TrendingUp } from "lucide-react";

interface SessionData {
    startXp: number;
    startExercises: number;
    startTime: number;
    moduleId: string;
    moduleName: string;
}

const SESSION_KEY = "session_data_v1";

/** Call this when the user enters a module */
export function startSession(moduleId: string, moduleName: string, xp: number, exercises: number) {
    const data: SessionData = {
        startXp: xp,
        startExercises: exercises,
        startTime: Date.now(),
        moduleId,
        moduleName,
    };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

/** Read the session data */
function getSession(): SessionData | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

/** End the session */
function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export function SessionSummary() {
    const { user } = useAuth();
    const { lang } = useTranslation();
    const [session, setSession] = useState<SessionData | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!user) return;

        const data = getSession();
        if (!data) return;

        // Only show if they spent at least 30 seconds and did at least 1 exercise
        const elapsed = Date.now() - data.startTime;
        const totalExNow = Object.values(user.progress).reduce((s, a) => s + a.length, 0);
        const exDone = totalExNow - data.startExercises;
        const xpGained = user.xp - data.startXp;

        if (elapsed < 30000 || exDone <= 0) return;

        setSession(data);
        setVisible(true);
    }, [user]);

    const handleClose = () => {
        setVisible(false);
        clearSession();
    };

    if (!visible || !session || !user) return null;

    const elapsed = Date.now() - session.startTime;
    const minutes = Math.round(elapsed / 60000);
    const totalExNow = Object.values(user.progress).reduce((s, a) => s + a.length, 0);
    const exDone = totalExNow - session.startExercises;
    const xpGained = user.xp - session.startXp;

    const stats = [
        { icon: BookOpen, label: lang === "fr" ? "Exercices" : "Exercises", value: exDone.toString(), color: "#00ff88" },
        { icon: Star, label: lang === "fr" ? "XP gagnés" : "XP gained", value: `+${xpGained}`, color: "#fbbf24" },
        { icon: Clock, label: lang === "fr" ? "Durée" : "Duration", value: `${minutes} min`, color: "#00d4ff" },
        { icon: Flame, label: "Streak", value: `${user.streak}${lang === "fr" ? "j" : "d"}`, color: "#ff2244" },
    ];

    return (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-dark-surface shadow-2xl">
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute right-3 top-3 rounded p-1 text-white/30 hover:text-white/60"
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-lyoko-blue/10 to-lyoko-purple/10 px-6 py-5 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-lyoko-blue/20">
                        <TrendingUp size={24} className="text-lyoko-blue" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">
                        {lang === "fr" ? "Résumé de Session" : "Session Summary"}
                    </h3>
                    <p className="text-xs text-white/40">{session.moduleName}</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 p-5">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center"
                        >
                            <s.icon size={18} className="mx-auto mb-1" style={{ color: s.color }} />
                            <p className="font-display text-xl font-bold text-white">{s.value}</p>
                            <p className="text-[0.65rem] text-white/40">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Encouragement */}
                <div className="border-t border-white/5 px-6 py-4 text-center">
                    <p className="text-sm text-white/50">
                        {exDone >= 10
                            ? (lang === "fr" ? "🏆 Performance exceptionnelle !" : "🏆 Exceptional performance!")
                            : exDone >= 5
                                ? (lang === "fr" ? "💪 Belle session, continuez !" : "💪 Great session, keep it up!")
                                : (lang === "fr" ? "✨ Bon début, revenez bientôt !" : "✨ Good start, come back soon!")}
                    </p>
                    <button
                        onClick={handleClose}
                        className="mt-3 rounded-lg bg-lyoko-blue px-6 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    >
                        {lang === "fr" ? "Continuer" : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
