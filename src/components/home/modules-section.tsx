"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import { useVideoTransition } from "@/components/video-transition";
import { MODULES } from "@/lib/constants";
import {
  GraduationCap, Palette, Braces, Terminal, Monitor,
  Smartphone, Atom, Server, Cpu, Play, Lock, Gamepad2,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu, Gamepad2,
};

export function ModulesSection() {
  const { playTransition } = useVideoTransition();

  return (
    <section id="courses" className="relative overflow-hidden py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dark-surface/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <GraduationCap className="mb-1 mr-2 inline-block text-carthage-gold" size={28} />
            Tous les <span className="text-carthage-gold">Modules</span>
          </h2>
          <p className="mb-14 text-center text-sm text-white/50">
            Chaque module est une arme contre XANA
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, i) => {
            const Icon = ICON_MAP[mod.icon] ?? Braces;
            return (
              <ScrollReveal key={mod.id} delay={i * 0.05}>
                <motion.article
                  whileHover={mod.available ? { y: -6 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 text-center backdrop-blur-sm ${
                    mod.available
                      ? "cursor-pointer border-white/[0.06] bg-white/[0.02] transition-colors duration-300 hover:border-white/[0.12]"
                      : "border-white/[0.04] bg-white/[0.01] opacity-50"
                  }`}
                  onClick={mod.available ? () => playTransition(mod.href) : undefined}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${mod.color}60, transparent)`,
                    }}
                  />

                  {/* Hover glow */}
                  <div
                    className="absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at center, ${mod.color}06, transparent 70%)`,
                    }}
                  />

                  <div
                    className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${mod.color}12`,
                      borderColor: `${mod.color}25`,
                      color: mod.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="relative mb-1 font-display text-sm font-semibold text-white">
                    {mod.name}
                  </h3>
                  <p className="relative mb-4 flex-1 text-xs leading-relaxed text-white/45">{mod.description}</p>
                  {mod.available ? (
                    <span
                      className="relative flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all duration-300 group-hover:brightness-110"
                      style={{ background: `${mod.color}18`, color: mod.color, border: `1px solid ${mod.color}20` }}
                    >
                      <Play size={12} />
                      Commencer
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] py-2.5 text-xs font-medium text-white/30">
                      <Lock size={12} />
                      Bientôt
                    </span>
                  )}
                </motion.article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
