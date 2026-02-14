"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";

/* ═══ SOUND TYPES ═══ */
type SoundName =
  | "success" | "error" | "click" | "hover" | "navigate"
  | "xp" | "badge" | "levelup" | "streak" | "hint"
  | "lock" | "unlock" | "intro" | "puzzlePlace" | "puzzleRemove"
  | "quizSelect" | "notification" | "tick" | "combo" | "transition"
  | "sectionComplete" | "codeRun" | "typing" | "start" | "warning" | "reset";

interface SoundCtx {
  play: (name: SoundName) => void;
  toggle: () => boolean;
  enabled: boolean;
  volume: number;
  setVolume: (v: number) => void;
}

const SoundContext = createContext<SoundCtx>({
  play: () => {},
  toggle: () => true,
  enabled: true,
  volume: 0.5,
  setVolume: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

/* ═══ PROVIDER ═══ */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("sound_enabled") !== "false";
  });
  const [volume, _setVolume] = useState(() => {
    if (typeof window === "undefined") return 0.5;
    return parseFloat(localStorage.getItem("sound_volume") || "0.5");
  });
  const volRef = useRef(volume);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch { return false; }
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return true;
  }, []);

  /* ── Oscillator helper ── */
  const osc = useCallback((type: OscillatorType, freq: number, start: number, dur: number, vol: number) => {
    if (!ensureCtx() || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime + start);
    g.gain.setValueAtTime(vol * volRef.current, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur + 0.05);
  }, [ensureCtx]);

  /* ── Noise helper ── */
  const noise = useCallback((start: number, dur: number, vol: number) => {
    if (!ensureCtx() || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * volRef.current * 0.3, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    src.connect(g);
    g.connect(ctx.destination);
    src.start(ctx.currentTime + start);
  }, [ensureCtx]);

  /* ═══ SOUND LIBRARY (exact copy from old project) ═══ */
  const sounds: Record<SoundName, () => void> = {
    // ✅ SUCCESS — Accord majeur ascendant joyeux
    success: () => {
      osc("sine", 523.25, 0, 0.15, 0.4);
      osc("sine", 659.25, 0.08, 0.15, 0.4);
      osc("sine", 783.99, 0.16, 0.15, 0.4);
      osc("sine", 1046.50, 0.24, 0.3, 0.5);
      osc("triangle", 523.25, 0, 0.15, 0.15);
      osc("triangle", 1046.50, 0.24, 0.3, 0.2);
    },
    // ❌ ERROR — Deux notes descendantes dissonantes
    error: () => {
      osc("sawtooth", 330, 0, 0.15, 0.25);
      osc("sawtooth", 220, 0.12, 0.25, 0.25);
      osc("square", 165, 0.22, 0.2, 0.1);
      noise(0, 0.08, 0.3);
    },
    // 🖱️ CLICK — Petit pop subtil
    click: () => {
      osc("sine", 800, 0, 0.06, 0.15);
      osc("sine", 1200, 0.01, 0.04, 0.08);
    },
    // 🔘 HOVER — Micro-son très léger
    hover: () => {
      osc("sine", 1400, 0, 0.03, 0.06);
    },
    // ⬅️➡️ NAVIGATE — Whoosh doux
    navigate: () => {
      osc("sine", 600, 0, 0.08, 0.12);
      osc("sine", 800, 0.03, 0.08, 0.1);
    },
    // ⭐ XP — Tintement de pièce
    xp: () => {
      osc("sine", 987.77, 0, 0.1, 0.3);
      osc("sine", 1318.51, 0.06, 0.12, 0.3);
      osc("triangle", 1975.53, 0.1, 0.15, 0.15);
    },
    // 🏆 BADGE — Fanfare courte
    badge: () => {
      osc("sine", 523.25, 0, 0.12, 0.35);
      osc("sine", 659.25, 0.1, 0.12, 0.35);
      osc("sine", 783.99, 0.2, 0.12, 0.35);
      osc("sine", 1046.50, 0.3, 0.25, 0.45);
      osc("triangle", 1046.50, 0.3, 0.25, 0.2);
      osc("sine", 1318.51, 0.45, 0.35, 0.5);
      osc("triangle", 1318.51, 0.45, 0.35, 0.25);
    },
    // 🆙 LEVEL UP — Gamme ascendante rapide
    levelup: () => {
      [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50].forEach((f, i) => {
        osc("sine", f, i * 0.06, 0.1, 0.3);
        osc("triangle", f, i * 0.06, 0.1, 0.12);
      });
      osc("sine", 1046.50, 0.5, 0.4, 0.45);
      osc("triangle", 1046.50, 0.5, 0.4, 0.2);
    },
    // 🔥 STREAK — Effet de combo/flamme
    streak: () => {
      osc("sawtooth", 200, 0, 0.08, 0.15);
      osc("sawtooth", 400, 0.05, 0.08, 0.15);
      osc("sawtooth", 600, 0.1, 0.08, 0.2);
      osc("sine", 800, 0.15, 0.15, 0.25);
      noise(0, 0.05, 0.2);
    },
    // 💡 HINT — Son doux d'ampoule
    hint: () => {
      osc("sine", 880, 0, 0.12, 0.2);
      osc("sine", 1108.73, 0.08, 0.15, 0.2);
      osc("triangle", 1318.51, 0.14, 0.18, 0.15);
    },
    // 🔒 LOCK — Son métallique sourd
    lock: () => {
      osc("square", 150, 0, 0.1, 0.15);
      osc("square", 120, 0.05, 0.12, 0.12);
      noise(0, 0.06, 0.25);
    },
    // 🔓 UNLOCK — Son de déverrouillage
    unlock: () => {
      osc("sine", 440, 0, 0.08, 0.2);
      osc("sine", 660, 0.06, 0.08, 0.2);
      osc("sine", 880, 0.12, 0.12, 0.25);
      osc("triangle", 1100, 0.18, 0.15, 0.15);
    },
    // 📖 INTRO — Son de page tournée
    intro: () => {
      noise(0, 0.08, 0.15);
      osc("sine", 600, 0.02, 0.1, 0.1);
      osc("sine", 900, 0.06, 0.08, 0.08);
    },
    // 🧩 PUZZLE PLACE — Pièce posée
    puzzlePlace: () => {
      osc("sine", 700, 0, 0.06, 0.18);
      osc("sine", 900, 0.03, 0.06, 0.12);
    },
    // 🧩 PUZZLE REMOVE — Pièce retirée
    puzzleRemove: () => {
      osc("sine", 500, 0, 0.05, 0.12);
      osc("sine", 350, 0.03, 0.05, 0.1);
    },
    // ❓ QUIZ SELECT — Sélection d'option
    quizSelect: () => {
      osc("sine", 1000, 0, 0.05, 0.15);
      osc("triangle", 1200, 0.02, 0.04, 0.08);
    },
    // 🔔 NOTIFICATION — Ding doux
    notification: () => {
      osc("sine", 880, 0, 0.15, 0.3);
      osc("sine", 1108.73, 0.1, 0.2, 0.25);
      osc("triangle", 880, 0, 0.15, 0.1);
    },
    // ⏱️ TICK
    tick: () => {
      osc("sine", 1000, 0, 0.03, 0.12);
    },
    // 🔥 COMBO
    combo: () => {
      osc("sine", 600, 0, 0.05, 0.2);
      osc("sine", 800, 0.04, 0.05, 0.2);
      osc("sine", 1000, 0.08, 0.05, 0.25);
      osc("sine", 1200, 0.12, 0.08, 0.3);
      osc("triangle", 1200, 0.12, 0.08, 0.12);
    },
    // ⏩ TRANSITION
    transition: () => {
      osc("sine", 440, 0, 0.06, 0.15);
      osc("sine", 554.37, 0.04, 0.06, 0.15);
      osc("sine", 659.25, 0.08, 0.08, 0.18);
    },
    // 🎯 SECTION COMPLETE
    sectionComplete: () => {
      [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51].forEach((f, i) => {
        osc("sine", f, i * 0.1, 0.15, 0.35);
        if (i > 3) osc("triangle", f, i * 0.1, 0.15, 0.15);
      });
    },
    // 💻 CODE RUN
    codeRun: () => {
      osc("square", 200, 0, 0.03, 0.08);
      osc("square", 300, 0.03, 0.03, 0.08);
      osc("square", 400, 0.06, 0.03, 0.08);
      osc("sine", 600, 0.09, 0.06, 0.12);
    },
    // ⌨️ TYPING
    typing: () => {
      const f = 800 + Math.random() * 600;
      osc("sine", f, 0, 0.02, 0.04);
    },
    // 🎮 START
    start: () => {
      osc("sine", 330, 0, 0.1, 0.25);
      osc("sine", 440, 0.08, 0.1, 0.25);
      osc("sine", 554.37, 0.16, 0.1, 0.3);
      osc("sine", 659.25, 0.24, 0.2, 0.35);
      osc("triangle", 659.25, 0.24, 0.2, 0.15);
    },
    // ⚠️ WARNING
    warning: () => {
      osc("triangle", 440, 0, 0.12, 0.2);
      osc("triangle", 440, 0.15, 0.12, 0.2);
    },
    // 🔄 RESET
    reset: () => {
      osc("sine", 800, 0, 0.06, 0.12);
      osc("sine", 600, 0.04, 0.06, 0.12);
      osc("sine", 400, 0.08, 0.08, 0.1);
    },
  };

  const play = useCallback((name: SoundName) => {
    if (!enabled) return;
    const fn = sounds[name];
    if (fn) fn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, osc, noise]);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("sound_enabled", String(next));
    if (next) {
      // Play a click to confirm
      ensureCtx();
      setTimeout(() => sounds.click(), 50);
    }
    return next;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ensureCtx]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volRef.current = clamped;
    _setVolume(clamped);
    localStorage.setItem("sound_volume", String(clamped));
  }, []);

  return (
    <SoundContext.Provider value={{ play, toggle, enabled, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}
