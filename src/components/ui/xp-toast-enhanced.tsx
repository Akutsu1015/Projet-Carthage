"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, Flame, Trophy, Star, Crown, Sparkles, type LucideIcon } from "lucide-react";
import { triggerParticleBurst } from "./magic-effects";

export interface XpToastData {
  id: number;
  amount: number;
  combo?: number;
  label?: string;
  isMilestone?: boolean;
  milestoneType?: "streak" | "level" | "achievement";
}

interface Props {
  toasts: XpToastData[];
  onRemove: (id: number) => void;
}

const COMBO_COLORS = {
  1: { bg: "#00ff88", border: "#00ff88", glow: "rgba(0,255,136,0.5)" },
  2: { bg: "#fbbf24", border: "#fbbf24", glow: "rgba(251,191,36,0.5)" },
  3: { bg: "#f97316", border: "#f97316", glow: "rgba(249,115,22,0.5)" },
  4: { bg: "#ef4444", border: "#ef4444", glow: "rgba(239,68,68,0.6)" },
  5: { bg: "#a855f7", border: "#a855f7", glow: "rgba(168,85,247,0.6)" },
  6: { bg: "#ec4899", border: "#ec4899", glow: "rgba(236,72,153,0.6)" },
};

function getComboColor(combo: number) {
  const maxCombo = Math.max(...Object.keys(COMBO_COLORS).map(Number));
  return COMBO_COLORS[Math.min(combo, maxCombo) as keyof typeof COMBO_COLORS] || COMBO_COLORS[1];
}

