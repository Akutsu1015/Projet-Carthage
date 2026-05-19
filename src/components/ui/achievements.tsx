"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import {
    Award, Lock, Star, Flame, Zap, Brain, Trophy, Compass,
    Target, Gem, Crown, Rocket, Shield, Sparkles, Heart,
} from "lucide-react";

/* ═══ ACHIEVEMENT DEFINITIONS ═══ */
interface AchievementDef {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    category: "progression" | "exploration" | "devotion";
    check: (ctx: CheckContext) => boolean;
}

interface CheckContext {
    totalExercises: number;
    xp: number;
    level: number;
    streak: number;
    modulesStarted: number;
    modulesCompleted: number;
    progress: Record<string, string[]>;
}

const ACHIEVEMENTS: AchievementDef[] = [
    // ── Progression ──
    {
        id: "first_step",
        title: "Premier Pas",
        description: "Complète ton premier exercice",
        icon: Star,
        color: "#00d4ff",
        category: "progression",
        check: (c) => c.totalExercises >= 1,
    },
    {
        id: "brain_connected",
        title: "Cerveau Connecté",
        description: "Complète 50 exercices",
        icon: Brain,
        color: "#00ff88",
        category: "progression",
        check: (c) => c.totalExercises >= 50,
    },
    {
        id: "diamond",
        title: "Diamant",
        description: "Complète 100 exercices",
        icon: Gem,
        color: "#a855f7",
        category: "progression",
        check: (c) => c.totalExercises >= 100,
    },
    {
        id: "warrior",
        title: "Guerrier de Lyoko",
        description: "Complète 250 exercices",
        icon: Shield,
        color: "#ff2244",
        category: "progression",
        check: (c) => c.totalExercises >= 250,
    },
    {
        id: "legend",
        title: "Légende Vivante",
        description: "Complète 500 exercices",
        icon: Crown,
        color: "#fbbf24",
        category: "progression",
        check: (c) => c.totalExercises >= 500,
    },
    // ── Exploration ──
    {
        id: "explorer",
        title: "Explorateur",
        description: "Essaye 3 modules différents",
        icon: Compass,
        color: "#00d4ff",
        category: "exploration",
        check: (c) => c.modulesStarted >= 3,
    },
    {
        id: "polyglot",
        title: "Polyglotte",
        description: "Essaye 5 modules différents",
        icon: Rocket,
        color: "#00ff88",
        category: "exploration",
        check: (c) => c.modulesStarted >= 5,
    },
    {
        id: "master_fullstack",
        title: "Maître Fullstack",
        description: "Essaye tous les modules web",
        icon: Sparkles,
        color: "#a855f7",
        category: "exploration",
        check: (c) => {
            const web = ["frontend", "javascript", "react", "nodejs"];
            return web.every((m) => (c.progress[m]?.length || 0) > 0);
        },
    },
    {
        id: "carthage_heir",
        title: "Héritier de Carthage",
        description: "50+ exercices dans un module",
        icon: Crown,
        color: "#fbbf24",
        category: "exploration",
        check: (c) => Object.values(c.progress).some((arr) => arr.length >= 50),
    },
    {
        id: "completionist",
        title: "Complétionniste",
        description: "Complète un module à 100%",
        icon: Trophy,
        color: "#fbbf24",
        category: "exploration",
        check: (c) => c.modulesCompleted >= 1,
    },
    // ── Devotion ──
    {
        id: "flame_spark",
        title: "Flamme Naissante",
        description: "Streak de 3 jours",
        icon: Flame,
        color: "#ff2244",
        category: "devotion",
        check: (c) => c.streak >= 3,
    },
    {
        id: "fire_walker",
        title: "Marcheur de Feu",
        description: "Streak de 7 jours",
        icon: Flame,
        color: "#ff6644",
        category: "devotion",
        check: (c) => c.streak >= 7,
    },
    {
        id: "inferno",
        title: "Inferno",
        description: "Streak de 30 jours",
        icon: Flame,
        color: "#fbbf24",
        category: "devotion",
        check: (c) => c.streak >= 30,
    },
    {
        id: "electric_shock",
        title: "Électrochoc",
        description: "Atteins 500 XP",
        icon: Zap,
        color: "#fbbf24",
        category: "devotion",
        check: (c) => c.xp >= 500,
    },
    {
        id: "champion",
        title: "Champion de Lyoko",
        description: "Atteins le niveau 10",
        icon: Trophy,
        color: "#a855f7",
        category: "devotion",
        check: (c) => c.level >= 10,
    },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    progression: { label: "Progression", color: "#00d4ff" },
    exploration: { label: "Exploration", color: "#00ff88" },
    devotion: { label: "Dévotion", color: "#fbbf24" },
};

const MODULE_LEVEL_MAP: Record<string, number> = {
    frontend: 250, javascript: 102, python: 120, csharp: 120,
    dart: 150, react: 120, nodejs: 120, cpp: 120,
};

function translateAchievement(id: string, defaultTitle: string, defaultDesc: string, lang: 'fr' | 'en') {
    if (lang === 'fr') return { title: defaultTitle, description: defaultDesc };
    
    const englishMap: Record<string, { title: string; description: string }> = {
        first_step: { title: "First Step", description: "Complete your first exercise" },
        brain_connected: { title: "Brain Connected", description: "Complete 50 exercises" },
        diamond: { title: "Diamond", description: "Complete 100 exercises" },
        warrior: { title: "Lyoko Warrior", description: "Complete 250 exercises" },
        legend: { title: "Living Legend", description: "Complete 500 exercises" },
        explorer: { title: "Explorer", description: "Try 3 different modules" },
        polyglot: { title: "Polyglot", description: "Try 5 different modules" },
        master_fullstack: { title: "Fullstack Master", description: "Try all web modules" },
        carthage_heir: { title: "Heir of Carthage", description: "50+ exercises in a single module" },
        completionist: { title: "Completionist", description: "Complete a module at 100%" },
        flame_spark: { title: "Rising Flame", description: "3-day streak" },
        fire_walker: { title: "Fire Walker", description: "7-day streak" },
        inferno: { title: "Inferno", description: "30-day streak" },
        electric_shock: { title: "Electric Shock", description: "Reach 500 XP" },
        champion: { title: "Lyoko Champion", description: "Reach level 10" },
    };
    
    return englishMap[id] || { title: defaultTitle, description: defaultDesc };
}

