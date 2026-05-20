"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Flame, Crown, X, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

interface MilestonePopupProps {
    milestone: 25 | 50 | 75 | 100;
    moduleName: string;
    onClose: () => void;
    onContinue: () => void;
}

const MILESTONE_CONFIG = {
    25: {
        icon: Star,
        color: "#00d4ff",
        bg: "from-lyoko-blue/20 to-transparent",
        border: "border-lyoko-blue/30",
        shadow: "shadow-[0_0_40px_rgba(0,212,255,0.2)]",
        title: "Bon départ !",
        subtitle: "Tu progresses bien, continue !",
        emoji: "🌟",
    },
    50: {
        icon: Flame,
        color: "#00ff88",
        bg: "from-lyoko-green/20 to-transparent",
        border: "border-lyoko-green/30",
        shadow: "shadow-[0_0_40px_rgba(0,255,136,0.2)]",
        title: "À mi-chemin !",
        subtitle: "Impressionnant — t'es dans le bon rythme !",
        emoji: "🔥",
    },
    75: {
        icon: Trophy,
        color: "#a855f7",
        bg: "from-lyoko-purple/20 to-transparent",
        border: "border-lyoko-purple/30",
        shadow: "shadow-[0_0_40px_rgba(168,85,247,0.2)]",
        title: "Presque là !",
        subtitle: "Plus que 25% — tu es quasi-expert !",
        emoji: "🏆",
    },
    100: {
        icon: Crown,
        color: "#fbbf24",
        bg: "from-carthage-gold/20 to-transparent",
        border: "border-carthage-gold/30",
        shadow: "shadow-[0_0_60px_rgba(251,191,36,0.3)]",
        title: "MODULE COMPLÉTÉ !",
        subtitle: "Tu as maîtrisé ce module. Félicitations !",
        emoji: "👑",
    },
};

// Confetti particle
function Confetti({ color, delay, x }: { color: string; delay: number; x: number }) {
    return (
        <div
            className="pointer-events-none absolute top-0 h-2 w-2 rounded-sm"
            style={{
                left: `${x}%`,
                background: color,
                animation: `confettiFall 2s ${delay}s ease-in forwards`,
            }}
        />
    );
}

const CONFETTI_COLORS = ["#00d4ff", "#00ff88", "#a855f7", "#fbbf24", "#ff2244", "#ffffff"];

export function MilestonePopup({ milestone, moduleName, onClose, onContinue }: MilestonePopupProps) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const cfg = MILESTONE_CONFIG[milestone];
    const Icon = cfg.icon;

    const title = t(`exercises.milestone_${milestone}_title`);
    const subtitle = t(`exercises.milestone_${milestone}_subtitle`);

    const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.8,
        x: Math.random() * 100,
    }));

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {/* Inject confetti keyframes once */}
            <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
                onClick={onClose}
            >
                {/* Confetti layer */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {confettiPieces.map((p, i) => (
                        <Confetti key={i} {...p} />
                    ))}
                </div>

                {/* Card */}
                <div
                    className={`relative mx-4 w-full max-w-sm rounded-2xl border bg-dark-surface p-8 text-center transition-all duration-500 ${cfg.border} ${cfg.shadow}`}
                    style={{
                        transform: visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(40px)",
                        opacity: visible ? 1 : 0,
                        background: `linear-gradient(145deg, #0a1628, #050a18)`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 rounded-lg p-1 text-white/30 hover:bg-white/5 hover:text-white/60"
                    >
                        <X size={16} />
                    </button>

                    {/* Milestone badge */}
                    <div
                        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2"
                        style={{ borderColor: cfg.color, background: `${cfg.color}18`, color: cfg.color }}
                    >
                        <Icon size={36} />
                    </div>

                    {/* Percentage ring label */}
                    <div
                        className="mb-2 inline-block rounded-full px-4 py-1 text-lg font-extrabold"
                        style={{ background: `${cfg.color}20`, color: cfg.color }}
                    >
                        {cfg.emoji} {milestone}%
                    </div>

                    <h2 className="mb-1 font-display text-2xl font-extrabold text-white">{title}</h2>
                    <p className="mb-1 text-sm text-white/50">{moduleName}</p>
                    <p className="mb-6 text-sm text-white/70">{subtitle}</p>

                    {/* XP bonus for 100% */}
                    {milestone === 100 && (
                        <div className="mb-4 rounded-xl border border-carthage-gold/20 bg-carthage-gold/10 px-4 py-2 text-sm font-semibold text-carthage-gold">
                            {t("exercises.milestone_bonus")}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onContinue}
                            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-dark-bg transition-all hover:opacity-90 hover:shadow-lg"
                            style={{ background: cfg.color }}
                        >
                            {t("exercises.continue_btn")} <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-xs text-white/30 transition-colors hover:text-white/50"
                        >
                            {t("exercises.close_btn")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