function SingleToast({ toast, onRemove }: { toast: XpToastData; onRemove: () => void }) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");
  const [shake, setShake] = useState(false);

  const combo = toast.combo || 1;
  const isCombo = combo > 1;
  const colors = getComboColor(combo);

  useEffect(() => {
    // Enter animation
    const t1 = setTimeout(() => setPhase("show"), 50);
    // Trigger shake for combo
    if (isCombo) {
      const tShake = setTimeout(() => setShake(true), 100);
      const tStopShake = setTimeout(() => setShake(false), 600);
    }
    // Trigger particle burst
    const tParticles = setTimeout(() => {
      const rect = document.getElementById(`toast-${toast.id}`)?.getBoundingClientRect();
      if (rect) {
        triggerParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 20 + combo * 5,
          colors: [colors.bg, "#ffffff", colors.border],
          speed: 3 + combo,
          spread: 0.8,
        });
      }
    }, 100);
    // Exit
    const t2 = setTimeout(() => setPhase("exit"), 2000 + combo * 300);
    const t3 = setTimeout(() => onRemove(), 2500 + combo * 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tParticles);
    };
  }, [toast.id, isCombo, combo, colors, onRemove]);

  const getIcon = () => {
    if (toast.milestoneType === "streak") return <Flame size={18} />;
    if (toast.milestoneType === "level") return <Crown size={18} />;
    if (toast.milestoneType === "achievement") return <Trophy size={18} />;
    if (isCombo && combo >= 5) return <Crown size={18} />;
    if (isCombo) return <Flame size={18} />;
    if (toast.isMilestone) return <Star size={18} />;
    return <Zap size={18} />;
  };

  return (
    <div
      id={`toast-${toast.id}`}
      className={`relative flex flex-col items-center gap-1 ${shake ? "animate-shake" : ""}`}
      style={{
        opacity: phase === "enter" ? 0 : phase === "show" ? 1 : 0,
        transform:
          phase === "enter"
            ? "translateY(30px) scale(0.5)"
            : phase === "show"
              ? "translateY(0) scale(1)"
              : "translateY(-20px) scale(0.8)",
        transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          transform: "scale(1.5)",
          opacity: phase === "show" ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Combo badge */}
      {isCombo && (
        <div
          className="relative z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${colors.bg}30, ${colors.bg}10)`,
            border: `1px solid ${colors.border}50`,
            color: colors.bg,
            boxShadow: `0 0 20px ${colors.glow}`,
            animation: "comboPulse 0.5s ease-in-out",
          }}
        >
          <Flame size={12} className="animate-pulse" />
          COMBO ×{combo}
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: "2s" }} />
        </div>
      )}

      {/* Main toast */}
      <div
        className="relative z-10 flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, rgba(10,16,28,0.95), rgba(5,10,24,0.98))`,
          borderColor: colors.border,
          color: colors.bg,
          boxShadow: `0 0 30px ${colors.glow}, inset 0 0 20px ${colors.glow}20`,
        }}
      >
        <span
          style={{
            filter: `drop-shadow(0 0 8px ${colors.bg})`,
            animation: "iconGlow 1s ease-in-out infinite alternate",
          }}
        >
          {getIcon()}
        </span>
        <span>+{toast.amount} XP</span>
        {toast.label && (
          <span className="text-xs font-normal opacity-70 ml-1">{toast.label}</span>
        )}
      </div>

      {/* Particle burst placeholder - actual particles are rendered by ParticleCanvas */}

      <style jsx>{`
        @keyframes comboPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes iconGlow {
          from {
            filter: drop-shadow(0 0 4px ${colors.bg});
          }
          to {
            filter: drop-shadow(0 0 12px ${colors.bg});
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-3px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(3px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export function XpToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 flex-col-reverse items-center gap-2">
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

// Streak indicator component
export function StreakIndicator({ streak, isFrozen = false }: { streak: number; isFrozen?: boolean }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(t);
  }, [streak]);

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold transition-all ${
        isFrozen
          ? "bg-lyoko-blue/20 border-lyoko-blue/40 text-lyoko-blue"
          : streak > 10
            ? "bg-xana-red/20 border-xana-red/40 text-xana-red"
            : streak > 5
              ? "bg-carthage-gold/20 border-carthage-gold/40 text-carthage-gold"
              : "bg-lyoko-green/20 border-lyoko-green/40 text-lyoko-green"
      } border`}
      style={{
        boxShadow: animate
          ? isFrozen
            ? "0 0 30px rgba(0,212,255,0.5)"
            : streak > 10
              ? "0 0 30px rgba(255,34,68,0.5)"
              : "0 0 30px rgba(0,255,136,0.5)"
          : "none",
        transition: "box-shadow 0.5s ease-out",
        animation: animate ? "streakBounce 0.5s ease-out" : "none",
      }}
    >
      <Flame
        size={16}
        className={isFrozen ? "text-lyoko-blue" : streak > 10 ? "text-xana-red" : streak > 5 ? "text-carthage-gold" : "text-lyoko-green"}
        style={{
          animation: isFrozen ? "freezeShake 2s ease-in-out infinite" : "flameFlicker 0.5s ease-in-out infinite alternate",
        }}
      />
      <span>{isFrozen ? "FREEZE!" : `${streak} Jours`}</span>

      <style jsx>{`
        @keyframes streakBounce {
          0%,
          100% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.2);
          }
          60% {
            transform: scale(0.9);
          }
        }
        @keyframes flameFlicker {
          from {
            transform: scale(1) rotate(-5deg);
            opacity: 1;
          }
          to {
            transform: scale(1.2) rotate(5deg);
            opacity: 0.8;
          }
        }
        @keyframes freezeShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px) rotate(-5deg);
          }
          75% {
            transform: translateX(2px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}

// Achievement unlock toast
export function AchievementToast({
  title,
  description,
  icon: Icon,
  onClose,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 50);
    const t2 = setTimeout(() => setPhase("exit"), 4000);
    const t3 = setTimeout(onClose, 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onClose]);

  return (
    <div
      className="fixed right-4 top-4 z-[300] max-w-sm"
      style={{
        opacity: phase === "enter" ? 0 : phase === "show" ? 1 : 0,
        transform:
          phase === "enter"
            ? "translateX(100px)"
            : phase === "show"
              ? "translateX(0)"
              : "translateX(100px)",
        transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-carthage-gold/40 bg-dark-surface/95 p-4 backdrop-blur-sm"
        style={{
          boxShadow: "0 0 40px rgba(251,191,36,0.3), inset 0 0 20px rgba(251,191,36,0.1)",
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            animation: "shine 2s ease-in-out infinite",
          }}
        />

        <div className="relative flex items-start gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 0 20px rgba(251,191,36,0.5)",
            }}
          >
            <Icon size={24} className="text-dark-bg" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-carthage-gold">Succès débloqué !</h4>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-white/60">{description}</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(200%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
