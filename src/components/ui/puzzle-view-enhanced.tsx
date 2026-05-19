"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, Puzzle, RotateCcw, Sparkles, Zap, Lightbulb } from "lucide-react";
import { useSound } from "@/lib/sound-manager";
import { triggerParticleBurst } from "./magic-effects";

interface PuzzleExercise {
  id: string;
  title: string;
  description?: string;
  instruction?: string;
  pieces?: string[];
  hint?: string;
}

interface PuzzleViewEnhancedProps {
  exercise: PuzzleExercise;
  onComplete: () => void;
  goNext: () => void;
  isCompleted: boolean;
  onWrong?: () => void;
}

export function PuzzleViewEnhanced({
  exercise,
  onComplete,
  goNext,
  isCompleted,
  onWrong,
}: PuzzleViewEnhancedProps) {
  const [source, setSource] = useState<{ text: string; origIdx: number; id: number }[]>([]);
  const [target, setTarget] = useState<{ text: string; origIdx: number; id: number }[]>([]);
  const [result, setResult] = useState<"none" | "success" | "error">("none");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<"source" | "target" | null>(null);
  const [animatingPieces, setAnimatingPieces] = useState<Set<number>>(new Set());
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // Initialize shuffled pieces
  useEffect(() => {
    if (exercise.pieces) {
      const indexed = exercise.pieces.map((p, i) => ({ text: p, origIdx: i, id: Date.now() + i }));
      const shuffled = [...indexed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setSource(shuffled);
      setTarget([]);
      setResult("none");
    }
  }, [exercise]);

  const moveToTarget = (idx: number) => {
    if (result === "success") return;
    play("puzzlePlace");

    // Add animation
    const piece = source[idx];
    setAnimatingPieces((prev) => new Set(prev).add(piece.id));
    setTimeout(() => {
      setAnimatingPieces((prev) => {
        const next = new Set(prev);
        next.delete(piece.id);
        return next;
      });
    }, 300);

    setResult("none");
    setSource((prev) => prev.filter((_, i) => i !== idx));
    setTarget((prev) => [...prev, piece]);
  };

  const moveToSource = (idx: number) => {
    if (result === "success") return;
    play("puzzleRemove");

    const piece = target[idx];
    setAnimatingPieces((prev) => new Set(prev).add(piece.id));
    setTimeout(() => {
      setAnimatingPieces((prev) => {
        const next = new Set(prev);
        next.delete(piece.id);
        return next;
      });
    }, 300);

    setResult("none");
    setTarget((prev) => prev.filter((_, i) => i !== idx));
    setSource((prev) => [...prev, piece]);
  };

  const handleReset = () => {
    play("reset");
    if (exercise.pieces) {
      const indexed = exercise.pieces.map((p, i) => ({ text: p, origIdx: i, id: Date.now() + i }));
      const shuffled = [...indexed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setSource(shuffled);
      setTarget([]);
      setResult("none");
    }
  };

  const handleValidate = () => {
    const userTexts = target.map((p) => p.text);
    const correctTexts = exercise.pieces || [];
    const correct = JSON.stringify(userTexts) === JSON.stringify(correctTexts);

    if (correct) {
      // Success - trigger particles
      const targetRect = targetRef.current?.getBoundingClientRect();
      if (targetRect) {
        triggerParticleBurst(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2, {
          count: 50,
          colors: ["#a855f7", "#00d4ff", "#00ff88", "#ffffff"],
          speed: 6,
          spread: 1,
        });
      }
      play("success");
      setResult("success");
      onComplete();
      setTimeout(() => play("xp"), 300);
      setTimeout(() => goNext(), 1800);
    } else {
      onWrong?.();
      play("error");
      setResult("error");
      setTimeout(() => setResult("none"), 2000);
    }
  };

  const pieceBaseClass =
    "cursor-pointer select-none rounded-lg px-4 py-3 font-mono text-sm transition-all duration-200 min-h-[44px] sm:py-2.5 sm:min-h-0";

  const getPieceStyle = (
    piece: { text: string; origIdx: number; id: number },
    zone: "source" | "target"
  ): React.CSSProperties => {
    const isAnimating = animatingPieces.has(piece.id);

    if (zone === "source") {
      return {
        border: "1px solid rgba(168,85,247,0.3)",
        background: "rgba(168,85,247,0.1)",
        color: "rgba(255,255,255,0.8)",
        transform: isAnimating ? "scale(1.1) rotate(5deg)" : "scale(1)",
        boxShadow: isAnimating ? "0 0 20px rgba(168,85,247,0.3)" : "none",
      };
    }

    // Target zone styles
    if (result === "success") {
      return {
        border: "1px solid rgba(0,255,136,0.4)",
        background: "rgba(0,255,136,0.12)",
        color: "#00ff88",
        boxShadow: "0 0 15px rgba(0,255,136,0.2)",
        transform: isAnimating ? "scale(1.05)" : "scale(1)",
      };
    }

    if (result === "error") {
      return {
        border: "1px solid rgba(239,68,68,0.4)",
        background: "rgba(239,68,68,0.1)",
        color: "#ef4444",
        boxShadow: "0 0 15px rgba(239,68,68,0.2)",
        transform: isAnimating ? "scale(0.95)" : "scale(1)",
      };
    }

    return {
      border: "1px solid rgba(0,212,255,0.3)",
      background: "rgba(0,212,255,0.1)",
      color: "rgba(255,255,255,0.8)",
      transform: isAnimating ? "scale(1.1)" : "scale(1)",
      boxShadow: isAnimating ? "0 0 20px rgba(0,212,255,0.3)" : "none",
    };
  };

  return (
    <div className="mx-auto max-w-3xl animate-fadeIn">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base sm:text-xl font-bold text-white flex items-center gap-2 min-w-0">
          <span className="relative flex-shrink-0">
            <Puzzle size={20} className="text-lyoko-purple" />
            <Sparkles
              size={10}
              className="absolute -top-1 -right-1 text-lyoko-purple animate-pulse"
            />
          </span>
          <span className="truncate">{exercise.title}</span>
        </h2>
        <span className="rounded-md bg-lyoko-purple/15 px-2.5 py-1 text-xs font-semibold text-lyoko-purple">
          Puzzle
        </span>
      </div>

      {exercise.description && (
        <p className="mb-3 text-sm text-white/60">{exercise.description}</p>
      )}

      {/* Instruction */}
      {exercise.instruction && (
        <div className="mb-4 rounded-xl border border-lyoko-purple/20 bg-lyoko-purple/5 px-4 py-3 text-sm text-white/80 flex items-start gap-2">
          <Lightbulb size={16} className="text-lyoko-purple mt-0.5 flex-shrink-0" />
          <span>{exercise.instruction}</span>
        </div>
      )}

      {/* Source zone - available pieces */}
      <div className="mb-2 flex items-center gap-2">
        <Puzzle size={14} className="text-lyoko-purple" />
        <span className="text-xs text-white/40">Cliquez pour placer :</span>
        <span className="text-xs text-white/20">({source.length} restants)</span>
      </div>

      <div
        ref={sourceRef}
        className="mb-4 flex min-h-[80px] flex-wrap gap-2 rounded-xl border-2 border-dashed p-4 transition-all duration-300"
        style={{
          borderColor: hoveredZone === "source" ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)",
          background: hoveredZone === "source" ? "rgba(168,85,247,0.05)" : "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={() => setHoveredZone("source")}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {source.length === 0 && (
          <span className="w-full text-center text-xs text-white/20 py-4 italic">
            Tous les blocs ont été placés ✨
          </span>
        )}
        {source.map((piece, idx) => (
          <button
            key={`src-${piece.id}`}
            onClick={() => moveToTarget(idx)}
            className={`${pieceBaseClass} hover:-translate-y-0.5 hover:shadow-lg`}
            style={{
              ...getPieceStyle(piece, "source"),
              boxShadow: "0 4px 15px rgba(168,85,247,0.15)",
            }}
          >
            {piece.text}
          </button>
        ))}
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-1 text-white/20">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>

      {/* Target zone - user's answer */}
      <div className="mb-2 flex items-center gap-2">
        <Zap size={14} className="text-lyoko-blue" />
        <span className="text-xs text-white/40">Votre réponse (cliquez pour retirer) :</span>
        <span className="text-xs text-white/20">({target.length} placés)</span>
      </div>

      <div
        ref={targetRef}
        className="mb-4 flex min-h-[100px] flex-wrap gap-2 rounded-xl border-2 border-dashed p-4 transition-all duration-300"
        style={{
          borderColor:
            result === "success"
              ? "rgba(0,255,136,0.4)"
              : result === "error"
                ? "rgba(239,68,68,0.4)"
                : hoveredZone === "target"
                  ? "rgba(0,212,255,0.4)"
                  : "rgba(0,212,255,0.2)",
          background:
            result === "success"
              ? "rgba(0,255,136,0.05)"
              : result === "error"
                ? "rgba(239,68,68,0.05)"
                : hoveredZone === "target"
                  ? "rgba(0,212,255,0.05)"
                  : "rgba(0,212,255,0.02)",
          boxShadow:
            result === "success"
              ? "0 0 30px rgba(0,255,136,0.2)"
              : result === "error"
                ? "0 0 30px rgba(239,68,68,0.2)"
                : "none",
        }}
        onMouseEnter={() => setHoveredZone("target")}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {target.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-6 text-white/20">
            <Puzzle size={24} className="mb-2 opacity-30" />
            <span className="text-xs italic">Cliquez sur les blocs ci-dessus pour les placer ici</span>
          </div>
        )}
        {target.map((piece, idx) => (
          <button
            key={`tgt-${piece.id}`}
            onClick={() => moveToSource(idx)}
            className={`${pieceBaseClass} hover:-translate-y-0.5`}
            style={getPieceStyle(piece, "target")}
          >
            {piece.text}
          </button>
        ))}
      </div>

      {/* Result messages */}
      {result === "success" && (
        <div className="mb-4 rounded-xl border border-lyoko-green/40 bg-lyoko-green/10 p-4 text-center animate-successPulse">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lyoko-green/20">
              <Check size={24} className="text-lyoko-green" />
            </div>
          </div>
          <p className="text-lyoko-green font-bold text-lg">Puzzle résolu ! 🎉</p>
          <p className="text-lyoko-green/70 text-sm">+25 XP</p>
        </div>
      )}

      {result === "error" && (
        <div className="mb-4 rounded-xl border border-xana-red/40 bg-xana-red/10 p-4 animate-errorShake">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-xana-red/20">
              <X size={24} className="text-xana-red" />
            </div>
          </div>
          <p className="text-xana-red font-bold text-center">L&apos;ordre n&apos;est pas correct...</p>
          {exercise.hint && (
            <p className="text-white/50 text-sm text-center mt-2">💡 {exercise.hint}</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 transition-all hover:bg-white/5 hover:border-white/20 sm:py-2.5 sm:hover:-translate-y-0.5"
        >
          <RotateCcw size={16} />
          Réinitialiser
        </button>
        <button
          onClick={handleValidate}
          disabled={target.length === 0 || result === "success"}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lyoko-purple to-purple-600 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:hover:-translate-y-0.5"
          style={{
            boxShadow: target.length > 0 ? "0 0 20px rgba(168,85,247,0.3)" : "none",
          }}
        >
          <Check size={18} />
          Valider
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes successPulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.4);
          }
        }
        @keyframes errorShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-successPulse {
          animation: successPulse 1s ease-in-out infinite;
        }
        .animate-errorShake {
          animation: errorShake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
