"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import {
  Zap, Star, Medal, Code, Volume2, Puzzle, HelpCircle, Flame, BarChart3,
} from "lucide-react";

const FEATURES = [
  { icon: Star, title: "Système XP", desc: "Gagnez de l'expérience à chaque exercice réussi", color: "#fbbf24" },
  { icon: Medal, title: "Badges", desc: "Débloquez des badges en progressant dans les modules", color: "#a855f7" },
  { icon: Code, title: "Éditeur Live", desc: "Codez directement dans le navigateur", color: "#00ff88" },
  { icon: Volume2, title: "Sons & FX", desc: "Effets sonores immersifs à chaque action", color: "#ff2244" },
  { icon: Puzzle, title: "Puzzles", desc: "Exercices de réordonnancement de code", color: "#00d4ff" },
  { icon: HelpCircle, title: "Quiz", desc: "Testez vos connaissances à chaque étape", color: "#00d4ff" },
  { icon: Flame, title: "Streaks", desc: "Maintenez votre série quotidienne", color: "#ff6644" },
  { icon: BarChart3, title: "Dashboard", desc: "Suivez votre progression en temps réel", color: "#00d4ff" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <Zap className="mb-1 mr-2 inline-block text-lyoko-green" size={28} />
            Système de <span className="text-lyoko-green">Combat</span>
          </h2>
          <p className="mb-14 text-center text-sm text-white/50">
            Vos armes pour vaincre XANA
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {FEATURES.map((feat, i) => (
            <ScrollReveal key={feat.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.12]"
                style={{
                  ["--feat-color" as string]: feat.color,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at center, ${feat.color}08, transparent 70%)`,
                  }}
                />

                {/* Top accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)` }}
                />

                <div
                  className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${feat.color}12`,
                    border: `1px solid ${feat.color}25`,
                    color: feat.color,
                    boxShadow: `0 0 0 0 ${feat.color}00`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${feat.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${feat.color}00`;
                  }}
                >
                  <feat.icon size={22} />
                </div>
                <h3 className="relative mb-1.5 font-display text-sm font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="relative text-xs leading-relaxed text-white/45">{feat.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
