"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

const STORAGE_KEY = "activity_log_v1";

export type ActivityLog = Record<string, number>; // { "2025-01-15": 3 }

export function logActivityToday() {
    if (typeof window === "undefined") return;
    try {
        const today = getDateKey(new Date());
        const raw = localStorage.getItem(STORAGE_KEY);
        const log: ActivityLog = raw ? JSON.parse(raw) : {};
        log[today] = (log[today] || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    } catch { /* ignore */ }
}

function getDateKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLast30Days(): string[] {
    const days: string[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        days.push(getDateKey(d));
    }
    return days;
}

function getIntensity(count: number): string {
    if (count === 0) return "bg-white/[0.04] border-white/[0.06]";
    if (count <= 2) return "bg-lyoko-blue/30 border-lyoko-blue/20";
    if (count <= 5) return "bg-lyoko-blue/55 border-lyoko-blue/30";
    if (count <= 10) return "bg-lyoko-green/60 border-lyoko-green/30";
    return "bg-lyoko-green border-lyoko-green/50 shadow-[0_0_6px_rgba(0,255,136,0.4)]";
}

export function ActivityHeatmap() {
    const { lang } = useTranslation();
    const [log, setLog] = useState<ActivityLog>({});
    const days = getLast30Days();
    const totalExercises = Object.values(log).reduce((a, b) => a + b, 0);
    const activeDays = Object.values(log).filter((v) => v > 0).length;
    const dayLabels = lang === "fr" ? ["L", "M", "M", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setLog(JSON.parse(raw));
        } catch { /* ignore */ }
    }, []);

    // Pad to start on Monday
    const firstDay = new Date(days[0]);
    const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
    const padded = Array(startDow).fill(null).concat(days);

    // Split into weeks (columns of 7)
    const weeks: (string | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
    }

    return (
        <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-lyoko-green" />
                    <span className="font-display text-sm font-bold text-white">
                        {lang === "fr" ? "Activité" : "Activity"}
                    </span>
                    <span className="text-xs text-white/40">
                        {lang === "fr" ? "30 derniers jours" : "Last 30 days"}
                    </span>
                </div>
                <div className="flex gap-4 text-right text-xs text-white/40">
                    <span>
                        <span className="font-bold text-white">{totalExercises}</span>{" "}
                        {lang === "fr" ? (totalExercises !== 1 ? "exercices" : "exercice") : (totalExercises !== 1 ? "exercises" : "exercise")}
                    </span>
                    <span>
                        <span className="font-bold text-white">{activeDays}</span>{" "}
                        {lang === "fr" ? (activeDays !== 1 ? "jours actifs" : "jour actif") : (activeDays !== 1 ? "active days" : "active day")}
                    </span>
                </div>
            </div>

            <div className="flex gap-1">
                {/* Day labels column */}
                <div className="mr-1 flex flex-col gap-1">
                    {dayLabels.map((l, i) => (
                        <div key={i} className="flex h-4 w-4 items-center justify-center text-[0.55rem] text-white/20">
                            {i % 2 === 0 ? l : ""}
                        </div>
                    ))}
                </div>

                {/* Weeks */}
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) => {
                            if (!day) return <div key={di} className="h-4 w-4" />;
                            const count = log[day] || 0;
                            const isToday = day === getDateKey(new Date());
                            return (
                                <div
                                    key={di}
                                    title={lang === "fr" ? `${day}: ${count} exercice${count !== 1 ? "s" : ""}` : `${day}: ${count} exercise${count !== 1 ? "s" : ""}`}
                                    className={`h-4 w-4 rounded-sm border transition-all ${getIntensity(count)} ${isToday ? "ring-1 ring-lyoko-blue ring-offset-1 ring-offset-dark-surface" : ""}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-1.5 justify-end">
                <span className="text-[0.6rem] text-white/25">
                    {lang === "fr" ? "Moins" : "Less"}
                </span>
                {["bg-white/[0.04]", "bg-lyoko-blue/30", "bg-lyoko-blue/55", "bg-lyoko-green/60", "bg-lyoko-green"].map((cls, i) => (
                    <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
                ))}
                <span className="text-[0.6rem] text-white/25">
                    {lang === "fr" ? "Plus" : "More"}
                </span>
            </div>
        </div>
    );
}
