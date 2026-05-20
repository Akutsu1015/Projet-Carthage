"use client";

import { useVideoTransition } from "@/components/video-transition";
import { MODULES } from "@/lib/constants";
import { useTranslation } from "@/lib/translation-context";
import {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
  ArrowRight, Lock,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
};

export function AvailableModuleCards() {
  const { t } = useTranslation();
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
              <h3 className="mb-1 font-display text-base font-bold text-white">
                {t(`modules_data.${mod.id}.name`)}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-white/45 text-pretty">
                {t(`modules_data.${mod.id}.description`)}
              </p>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.7rem] font-semibold text-white/40">
                  {mod.levels} {t("exercises.exercises_suffix")}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-lyoko-blue opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  {t("exercises.start")} <ArrowRight size={12} />
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
  const { t } = useTranslation();
  const upcoming = MODULES.filter((m) => !m.available);

  if (upcoming.length === 0) return null;

  return (
    <>
      <h2 className="mb-6 font-display text-lg font-bold text-white/50">
        {t("exercises.upcoming_title")}
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
              <h3 className="mb-1 font-display text-base font-bold text-white/60">
                {t(`modules_data.${mod.id}.name`)}
              </h3>
              <p className="mb-3 text-xs text-white/30">
                {t(`modules_data.${mod.id}.description`)}
              </p>
              <span className="flex items-center gap-1 text-xs text-white/25">
                <Lock size={12} /> {t("exercises.in_development")}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
