"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/sound-manager";
// Register exercise data — Frontend (250 exercises)
import "@/lib/exercises/frontend-part1";
import "@/lib/exercises/frontend-part2";
import "@/lib/exercises/frontend-part3";
import "@/lib/exercises/frontend-part4";
import "@/lib/exercises/frontend-part5";
// JavaScript (102 exercises)
import "@/lib/exercises/javascript-part1";
import "@/lib/exercises/javascript-part2";
import "@/lib/exercises/javascript-part3";
import "@/lib/exercises/javascript-part4";
// Python (120 exercises)
import "@/lib/exercises/python-part1";
import "@/lib/exercises/python-part2";
import "@/lib/exercises/python-part3";
import "@/lib/exercises/python-part4";
import "@/lib/exercises/python-part5";
// Dart (150 exercises)
import "@/lib/exercises/dart-part1";
import "@/lib/exercises/dart-part2";
import "@/lib/exercises/dart-part3";
import "@/lib/exercises/dart-part4";
import "@/lib/exercises/dart-part5";
// React (150 exercises)
import "@/lib/exercises/react-part1";
import "@/lib/exercises/react-part2";
import "@/lib/exercises/react-part3";
import "@/lib/exercises/react-part4";
import "@/lib/exercises/react-part5";
// Node.js (150 exercises)
import "@/lib/exercises/nodejs-part1";
import "@/lib/exercises/nodejs-part2";
import "@/lib/exercises/nodejs-part3";
import "@/lib/exercises/nodejs-part4";
import "@/lib/exercises/nodejs-part5";
// C/C++ (150 exercises)
import "@/lib/exercises/cpp-part1";
import "@/lib/exercises/cpp-part2";
import "@/lib/exercises/cpp-part3";
import "@/lib/exercises/cpp-part4";
import "@/lib/exercises/cpp-part5";
// C# .NET (150 exercises)
import "@/lib/exercises/csharp-part1";
import "@/lib/exercises/csharp-part2";
import "@/lib/exercises/csharp-part3";
import "@/lib/exercises/csharp-part4";
import "@/lib/exercises/csharp-part5";
import {
  ChevronLeft, ChevronRight, Search, Check, X, HelpCircle,
  BookOpen, Code, Puzzle, CircleDot, Play, RotateCcw, Lock,
  Monitor, Smartphone, TerminalSquare, Eye, EyeOff, Maximize2, Minimize2,
  RefreshCw, Sun, Moon, RotateCw,
} from "lucide-react";
import JeremyChatbot from "@/components/jeremy-chatbot";
import { flexNormalize, flexContains } from "@/lib/flexible-compare";

/* ═══ MODULE CATEGORIES ═══ */
const VISUAL_MODULES = ["frontend", "javascript", "react"];
const MOBILE_MODULES = ["dart"];
const TERMINAL_MODULES = ["nodejs", "python", "cpp"];

/* ═══ TYPES ═══ */
export interface Exercise {
  id: string;
  type?: "intro" | "quiz" | "puzzle" | "code";
  category?: string;
  title: string;
  description?: string;
  content?: string;
  code_example?: string;
  language?: string;
  // quiz
  options?: string[];
  correct?: number;
  explanation?: string;
  instruction?: string;
  // puzzle
  pieces?: string[];
  hint?: string;
  // code
  code_template?: string;
  solution?: string;
  tests?: { type?: string; expected?: string; message?: string; input?: string; expected_output?: string; [k: string]: unknown }[];
  help_steps?: string[];
  preview?: string;
  // Allow extra properties from original exercise data
  [key: string]: unknown;
}

interface Props {
  moduleId: string;
  moduleName: string;
  moduleColor: string;
  moduleLevels: number;
}

const TYPE_ICONS: Record<string, React.ElementType> = { intro: BookOpen, quiz: CircleDot, puzzle: Puzzle, code: Code };

