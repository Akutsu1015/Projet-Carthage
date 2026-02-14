"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useVideoTransition } from "@/components/video-transition";
import { MODULES } from "@/lib/constants";
import {
  GraduationCap, Palette, Braces, Terminal, Monitor,
  Smartphone, Atom, Server, Cpu, Play, Lock,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
};

export function ModulesSection() {
  const { playTransition } = useVideoTransition();

  return (
    <section id="courses" className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <GraduationCap className="mb-1 mr-2 inline-block text-carthage-gold" size={28} />
            Tous les <span className="text-carthage-gold">Modules</span>
          </h2>
          <p className="mb-12 text-center text-sm text-white/50">
            Chaque module est une arme contre XANA
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, i) => {
            const Icon = ICON_MAP[mod.icon] ?? Braces;
            return (
              <ScrollReveal key={mod.id} delay={i * 0.05}>
                <article className="flex h-full flex-col rounded-2xl border border-white/5 bg-dark-card p-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-lyoko-blue/20">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border"
                    style={{
                      background: `${mod.color}10`,
                      borderColor: `${mod.color}20`,
                      color: mod.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-1 font-display text-sm font-semibold text-white">
                    {mod.name}
                  </h3>
                  <p className="mb-4 flex-1 text-xs text-white/50">{mod.description}</p>
                  {mod.available ? (
                    <button
                      onClick={() => playTransition(mod.href)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2 text-xs font-medium text-white/80 transition-all hover:border-lyoko-blue/40 hover:text-lyoko-blue"
                    >
                      <Play size={12} />
                      Commencer
                    </button>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 rounded-lg border border-white/8 py-2 text-xs font-medium text-white/30">
                      <Lock size={12} />
                      Bientôt
                    </span>
                  )}
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
