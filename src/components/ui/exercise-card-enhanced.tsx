"use client";

import { useState, useRef } from "react";
import { Check, Lock, BookOpen, CircleDot, Puzzle, Code, Star, Sparkles } from "lucide-react";
import { triggerRipple } from "./magic-effects";

interface ExerciseCardProps {
  id: string;
  title: string;
  type?: "intro" | "quiz" | "puzzle" | "code";
  category?: string;
  isCompleted: boolean;
  isLocked?: boolean;
  isCurrent: boolean;
  progress?: number;
  onClick: () => void;
  color?: string;
  index: number;
}

const TYPE_CONFIG = {
  intro: {
    icon: BookOpen,
    label: "Introduction",
    gradient: "from-lyoko-blue to-blue-600",
    glowColor: "#00d4ff",
  },
  quiz: {
    icon: CircleDot,
    label: "Quiz",
    gradient: "from-carthage-gold to-amber-600",
    glowColor: "#fbbf24",
  },
  puzzle: {
    icon: Puzzle,
    label: "Puzzle",
    gradient: "from-lyoko-purple to-purple-600",
    glowColor: "#a855f7",
  },
  code: {
    icon: Code,
    label: "Code",
    gradient: "from-lyoko-green to-emerald-600",
    glowColor: "#00ff88",
  },
};

export function ExerciseCardEnhanced({
  id,
  title,
  type,
  category,
  isCompleted,
  isLocked = false,
  isCurrent,
  progress = 0,
  onClick,
  color = "#00d4ff",
  index,
}: ExerciseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const config = TYPE_CONFIG[type || "code"];
  const Icon = config.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) return;

    // Trigger ripple effect
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      triggerRipple(e.clientX, e.clientY, isCompleted ? "#00ff88" : color);
    }

    // Show sparkle
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 600);

    onClick();
  };

  const getCardStyles = () => {
    if (isLocked) {
      return {
        background: "linear-gradient(135deg, rgba(30,30,40,0.8), rgba(20,20,30,0.9))",
        borderColor: "rgba(255,255,255,0.05)",
        boxShadow: "none",
      };
    }

    if (isCompleted) {
      return {
        background: "linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,212,255,0.05))",
        borderColor: "rgba(0,255,136,0.3)",
        boxShadow: isHovered ? "0 0 30px rgba(0,255,136,0.2)" : "0 0 15px rgba(0,255,136,0.1)",
      };
    }

    if (isCurrent) {
      return {
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderColor: color,
        boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}10`,
      };
    }

    return {
      background: isHovered
        ? `linear-gradient(135deg, ${color}12, rgba(20,25,40,0.9))`
        : "linear-gradient(135deg, rgba(20,25,40,0.6), rgba(10,15,30,0.8))",
      borderColor: isHovered ? `${color}40` : "rgba(255,255,255,0.08)",
      boxShadow: isHovered ? `0 0 25px ${color}30` : "none",
    };
  };

  const styles = getCardStyles();

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={isLocked}
      className="relative w-full text-left transition-all duration-300 group"
      style={{
        transform: isPressed ? "scale(0.98)" : isHovered && !isLocked ? "scale(1.02) translateX(4px)" : "scale(1)",
        transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      }}
    >
      {/* Animated border glow */}
      {(isCurrent || (isHovered && !isLocked)) && !isCompleted && (
        <div
          className="absolute -inset-[1px] rounded-xl opacity-60"
          style={{
            background: `linear-gradient(90deg, ${color}00, ${color}60, ${color}00)`,
            backgroundSize: "200% 100%",
            animation: "borderGlow 2s linear infinite",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Card content */}
      <div
        className="relative flex items-center gap-3 rounded-xl border p-3 overflow-hidden"
        style={{
          ...styles,
          transition: "all 0.3s ease",
        }}
      >
        {/* Background decoration */}
        {!isLocked && (
          <div
            className="absolute right-0 top-0 h-full w-1/2 opacity-10"
            style={{
              background: `linear-gradient(90deg, transparent, ${color})`,
              transform: isHovered ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.5s ease",
            }}
          />
        )}

        {/* Icon container */}
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
          style={{
            background: isCompleted
              ? "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))"
              : isLocked
                ? "rgba(255,255,255,0.05)"
                : `linear-gradient(135deg, ${color}20, ${color}10)`,
            border: `1px solid ${isCompleted ? "rgba(0,255,136,0.3)" : isLocked ? "rgba(255,255,255,0.1)" : `${color}30`}`,
            boxShadow: isHovered && !isLocked ? `0 0 15px ${color}30` : "none",
            transition: "all 0.3s ease",
          }}
        >
          {isCompleted ? (
            <Check size={18} className="text-lyoko-green" />
          ) : isLocked ? (
            <Lock size={16} className="text-white/30" />
          ) : (
            <Icon size={16} style={{ color }} />
          )}

          {/* Sparkle animation */}
          {showSparkle && (
            <Sparkles
              size={20}
              className="absolute text-white animate-ping"
              style={{ animationDuration: "0.5s" }}
            />
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[0.7rem] font-medium uppercase tracking-wider"
              style={{ color: isCompleted ? "#00ff88" : isLocked ? "rgba(255,255,255,0.3)" : color }}
            >
              {config.label}
            </span>
            {isCurrent && (
              <span
                className="flex h-2 w-2 rounded-full animate-pulse"
                style={{ background: color, boxShadow: `0 0 10px ${color}` }}
              />
            )}
          </div>
          <p
            className="text-sm font-medium truncate transition-colors"
            style={{
              color: isCompleted ? "rgba(255,255,255,0.9)" : isLocked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
            }}
          >
            {title}
          </p>
        </div>

        {/* Progress indicator */}
        {!isCompleted && !isLocked && progress > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}80)`,
                }}
              />
            </div>
            <span className="text-[0.7rem] text-white/40">{progress}%</span>
          </div>
        )}

        {/* Completed badge */}
        {isCompleted && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-lyoko-green fill-lyoko-green" />
            <span className="text-xs text-lyoko-green font-medium">Fait</span>
          </div>
        )}

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-surface/50 backdrop-blur-[1px] rounded-xl">
            <span className="text-xs text-white/30">Verrouillé</span>
          </div>
        )}
      </div>

      {/* Hover shine effect */}
      {isHovered && !isLocked && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shine 0.6s ease-out forwards",
          }}
        />
      )}

      <style jsx>{`
        @keyframes borderGlow {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(200%);
          }
        }
      `}</style>
    </button>
  );
}

// Category header with animated gradient
export function CategoryHeader({ title, count, completed }: { title: string; count: number; completed: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const progress = count > 0 ? (completed / count) * 100 : 0;

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 group"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[0.75rem] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </span>
          <span className="text-[0.7rem] text-white/30">
            {completed}/{count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress bar */}
          <div className="h-1 w-16 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background:
                  progress === 100
                    ? "linear-gradient(90deg, #00ff88, #00d4ff)"
                    : "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.5))",
              }}
            />
          </div>
          <svg
            className={`w-3 h-3 text-white/30 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    </div>
  );
}
