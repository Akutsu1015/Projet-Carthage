"use client";

import { useVideoTransition } from "@/components/video-transition";
import { MODULES } from "@/lib/constants";
import {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
  ArrowRight, Lock,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
};

export function AvailableModuleCards() {
  const { playTransition } = useVideoTransition();
  const available = MODULES.filter((m) => m.available);

  return (
    <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {available.map((mod) => {
        const Icon = ICON_MAP[mod.icon] ?? Braces;
        return (
          <button
            key={mod.id}
            onClick={() => playTransition(mod.href)}
            className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] text-left transition-all hover:border-white/15 hover:shadow-[0_0_30px_rgba(0,212,255,0.08)]"
          >
            <div className="p-6">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${mod.color}15`, color: mod.color }}
              >
                <Icon size={24} />
              </div>
              <h3 className="mb-1 font-display text-base font-bold text-white">{mod.name}</h3>
              <p className="mb-3 text-xs leading-relaxed text-white/45">{mod.description}</p>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white/40">
                  {mod.levels} exercices
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-lyoko-blue opacity-0 transition-opacity group-hover:opacity-100">
                  Commencer <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function UpcomingModuleCards() {
  const upcoming = MODULES.filter((m) => !m.available);

  if (upcoming.length === 0) return null;

  return (
    <>
      <h2 className="mb-6 font-display text-lg font-bold text-white/50">
        Prochainement
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {upcoming.map((mod) => {
          const Icon = ICON_MAP[mod.icon] ?? Braces;
          return (
            <div
              key={mod.id}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 opacity-50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/20">
                <Icon size={24} />
              </div>
              <h3 className="mb-1 font-display text-base font-bold text-white/60">{mod.name}</h3>
              <p className="mb-3 text-xs text-white/30">{mod.description}</p>
              <span className="flex items-center gap-1 text-xs text-white/25">
                <Lock size={12} /> En développement
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
