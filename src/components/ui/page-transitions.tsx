"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Star, type LucideIcon } from "lucide-react";

interface TransitionWrapperProps {
  children: React.ReactNode;
  transitionKey: string | number;
  type?: "slide" | "fade" | "flip" | "zoom" | "slideUp";
  duration?: number;
}

export function TransitionWrapper({
  children,
  transitionKey,
  type = "slide",
  duration = 300,
}: TransitionWrapperProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("show");
  const [key, setKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionKey !== key) {
      setPhase("exit");
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setKey(transitionKey);
        setPhase("enter");
        setTimeout(() => setPhase("show"), 50);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [transitionKey, children, duration, key]);

  const getTransform = () => {
    switch (type) {
      case "slide":
        return phase === "enter" ? "translateX(20px)" : phase === "exit" ? "translateX(-20px)" : "translateX(0)";
      case "slideUp":
        return phase === "enter" ? "translateY(20px)" : phase === "exit" ? "translateY(-20px)" : "translateY(0)";
      case "zoom":
        return phase === "enter" ? "scale(0.95)" : phase === "exit" ? "scale(1.05)" : "scale(1)";
      case "flip":
        return phase === "enter"
          ? "rotateY(-10deg) translateZ(-50px)"
          : phase === "exit"
            ? "rotateY(10deg) translateZ(-50px)"
            : "rotateY(0) translateZ(0)";
      default:
        return "none";
    }
  };

  return (
    <div
      style={{
        opacity: phase === "show" ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        perspective: type === "flip" ? "1000px" : "none",
      }}
    >
      {displayChildren}
    </div>
  );
}

// Loading skeleton with shimmer
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-white/5 overflow-hidden relative"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

// Progress bar with animated gradient
export function AnimatedProgress({
  value,
  max,
  color = "#00d4ff",
  showPercentage = true,
}: {
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-white/40">Progression</span>
        {showPercentage && (
          <span className="text-xs font-medium" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full relative transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 10px ${color}40`,
          }}
        >
          {/* Animated shimmer */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Celebration overlay for milestones
export function CelebrationOverlay({
  show,
  type = "milestone",
  onComplete,
}: {
  show: boolean;
  type?: "milestone" | "levelup" | "streak" | "achievement";
  onComplete?: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    if (show) {
      setPhase("enter");
      const t1 = setTimeout(() => setPhase("show"), 100);
      const t2 = setTimeout(() => setPhase("exit"), 2500);
      const t3 = setTimeout(() => onComplete?.(), 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [show, onComplete]);

  if (!show) return null;

  const config = {
    milestone: { icon: Star, color: "#fbbf24", text: "Objectif atteint !" },
    levelup: { icon: Zap, color: "#00d4ff", text: "Niveau supérieur !" },
    streak: { icon: Sparkles, color: "#ef4444", text: "Série incroyable !" },
    achievement: { icon: Star, color: "#a855f7", text: "Succès débloqué !" },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none"
      style={{
        opacity: phase === "enter" ? 0 : phase === "show" ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          transform:
            phase === "enter"
              ? "scale(0.5) translateY(50px)"
              : phase === "show"
                ? "scale(1) translateY(0)"
                : "scale(1.2) translateY(-50px)",
          opacity: phase === "show" ? 1 : 0,
          transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute -inset-20 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
          }}
        />

        {/* Icon */}
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full mb-4"
          style={{
            background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
            border: `3px solid ${config.color}`,
            boxShadow: `0 0 60px ${config.color}60`,
          }}
        >
          <Icon size={48} style={{ color: config.color }} />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: `2px dashed ${config.color}40`,
              animationDuration: "8s",
            }}
          />
        </div>

        {/* Text */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{
            color: config.color,
            textShadow: `0 0 30px ${config.color}60`,
          }}
        >
          {config.text}
        </h2>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${50 + Math.cos((i * Math.PI) / 6) * 150}px`,
                top: `${50 + Math.sin((i * Math.PI) / 6) * 150}px`,
                animation: `sparkle 1s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              <Sparkles size={16} style={{ color: config.color, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Animated counter
export function AnimatedCounter({
  value,
  duration = 1000,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

// Floating badges
export function FloatingBadges({ badges }: { badges: { icon: LucideIcon; color: string }[] }) {
  return (
    <div className="flex -space-x-2">
      {badges.map((badge, i) => {
        const Icon = badge.icon;
        return (
          <div
            key={i}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-dark-bg"
            style={{
              background: `linear-gradient(135deg, ${badge.color}30, ${badge.color}10)`,
              borderColor: badge.color,
              animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              zIndex: badges.length - i,
            }}
          >
            <Icon size={14} style={{ color: badge.color }} />
          </div>
        );
      })}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