/* ═══ COMPONENT ═══ */
export function ExerciseClient({ moduleId, moduleName, moduleColor, moduleLevels }: Props) {
  const { user, updateProgress, addXp } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [helpLevel, setHelpLevel] = useState(0);

  // Load exercises from registry or props
  useEffect(() => {
    async function load() {
      const { getExercises } = await import("@/lib/exercises");
      const data = getExercises(moduleId);
      if (data.length > 0) {
        setExercises(data);
      }
    }
    load();

    // Load completed
    try {
      const c = JSON.parse(localStorage.getItem(`${moduleId}_completed_exercises`) || "[]");
      setCompleted(new Set(c));
    } catch { /* empty */ }
  }, [moduleId]);

  // Persist completed
  useEffect(() => {
    if (completed.size > 0) {
      localStorage.setItem(`${moduleId}_completed_exercises`, JSON.stringify([...completed]));
    }
  }, [completed, moduleId]);

  const rawExercise = exercises[currentIdx];
  // Normalize: default type to 'code' and category to 'Général' if missing
  const exercise = rawExercise ? { ...rawExercise, type: rawExercise.type || 'code' as const, category: rawExercise.category || 'Général' } : rawExercise;

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Side effects outside the state updater to avoid setState-during-render
    if (!completed.has(id)) {
      updateProgress(moduleId, id);
      addXp(25);
    }
  }, [moduleId, updateProgress, addXp, completed]);

  const { play } = useSound();

  const goNext = useCallback(() => {
    if (currentIdx < exercises.length - 1) {
      play("transition");
      setCurrentIdx(currentIdx + 1);
      setHelpLevel(0);
    }
  }, [currentIdx, exercises.length, play]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      play("navigate");
      setCurrentIdx(currentIdx - 1);
      setHelpLevel(0);
    }
  }, [currentIdx, play]);

  // Group exercises by category
  const categories = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const cat = ex.category || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ex);
    return acc;
  }, {});

  const filtered = search
    ? exercises.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`flex-shrink-0 overflow-y-auto border-r border-white/5 bg-dark-surface transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: moduleColor }} />
            <h2 className="font-display text-sm font-bold text-white">{moduleName}</h2>
          </div>
          <p className="mb-3 text-xs text-white/40">{completed.size}/{exercises.length} complétés</p>
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full transition-all" style={{ width: exercises.length ? `${(completed.size / exercises.length) * 100}%` : "0%", background: moduleColor }} />
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
            />
          </div>

          {/* Exercise list */}
          {filtered ? (
            <div className="space-y-1">
              {filtered.map((ex) => (
                <SidebarItem key={ex.id} ex={ex} isCurrent={ex.id === exercise?.id} isCompleted={completed.has(ex.id)} onClick={() => { setCurrentIdx(exercises.indexOf(ex)); setSearch(""); setHelpLevel(0); }} color={moduleColor} />
              ))}
              {filtered.length === 0 && <p className="py-4 text-center text-xs text-white/30">Aucun résultat</p>}
            </div>
          ) : (
            Object.entries(categories).map(([cat, exs]) => (
              <div key={cat} className="mb-3">
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white/30">{cat}</p>
                <div className="space-y-0.5">
                  {exs.map((ex) => (
                    <SidebarItem key={ex.id} ex={ex} isCurrent={ex.id === exercise?.id} isCompleted={completed.has(ex.id)} onClick={() => { setCurrentIdx(exercises.indexOf(ex)); setHelpLevel(0); }} color={moduleColor} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-dark-bg px-4 py-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white/70">
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          <span className="flex-1 text-sm font-medium text-white/80">{exercise?.title || "Chargement..."}</span>
          <div className="flex items-center gap-1">
            <button onClick={goPrev} disabled={currentIdx === 0} className="rounded p-1 text-white/40 hover:bg-white/5 disabled:opacity-20">
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[60px] text-center text-xs text-white/40">{currentIdx + 1}/{exercises.length}</span>
            <button onClick={goNext} disabled={currentIdx >= exercises.length - 1} className="rounded p-1 text-white/40 hover:bg-white/5 disabled:opacity-20">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!exercise ? (
            <EmptyState moduleName={moduleName} moduleLevels={moduleLevels} />
          ) : exercise.type === "intro" ? (
            <IntroView ex={exercise} onComplete={() => { markComplete(exercise.id); goNext(); }} isCompleted={completed.has(exercise.id)} />
          ) : exercise.type === "quiz" ? (
            <QuizView ex={exercise} onComplete={() => markComplete(exercise.id)} goNext={goNext} isCompleted={completed.has(exercise.id)} />
          ) : exercise.type === "puzzle" ? (
            <PuzzleView ex={exercise} onComplete={() => markComplete(exercise.id)} goNext={goNext} isCompleted={completed.has(exercise.id)} />
          ) : (
            <CodeView ex={exercise} onComplete={() => markComplete(exercise.id)} goNext={goNext} isCompleted={completed.has(exercise.id)} helpLevel={helpLevel} setHelpLevel={setHelpLevel} moduleId={moduleId} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function SidebarItem({ ex, isCurrent, isCompleted, onClick, color }: {
  ex: Exercise; isCurrent: boolean; isCompleted: boolean; onClick: () => void; color: string;
}) {
  const Icon = TYPE_ICONS[ex.type || "code"] || Code;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-all ${
        isCurrent ? "border border-white/10 bg-white/8 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      {isCompleted ? (
        <Check size={13} className="flex-shrink-0 text-lyoko-green" />
      ) : (
        <Icon size={13} className="flex-shrink-0" style={{ color }} />
      )}
      <span className="truncate">{ex.title}</span>
    </button>
  );
}

function EmptyState({ moduleName, moduleLevels }: { moduleName: string; moduleLevels: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <BookOpen className="mb-4 h-16 w-16 text-white/10" />
      <h2 className="mb-2 font-display text-xl font-bold text-white/60">Module {moduleName}</h2>
      <p className="mb-4 max-w-md text-sm text-white/40">
        {moduleLevels} exercices interactifs. Les données d&apos;exercices sont en cours de chargement.
        Assurez-vous que les fichiers de données du module sont correctement importés.
      </p>
      <p className="text-xs text-white/25">
        Tip : Les exercices seront chargés depuis les fichiers JavaScript existants du projet.
      </p>
    </div>
  );
}

function IntroView({ ex, onComplete, isCompleted }: { ex: Exercise; onComplete: () => void; isCompleted: boolean }) {
  const [done, setDone] = useState(false);
  const { play } = useSound();

  useEffect(() => { setDone(false); }, [ex]);

  const handleContinue = () => {
    play("intro");
    onComplete();
    setDone(true);
    setTimeout(() => play("xp"), 300);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">
          <BookOpen size={18} className="mr-2 inline text-lyoko-blue" />
          {ex.title}
        </h2>
        <span className="rounded-md bg-lyoko-blue/15 px-2.5 py-1 text-xs font-semibold text-lyoko-blue">Introduction</span>
      </div>
      {ex.description && <p className="mb-4 text-sm text-white/60">{ex.description}</p>}

      {/* Content */}
      {ex.content && (
        <div
          className="intro-content mb-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-[0.92rem] leading-[1.8] text-white/80"
          dangerouslySetInnerHTML={{ __html: ex.content }}
        />
      )}

      {/* Code example */}
      {ex.code_example && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-medium text-white/50">
            <Code size={14} className="mr-1 inline" /> Exemple :
          </h3>
          <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-[#0d0d1a] p-4">
            <code className="font-mono text-sm text-white/85">{ex.code_example}</code>
          </pre>
        </div>
      )}

      {/* Continue button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          className={`inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition-all ${
            done || isCompleted
              ? "border border-lyoko-green/30 bg-lyoko-green/10 text-lyoko-green"
              : "bg-lyoko-blue text-white shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
          }`}
        >
          {done || isCompleted ? <><Check size={16} /> Section lue ! +25 XP</> : <><Check size={16} /> J&apos;ai compris, continuer !</>}
        </button>
      </div>
    </div>
  );
}

function QuizView({ ex, onComplete, goNext, isCompleted }: { ex: Exercise; onComplete: () => void; goNext: () => void; isCompleted: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { play } = useSound();

  // Reset on exercise change
  useEffect(() => { setSelected(null); setValidated(false); setIsCorrect(false); }, [ex]);

  const handleSelect = (i: number) => {
    if (validated) return;
    play("quizSelect");
    setSelected(i);
  };

  const handleValidate = () => {
    if (selected === null) return;
    setValidated(true);
    const correct = selected === ex.correct;
    setIsCorrect(correct);
    if (correct) {
      play("success");
      onComplete();
      setTimeout(() => play("xp"), 300);
      setTimeout(() => goNext(), 1500);
    } else {
      play("error");
      setTimeout(() => {
        setValidated(false);
        setSelected(null);
        setIsCorrect(false);
      }, 1500);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">
          <CircleDot size={18} className="mr-2 inline text-carthage-gold" />
          {ex.title}
        </h2>
        <span className="rounded-md bg-carthage-gold/15 px-2.5 py-1 text-xs font-semibold text-carthage-gold">Quiz</span>
      </div>
      {ex.description && <p className="mb-4 text-sm text-white/60">{ex.description}</p>}

      {/* Instruction */}
      {ex.instruction && (
        <div className="mb-4 rounded-r-lg border-l-[3px] border-carthage-gold bg-white/[0.02] px-4 py-3 text-sm text-white/70">
          {ex.instruction}
        </div>
      )}

      {/* Code snippet if present */}
      {ex.content && (
        <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/70" dangerouslySetInnerHTML={{ __html: ex.content }} />
      )}

      {/* code_snippet field (used by some quiz exercises) */}
      {(ex.code_snippet as string | undefined) && (
        <pre className="mb-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-4">
          <code className="font-mono text-sm text-white/85">{ex.code_snippet as string}</code>
        </pre>
      )}

      {/* Options — click to SELECT, not to answer */}
      <div className="mb-5 space-y-2">
        {ex.options?.map((opt, i) => {
          const thisCorrect = i === ex.correct;
          const thisSelected = i === selected;
          let cls = "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]";

          if (!validated && thisSelected) {
            cls = "border-carthage-gold/50 bg-carthage-gold/[0.08]";
          }
          if (validated && thisSelected && isCorrect) {
            cls = "border-lyoko-green/50 bg-lyoko-green/[0.1]";
          }
          if (validated && thisSelected && !isCorrect) {
            cls = "border-xana-red/50 bg-xana-red/[0.1]";
          }
          if (validated && thisCorrect && !thisSelected) {
            cls = "border-lyoko-green/30 bg-lyoko-green/[0.05]";
          }

          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${cls}`}
            >
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                !validated && thisSelected ? "bg-carthage-gold/20 text-carthage-gold" : "bg-white/[0.06] text-white/50"
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-white/80">{opt}</span>
              {validated && thisCorrect && <Check size={16} className="text-lyoko-green" />}
              {validated && thisSelected && !isCorrect && <X size={16} className="text-xana-red" />}
            </button>
          );
        })}
      </div>

      {/* Validate button */}
      {!validated && (
        <div className="text-center">
          <button
            onClick={handleValidate}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-lg bg-carthage-gold px-8 py-2.5 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(251,191,36,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <Check size={16} /> Valider ma réponse
          </button>
        </div>
      )}

      {/* Result message */}
      {validated && (
        <div className={`rounded-xl border p-4 text-sm ${isCorrect ? "border-lyoko-green/30 bg-lyoko-green/[0.06] text-lyoko-green" : "border-xana-red/30 bg-xana-red/[0.06] text-xana-red"}`}>
          {isCorrect ? (
            <><Check size={15} className="mr-1 inline" /> <strong>Bonne réponse !</strong> +25 XP {ex.explanation && <><br /><span className="text-white/50">{ex.explanation}</span></>}</>
          ) : (
            <><X size={15} className="mr-1 inline" /> <strong>Mauvaise réponse.</strong> Réessayez ! {ex.hint && <><br /><span className="text-white/50">{ex.hint as string}</span></>}</>
          )}
        </div>
      )}
    </div>
  );
}