/* ═══ COMPONENT ═══ */
export function Achievements() {
    const { user } = useAuth();
    const { lang } = useTranslation();
    const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (!user) return;

        const totalExercises = Object.values(user.progress).reduce(
            (sum, arr) => sum + arr.length, 0
        );
        const modulesStarted = Object.keys(user.progress).filter(
            (k) => user.progress[k]?.length > 0
        ).length;
        const modulesCompleted = Object.entries(user.progress).filter(
            ([k, arr]) => MODULE_LEVEL_MAP[k] && arr.length >= MODULE_LEVEL_MAP[k]
        ).length;

        const ctx: CheckContext = {
            totalExercises,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            modulesStarted,
            modulesCompleted,
            progress: user.progress,
        };

        const ids = new Set<string>();
        for (const a of ACHIEVEMENTS) {
            if (a.check(ctx)) ids.add(a.id);
        }
        setUnlocked(ids);
    }, [user]);

    if (!user) return null;

    const sorted = [...ACHIEVEMENTS].sort((a, b) => {
        const aU = unlocked.has(a.id) ? 0 : 1;
        const bU = unlocked.has(b.id) ? 0 : 1;
        return aU - bU;
    });

    const displayed = showAll ? sorted : sorted.slice(0, 8);
    const unlockedCount = unlocked.size;

    // Group by category
    const categories = ["progression", "exploration", "devotion"] as const;

    const categoryLabels: Record<string, { label: string; color: string }> = {
        progression: { label: lang === "fr" ? "Progression" : "Progression", color: "#00d4ff" },
        exploration: { label: lang === "fr" ? "Exploration" : "Exploration", color: "#00ff88" },
        devotion: { label: lang === "fr" ? "Dévotion" : "Devotion", color: "#fbbf24" },
    };

    return (
        <div className="mb-8 rounded-2xl border border-carthage-gold/15 bg-gradient-to-br from-carthage-gold/[0.04] to-transparent">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-carthage-gold/15 px-5 py-3">
                <Award size={16} className="text-carthage-gold" />
                <span className="font-display text-sm font-bold text-carthage-gold">
                    {lang === "fr" ? "Trophées" : "Achievements"}
                </span>
                <span className="ml-auto rounded-full border border-carthage-gold/30 bg-carthage-gold/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-carthage-gold">
                    {unlockedCount}/{ACHIEVEMENTS.length}
                </span>
            </div>

            <div className="p-5">
                {showAll ? (
                    // Grouped view
                    <div className="space-y-5">
                        {categories.map((cat) => {
                            const items = ACHIEVEMENTS.filter((a) => a.category === cat);
                            const cfg = categoryLabels[cat];
                            return (
                                <div key={cat}>
                                    <h4
                                        className="mb-3 text-xs font-bold uppercase tracking-wider"
                                        style={{ color: cfg.color }}
                                    >
                                        {cfg.label}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                        {items.map((ach) => (
                                            <AchievementCard
                                                key={ach.id}
                                                achievement={ach}
                                                isUnlocked={unlocked.has(ach.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Flat preview
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {displayed.map((ach) => (
                            <AchievementCard
                                key={ach.id}
                                achievement={ach}
                                isUnlocked={unlocked.has(ach.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Toggle */}
                {ACHIEVEMENTS.length > 8 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="mt-4 w-full text-center text-xs font-medium text-carthage-gold/60 transition-colors hover:text-carthage-gold"
                    >
                        {showAll
                            ? (lang === "fr" ? "Voir moins" : "Show less")
                            : (lang === "fr" ? `Voir tous les trophées (${ACHIEVEMENTS.length})` : `Show all achievements (${ACHIEVEMENTS.length})`)}
                    </button>
                )}
            </div>
        </div>
    );
}

/* ═══ CARD ═══ */
function AchievementCard({
    achievement,
    isUnlocked,
}: {
    achievement: AchievementDef;
    isUnlocked: boolean;
}) {
    const { lang } = useTranslation();
    const { title, description } = translateAchievement(achievement.id, achievement.title, achievement.description, lang);
    const Icon = isUnlocked ? achievement.icon : Lock;

    return (
        <div
            className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${isUnlocked
                ? "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                : "border-white/[0.04] bg-white/[0.015] opacity-50"
                }`}
        >
            {/* Glow effect for unlocked */}
            {isUnlocked && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(circle at 50% 30%, ${achievement.color}12, transparent 70%)`,
                    }}
                />
            )}

            {/* Icon */}
            <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                    background: isUnlocked ? `${achievement.color}20` : "rgba(255,255,255,0.04)",
                    color: isUnlocked ? achievement.color : "rgba(255,255,255,0.2)",
                }}
            >
                <Icon size={18} />
            </div>

            <span className="text-[0.7rem] font-semibold leading-tight text-white">
                {title}
            </span>
            <span className="text-[0.6rem] leading-tight text-white/40">
                {description}
            </span>
        </div>
    );
}
