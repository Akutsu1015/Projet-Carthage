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
  play: () => { },
  toggle: () => true,
  enabled: true,
  volume: 0.5,
  setVolume: () => { },
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
      try { ctxRef.current = new AudioContext(); } catch { return false; }
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return true;
  }, []);

  /* ─────────────────────────────────────────────────────────────
   *  HELPER PRIMITIVES
   * ───────────────────────────────────────────────────────────── */

  /** Full ADSR oscillator with optional filter */
  const adsr = useCallback((
    type: OscillatorType,
    freq: number,
    startTime: number,
    attack: number,
    decay: number,
    sustain: number,          // sustain level 0-1
    sustainDur: number,
    release: number,
    peakVol: number,
    filterType?: BiquadFilterType,
    filterFreq?: number,
    filterQ?: number,
    freqEnd?: number,         // optional glide end frequency
  ) => {
    if (!ensureCtx() || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime + startTime;

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const chain: AudioNode[] = [o];

    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (freqEnd !== undefined) {
      o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 0.01), now + attack + decay + sustainDur + release);
    }

    // ADSR
    const vol = peakVol * volRef.current;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + attack);
    g.gain.linearRampToValueAtTime(vol * sustain, now + attack + decay);
    g.gain.setValueAtTime(vol * sustain, now + attack + decay + sustainDur);
    g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + sustainDur + release);

    if (filterType && filterFreq) {
      const f = ctx.createBiquadFilter();
      f.type = filterType;
      f.frequency.setValueAtTime(filterFreq, now);
      if (filterQ) f.Q.setValueAtTime(filterQ, now);
      chain[chain.length - 1].connect(f);
      f.connect(g);
    } else {
      chain[chain.length - 1].connect(g);
    }

    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + attack + decay + sustainDur + release + 0.05);
  }, [ensureCtx]);

  /** FM synthesis: carrier modulated by a modulator */
  const fm = useCallback((
    carrierFreq: number,
    modRatio: number,         // modulator freq = carrier * modRatio
    modDepth: number,         // how much mod affects carrier (Hz)
    startTime: number,
    attack: number,
    decay: number,
    sustain: number,
    sustainDur: number,
    release: number,
    peakVol: number,
    carrierType: OscillatorType = "sine",
  ) => {
    if (!ensureCtx() || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime + startTime;

    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const ampGain = ctx.createGain();

    carrier.type = carrierType;
    carrier.frequency.setValueAtTime(carrierFreq, now);
    mod.type = "sine";
    mod.frequency.setValueAtTime(carrierFreq * modRatio, now);
    modGain.gain.setValueAtTime(modDepth, now);

    const vol = peakVol * volRef.current;
    ampGain.gain.setValueAtTime(0.0001, now);
    ampGain.gain.linearRampToValueAtTime(vol, now + attack);
    ampGain.gain.linearRampToValueAtTime(vol * sustain, now + attack + decay);
    ampGain.gain.setValueAtTime(vol * sustain, now + attack + decay + sustainDur);
    ampGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + sustainDur + release);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(ampGain);
    ampGain.connect(ctx.destination);

    mod.start(now); mod.stop(now + attack + decay + sustainDur + release + 0.1);
    carrier.start(now); carrier.stop(now + attack + decay + sustainDur + release + 0.1);
  }, [ensureCtx]);

  /** Shaped noise burst (white noise + bandpass) */
  const noiseBurst = useCallback((
    startTime: number,
    dur: number,
    vol: number,
    bpFreq?: number,          // bandpass center freq (undefined = broadband)
    bpQ?: number,
  ) => {
    if (!ensureCtx() || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime + startTime;
    const bufSize = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const level = vol * volRef.current;
    g.gain.setValueAtTime(level, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    if (bpFreq) {
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.setValueAtTime(bpFreq, now);
      if (bpQ) f.Q.setValueAtTime(bpQ, now);
      src.connect(f);
      f.connect(g);
    } else {
      src.connect(g);
    }
    g.connect(ctx.destination);
    src.start(now);
  }, [ensureCtx]);

  /** Simple reverb/echo simulation via 2 delayed copies */
  const echo = useCallback((fn: () => void, delayMs: number, vol: number) => {
    fn();
    setTimeout(() => {
      volRef.current *= vol;
      fn();
      volRef.current /= vol;
    }, delayMs);
  }, []);

  /* ═══════════════════════════════════════════════════════════════
   *  SOUND LIBRARY — Greatly Enhanced
   * ═══════════════════════════════════════════════════════════════ */
  const sounds: Record<SoundName, () => void> = {

    // ✅ SUCCESS — Accord majeur + shimmer FM
    success: () => {
      // Warm chord
      adsr("sine", 523.25, 0, 0.01, 0.05, 0.7, 0.05, 0.25, 0.35);
      adsr("sine", 659.25, 0.04, 0.01, 0.05, 0.7, 0.05, 0.25, 0.35);
      adsr("sine", 783.99, 0.08, 0.01, 0.05, 0.7, 0.05, 0.3, 0.35);
      adsr("sine", 1046.50, 0.14, 0.02, 0.08, 0.6, 0.1, 0.4, 0.45);
      // Sparkle FM shimmer
      fm(1046.50, 2.01, 30, 0.14, 0.01, 0.05, 0.5, 0.15, 0.3, 0.2);
      // High triangle chime
      adsr("triangle", 2093, 0.18, 0.005, 0.04, 0.4, 0, 0.25, 0.2);
      // Soft noise breath
      noiseBurst(0, 0.06, 0.07, 3000, 0.5);
    },

    // ❌ ERROR — Dissonance grave + impact
    error: () => {
      // Harsh sawtooth descend
      adsr("sawtooth", 280, 0, 0.005, 0.05, 0.6, 0.05, 0.2, 0.3, "lowpass", 600, 2, 160);
      adsr("sawtooth", 180, 0.12, 0.005, 0.04, 0.5, 0.04, 0.2, 0.28, "lowpass", 400, 2, 100);
      // Impact thud
      fm(80, 0.5, 60, 0, 0.005, 0.06, 0, 0, 0.2, 0.35, "sine");
      // Noise snap
      noiseBurst(0, 0.04, 0.45, 800, 0.3);
      noiseBurst(0.04, 0.08, 0.12, 200, 1.5);
    },

    // 🖱️ CLICK — Pop satisfaisant
    click: () => {
      fm(900, 0.5, 120, 0, 0.003, 0.04, 0, 0, 0.07, 0.3);
      noiseBurst(0, 0.025, 0.2, 4000, 0.8);
    },

    // 🔘 HOVER — Micro-tinkle
    hover: () => {
      adsr("sine", 2400, 0, 0.002, 0.02, 0, 0, 0.04, 0.04);
    },

    // ⬅️ NAVIGATE — Whoosh avec filtre
    navigate: () => {
      adsr("sine", 400, 0, 0.01, 0.12, 0, 0, 0.1, 0.18, "highpass", 300, 0.5, 900);
      adsr("sine", 800, 0.04, 0.01, 0.08, 0, 0, 0.08, 0.12, "lowpass", 1200, 0.7);
      noiseBurst(0, 0.15, 0.06, 600, 0.4);
    },

    // ⭐ XP — Pièce avec tintement
    xp: () => {
      // Metallic coin ping
      fm(987.77, 4.0, 80, 0, 0.003, 0.06, 0.3, 0.1, 0.3, 0.35);
      adsr("triangle", 1975.53, 0.04, 0.002, 0.04, 0.2, 0, 0.2, 0.22);
      adsr("sine", 2637, 0.09, 0.001, 0.03, 0, 0, 0.15, 0.12);
      // Sparkle
      adsr("sine", 3520, 0.06, 0.001, 0.02, 0, 0, 0.1, 0.08);
    },

    // 🏆 BADGE — Fanfare épique
    badge: () => {
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      melody.forEach((f, i) => {
        adsr("sine", f, i * 0.1, 0.01, 0.05, 0.7, 0.02, 0.2, 0.38);
        adsr("triangle", f, i * 0.1 + 0.01, 0.01, 0.05, 0.5, 0.02, 0.2, 0.15);
        if (i >= 3) fm(f, 2, 15, i * 0.1, 0.01, 0.06, 0.5, 0.05, 0.25, 0.15);
      });
      // Final shimmer
      adsr("sine", 2093, 0.5, 0.01, 0.06, 0.4, 0.1, 0.4, 0.3);
      noiseBurst(0, 0.06, 0.06, 4000, 0.5);
    },

    // 🆙 LEVEL UP — Fanfare dramatique
    levelup: () => {
      const scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
      scale.forEach((f, i) => {
        adsr("sine", f, i * 0.065, 0.01, 0.04, 0.7, 0, 0.15, 0.32);
        adsr("triangle", f, i * 0.065, 0.01, 0.04, 0.5, 0, 0.15, 0.13);
        if (i % 2 === 0) fm(f * 2, 1, 8, i * 0.065, 0.005, 0.04, 0.3, 0, 0.12, 0.1);
      });
      // Long sustain chord at the top
      adsr("sine", 1318.51, 0.55, 0.02, 0.1, 0.8, 0.4, 0.5, 0.45);
      adsr("sine", 1046.50, 0.55, 0.02, 0.1, 0.7, 0.4, 0.5, 0.35);
      adsr("sine", 783.99, 0.55, 0.02, 0.1, 0.6, 0.4, 0.5, 0.28);
      fm(1318.51, 3.01, 40, 0.55, 0.02, 0.1, 0.6, 0.4, 0.5, 0.2);
      noiseBurst(0.55, 0.12, 0.08, 5000, 0.5);
    },

    // 🔥 STREAK — Whoosh de feu
    streak: () => {
      adsr("sawtooth", 120, 0, 0.005, 0.1, 0.3, 0.05, 0.15, 0.25, "lowpass", 300, 1.5, 300);
      adsr("sawtooth", 240, 0.05, 0.005, 0.08, 0.3, 0.05, 0.14, 0.2, "lowpass", 500, 1.5, 500);
      noiseBurst(0, 0.25, 0.18, 800, 0.6);
      adsr("sine", 880, 0.18, 0.01, 0.06, 0.5, 0.05, 0.2, 0.3);
    },

    // 💡 HINT — Carillon lumineux
    hint: () => {
      fm(880, 2, 25, 0, 0.01, 0.08, 0.5, 0.1, 0.3, 0.28);
      adsr("sine", 1108.73, 0.1, 0.01, 0.06, 0.4, 0.08, 0.25, 0.22);
      adsr("triangle", 1318.51, 0.18, 0.005, 0.04, 0.2, 0.05, 0.2, 0.14);
      adsr("sine", 2637, 0.22, 0.003, 0.03, 0, 0, 0.15, 0.1);
    },

    // 🔒 LOCK — Cliquetis de métal lourd
    lock: () => {
      fm(120, 0.5, 80, 0, 0.003, 0.06, 0, 0, 0.12, 0.4, "square");
      noiseBurst(0, 0.07, 0.5, 1200, 0.8);
      adsr("square", 180, 0.05, 0.003, 0.04, 0, 0, 0.1, 0.12, "lowpass", 400, 2);
      adsr("square", 120, 0.09, 0.003, 0.05, 0, 0, 0.1, 0.1, "lowpass", 300, 2);
    },

    // 🔓 UNLOCK — Tintement d'ouverture
    unlock: () => {
      adsr("sine", 330, 0, 0.005, 0.05, 0.5, 0.03, 0.2, 0.2);
      adsr("sine", 440, 0.07, 0.005, 0.05, 0.5, 0.03, 0.2, 0.25);
      adsr("sine", 660, 0.14, 0.005, 0.05, 0.5, 0.05, 0.25, 0.3);
      fm(880, 3, 30, 0.2, 0.008, 0.06, 0.4, 0.08, 0.3, 0.22);
      adsr("triangle", 1320, 0.26, 0.003, 0.03, 0.2, 0.03, 0.2, 0.15);
    },

    // 📖 INTRO — Bruissement de page + accord doux
    intro: () => {
      noiseBurst(0, 0.12, 0.18, 2000, 0.8);
      noiseBurst(0.05, 0.1, 0.08, 800, 1.2);
      adsr("sine", 440, 0.08, 0.02, 0.1, 0.5, 0.1, 0.3, 0.18);
      adsr("sine", 554.37, 0.14, 0.02, 0.1, 0.5, 0.08, 0.25, 0.14);
    },

    // 🧩 PUZZLE PLACE — Clac satisfaisant
    puzzlePlace: () => {
      fm(600, 0.5, 80, 0, 0.003, 0.05, 0, 0, 0.1, 0.3);
      noiseBurst(0, 0.04, 0.35, 2500, 0.7);
      adsr("sine", 880, 0.03, 0.005, 0.06, 0.3, 0.03, 0.15, 0.2);
    },

    // 🧩 PUZZLE REMOVE — Glissement
    puzzleRemove: () => {
      adsr("sine", 700, 0, 0.005, 0.08, 0, 0, 0.1, 0.18, "lowpass", 800, 1, 300);
      noiseBurst(0, 0.07, 0.1, 1500, 0.6);
    },

    // ❓ QUIZ SELECT — Tick électronique
    quizSelect: () => {
      fm(1200, 0.5, 60, 0, 0.003, 0.04, 0, 0, 0.06, 0.18);
      adsr("triangle", 1600, 0.01, 0.002, 0.03, 0, 0, 0.06, 0.1);
    },

    // 🔔 NOTIFICATION — Carillon 2 tons
    notification: () => {
      fm(880, 2, 20, 0, 0.008, 0.07, 0.5, 0.05, 0.3, 0.32);
      adsr("sine", 1100, 0, 0.008, 0.07, 0.4, 0.05, 0.3, 0.22);
      fm(1320, 2, 20, 0.18, 0.005, 0.06, 0.4, 0.06, 0.35, 0.28);
      adsr("triangle", 1320, 0.18, 0.005, 0.06, 0.3, 0.06, 0.35, 0.14);
    },

    // ⏱️ TICK — Horloge précise
    tick: () => {
      fm(1200, 0.5, 50, 0, 0.002, 0.025, 0, 0, 0.04, 0.18);
      noiseBurst(0, 0.015, 0.15, 5000, 0.4);
    },

    // 🔥 COMBO — Montée électrique + impact
    combo: () => {
      const steps = [500, 650, 820, 1050, 1320];
      steps.forEach((f, i) => {
        fm(f, 2, 40 - i * 5, i * 0.07, 0.005, 0.04, 0.4, 0.01, 0.15, 0.2 + i * 0.03);
        adsr("triangle", f, i * 0.07, 0.005, 0.04, 0.3, 0.01, 0.12, 0.1);
      });
      // Final punch
      fm(1320, 3, 60, 0.36, 0.005, 0.06, 0.6, 0.05, 0.25, 0.4);
      noiseBurst(0.36, 0.06, 0.22, 3500, 0.5);
    },

    // ⏩ TRANSITION — Swoosh propre
    transition: () => {
      adsr("sine", 300, 0, 0.01, 0.15, 0, 0, 0.1, 0.15, "highpass", 200, 0.5, 1000);
      adsr("sine", 600, 0.02, 0.01, 0.12, 0, 0, 0.08, 0.12, "bandpass", 800, 1.5);
      noiseBurst(0, 0.2, 0.05, 1200, 0.4);
    },

    // 🎯 SECTION COMPLETE — Fanfare RPG
    sectionComplete: () => {
      const melody = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
      melody.forEach((f, i) => {
        adsr("sine", f, i * 0.1, 0.01, 0.06, 0.7, 0.02, 0.25, 0.38);
        adsr("triangle", f, i * 0.1 + 0.01, 0.01, 0.05, 0.5, 0.02, 0.22, 0.15);
        fm(f, 2, 18, i * 0.1, 0.01, 0.05, 0.5, 0.02, 0.2, 0.12);
      });
      // Glory chord
      [523.25, 659.25, 783.99, 1046.50].forEach((f) => {
        adsr("sine", f, 0.72, 0.02, 0.08, 0.8, 0.5, 0.5, 0.28);
      });
      noiseBurst(0, 0.07, 0.08, 5000, 0.5);
      noiseBurst(0.7, 0.1, 0.1, 5000, 0.5);
    },

    // 💻 CODE RUN — Boot séquence techno
    codeRun: () => {
      adsr("square", 165, 0, 0.003, 0.03, 0, 0, 0.04, 0.14, "lowpass", 600, 2);
      adsr("square", 220, 0.04, 0.003, 0.03, 0, 0, 0.04, 0.14, "lowpass", 700, 2);
      adsr("square", 330, 0.08, 0.003, 0.03, 0, 0, 0.04, 0.14, "lowpass", 900, 2);
      adsr("sine", 660, 0.13, 0.005, 0.05, 0.3, 0.04, 0.12, 0.22);
      noiseBurst(0, 0.05, 0.08, 4000, 0.5);
    },

    // ⌨️ TYPING — Mécanique réaliste aléatoire
    typing: () => {
      const f = 600 + Math.random() * 800;
      const variant = Math.random();
      if (variant < 0.3) {
        fm(f, 0.5, 60, 0, 0.002, 0.025, 0, 0, 0.03, 0.12);
      } else {
        noiseBurst(0, 0.02, 0.14 + Math.random() * 0.06, 3000 + Math.random() * 2000, 0.6);
        adsr("sine", f, 0.003, 0.001, 0.015, 0, 0, 0.015, 0.05);
      }
    },

    // 🎮 START — Theme hero intro
    start: () => {
      adsr("sine", 261.63, 0, 0.01, 0.05, 0.7, 0.05, 0.25, 0.3);
      adsr("sine", 329.63, 0.1, 0.01, 0.05, 0.7, 0.05, 0.25, 0.32);
      adsr("sine", 392.00, 0.2, 0.01, 0.05, 0.7, 0.05, 0.25, 0.34);
      adsr("sine", 523.25, 0.3, 0.02, 0.07, 0.8, 0.15, 0.35, 0.4);
      fm(523.25, 2, 25, 0.3, 0.02, 0.07, 0.7, 0.15, 0.38, 0.22);
      adsr("triangle", 784.00, 0.38, 0.01, 0.06, 0.5, 0.1, 0.3, 0.2);
      noiseBurst(0, 0.06, 0.06, 3500, 0.5);
      noiseBurst(0.3, 0.1, 0.08, 5000, 0.5);
    },

    // ⚠️ WARNING — Alarme douce urgente
    warning: () => {
      adsr("triangle", 440, 0, 0.005, 0.06, 0.7, 0.08, 0.1, 0.3, "bandpass", 800, 3);
      adsr("triangle", 440, 0.22, 0.005, 0.06, 0.7, 0.08, 0.1, 0.3, "bandpass", 800, 3);
      adsr("sine", 554, 0.11, 0.005, 0.04, 0.5, 0.04, 0.08, 0.18);
      noiseBurst(0.02, 0.04, 0.08, 1500, 1.0);
      noiseBurst(0.24, 0.04, 0.08, 1500, 1.0);
    },

    // 🔄 RESET — Glissando descendant
    reset: () => {
      adsr("sine", 900, 0, 0.005, 0.1, 0, 0, 0.12, 0.22, "lowpass", 1200, 1, 300);
      adsr("sine", 600, 0.06, 0.005, 0.1, 0, 0, 0.12, 0.18, "lowpass", 900, 1, 200);
      adsr("sine", 400, 0.12, 0.005, 0.1, 0, 0, 0.12, 0.14, "lowpass", 600, 1, 150);
      noiseBurst(0, 0.08, 0.06, 1000, 0.6);
    },
  };

  /* ─────────────────────────────────────────────────────────────
   *  CONTEXT METHODS
   * ───────────────────────────────────────────────────────────── */
  const play = useCallback((name: SoundName) => {
    if (!enabled) return;
    const fn = sounds[name];
    if (fn) fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, adsr, fm, noiseBurst]);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("sound_enabled", String(next));
    if (next) {
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
