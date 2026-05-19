"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/sound-manager";
import { XpToastContainer, type XpToastData } from "@/components/ui/xp-toast-enhanced";
import { MilestonePopup } from "@/components/ui/milestone-popup";
import { ParticleCanvas, FloatingTextContainer, RippleContainer, ConfettiRainCanvas, triggerConfettiRain } from "@/components/ui/magic-effects";
import { ExerciseCardEnhanced, CategoryHeader } from "@/components/ui/exercise-card-enhanced";
import { QuizViewEnhanced } from "@/components/ui/quiz-view-enhanced";
import { PuzzleViewEnhanced } from "@/components/ui/puzzle-view-enhanced";
import { TransitionWrapper, CelebrationOverlay } from "@/components/ui/page-transitions";
import { logActivityToday } from "@/components/ui/activity-heatmap";
import { startSession } from "@/components/ui/session-summary";
import { getExercises } from "@/lib/exercises/registry";

// Import all exercise modules
import "@/lib/exercises/frontend-part1";
import "@/lib/exercises/frontend-part2";
import "@/lib/exercises/frontend-part3";
import "@/lib/exercises/frontend-part4";
import "@/lib/exercises/frontend-part5";
import "@/lib/exercises/javascript-part1";
import "@/lib/exercises/javascript-part2";
import "@/lib/exercises/javascript-part3";
import "@/lib/exercises/javascript-part4";
import "@/lib/exercises/python-part1";
import "@/lib/exercises/python-part2";
import "@/lib/exercises/python-part3";
import "@/lib/exercises/python-part4";
import "@/lib/exercises/python-part5";
import "@/lib/exercises/dart-part1";
import "@/lib/exercises/dart-part2";
import "@/lib/exercises/dart-part3";
import "@/lib/exercises/dart-part4";
import "@/lib/exercises/dart-part5";
import "@/lib/exercises/react-part1";
import "@/lib/exercises/react-part2";
import "@/lib/exercises/react-part3";
import "@/lib/exercises/react-part4";
import "@/lib/exercises/react-part5";
import "@/lib/exercises/nodejs-part1";
import "@/lib/exercises/nodejs-part2";
import "@/lib/exercises/nodejs-part3";
import "@/lib/exercises/nodejs-part4";
import "@/lib/exercises/nodejs-part5";
import "@/lib/exercises/cpp-part1";
import "@/lib/exercises/cpp-part2";
import "@/lib/exercises/cpp-part3";
import "@/lib/exercises/cpp-part4";
import "@/lib/exercises/cpp-part5";
import "@/lib/exercises/cpp-part6";
import "@/lib/exercises/csharp-part1";
import "@/lib/exercises/csharp-part2";
import "@/lib/exercises/csharp-part3";
import "@/lib/exercises/csharp-part4";
import "@/lib/exercises/csharp-part5";
import "@/lib/exercises/csharp-part6";

import {
  ChevronLeft, ChevronRight, Search, BookOpen, Code, Puzzle, CircleDot,
  Play, RotateCcw, Lock, Monitor, Smartphone, TerminalSquare, Eye, EyeOff,
  RefreshCw, Sun, Moon, RotateCw, SkipForward, Home, Shrink, Expand,
  Flame, Zap, Trophy, Star, Check, Lightbulb, Sparkles, Menu, X as XIcon
} from "lucide-react";
import Link from "next/link";
import JeremyChatbot from "@/components/jeremy-chatbot";
import FranzCodePlayer from "@/components/franzcode-player";
import { validateCode } from "@/lib/exercises/validate-code";

/* ═══ MODULE CATEGORIES ═══ */
const VISUAL_MODULES = ["frontend", "javascript", "react"];
const MOBILE_MODULES = ["dart"];
const TERMINAL_MODULES = ["nodejs", "python", "cpp", "csharp"];

/* ═══ PREVIEW HELPERS ═══ */

