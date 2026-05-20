"use client";

import { useState, useEffect, useRef } from "react";
import { safeHtml } from "@/lib/sanitize";
import { Check, X, Clock, Zap, Sparkles, Trophy } from "lucide-react";
import { useSound } from "@/lib/sound-manager";
import { useTranslation } from "@/lib/translation-context";
import { triggerParticleBurst } from "./magic-effects";

interface QuizExercise {
  id: string;
  title: string;
  instruction?: string;
  content?: string;
  code_snippet?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
  hint?: string;
}

interface QuizViewEnhancedProps {
  exercise: QuizExercise;
  onComplete: () => void;
  goNext: () => void;
  isCompleted: boolean;
  onWrong?: () => void;
}

const QUIZ_TIME = 30;

export function QuizViewEnhanced({
  exercise,
  onComplete,
  goNext,
  isCompleted,
  onWrong,
}: QuizViewEnhancedProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const [showStreak, setShowStreak] = useState(false);
  const [shakeOption, setShakeOption] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { play } = useSound();
  const { t, lang } = useTranslation();

  // Reset on exercise change
  useEffect(() => {
    setSelected(null);
    setValidated(false);
    setIsCorrect(false);
    setTimeLeft(QUIZ_TIME);
    setTimerActive(!isCompleted);
    setShowStreak(false);
  }, [exercise, isCompleted]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || validated || isCompleted) return;

    if (timeLeft <= 0) {
      setTimerActive(false);
      setValidated(true);
      setIsCorrect(false);
      onWrong?.();
      play("error");
      setTimeout(() => {
        setValidated(false);
        setSelected(null);
        setTimeLeft(QUIZ_TIME);
        setTimerActive(true);
      }, 2000);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timerActive, validated, isCompleted, timeLeft, onWrong, play]);

  const handleSelect = (index: number) => {
    console.log("handleSelect called with index:", index, "validated:", validated, "isCompleted:", isCompleted);
    if (validated || isCompleted) return;
    try {
      play("quizSelect");
    } catch (e) {
      console.error("Sound error:", e);
    }
    setSelected(index);
    console.log("Selected set to:", index);
  };

  const handleValidate = () => {
    if (selected === null) return;

    setTimerActive(false);
    setValidated(true);
    const correct = selected === exercise.correct;
    setIsCorrect(correct);

    if (correct) {
      // Success animation
      const btn = buttonRefs.current[selected];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        triggerParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 40,
          colors: ["#00ff88", "#00d4ff", "#ffffff"],
          speed: 6,
        });
      }
      play("success");
      onComplete();
      setShowStreak(true);
      setTimeout(() => play("xp"), 300);
      setTimeout(() => goNext(), 1800);
    } else {
      // Wrong answer animation
      setShakeOption(selected);
      setTimeout(() => setShakeOption(null), 500);
      onWrong?.();
      play("error");
      setTimeout(() => {
        setValidated(false);
        setSelected(null);
        setTimeLeft(QUIZ_TIME);
        setTimerActive(true);
      }, 1500);
    }
  };

  const getTimeColor = () => {
    if (timeLeft <= 5) return "#ef4444";
    if (timeLeft <= 10) return "#f97316";
    if (timeLeft <= 20) return "#fbbf24";
    return "#00d4ff";
  };

  const timeColor = getTimeColor();

  return (
    <div className="mx-auto max-w-3xl animate-fadeIn">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base sm:text-xl font-bold text-white flex items-center gap-2 min-w-0">
          <span className="relative flex-shrink-0">
            <Zap size={20} className="text-carthage-gold" />
            <Sparkles
              size={10}
              className="absolute -top-1 -right-1 text-carthage-gold animate-pulse"
            />
          </span>
          <span className="truncate">{exercise.title}</span>
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Animated timer */}
          {!isCompleted && (
            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all"
              style={{
                borderColor: `${timeColor}40`,
                background: `${timeColor}15`,
                color: timeColor,
                boxShadow: timeLeft <= 10 ? `0 0 15px ${timeColor}40` : "none",
                animation: timeLeft <= 5 ? "timerPulse 0.5s ease-in-out infinite" : "none",
              }}
            >
              <Clock size={12} className={timeLeft <= 10 ? "animate-spin" : ""} />
              {timeLeft}s
            </div>
          )}
          <span className="rounded-md bg-carthage-gold/15 px-2.5 py-1 text-xs font-semibold text-carthage-gold">
            Quiz
          </span>
        </div>
      </div>

      {/* Animated timer bar */}
      {!isCompleted && (
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${(timeLeft / QUIZ_TIME) * 100}%`,
              background: `linear-gradient(90deg, ${timeColor}, ${timeColor}80)`,
              boxShadow: `0 0 10px ${timeColor}50`,
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "shimmer 2s linear infinite",
              }}
            />
          </div>
        </div>
      )}

      {/* Instruction */}
      {exercise.instruction && (
        <div className="mb-4 rounded-xl border border-carthage-gold/20 bg-carthage-gold/5 px-4 py-3 text-sm text-white/80">
          <span className="text-carthage-gold font-semibold">{t("exercises.question")}: </span>
          <span dangerouslySetInnerHTML={safeHtml(exercise.instruction)} />
        </div>
      )}

      {/* Content */}
      {exercise.content && (
        <div
          className="mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70"
          dangerouslySetInnerHTML={safeHtml(exercise.content)}
        />
      )}

      {/* Code snippet */}
      {exercise.code_snippet && (
        <pre className="mb-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-4">
          <code className="font-mono text-sm text-white/85">{exercise.code_snippet}</code>
        </pre>
      )}

      {/* Options */}
      <div className="mb-5 space-y-2.5">
        {(exercise.options || []).map((option, i) => {
          const isSelected = i === selected;
          const isCorrectOption = i === (exercise.correct || 0);
          const shouldShake = shakeOption === i;

          let buttonStyle: React.CSSProperties = {
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          };

          if (!validated && isSelected) {
            buttonStyle = {
              borderColor: "#fbbf24",
              background: "rgba(251,191,36,0.1)",
              boxShadow: "0 0 20px rgba(251,191,36,0.2)",
            };
          }

          if (validated) {
            if (isCorrectOption) {
              buttonStyle = {
                borderColor: "#00ff88",
                background: "rgba(0,255,136,0.15)",
                boxShadow: "0 0 25px rgba(0,255,136,0.3)",
              };
            } else if (isSelected && !isCorrect) {
              buttonStyle = {
                borderColor: "#ef4444",
                background: "rgba(239,68,68,0.1)",
                boxShadow: "0 0 20px rgba(239,68,68,0.2)",
              };
            }
          }

          return (
            <button
              key={i}
              ref={(el) => { buttonRefs.current[i] = el; }}
              onClick={() => handleSelect(i)}
              disabled={validated}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 ${
                shouldShake ? "animate-shake" : ""
              }`}
              style={buttonStyle}
            >
              {/* Letter badge */}
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  background: isSelected
                    ? validated
                      ? isCorrect
                        ? "#00ff88"
                        : "#ef4444"
                      : "#fbbf24"
                    : "rgba(255,255,255,0.06)",
                  color: isSelected ? "#000" : "rgba(255,255,255,0.5)",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>

              {/* Option text */}
              <span className="flex-1 text-white/80">{option}</span>

              {/* Status icon */}
              {validated && isCorrectOption && (
                <Check size={18} className="text-lyoko-green" />
              )}
              {validated && isSelected && !isCorrect && (
                <X size={18} className="text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Streak celebration */}
      {showStreak && isCorrect && (
        <div className="mb-4 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold animate-bounce"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#000",
              boxShadow: "0 0 30px rgba(251,191,36,0.5)",
            }}
          >
            <Trophy size={16} />
            {t("exercises.quiz_correct_xp")}
          </div>
        </div>
      )}

      {/* Validate button */}
      {!validated && (
        <div className="text-center">
          <button
            onClick={handleValidate}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-carthage-gold to-amber-500 px-8 py-3 text-sm font-bold text-dark-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            style={{
              boxShadow: selected !== null ? "0 0 20px rgba(251,191,36,0.3)" : "none",
            }}
          >
            <Check size={18} />
            {t("exercises.quiz_validate")}
          </button>
        </div>
      )}

      {/* Result message */}
      {validated && (
        <div
          className={`rounded-xl border p-4 text-sm animate-fadeIn ${
            isCorrect
              ? "border-lyoko-green/30 bg-lyoko-green/[0.08]"
              : "border-xana-red/30 bg-xana-red/[0.08]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isCorrect ? "bg-lyoko-green/20" : "bg-xana-red/20"
              }`}
            >
              {isCorrect ? (
                <Check size={18} className="text-lyoko-green" />
              ) : (
                <X size={18} className="text-xana-red" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${isCorrect ? "text-lyoko-green" : "text-xana-red"}`}>
                {isCorrect ? t("exercises.quiz_correct") : t("exercises.quiz_incorrect")}
              </p>
              {exercise.explanation && (
                <p className="mt-1 text-white/60 text-xs">{exercise.explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes timerPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