function PuzzleView({ ex, onComplete, goNext, isCompleted }: { ex: Exercise; onComplete: () => void; goNext: () => void; isCompleted: boolean }) {
  // Source = shuffled pieces still available. Target = pieces placed by user in order.
  const [source, setSource] = useState<{ text: string; origIdx: number }[]>([]);
  const [target, setTarget] = useState<{ text: string; origIdx: number }[]>([]);
  const [result, setResult] = useState<"none" | "success" | "error">("none");
  const { play } = useSound();

  // Shuffle on exercise change
  useEffect(() => {
    if (ex.pieces) {
      const indexed = ex.pieces.map((p, i) => ({ text: p, origIdx: i }));
      // Fisher-Yates shuffle
      const shuffled = [...indexed];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setSource(shuffled);
      setTarget([]);
      setResult("none");
    }
  }, [ex]);

  // Click piece in source → move to target (end)
  const moveToTarget = (idx: number) => {
    if (result === "success") return;
    play("puzzlePlace");
    setResult("none");
    const piece = source[idx];
    setSource(prev => prev.filter((_, i) => i !== idx));
    setTarget(prev => [...prev, piece]);
  };

  // Click piece in target → move back to source
  const moveToSource = (idx: number) => {
    if (result === "success") return;
    play("puzzleRemove");
    setResult("none");
    const piece = target[idx];
    setTarget(prev => prev.filter((_, i) => i !== idx));
    setSource(prev => [...prev, piece]);
  };

  const handleReset = () => {
    if (ex.pieces) {
      const indexed = ex.pieces.map((p, i) => ({ text: p, origIdx: i }));
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
    // Check if target order matches original order (0,1,2,3...)
    const userOrder = target.map(p => p.origIdx);
    const correctOrder = (ex.pieces || []).map((_, i) => i);
    const correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

    if (correct) {
      play("success");
      setResult("success");
      onComplete();
      setTimeout(() => play("xp"), 300);
      setTimeout(() => goNext(), 1500);
    } else {
      play("error");
      setResult("error");
      setTimeout(() => setResult("none"), 1500);
    }
  };

  const pieceBaseClass = "cursor-pointer select-none rounded-lg px-4 py-2.5 font-mono text-sm transition-all hover:-translate-y-0.5";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">
          <Puzzle size={18} className="mr-2 inline text-lyoko-purple" />
          {ex.title}
        </h2>
        <span className="rounded-md bg-lyoko-purple/15 px-2.5 py-1 text-xs font-semibold text-lyoko-purple">Puzzle</span>
      </div>
      {ex.description && <p className="mb-3 text-sm text-white/60">{ex.description}</p>}

      {/* Instruction */}
      {ex.instruction && (
        <div className="mb-4 rounded-r-lg border-l-[3px] border-lyoko-purple bg-white/[0.02] px-4 py-3 text-sm text-white/70">
          {ex.instruction}
        </div>
      )}

      {/* Source zone — available pieces */}
      <p className="mb-2 text-xs text-white/40">
        <Puzzle size={12} className="mr-1 inline" /> Cliquez sur les blocs dans le bon ordre pour reconstituer le code :
      </p>
      <div className="mb-4 flex min-h-[60px] flex-wrap gap-2 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] p-3">
        {source.length === 0 && (
          <span className="w-full text-center text-xs text-white/20 py-2">Tous les blocs ont été placés</span>
        )}
        {source.map((piece, idx) => (
          <button
            key={`src-${piece.origIdx}`}
            onClick={() => moveToTarget(idx)}
            className={`${pieceBaseClass} border border-lyoko-purple/30 bg-lyoko-purple/[0.1] text-white/80 hover:border-lyoko-purple/50 hover:bg-lyoko-purple/[0.18] hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)]`}
          >
            {piece.text}
          </button>
        ))}
      </div>

      {/* Target zone — user's answer */}
      <p className="mb-2 text-xs text-white/40">
        <ChevronRight size={12} className="mr-1 inline" /> Votre réponse (cliquez pour retirer) :
      </p>
      <div className={`mb-4 flex min-h-[80px] flex-wrap gap-2 rounded-xl border-2 border-dashed p-3 transition-colors ${
        result === "success" ? "border-lyoko-green/30 bg-lyoko-green/[0.03]" :
        result === "error" ? "border-xana-red/30 bg-xana-red/[0.03]" :
        "border-lyoko-blue/20 bg-lyoko-blue/[0.02]"
      }`}>
        {target.length === 0 && (
          <span className="w-full text-center text-xs text-white/20 py-4">Cliquez sur les blocs ci-dessus pour les placer ici</span>
        )}
        {target.map((piece, idx) => (
          <button
            key={`tgt-${piece.origIdx}`}
            onClick={() => moveToSource(idx)}
            className={`${pieceBaseClass} ${
              result === "success" ? "border border-lyoko-green/40 bg-lyoko-green/[0.12] text-lyoko-green" :
              result === "error" ? "border border-xana-red/40 bg-xana-red/[0.1] text-xana-red" :
              "border border-lyoko-blue/30 bg-lyoko-blue/[0.1] text-white/80 hover:border-lyoko-blue/50 hover:bg-lyoko-blue/[0.18]"
            }`}
          >
            {piece.text}
          </button>
        ))}
      </div>

      {/* Result message */}
      {result === "success" && (
        <div className="mb-4 rounded-xl border border-lyoko-green/30 bg-lyoko-green/[0.06] p-3 text-sm text-lyoko-green">
          <Check size={15} className="mr-1 inline" /> <strong>Puzzle résolu !</strong> +25 XP
        </div>
      )}
      {result === "error" && (
        <div className="mb-4 rounded-xl border border-xana-red/30 bg-xana-red/[0.06] p-3 text-sm text-xana-red">
          <X size={15} className="mr-1 inline" /> <strong>L&apos;ordre n&apos;est pas correct.</strong> Réessayez !
          {ex.hint && <><br /><span className="text-xs text-white/40">{ex.hint as string}</span></>}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button onClick={() => { play("reset"); handleReset(); }}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/50 transition-all hover:bg-white/5">
          <RotateCcw size={15} /> Réinitialiser
        </button>
        <button onClick={handleValidate}
          disabled={target.length === 0}
          className="flex items-center gap-2 rounded-lg bg-lyoko-purple px-8 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
          <Check size={16} /> Valider
        </button>
      </div>
    </div>
  );
}

/* ═══ PREVIEW HELPERS ═══ */

function buildVisualPreview(code: string, moduleId: string): string {
  if (moduleId === "frontend") {
    // If the code looks like a full HTML doc, use it directly
    if (code.trim().toLowerCase().startsWith("<!doctype") || code.trim().toLowerCase().startsWith("<html")) {
      return code;
    }
    // Otherwise, detect CSS-only vs HTML
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(code);
    if (!hasHtmlTags && (code.includes("{") && code.includes("}"))) {
      // CSS only
      return `<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;padding:20px;background:#fff;color:#111;}${code}</style></head><body><div class="demo"><h2>CSS Preview</h2><p>Votre style est appliqué.</p><button>Bouton</button></div></body></html>`;
    }
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#fff;color:#111;}</style></head><body>${code}</body></html>`;
  }

  if (moduleId === "react") {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#fff;color:#111;} *{box-sizing:border-box;}</style>
</head><body><div id="root"></div>
<script type="text/babel">
try {
  ${code}
  const root = ReactDOM.createRoot(document.getElementById('root'));
  if (typeof App !== 'undefined') root.render(React.createElement(App));
  else if (typeof Component !== 'undefined') root.render(React.createElement(Component));
} catch(e) { document.getElementById('root').innerHTML = '<pre style="color:red">' + e.message + '</pre>'; }
<\/script></body></html>`;
  }

  if (moduleId === "javascript") {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Courier New',monospace;padding:20px;margin:0;background:#0a0a0a;color:#00ff88;font-size:14px;} .log{margin:2px 0;padding:4px 8px;border-left:2px solid #00d4ff;background:rgba(0,212,255,0.05);}</style></head><body>
<div id="console"></div>
<script>
const _c = document.getElementById('console');
const _log = console.log;
console.log = function(...args) {
  _log(...args);
  const d = document.createElement('div');
  d.className = 'log';
  d.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' ');
  _c.appendChild(d);
};
try { ${code} } catch(e) { const d = document.createElement('div'); d.style.color='#ff2244'; d.textContent = '❌ ' + e.message; _c.appendChild(d); }
<\/script></body></html>`;
  }

  return "";
}

function buildMobilePreview(code: string): string {
  // Detect Flutter UI widgets
  const hasAppBar = code.includes("AppBar");
  const hasButton = code.includes("ElevatedButton") || code.includes("TextButton") || code.includes("FloatingActionButton");
  const hasListView = code.includes("ListView");
  const hasImage = code.includes("Image.");
  const hasScaffold = code.includes("Scaffold");
  const hasMaterial = code.includes("MaterialApp") || code.includes("runApp");
  const textMatches = [...code.matchAll(/Text\(\s*['"]([^'"]*)['"]/g)].map(m => m[1]);
  const titleMatch = code.match(/title:\s*Text\(\s*['"]([^'"]*)['"]/);
  const appTitle = titleMatch ? titleMatch[1] : "Flutter App";

  const isFlutterUI = hasAppBar || hasButton || hasListView || hasImage || hasScaffold || hasMaterial || textMatches.length > 0;

  // If it's NOT Flutter UI code → show console/info mode
  if (!isFlutterUI) {
    // Extract print() outputs for simulated console
    const prints = [...code.matchAll(/print\(\s*['"]([^'"]*)['"]\s*\)/g)].map(m => m[1]);
    // Also match interpolated prints like print('$var est $val') — show raw string
    const interpPrints = [...code.matchAll(/print\(\s*'([^']*)'\s*\)/g)].map(m => m[1]);
    const allPrints = prints.length > 0 ? prints : interpPrints;

    const consoleLinesHTML = allPrints.length > 0
      ? allPrints.map(p => `<div class="log">${p.replace(/\$/g, '<span class="var">$</span>')}</div>`).join("")
      : `<div class="empty">En attente d'exécution...</div>`;

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a0f;color:#fff;min-height:100vh;display:flex;flex-direction:column;}
.statusbar{height:24px;background:#111;display:flex;align-items:center;justify-content:flex-end;padding:0 12px;font-size:10px;color:rgba(255,255,255,0.4);}
.info{padding:20px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);}
.info-icon{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:14px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);margin-bottom:12px;}
.info-icon svg{width:24px;height:24px;color:#00d4ff;}
.info h3{font-size:13px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:4px;}
.info p{font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;max-width:220px;margin:0 auto;}
.console-header{display:flex;align-items:center;gap:6px;padding:10px 16px 6px;font-size:11px;font-weight:600;color:#00d4ff;letter-spacing:0.5px;}
.console-header .dot{width:6px;height:6px;border-radius:50%;background:#00d4ff;opacity:0.6;}
.console{flex:1;padding:4px 16px 16px;font-family:'Courier New',monospace;font-size:12px;}
.log{padding:4px 8px;margin:2px 0;border-left:2px solid #00d4ff;background:rgba(0,212,255,0.04);color:#00ff88;border-radius:0 4px 4px 0;}
.var{color:#00d4ff;}
.empty{color:rgba(255,255,255,0.2);font-style:italic;padding:8px 0;}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);font-size:10px;color:#00d4ff;margin-top:8px;font-weight:500;}
</style></head><body>
<div class="statusbar">12:00</div>
<div class="info">
  <div class="info-icon"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 17.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v10.5A2.25 2.25 0 0 0 5.25 20.25Z"/></svg></div>
  <h3>Exercice console</h3>
  <p>Cet exercice utilise <strong>print()</strong> — pas d'interface visuelle. La sortie s'affiche dans la console ci-dessous.</p>
  <span class="badge">Mode console</span>
</div>
<div class="console-header"><span class="dot"></span> Console Dart</div>
<div class="console">${consoleLinesHTML}</div>
</body></html>`;
  }

  // Flutter UI mode — build visual mock
  let bodyHTML = "";
  if (textMatches.length > 0) {
    bodyHTML = textMatches.map(t => `<p style="margin:8px 0;font-size:16px;">${t}</p>`).join("");
  }
  if (hasButton) bodyHTML += `<button style="margin:12px 0;padding:12px 24px;background:#6200EA;color:#fff;border:none;border-radius:24px;font-size:14px;cursor:pointer;">Button</button>`;
  if (hasListView) bodyHTML += `<div style="border-top:1px solid #e0e0e0;">${[1,2,3,4].map(i => `<div style="padding:16px;border-bottom:1px solid #e0e0e0;">List Item ${i}</div>`).join("")}</div>`;
  if (hasImage) bodyHTML += `<div style="margin:12px 0;width:100%;height:120px;background:linear-gradient(135deg,#6200EA,#00BCD4);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;">Image</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Roboto',sans-serif;background:#FAFAFA;min-height:100vh;overflow-x:hidden;}
.appbar{background:#6200EA;color:#fff;padding:12px 16px;font-size:18px;font-weight:500;display:flex;align-items:center;gap:12px;box-shadow:0 2px 4px rgba(0,0,0,0.15);}
.appbar svg{opacity:0.9;}
.body{padding:16px;}
.fab{position:fixed;bottom:16px;right:16px;width:56px;height:56px;background:#6200EA;color:#fff;border:none;border-radius:28px;font-size:24px;cursor:pointer;box-shadow:0 4px 12px rgba(98,0,234,0.4);display:flex;align-items:center;justify-content:center;}
.statusbar{height:24px;background:#4a148c;display:flex;align-items:center;justify-content:flex-end;padding:0 12px;font-size:10px;color:rgba(255,255,255,0.7);}
</style></head><body>
<div class="statusbar">12:00</div>
${hasAppBar ? `<div class="appbar"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="14" x2="17" y2="14"/></svg>${appTitle}</div>` : ""}
<div class="body">${bodyHTML}</div>
${hasButton && code.includes("FloatingActionButton") ? `<button class="fab">+</button>` : ""}
</body></html>`;
}

function buildTerminalOutput(code: string, moduleId: string): string[] {
  const lines: string[] = [];
  const timestamp = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (moduleId === "nodejs") {
    lines.push(`$ node script.js`);
    // Detect common patterns
    if (code.includes("console.log")) {
      const logs = [...code.matchAll(/console\.log\(\s*(['"`])(.*?)\1/g)];
      logs.forEach(m => lines.push(m[2]));
      if (logs.length === 0) lines.push("[output]");
    }
    if (code.includes("listen(")) {
      const portMatch = code.match(/listen\(\s*(\d+)/);
      lines.push(`Server running on port ${portMatch ? portMatch[1] : "3000"}`);
    }
    if (code.includes("readFile") || code.includes("readFileSync")) lines.push("[File content loaded]");
    if (code.includes("writeFile") || code.includes("writeFileSync")) lines.push("File written successfully");
    if (code.includes("express()")) lines.push("Express app initialized");
    if (lines.length <= 1) lines.push("Process exited with code 0");
  } else if (moduleId === "python") {
    lines.push(`$ python main.py`);
    const prints = [...code.matchAll(/print\(\s*(['"])(.*?)\1/g)];
    prints.forEach(m => lines.push(m[2]));
    if (code.includes("def ")) lines.push("[Function defined]");
    if (code.includes("class ")) lines.push("[Class defined]");
    if (lines.length <= 1) lines.push("Process finished with exit code 0");
  } else if (moduleId === "cpp") {
    lines.push(`$ g++ main.cpp -o main && ./main`);
    const printfs = [...code.matchAll(/printf\(\s*"([^"]*?)(?:\\n)?"/g)];
    printfs.forEach(m => lines.push(m[1].replace(/%[dfsczp]/g, "[val]")));
    const couts = [...code.matchAll(/cout\s*<<\s*"([^"]*?)"/g)];
    couts.forEach(m => lines.push(m[1]));
    if (lines.length <= 1) lines.push("Process exited with code 0");
  }

  lines.push(`\n[${timestamp}] Terminé.`);
  return lines;
}

/* ═══ PREVIEW PANELS ═══ */

function LivePreviewPanel({ code, moduleId }: { code: string; moduleId: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [darkBg, setDarkBg] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounced auto-refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const html = buildVisualPreview(code, moduleId);
        iframeRef.current.srcdoc = html;
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [code, moduleId, refreshKey]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Monitor size={13} className="text-lyoko-blue" />
          <span className="text-[0.7rem] font-medium text-white/50">Aperçu en direct</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setDarkBg(!darkBg)} className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white/60" title="Fond sombre/clair">
            {darkBg ? <Sun size={12} /> : <Moon size={12} />}
          </button>
          <button onClick={() => setRefreshKey(k => k + 1)} className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white/60" title="Rafraîchir">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
      {/* Iframe */}
      <div className={`flex-1 ${darkBg ? "bg-gray-900" : "bg-white"}`}>
        <iframe
          ref={iframeRef}
          title="preview"
          sandbox="allow-scripts allow-modals"
          className="h-full w-full border-0"
          style={{ minHeight: 300 }}
        />
      </div>
    </div>
  );
}

function MobileEmulatorPanel({ code }: { code: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildMobilePreview(code);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [code]);

  const isPortrait = orientation === "portrait";
  const phoneW = isPortrait ? 280 : 500;
  const phoneH = isPortrait ? 560 : 280;

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-dark-surface/50">
      {/* Toolbar */}
      <div className="flex w-full items-center justify-between border-b border-white/5 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Smartphone size={13} className="text-lyoko-purple" />
          <span className="text-[0.7rem] font-medium text-white/50">Émulateur Mobile</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOrientation(o => o === "portrait" ? "landscape" : "portrait")}
            className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white/60" title="Rotation"
          >
            <RotateCw size={12} />
          </button>
          <button
            onClick={() => { if (iframeRef.current) iframeRef.current.srcdoc = buildMobilePreview(code); }}
            className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white/60" title="Rafraîchir"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className="relative overflow-hidden border-[3px] border-gray-700 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          style={{
            width: phoneW,
            height: phoneH,
            borderRadius: isPortrait ? 32 : 24,
          }}
        >
          {/* Notch */}
          {isPortrait && (
            <div className="absolute left-1/2 top-0 z-10 h-[22px] w-[100px] -translate-x-1/2 rounded-b-xl bg-black" />
          )}
          {/* Screen */}
          <iframe
            ref={iframeRef}
            title="mobile-preview"
            sandbox="allow-scripts"
            className="h-full w-full border-0 bg-white"
          />
          {/* Home indicator */}
          {isPortrait && (
            <div className="absolute bottom-2 left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
}

function TerminalPanel({ code, moduleId, isRunning }: { code: string; moduleId: string; isRunning: boolean }) {
  const [lines, setLines] = useState<string[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRunning) {
      setLines([]);
      const output = buildTerminalOutput(code, moduleId);
      // Animate lines appearing
      output.forEach((line, i) => {
        setTimeout(() => {
          setLines(prev => [...prev, line]);
          if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
        }, i * 150);
      });
    }
  }, [isRunning, code, moduleId]);

  const langLabel = moduleId === "nodejs" ? "Node.js" : moduleId === "python" ? "Python 3" : moduleId === "cpp" ? "g++ / C++" : moduleId;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <TerminalSquare size={13} className="text-lyoko-green" />
          <span className="text-[0.7rem] font-medium text-white/50">Terminal — {langLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          {isRunning && <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-lyoko-green" />}
          <button onClick={() => setLines([])} className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white/60" title="Effacer">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>
      {/* Terminal content */}
      <div ref={termRef} className="flex-1 overflow-y-auto bg-[#0c0c0c] p-3 font-mono text-[0.78rem] leading-relaxed" style={{ minHeight: 300 }}>
        {lines.length === 0 ? (
          <span className="text-white/20">En attente d&apos;exécution...</span>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`${line.startsWith("$") ? "text-lyoko-blue" : line.startsWith("[") || line.startsWith("\n") ? "text-white/30" : line.includes("❌") || line.includes("Error") ? "text-xana-red" : "text-lyoko-green"}`}>
              {line}
            </div>
          ))
        )}
        {isRunning && <span className="inline-block h-4 w-1.5 animate-pulse bg-lyoko-green" />}
      </div>
    </div>
  );
}

/* ═══ CODE VIEW (split-pane IDE) ═══ */

function CodeView({ ex, onComplete, goNext, isCompleted, helpLevel, setHelpLevel, moduleId }: {
  ex: Exercise; onComplete: () => void; goNext: () => void; isCompleted: boolean; helpLevel: number; setHelpLevel: (n: number) => void; moduleId: string;
}) {
  const [code, setCode] = useState(ex.code_template || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPreview, setShowPreview] = useState(true);
  const [termRunKey, setTermRunKey] = useState(0);
  const [isTermRunning, setIsTermRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { play } = useSound();

  const hasVisual = VISUAL_MODULES.includes(moduleId);
  const hasMobile = MOBILE_MODULES.includes(moduleId);
  const hasTerminal = TERMINAL_MODULES.includes(moduleId);
  const hasPanel = hasVisual || hasMobile || hasTerminal;

  useEffect(() => {
    setCode(ex.code_template || "");
    setOutput("");
    setStatus("idle");
    setIsTermRunning(false);
  }, [ex]);

  const runCode = () => {
    play("codeRun");
    // Normalize: collapse whitespace, remove spaces around HTML tags + punctuation, lowercase
    const normalizeCode = (s: string) => {
      let n = flexNormalize(s);
      // Extra HTML normalization
      n = n.replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/\s+>/g, ">").replace(/<\s+/g, "<");
      return n;
    };

    // Smart HTML contains: for expected like <tag>content</tag>,
    // check if a matching tag in the code contains the expected text.
    // e.g. <em>est génial</em> matches expected <em>génial</em>
    const htmlContains = (norm: string, val: string): boolean => {
      // Direct substring match first
      if (norm.includes(val)) return true;
      // Try tag-aware match: extract <tag>content</tag> pattern
      const tagMatch = val.match(/^<(\w+)(?:\s[^>]*)?>(.+?)<\/\1>$/);
      if (tagMatch) {
        const [, tag, content] = tagMatch;
        // Find all occurrences of this tag in the code and check if any contains the text
        const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([^]*?)</${tag}>`, "gi");
        let m;
        while ((m = re.exec(norm)) !== null) {
          if (m[1].includes(content)) return true;
        }
      }
      return false;
    };

    const normalized = normalizeCode(code);
    let allPass = true;

    for (const test of ex.tests || []) {
      const expected = test.expected || test.expected_output || "";
      if (!expected) continue;
      const val = normalizeCode(expected);
      const ttype = test.type || "contains";
      if (ttype === "contains" && !htmlContains(normalized, val) && !flexContains(code, expected)) { allPass = false; break; }
      if (ttype === "not_contains" && htmlContains(normalized, val)) { allPass = false; break; }
      if (ttype === "match" && !new RegExp(expected, "i").test(code)) { allPass = false; break; }
      if (ttype === "exact" && normalized !== val && flexNormalize(code) !== flexNormalize(expected)) { allPass = false; break; }
      if (ttype === "output") {
        // Actually execute JS code and capture console.log output
        try {
          const logs: string[] = [];
          const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")), warn: () => {}, error: () => {}, info: () => {} };
          const fn = new Function("console", code);
          fn(fakeConsole);
          const capturedOutput = logs.join("\n");
          if (!flexContains(capturedOutput, expected) && !normalizeCode(capturedOutput).includes(val)) { allPass = false; break; }
        } catch {
          // If execution fails, fall back to source check
          if (!normalized.includes(val)) { allPass = false; break; }
        }
      }
    }

    // Trigger terminal animation for terminal modules
    if (hasTerminal) {
      setIsTermRunning(false);
      setTimeout(() => { setTermRunKey(k => k + 1); setIsTermRunning(true); }, 50);
    }

    if (allPass) {
      play("success");
      setStatus("success");
      setOutput("✓ Bravo ! Exercice réussi ! +25 XP");
      onComplete();
      setTimeout(() => play("xp"), 300);
      setTimeout(() => goNext(), 1500);
    } else {
      play("error");
      setStatus("error");
      const hint = ex.hint ? `\n💡 ${ex.hint}` : "";
      setOutput(`✗ Pas tout à fait... Vérifiez votre code.${hint}`);
    }
  };

  const showHelp = () => {
    play("hint");
    if (ex.help_steps && helpLevel < ex.help_steps.length) {
      setHelpLevel(helpLevel + 1);
    } else if (ex.hint && helpLevel === 0) {
      setHelpLevel(1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white">
            <Code size={16} className="mr-2 inline text-lyoko-green" />
            {ex.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-lyoko-green/15 px-2.5 py-1 text-xs font-semibold text-lyoko-green">Code</span>
          {hasPanel && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-all hover:bg-white/5 hover:text-white/70"
            >
              {showPreview ? <><EyeOff size={13} /> Masquer aperçu</> : <><Eye size={13} /> Afficher aperçu</>}
            </button>
          )}
        </div>
      </div>

      {ex.description && <p className="mb-3 text-sm text-white/60">{ex.description}</p>}

      {/* Instruction with left accent border (like old version) */}
      {ex.instruction && (
        <div className="mb-3 rounded-r-lg border-l-[3px] border-lyoko-green bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-white/70" dangerouslySetInnerHTML={{ __html: ex.instruction }} />
      )}

      {/* Preview attendu */}
      {ex.preview && (
        <div className="mb-3">
          <h3 className="mb-1.5 text-xs font-medium text-white/40"><Eye size={12} className="mr-1 inline" /> Aperçu attendu :</h3>
          <div className="rounded-lg bg-white p-3 text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: ex.preview }} />
        </div>
      )}

      {/* Help Steps / Hint */}
      {helpLevel > 0 && (ex.help_steps || ex.hint) && (
        <div className="mb-3 space-y-2">
          {ex.help_steps ? (
            ex.help_steps.slice(0, helpLevel).map((step, i) => (
              <div key={i} className="rounded-lg border border-carthage-gold/20 bg-carthage-gold/5 px-4 py-2 text-sm text-carthage-gold">
                Indice {i + 1}: {step}
              </div>
            ))
          ) : ex.hint ? (
            <div className="rounded-lg border border-carthage-gold/20 bg-carthage-gold/5 px-4 py-2 text-sm text-carthage-gold">
              {ex.hint}
            </div>
          ) : null}
        </div>
      )}

      {/* ═══ SPLIT PANE: Editor + Preview ═══ */}
      <div className={`mb-3 flex flex-1 gap-3 ${!showPreview || !hasPanel ? "flex-col" : ""}`} style={{ minHeight: 350 }}>
        {/* Editor Panel */}
        <div className={`flex flex-col overflow-hidden rounded-xl border border-white/10 ${showPreview && hasPanel ? "w-1/2" : "w-full"}`}>
          <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-4 py-1.5">
            <span className="font-mono text-[0.7rem] text-white/40">
              {moduleId === "frontend" ? "index.html" : moduleId === "react" ? "App.jsx" : moduleId === "javascript" ? "script.js" : moduleId === "nodejs" ? "server.js" : moduleId === "python" ? "main.py" : moduleId === "cpp" ? "main.cpp" : moduleId === "dart" ? "main.dart" : "code"}
            </span>
            <span className="text-[0.6rem] text-white/20">Ctrl+Enter pour valider</span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-xana-red/60" />
              <div className="h-2 w-2 rounded-full bg-carthage-gold/60" />
              <div className="h-2 w-2 rounded-full bg-lyoko-green/60" />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="block flex-1 resize-none bg-dark-bg p-4 font-mono text-[0.8rem] leading-relaxed text-white/90 placeholder:text-white/20 focus:outline-none"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runCode();
              }
              if (e.key === "Tab") {
                e.preventDefault();
                const t = e.currentTarget;
                const s = t.selectionStart;
                setCode(code.substring(0, s) + "  " + code.substring(t.selectionEnd));
                setTimeout(() => { t.selectionStart = t.selectionEnd = s + 2; }, 0);
              }
            }}
          />
        </div>

        {/* Preview Panel */}
        {showPreview && hasPanel && (
          <div className="w-1/2">
            {hasVisual && <LivePreviewPanel code={code} moduleId={moduleId} />}
            {hasMobile && <MobileEmulatorPanel code={code} />}
            {hasTerminal && <TerminalPanel code={code} moduleId={moduleId} isRunning={isTermRunning} key={termRunKey} />}
          </div>
        )}
      </div>

      {/* Console output */}
      {output && (
        <div className={`mb-3 rounded-xl border p-3 font-mono text-sm ${
          status === "success" ? "border-lyoko-green/30 bg-lyoko-green/5 text-lyoko-green" : "border-xana-red/30 bg-xana-red/5 text-xana-red"
        }`}>
          {output}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={runCode}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-lyoko-blue to-lyoko-green px-5 py-2 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5">
          <Play size={15} /> Valider
        </button>
        {((ex.help_steps && helpLevel < ex.help_steps.length) || (ex.hint && helpLevel === 0)) && (
          <button onClick={showHelp} className="flex items-center gap-2 rounded-lg border border-carthage-gold/30 px-4 py-2 text-sm text-carthage-gold transition-all hover:bg-carthage-gold/10">
            <HelpCircle size={15} /> Aide
          </button>
        )}
        <button onClick={() => { play("reset"); setCode(ex.code_template || ""); setOutput(""); setStatus("idle"); setIsTermRunning(false); }}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition-all hover:bg-white/5">
          <RotateCcw size={15} /> Reset
        </button>
        {status === "success" && (
          <button onClick={goNext} className="flex items-center gap-2 rounded-lg border border-lyoko-green/30 bg-lyoko-green/10 px-5 py-2 text-sm font-medium text-lyoko-green transition-all hover:bg-lyoko-green/20">
            <ChevronRight size={15} /> Suivant
          </button>
        )}
      </div>

      {/* Jérémie Belpois — AI Assistant */}
      <JeremyChatbot
        exerciseContext={{
          title: ex.title,
          module: moduleId,
          instruction: ex.instruction || ex.description || "",
          level: parseInt(ex.id.replace(/\D/g, "")) || 1,
          code,
          error: status === "error" ? output : undefined,
        }}
      />
    </div>
  );
}