function buildVisualPreview(code: string, moduleId: string): string {
  if (moduleId === "frontend") {
    if (code.trim().toLowerCase().startsWith("<!doctype") || code.trim().toLowerCase().startsWith("<html")) {
      return code;
    }
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(code);
    if (!hasHtmlTags && (code.includes("{") && code.includes("}"))) {
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
  if (!isFlutterUI) {
    const prints = [...code.matchAll(/print\(\s*['"]([^'"]*)['"]\s*\)/g)].map(m => m[1]);
    const interpPrints = [...code.matchAll(/print\(\s*'([^']*)'\s*\)/g)].map(m => m[1]);
    const allPrints = prints.length > 0 ? prints : interpPrints;
    const consoleLinesHTML = allPrints.length > 0
      ? allPrints.map(p => `<div class="log">${p.replace(/\$/g, '<span class="var">$</span>')}</div>`).join("")
      : `<div class="empty">En attente d'exécution...</div>`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a0f;color:#fff;min-height:100vh;display:flex;flex-direction:column;}.statusbar{height:24px;background:#111;display:flex;align-items:center;justify-content:flex-end;padding:0 12px;font-size:10px;color:rgba(255,255,255,0.4);}.info{padding:20px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);}.info h3{font-size:13px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:4px;}.info p{font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;}.console-header{display:flex;align-items:center;gap:6px;padding:10px 16px 6px;font-size:11px;font-weight:600;color:#00d4ff;}.console{flex:1;padding:4px 16px 16px;font-family:'Courier New',monospace;font-size:12px;}.log{padding:4px 8px;margin:2px 0;border-left:2px solid #00d4ff;background:rgba(0,212,255,0.04);color:#00ff88;border-radius:0 4px 4px 0;}.var{color:#00d4ff;}.empty{color:rgba(255,255,255,0.2);font-style:italic;padding:8px 0;}</style></head><body>
<div class="statusbar">12:00</div>
<div class="info"><h3>Exercice console</h3><p>Cet exercice utilise <strong>print()</strong> — la sortie s'affiche ci-dessous.</p></div>
<div class="console-header">Console Dart</div>
<div class="console">${consoleLinesHTML}</div>
</body></html>`;
  }
  let bodyHTML = "";
  if (textMatches.length > 0) bodyHTML = textMatches.map(t => `<p style="margin:8px 0;font-size:16px;">${t}</p>`).join("");
  if (hasButton) bodyHTML += `<button style="margin:12px 0;padding:12px 24px;background:#6200EA;color:#fff;border:none;border-radius:24px;font-size:14px;cursor:pointer;">Button</button>`;
  if (hasListView) bodyHTML += `<div style="border-top:1px solid #e0e0e0;">${[1,2,3,4].map(i => `<div style="padding:16px;border-bottom:1px solid #e0e0e0;">List Item ${i}</div>`).join("")}</div>`;
  if (hasImage) bodyHTML += `<div style="margin:12px 0;width:100%;height:120px;background:linear-gradient(135deg,#6200EA,#00BCD4);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;">Image</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Roboto',sans-serif;background:#FAFAFA;min-height:100vh;}.appbar{background:#6200EA;color:#fff;padding:12px 16px;font-size:18px;font-weight:500;}.body{padding:16px;}.statusbar{height:24px;background:#4a148c;display:flex;align-items:center;justify-content:flex-end;padding:0 12px;font-size:10px;color:rgba(255,255,255,0.7);}.fab{position:fixed;bottom:16px;right:16px;width:56px;height:56px;background:#6200EA;color:#fff;border:none;border-radius:28px;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;}</style></head><body>
<div class="statusbar">12:00</div>
${hasAppBar ? `<div class="appbar">${appTitle}</div>` : ""}
<div class="body">${bodyHTML}</div>
${hasButton && code.includes("FloatingActionButton") ? `<button class="fab">+</button>` : ""}
</body></html>`;
}

function buildTerminalOutput(code: string, moduleId: string): string[] {
  const lines: string[] = [];
  const timestamp = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  if (moduleId === "nodejs") {
    lines.push(`$ node script.js`);
    if (code.includes("console.log")) {
      const logs = [...code.matchAll(/console\.log\(\s*(['"`])(.*?)\1/g)];
      logs.forEach(m => lines.push(m[2]));
      if (logs.length === 0) lines.push("[output]");
    }
    if (code.includes("listen(")) { const portMatch = code.match(/listen\(\s*(\d+)/); lines.push(`Server running on port ${portMatch ? portMatch[1] : "3000"}`); }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildVisualPreview(code, moduleId);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [code, moduleId, refreshKey]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Monitor size={13} className="text-lyoko-blue" />
          <span className="text-xs font-medium text-white/50">Aperçu en direct</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setDarkBg(!darkBg)} className="rounded p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Fond sombre/clair">
            {darkBg ? <Sun size={12} /> : <Moon size={12} />}
          </button>
          <button onClick={() => setRefreshKey(k => k + 1)} className="rounded p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Rafraîchir">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
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
      if (iframeRef.current) iframeRef.current.srcdoc = buildMobilePreview(code);
    }, 600);
    return () => clearTimeout(timer);
  }, [code]);

  const isPortrait = orientation === "portrait";

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-dark-surface/50">
      <div className="flex w-full items-center justify-between border-b border-white/5 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Smartphone size={13} className="text-lyoko-purple" />
          <span className="text-xs font-medium text-white/50">Émulateur Mobile</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setOrientation(o => o === "portrait" ? "landscape" : "portrait")} className="rounded p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Rotation">
            <RotateCw size={12} />
          </button>
          <button onClick={() => { if (iframeRef.current) iframeRef.current.srcdoc = buildMobilePreview(code); }} className="rounded p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Rafraîchir">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-3 w-full">
        <div
          className="relative overflow-hidden border-[3px] border-gray-700 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          style={{
            width: isPortrait ? "min(260px, 70vw)" : "min(440px, 85vw)",
            aspectRatio: isPortrait ? "280 / 420" : "500 / 280",
            maxHeight: "100%",
            borderRadius: isPortrait ? 32 : 24,
          }}
        >
          {isPortrait && <div className="absolute left-1/2 top-0 z-10 h-[22px] w-[100px] -translate-x-1/2 rounded-b-xl bg-black" />}
          <iframe ref={iframeRef} title="mobile-preview" sandbox="allow-scripts" className="h-full w-full border-0 bg-white" />
          {isPortrait && <div className="absolute bottom-2 left-1/2 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-gray-600" />}
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
      <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <TerminalSquare size={13} className="text-lyoko-green" />
          <span className="text-xs font-medium text-white/50">Terminal — {langLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          {isRunning && <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-lyoko-green" />}
          <button onClick={() => setLines([])} className="rounded p-1.5 text-white/30 hover:bg-white/5 hover:text-white/60 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Effacer">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>
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
  options?: string[];
  correct?: number;
  explanation?: string;
  instruction?: string;
  pieces?: string[];
  hint?: string;
  code_template?: string;
  solution?: string;
  tests?: { type?: string; expected?: string; message?: string; input?: string; expected_output?: string;[k: string]: unknown }[];
  help_steps?: string[];
  preview?: string;
  [key: string]: unknown;
}

interface Props {
  moduleId: string;
  moduleName: string;
  moduleColor: string;
  moduleLevels: number;
}

const TYPE_ICONS: Record<string, any> = { intro: BookOpen, quiz: CircleDot, puzzle: Puzzle, code: Code };

/* ═══ ENHANCED EXERCISE CLIENT ═══ */
export function ExerciseClientEnhanced({ moduleId, moduleName, moduleColor, moduleLevels }: Props) {
  const { user, updateProgress, addXp, refreshUser } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar by default on md+ (and keep it user-controlled afterwards)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    setSidebarOpen(mql.matches);
  }, []);
  const [search, setSearch] = useState("");
  const [helpLevel, setHelpLevel] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Gamification state
  const [comboCount, setComboCount] = useState(0);
  const [xpToasts, setXpToasts] = useState<XpToastData[]>([]);
  const toastIdRef = useRef(0);
  const [milestone, setMilestone] = useState<{ pct: 25 | 50 | 75 | 100 } | null>(null);
  const shownMilestonesRef = useRef<Set<number>>(new Set());
  const newlyCompletedRef = useRef<string[]>([]);
  const comboCountRef = useRef(0);
  const migrationDoneRef = useRef(false);
  const [celebration, setCelebration] = useState<{ show: boolean; type: "milestone" | "levelup" | "streak" | "achievement" }>({ show: false, type: "milestone" });

  comboCountRef.current = comboCount;

  const fireXpToast = useCallback((amount: number, combo?: number, label?: string) => {
    const id = ++toastIdRef.current;
    setXpToasts((prev) => [...prev, { id, amount, combo, label }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setXpToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load exercises (registry is static, so this is cheap)
  useEffect(() => {
    const data = getExercises(moduleId);
    if (data.length > 0) {
      setExercises(data);
    }
    // Pre-populate shown milestones so we don't re-fire on page load
    shownMilestonesRef.current = new Set([25, 50, 75, 100]);
    migrationDoneRef.current = false; // allow migration to run once per module
  }, [moduleId]);

  // ── Sync completed set from the server (source of truth: user.progress) ──
  useEffect(() => {
    const ids = user ? (user.progress[moduleId] || []) : [];
    setCompleted(new Set(ids));
  }, [user, moduleId]);

  // ── One-time migration of legacy localStorage completions → server ──
  // If any exercises were stored locally from a previous session, upload
  // them silently (without awarding XP) and then clear the localStorage key.
  useEffect(() => {
    if (!user || migrationDoneRef.current) return;
    migrationDoneRef.current = true;
    if (typeof window === "undefined") return;
    const key = `${moduleId}_completed_exercises`;
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    let ids: unknown;
    try { ids = JSON.parse(raw); } catch { window.localStorage.removeItem(key); return; }
    if (!Array.isArray(ids)) { window.localStorage.removeItem(key); return; }
    const serverIds = new Set(user.progress[moduleId] || []);
    const toMigrate = (ids as unknown[])
      .filter((x): x is string => typeof x === "string")
      .filter((id) => !serverIds.has(id));
    if (toMigrate.length === 0) { window.localStorage.removeItem(key); return; }
    Promise.all(
      toMigrate.map((id) =>
        fetch("/api/db/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          // Deliberately no `xp` field → server records completion without awarding XP
          body: JSON.stringify({ moduleId, exerciseId: id }),
        }).catch(() => null)
      )
    ).finally(() => {
      window.localStorage.removeItem(key);
      refreshUser();
    });
  }, [user, moduleId, refreshUser]);

  // Start session tracking
  useEffect(() => {
    if (!user || exercises.length === 0) return;
    const totalExNow = Object.values(user.progress).reduce((s, a) => s + a.length, 0);
    startSession(moduleId, moduleName, user.xp, totalExNow);
  }, [exercises.length, moduleId, moduleName, user]);

  const rawExercise = exercises[currentIdx];
  const exercise = rawExercise ? { ...rawExercise, type: rawExercise.type || 'code' as const, category: rawExercise.category || 'Général' } : rawExercise;

  const { play } = useSound();

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      newlyCompletedRef.current = [...newlyCompletedRef.current, id];
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Side effects processor
  useEffect(() => {
    if (newlyCompletedRef.current.length === 0) return;
    const ids = newlyCompletedRef.current;
    newlyCompletedRef.current = [];

    ids.forEach((id) => {
      updateProgress(moduleId, id);
      logActivityToday();

      const newCombo = comboCountRef.current + 1;
      comboCountRef.current = newCombo;
      const multiplier = newCombo >= 6 ? 3 : newCombo >= 3 ? 2 : 1;
      const xpEarned = 25 * multiplier;
      setComboCount(newCombo);
      addXp(xpEarned);
      fireXpToast(xpEarned, multiplier > 1 ? multiplier : undefined);
      if (multiplier > 1) play("combo");
    });

    // Milestone check
    if (exercises.length > 0) {
      const pct = Math.floor((completed.size / exercises.length) * 100);
      const MILESTONES = [25, 50, 75, 100] as const;
      for (const m of MILESTONES) {
        if (pct >= m && !shownMilestonesRef.current.has(m)) {
          shownMilestonesRef.current.add(m);
          setTimeout(() => {
            setMilestone({ pct: m });
            setCelebration({ show: true, type: m === 100 ? "achievement" : "milestone" });
          }, 800);
          if (m === 100) {
            addXp(250);
            play("sectionComplete");
            triggerConfettiRain({ count: 150 });
          } else {
            play("badge");
          }
          break;
        }
      }
    }
  }, [completed, exercises.length, moduleId, updateProgress, addXp, fireXpToast, play]);

  const goNext = useCallback(() => {
    if (currentIdx < exercises.length - 1) {
      play("transition");
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
        setHelpLevel(0);
        setTimeout(() => setTransitioning(false), 50);
      }, 150);
    }
  }, [currentIdx, exercises.length, play]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      play("navigate");
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx - 1);
        setHelpLevel(0);
        setTimeout(() => setTransitioning(false), 50);
      }, 150);
    }
  }, [currentIdx, play]);

  const skipToNextUncompleted = useCallback(() => {
    for (let i = currentIdx + 1; i < exercises.length; i++) {
      if (!completed.has(exercises[i].id)) {
        play("transition");
        setTransitioning(true);
        setTimeout(() => {
          setCurrentIdx(i);
          setHelpLevel(0);
          setTimeout(() => setTransitioning(false), 50);
        }, 150);
        return;
      }
    }
    for (let i = 0; i < currentIdx; i++) {
      if (!completed.has(exercises[i].id)) {
        play("transition");
        setTransitioning(true);
        setTimeout(() => {
          setCurrentIdx(i);
          setHelpLevel(0);
          setTimeout(() => setTransitioning(false), 50);
        }, 150);
        return;
      }
    }
  }, [currentIdx, exercises, completed, play]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isTextarea = tag === "TEXTAREA";
      const isInput = tag === "INPUT";

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") return;
      if (isTextarea || isInput) return;

      if (e.key === "ArrowRight" || e.key === "n") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft" || e.key === "p") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") { e.preventDefault(); setZenMode(false); setSidebarOpen((p) => !p); }
      if (e.key === "f" && !e.ctrlKey) { e.preventDefault(); setZenMode((p) => !p); }
      if (e.key === "s" && !e.ctrlKey) { e.preventDefault(); skipToNextUncompleted(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, skipToNextUncompleted]);

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
    <div
      className={`flex relative transition-all duration-300 ${zenMode ? "h-[100dvh] fixed inset-0 z-[100]" : "h-[calc(100dvh-4rem)]"}`}
    >
      {/* Global effects layers */}
      <ParticleCanvas />
      <FloatingTextContainer />
      <RippleContainer />
      <ConfettiRainCanvas />

      <FranzCodePlayer />

      {/* XP Toast Container */}
      <XpToastContainer toasts={xpToasts} onRemove={removeToast} />

      {/* Milestone Popup */}
      {milestone && (
        <MilestonePopup
          milestone={milestone.pct}
          moduleName={moduleName}
          onClose={() => setMilestone(null)}
          onContinue={() => { setMilestone(null); goNext(); }}
        />
      )}

      {/* Celebration Overlay */}
      <CelebrationOverlay
        show={celebration.show}
        type={celebration.type}
        onComplete={() => setCelebration({ show: false, type: "milestone" })}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && !zenMode && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[85vw] max-w-xs overflow-y-auto border-r border-white/5 bg-dark-surface transition-transform duration-300 md:static md:z-auto md:w-80 md:max-w-none md:translate-x-0 md:transition-[width,transform] ${
          zenMode
            ? "-translate-x-full md:w-0 md:overflow-hidden"
            : sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:w-0 md:overflow-hidden md:-translate-x-0"
        }`}
      >
        <div className="p-4">

          {/* Module header */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full animate-pulse"
              style={{ background: moduleColor, boxShadow: `0 0 15px ${moduleColor}` }}
            />
            <h2 className="font-display text-sm font-bold text-white">{moduleName}</h2>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer"
              className="ml-auto rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white md:hidden"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-white/40">Progression</span>
              <span className="text-xs font-medium" style={{ color: moduleColor }}>
                {completed.size}/{exercises.length}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: exercises.length ? `${(completed.size / exercises.length) * 100}%` : "0%",
                  background: `linear-gradient(90deg, ${moduleColor}, ${moduleColor}80)`,
                  boxShadow: `0 0 10px ${moduleColor}50`,
                }}
              >
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

          {/* Combo badge */}
          {comboCount >= 3 && (
            <div
              className={`mb-4 flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                comboCount >= 6 ? "bg-xana-red/15 text-xana-red" : "bg-carthage-gold/15 text-carthage-gold"
              } border border-current/30 animate-pulse`}
              style={{
                boxShadow: comboCount >= 6 ? "0 0 20px rgba(255,34,68,0.3)" : "0 0 20px rgba(251,191,36,0.2)",
              }}
            >
              <Flame size={14} className="animate-bounce" />
              ×{comboCount >= 6 ? 3 : 2} COMBO {comboCount >= 10 && "🔥"}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un exercice..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
            />
          </div>

          {/* Exercise list */}
          <div className="space-y-4">
            {filtered ? (
              <div className="space-y-1.5">
                {filtered.map((ex, i) => (
                  <ExerciseCardEnhanced
                    key={ex.id}
                    {...ex}
                    isCompleted={completed.has(ex.id)}
                    isCurrent={ex.id === exercise?.id}
                    onClick={() => { setCurrentIdx(exercises.indexOf(ex)); setSearch(""); setHelpLevel(0); }}
                    color={moduleColor}
                    index={i}
                  />
                ))}
                {filtered.length === 0 && <p className="py-4 text-center text-xs text-white/30">Aucun résultat</p>}
              </div>
            ) : (
              Object.entries(categories).map(([cat, exs]) => (
                <div key={cat}>
                  <CategoryHeader
                    title={cat}
                    count={exs.length}
                    completed={exs.filter((e) => completed.has(e.id)).length}
                  />
                  <div className="space-y-1.5">
                    {exs.map((ex, i) => (
                      <ExerciseCardEnhanced
                        key={ex.id}
                        {...ex}
                        isCompleted={completed.has(ex.id)}
                        isCurrent={ex.id === exercise?.id}
                        onClick={() => { setCurrentIdx(exercises.indexOf(ex)); setHelpLevel(0); }}
                        color={moduleColor}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/5 bg-dark-bg px-3 py-2 sm:px-4 transition-all ${zenMode ? "opacity-0 h-0 py-0 overflow-hidden" : ""}`}>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Ouvrir le menu"
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white md:hidden"
          >
            <Menu size={18} />
          </button>
          {/* Breadcrumbs */}
          <div className="flex min-w-0 items-center gap-1.5 mr-2">
            <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors"><Home size={14} /></Link>
            <ChevronRight size={12} className="text-white/15" />
            <span className="hidden truncate text-xs text-white/40 sm:inline">{moduleName}</span>
            {exercise && <><ChevronRight size={12} className="hidden text-white/15 sm:inline-block" /><span className="text-xs font-medium text-white/60">#{currentIdx + 1}</span></>}
          </div>

          <div className="flex-1" />

          {/* Combo badge in toolbar */}
          {comboCount >= 3 && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                comboCount >= 6 ? "bg-xana-red/15 text-xana-red border border-xana-red/30" : "bg-carthage-gold/15 text-carthage-gold border border-carthage-gold/30"
              }`}
              style={{
                boxShadow: comboCount >= 6 ? "0 0 15px rgba(255,34,68,0.3)" : "none",
              }}
            >
              <Flame size={11} className="animate-pulse" />
              ×{comboCount >= 6 ? 3 : 2}
            </div>
          )}

          {/* Skip button */}
          <button
            onClick={skipToNextUncompleted}
            title="Prochain non-complété (S)"
            className="rounded-lg p-1.5 text-white/30 hover:bg-lyoko-blue/10 hover:text-lyoko-blue transition-all"
          >
            <SkipForward size={16} />
          </button>

          {/* Zen toggle */}
          <button
            onClick={() => setZenMode(!zenMode)}
            title="Mode Focus (F)"
            className="rounded-lg p-1.5 text-white/30 hover:bg-lyoko-purple/10 hover:text-lyoko-purple transition-all"
          >
            {zenMode ? <Shrink size={16} /> : <Expand size={16} />}
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-1 ml-2">
            <button onClick={goPrev} disabled={currentIdx === 0} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 disabled:opacity-20 transition-all">
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[60px] text-center text-xs text-white/40 font-mono">
              {currentIdx + 1}/{exercises.length}
            </span>
            <button onClick={goNext} disabled={currentIdx >= exercises.length - 1} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 disabled:opacity-20 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Zen mode mini-nav */}
        {zenMode && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-xl border border-white/10 bg-dark-surface/90 px-3 py-1.5 backdrop-blur-sm shadow-lg">
            <button onClick={goPrev} disabled={currentIdx === 0} className="rounded p-1 text-white/40 hover:bg-white/5 disabled:opacity-20"><ChevronLeft size={16} /></button>
            <span className="text-[0.65rem] text-white/40 font-mono">{currentIdx + 1}/{exercises.length}</span>
            <button onClick={goNext} disabled={currentIdx >= exercises.length - 1} className="rounded p-1 text-white/40 hover:bg-white/5 disabled:opacity-20"><ChevronRight size={16} /></button>
            <div className="mx-1 h-4 w-px bg-white/10" />
            <button onClick={() => setZenMode(false)} className="rounded p-1 text-white/40 hover:text-white/70"><Shrink size={14} /></button>
          </div>
        )}

        {/* Exercise content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <TransitionWrapper
            transitionKey={currentIdx}
            type="slideUp"
            duration={200}
          >
            <div
              className="transition-all duration-200"
              style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(12px)" : "translateY(0)",
              }}
            >
              {!exercise ? (
                <EmptyState moduleName={moduleName} moduleLevels={moduleLevels} />
              ) : exercise.type === "intro" ? (
                <IntroViewEnhanced ex={exercise} onComplete={() => { markComplete(exercise.id); goNext(); }} isCompleted={completed.has(exercise.id)} color={moduleColor} />
              ) : exercise.type === "quiz" ? (
                <QuizViewEnhanced
                  exercise={exercise}
                  onComplete={() => markComplete(exercise.id)}
                  goNext={goNext}
                  isCompleted={completed.has(exercise.id)}
                  onWrong={() => setComboCount(0)}
                />
              ) : exercise.type === "puzzle" ? (
                <PuzzleViewEnhanced
                  exercise={exercise}
                  onComplete={() => markComplete(exercise.id)}
                  goNext={goNext}
                  isCompleted={completed.has(exercise.id)}
                  onWrong={() => setComboCount(0)}
                />
              ) : (
                <CodeViewEnhanced
                  ex={exercise}
                  onComplete={() => markComplete(exercise.id)}
                  goNext={goNext}
                  isCompleted={completed.has(exercise.id)}
                  helpLevel={helpLevel}
                  setHelpLevel={setHelpLevel}
                  moduleId={moduleId}
                  onWrong={() => setComboCount(0)}
                />
              )}
            </div>
          </TransitionWrapper>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

// Enhanced Intro View
function IntroViewEnhanced({ ex, onComplete, isCompleted, color }: { ex: Exercise; onComplete: () => void; isCompleted: boolean; color: string }) {
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base sm:text-xl font-bold text-white flex items-center gap-2 min-w-0">
          <BookOpen size={20} style={{ color }} className="flex-shrink-0" />
          <span className="truncate">{ex.title}</span>
        </h2>
        <span
          className="rounded-lg px-3 py-1 text-xs font-semibold"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
        >
          Introduction
        </span>
      </div>

      {ex.description && <p className="mb-4 text-sm text-white/60">{ex.description}</p>}

      {ex.content && (
        <div
          className="intro-content mb-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 text-[0.95rem] leading-[1.8] text-white/80"
          dangerouslySetInnerHTML={{ __html: ex.content }}
        />
      )}

      {ex.code_example && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-medium text-white/50">
            <Code size={14} className="mr-1 inline" /> Exemple :
          </h3>
          <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d0d1a] p-4">
            <code className="font-mono text-sm text-white/85">{ex.code_example}</code>
          </pre>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleContinue}
          className={`inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
            done || isCompleted
              ? "border border-lyoko-green/40 bg-lyoko-green/10 text-lyoko-green"
              : "text-dark-bg"
          }`}
          style={{
            background: done || isCompleted ? undefined : `linear-gradient(135deg, ${color}, ${color}80)`,
            boxShadow: done || isCompleted ? "none" : `0 0 25px ${color}40`,
          }}
        >
          {done || isCompleted ? <><Check size={16} /> Section lue ! +25 XP</> : <><ChevronRight size={16} /> J&apos;ai compris, continuer !</>}
        </button>
      </div>
    </div>
  );
}

// Enhanced Code View
function CodeViewEnhanced({
  ex,
  onComplete,
  goNext,
  isCompleted,
  helpLevel,
  setHelpLevel,
  moduleId,
  onWrong,
}: {
  ex: Exercise;
  onComplete: () => void;
  goNext: () => void;
  isCompleted: boolean;
  helpLevel: number;
  setHelpLevel: (n: number) => void;
  moduleId: string;
  onWrong?: () => void;
}) {
  const [code, setCode] = useState(ex.code_template || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPreview, setShowPreview] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [termRunKey, setTermRunKey] = useState(0);
  const [isTermRunning, setIsTermRunning] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
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
    setIsRunning(true);

    setTimeout(() => {
      const result = validateCode(code, ex.tests, moduleId);
      setIsRunning(false);
      if (result.pass) {
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
        const reason = result.failReason ? `\n${result.failReason}` : "";
        setOutput(`✗ Pas tout à fait... Vérifiez votre code.${reason}${hint}`);
        onWrong?.();
      }
    }, 600);
  };

  // Mobile editor helpers
  const showHelp = () => {
    play("hint");
    if (ex.help_steps && helpLevel < ex.help_steps.length) {
      setHelpLevel(helpLevel + 1);
    } else if (ex.hint && helpLevel === 0) {
      setHelpLevel(1);
    }
  };

  const fileName = moduleId === "frontend" ? "index.html" : moduleId === "react" ? "App.jsx" : moduleId === "javascript" ? "script.js" : moduleId === "nodejs" ? "server.js" : moduleId === "python" ? "main.py" : moduleId === "cpp" ? "main.cpp" : moduleId === "dart" ? "main.dart" : "code";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2 min-w-0 truncate">
          <Code size={18} className="text-lyoko-green flex-shrink-0" />
          <span className="truncate">{ex.title}</span>
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="rounded-md bg-lyoko-green/15 px-2.5 py-1 text-xs font-semibold text-lyoko-green">Code</span>
          {hasPanel && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-all hover:bg-white/5 hover:text-white/70 min-h-[36px]"
            >
              {showPreview ? <><EyeOff size={13} /> Masquer</> : <><Eye size={13} /> Aperçu</>}
            </button>
          )}
        </div>
      </div>

      {ex.description && <p className="mb-3 text-sm text-white/60">{ex.description}</p>}

      {ex.instruction && (
        <div className="mb-3 rounded-xl border-l-4 border-lyoko-green bg-white/[0.02] px-4 py-3 text-sm text-white/70" dangerouslySetInnerHTML={{ __html: ex.instruction }} />
      )}

      {ex.preview && (
        <div className="mb-3">
          <h3 className="mb-1.5 text-xs font-medium text-white/40"><Eye size={12} className="mr-1 inline" /> Résultat attendu :</h3>
          <div className="rounded-lg bg-white p-3 text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: ex.preview }} />
        </div>
      )}

      {helpLevel > 0 && (ex.help_steps || ex.hint) && (
        <div className="mb-3 space-y-2">
          {ex.help_steps ? (
            ex.help_steps.slice(0, helpLevel).map((step, i) => (
              <div key={i} className="rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-4 py-2 text-sm text-carthage-gold animate-fadeIn">
                <Lightbulb size={14} className="inline mr-2" />
                Indice {i + 1}: {step}
              </div>
            ))
          ) : ex.hint ? (
            <div className="rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-4 py-2 text-sm text-carthage-gold">
              <Lightbulb size={14} className="inline mr-2" />
              {ex.hint}
            </div>
          ) : null}
        </div>
      )}

      {/* Mobile tabs (editor / preview) — only when a preview panel exists */}
      {showPreview && hasPanel && (
        <div className="mb-2 flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${mobileTab === "editor" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
          >
            <Code size={13} className="mr-1 inline" /> Éditeur
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${mobileTab === "preview" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
          >
            {hasTerminal ? <TerminalSquare size={13} className="mr-1 inline" /> : hasMobile ? <Smartphone size={13} className="mr-1 inline" /> : <Monitor size={13} className="mr-1 inline" />}
            Aperçu
          </button>
        </div>
      )}

      <div className={`mb-3 flex flex-1 flex-col gap-3 lg:flex-row ${!showPreview || !hasPanel ? "lg:flex-col" : ""}`} style={{ minHeight: 280 }}>
        <div className={`flex flex-col overflow-hidden rounded-xl border border-white/10 ${showPreview && hasPanel ? `lg:w-1/2 ${mobileTab === "editor" ? "flex" : "hidden lg:flex"}` : "w-full"}`}>
          <div className="flex items-center justify-between border-b border-white/5 bg-dark-surface px-3 py-2 sm:px-4">
            <span className="font-mono text-xs text-white/40">{fileName}</span>
            <span className="hidden text-[0.7rem] text-white/20 sm:inline">Ctrl+Enter pour valider</span>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            inputMode="text"
            className="block flex-1 resize-none bg-dark-bg p-3 font-mono text-[16px] leading-relaxed text-white/90 placeholder:text-white/20 focus:outline-none sm:p-4 sm:text-[0.85rem]"
            style={{ minHeight: 240 }}
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
          {/* Mobile code-insert bar */}
          <CodeInsertBar textareaRef={textareaRef} code={code} setCode={setCode} />
        </div>

        {showPreview && hasPanel && (
          <div className={`lg:w-1/2 ${mobileTab === "preview" ? "flex flex-1 flex-col" : "hidden lg:flex lg:flex-1 lg:flex-col"}`} style={{ minHeight: 240 }}>
            {hasVisual && <LivePreviewPanel code={code} moduleId={moduleId} />}
            {hasMobile && <MobileEmulatorPanel code={code} />}
            {hasTerminal && <TerminalPanel code={code} moduleId={moduleId} isRunning={isTermRunning} key={termRunKey} />}
          </div>
        )}
      </div>

    {output && (
      <div className={`mb-3 rounded-xl border p-3 font-mono text-sm ${status === "success" ? "border-lyoko-green/30 bg-lyoko-green/5 text-lyoko-green" : "border-red-500/30 bg-red-500/5 text-red-400"}`}>
        {output}
      </div>
    )}

    <div className="flex flex-wrap gap-2">
      <button
        onClick={runCode}
        disabled={isRunning}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-lyoko-blue to-lyoko-green px-5 py-2.5 text-sm font-bold text-dark-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50"
      >
        {isRunning ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
        {isRunning ? "Exécution..." : "Valider"}
      </button>

      {((ex.help_steps && helpLevel < ex.help_steps.length) || (ex.hint && helpLevel === 0)) && (
        <button onClick={showHelp} className="flex items-center gap-2 rounded-xl border border-carthage-gold/30 px-4 py-2.5 text-sm text-carthage-gold transition-all hover:bg-carthage-gold/10">
          <Lightbulb size={15} /> Aide
        </button>
      )}

      <button
        onClick={() => { play("reset"); setCode(ex.code_template || ""); setOutput(""); setStatus("idle"); }}
        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 transition-all hover:bg-white/5"
      >
        <RotateCcw size={15} /> Reset
      </button>

      {status === "success" && (
        <button onClick={goNext} className="flex items-center gap-2 rounded-xl border border-lyoko-green/30 bg-lyoko-green/10 px-5 py-2.5 text-sm font-medium text-lyoko-green transition-all hover:bg-lyoko-green/20">
          <ChevronRight size={15} /> Suivant
        </button>
      )}
    </div>

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

// Mobile-only code insert bar — sits below the textarea, helps type code on touch keyboards
const INSERT_CHARS = ["{", "}", "(", ")", "[", "]", "<", ">", ";", ":", "'", '"', "=", "/"];
function CodeInsertBar({
  textareaRef,
  code,
  setCode,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  code: string;
  setCode: (s: string) => void;
}) {
  const insert = (str: string) => {
    const t = textareaRef.current;
    if (!t) {
      setCode(code + str);
      return;
    }
    const s = t.selectionStart;
    const e = t.selectionEnd;
    const next = code.substring(0, s) + str + code.substring(e);
    setCode(next);
    setTimeout(() => {
      t.focus();
      t.selectionStart = t.selectionEnd = s + str.length;
    }, 0);
  };
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-t border-white/5 bg-dark-surface/80 px-2 py-1.5 lg:hidden">
      <button
        type="button"
        onClick={() => insert("  ")}
        className="flex-shrink-0 rounded-md bg-white/5 px-2.5 py-1.5 font-mono text-[0.75rem] text-white/70 hover:bg-white/10 active:bg-white/20"
        aria-label="Tabulation"
      >
        ⇥
      </button>
      {INSERT_CHARS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => insert(c)}
          className="flex-shrink-0 rounded-md bg-white/5 px-2.5 py-1.5 font-mono text-[0.85rem] text-white/70 hover:bg-white/10 active:bg-white/20"
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ moduleName, moduleLevels }: { moduleName: string; moduleLevels: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <BookOpen className="h-20 w-20 text-white/10" />
        <div className="absolute inset-0 animate-pulse">
          <Sparkles size={24} className="absolute -top-2 -right-2 text-carthage-gold" />
        </div>
      </div>
      <h2 className="mb-2 font-display text-2xl font-bold text-white/60">Module {moduleName}</h2>
      <p className="mb-4 max-w-md text-sm text-white/40">
        {moduleLevels} exercices interactifs vous attendent. Commencez votre parcours d&apos;apprentissage dès maintenant !
      </p>
      <p className="text-xs text-white/25">Les exercices sont chargés automatiquement depuis la base de données du projet.</p>
    </div>
  );
}
