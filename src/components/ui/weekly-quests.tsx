"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Swords, Check, Flame, BookOpen, Zap, Target } from "lucide-react";

/* ═══ TYPES ═══ */
interface Quest {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    target: number;
    current: number;
    xpReward: number;
    completed: boolean;
}

/* ═══ HELPERS ═══ */
function getWeekKey() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getWeekSeed() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.floor((now.getTime() - start.getTime()) / (7 * 86400000));
}

/* ═══ QUEST TEMPLATES ═══ */
const QUEST_TEMPLATES = [
    {
        id: "exercises",
        title: "Machine de Guerre",
        description: "exercices cette semaine",
        icon: BookOpen,
        color: "#00d4ff",
        targets: [10, 15, 20, 25],
        xpReward: 150,
        getProgress: (log: Record<string, number>) => {
            const now = new Date();
            const monday = new Date(now);
            monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
            monday.setHours(0, 0, 0, 0);
            let total = 0;
            for (const [dateStr, count] of Object.entries(log)) {
                if (new Date(dateStr) >= monday) total += count;
            }
            return total;
        },
    },
    {
        id: "streak",
        title: "Flamme Éternelle",
        description: "jours de streak consécutifs",
        icon: Flame,
        color: "#ff2244",
        targets: [3, 5, 7],
        xpReward: 200,
        getProgress: (_log: Record<string, number>, streak: number) => streak,
    },
    {
        id: "xp",
        title: "Chasseur d'XP",
        description: "XP gagnés cette semaine",
        icon: Zap,
        color: "#fbbf24",
        targets: [300, 500, 750, 1000],
        xpReward: 100,
        getProgress: (log: Record<string, number>) => {
            const now = new Date();
            const monday = new Date(now);
            monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
            monday.setHours(0, 0, 0, 0);
            let total = 0;
            for (const [dateStr, count] of Object.entries(log)) {
                if (new Date(dateStr) >= monday) total += count * 25; // ~25 XP per exercise
            }
            return total;
        },
    },
    {
        id: "modules",
        title: "Explorateur",
        description: "modules différents pratiqués",
        icon: Target,
        color: "#a855f7",
        targets: [2, 3, 4],
        xpReward: 250,
        getProgress: (_log: Record<string, number>, _streak: number, progress: Record<string, string[]>) => {
            return Object.keys(progress).filter((k) => progress[k]?.length > 0).length;
        },
    },
];

/* ═══ COMPONENT ═══ */
export function WeeklyQuests() {
    const { user } = useAuth();
    const [quests, setQuests] = useState<Quest[]>([]);
    const weekKey = getWeekKey();
    const storageKey = `weekly_quests_${weekKey}`;

    useEffect(() => {
        if (!user) return;

        // Read activity log
        let log: Record<string, number> = {};
        try {
            const raw = localStorage.getItem("activity_log_v1");
            if (raw) log = JSON.parse(raw);
        } catch { /* ignore */ }

        // Read completed quests for this week
        let completedIds: string[] = [];
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) completedIds = JSON.parse(raw);
        } catch { /* ignore */ }

        // Use week seed for deterministic target selection
        const seed = getWeekSeed();

        const built: Quest[] = QUEST_TEMPLATES.map((tmpl, i) => {
            const targetIdx = (seed + i) % tmpl.targets.length;
            const target = tmpl.targets[targetIdx];
            const current = tmpl.getProgress(log, user.streak, user.progress);
            const completed = completedIds.includes(tmpl.id) || current >= target;

            // Auto-mark as completed in storage
            if (current >= target && !completedIds.includes(tmpl.id)) {
                completedIds.push(tmpl.id);
                try {
                    localStorage.setItem(storageKey, JSON.stringify(completedIds));
                } catch { /* ignore */ }
            }

            return {
                id: tmpl.id,
                title: tmpl.title,
                description: `${target} ${tmpl.description}`,
                icon: tmpl.icon,
                color: tmpl.color,
                target,
                current: Math.min(current, target),
                xpReward: tmpl.xpReward,
                completed,
            };
        });

        setQuests(built);
    }, [user, storageKey]);

    const completedCount = quests.filter((q) => q.completed).length;

    if (!user || quests.length === 0) return null;

    return (
        <div className="mb-8 overflow-hidden rounded-2xl border border-lyoko-purple/20 bg-gradient-to-br from-lyoko-purple/[0.06] to-transparent">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-lyoko-purple/15 px-5 py-3">
                <Swords size={16} className="text-lyoko-purple" />
                <span className="font-display text-sm font-bold text-lyoko-purple">
                    Quêtes Hebdomadaires
                </span>
                <span className="ml-auto rounded-full border border-lyoko-purple/30 bg-lyoko-purple/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-lyoko-purple">
                    {completedCount}/{quests.length}
                </span>
            </div>

            {/* Quest list */}
            <div className="divide-y divide-white/[0.04]">
                {quests.map((quest) => {
                    const Icon = quest.icon;
                    const pct = quest.target > 0 ? Math.round((quest.current / quest.target) * 100) : 0;

                    return (
                        <div
                            key={quest.id}
                            className={`flex items-center gap-4 px-5 py-3.5 transition-all ${quest.completed ? "opacity-60" : ""}`}
                        >
                            {/* Icon */}
                            <div
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
                                style={{
                                    background: `${quest.color}15`,
                                    borderColor: `${quest.color}30`,
                                    color: quest.completed ? "#4ade80" : quest.color,
                                }}
                            >
                                {quest.completed ? <Check size={20} /> : <Icon size={20} />}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <div className="mb-0.5 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-white">
                                        {quest.title}
                                    </h4>
                                    <span
                                        className="rounded-full border px-2 py-0.5 text-[0.6rem] font-bold"
                                        style={{
                                            background: `${quest.color}12`,
                                            borderColor: `${quest.color}25`,
                                            color: quest.color,
                                        }}
                                    >
                                        +{quest.xpReward} XP
                                    </span>
                                </div>
                                <p className="mb-1.5 text-xs text-white/40">
                                    {quest.description}
                                </p>

                                {/* Progress bar */}
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${pct}%`,
                                                background: quest.completed
                                                    ? "#4ade80"
                                                    : `linear-gradient(90deg, ${quest.color}, ${quest.color}88)`,
                                                boxShadow: quest.completed
                                                    ? "0 0 8px rgba(74,222,128,0.4)"
                                                    : `0 0 8px ${quest.color}40`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[0.6rem] font-mono text-white/30">
                                        {quest.current}/{quest.target}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
