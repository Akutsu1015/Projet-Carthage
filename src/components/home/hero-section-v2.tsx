"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Star, Shield, Swords, ChevronDown,
} from "lucide-react";

const PILLS = [
  { label: "HTML / CSS", color: "#ff6644" },
  { label: "JavaScript", color: "#fbbf24" },
  { label: "Python", color: "#00d4ff" },
  { label: "React", color: "#61dafb" },
  { label: "Node.js", color: "#00ff88" },
  { label: "+ 4 langages", color: "#a855f7" },
];

const FLOATING_ACHIEVEMENTS = [
  { icon: Zap, label: "+120 XP", sub: "Exercice complété", color: "#fbbf24", delay: 0 },
  { icon: Star, label: "Niveau 12", sub: "Développeur Lyoko", color: "#a855f7", delay: 0.8 },
];

const CODE_LINES = [
  { content: "function", type: "keyword" },
  { content: " resistance", type: "fn" },
  { content: "() {", type: "punct" },
  { content: null, indent: 1, text: "// Mission : vaincre XANA", type: "comment" },
  { content: null, indent: 1, text: 'const arme = "JavaScript";', type: "text" },
  { content: null, indent: 1, text: "const xp = 1100;", type: "text" },
  { content: null, indent: 1, text: "return vaincre(arme, xp);", type: "text" },
  { content: "}", type: "punct" },
];

type CodeColor = {
  keyword: string;
  fn: string;
  punct: string;
  comment: string;
  text: string;
};

const C: CodeColor = {
  keyword: "#ff2244",
  fn: "#00d4ff",
  punct: "#f2f2f2",
  comment: "#6a8a9e",
  text: "#e2e8f0",
};

export function HeroSectionV2() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lyoko-blue/[0.06] blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-lyoko-purple/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── LEFT : pitch ── */}
          <div>
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-lyoko-blue/20 bg-lyoko-blue/8 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lyoko-green animate-pulse" />
              <span className="font-display text-[0.65rem] font-bold tracking-widest text-lyoko-blue uppercase">
                100&nbsp;% Gratuit · Sans pub · Open source
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 font-display text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.1] text-white"
            >
              Apprenez à coder.{" "}
              <span
                className="bg-gradient-to-r from-lyoko-blue via-lyoko-green to-lyoko-blue bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto", animation: "gradient-shift 4s linear infinite" }}
              >
                Sauvez Lyoko.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-lg text-base leading-relaxed text-white/60 md:text-lg"
            >
              La plateforme de formation en ligne avec <strong className="text-white/90">1&nbsp;100+ exercices interactifs</strong>,
              un assistant IA et des battles en temps réel. Rejoignez le Projet Carthage.
            </motion.p>

            {/* Language pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-10 flex flex-wrap gap-2"
            >
              {PILLS.map((p) => (
                <span
                  key={p.label}
                  className="rounded-full border px-3 py-1 font-display text-[0.65rem] font-semibold tracking-wide"
                  style={{
                    borderColor: `${p.color}30`,
                    background: `${p.color}10`,
                    color: p.color,
                  }}
                >
                  {p.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-lyoko-blue to-[#009ab8] px-7 py-3.5 font-display text-sm font-bold text-white shadow-[0_4px_24px_rgba(0,212,255,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,212,255,0.5)]"
              >
                <Zap size={16} className="transition-transform group-hover:scale-110" />
                Commencer gratuitement
              </Link>
              <Link
                href="/exercises"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-display text-sm font-bold text-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/20 hover:text-white"
              >
                Voir les formations
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Mini social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/35"
            >
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-lyoko-green" />
                Aucune carte de crédit
              </span>
              <span className="flex items-center gap-1.5">
                <Swords size={12} className="text-xana-red" />
                Battle Code en ligne
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={12} className="text-carthage-gold" />
                Système XP &amp; badges
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT : code preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* IDE card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#050a18] px-5 py-3">
                <span className="h-3 w-3 rounded-full bg-xana-red/70" />
                <span className="h-3 w-3 rounded-full bg-carthage-gold/70" />
                <span className="h-3 w-3 rounded-full bg-lyoko-green/70" />
                <span className="ml-4 font-mono text-[0.7rem] text-white/30">
                  exercise.js — Projet Carthage
                </span>
              </div>

              {/* Line numbers + code */}
              <div className="p-6 font-mono text-[0.82rem] leading-[1.9]">
                <div className="flex items-start gap-5">
                  <div className="select-none text-right text-white/15">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>
                  <div>
                    <div>
                      <span style={{ color: C.keyword }}>function</span>
                      <span style={{ color: C.fn }}> resistance</span>
                      <span style={{ color: C.punct }}>() {"{"}</span>
                    </div>
                    <div className="pl-5">
                      <span style={{ color: C.comment }}>// Mission : vaincre XANA</span>
                    </div>
                    <div className="pl-5">
                      <span style={{ color: C.keyword }}>const</span>
                      <span style={{ color: C.text }}> arme </span>
                      <span style={{ color: C.punct }}>= </span>
                      <span style={{ color: "#00ff88" }}>&quot;JavaScript&quot;</span>
                      <span style={{ color: C.punct }}>;</span>
                    </div>
                    <div className="pl-5">
                      <span style={{ color: C.keyword }}>const</span>
                      <span style={{ color: C.text }}> xp </span>
                      <span style={{ color: C.punct }}>= </span>
                      <span style={{ color: "#fbbf24" }}>1100</span>
                      <span style={{ color: C.punct }}>;</span>
                    </div>
                    <div className="pl-5">
                      <span style={{ color: C.keyword }}>const</span>
                      <span style={{ color: C.text }}> victoire </span>
                      <span style={{ color: C.punct }}>= </span>
                      <span style={{ color: C.fn }}>vaincre</span>
                      <span style={{ color: C.punct }}>(arme, xp);</span>
                    </div>
                    <div className="pl-5">
                      <span style={{ color: C.keyword }}>return</span>
                      <span style={{ color: C.text }}> victoire</span>
                      <span style={{ color: C.punct }}>;</span>
                    </div>
                    <div>
                      <span style={{ color: C.punct }}>{"}"}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-[14px] w-[2px] animate-pulse bg-lyoko-blue/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom status bar */}
              <div className="flex items-center justify-between border-t border-white/[0.05] bg-lyoko-blue/[0.06] px-5 py-2">
                <span className="font-mono text-[0.65rem] text-lyoko-blue/60">JavaScript • UTF-8</span>
                <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-lyoko-green/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-lyoko-green" />
                  Exercice en cours
                </span>
              </div>
            </div>

            {/* Floating achievement cards */}
            {FLOATING_ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.9 + a.delay, duration: 0.5, type: "spring" }}
                className={`absolute flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
                  i === 0 ? "-bottom-4 -left-8" : "-top-4 -right-6"
                }`}
                style={{
                  background: `${a.color}10`,
                  borderColor: `${a.color}30`,
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${a.color}20`, color: a.color }}
                >
                  <a.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{a.label}</p>
                  <p className="text-[0.65rem] text-white/50">{a.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Decorative ring */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl border border-lyoko-blue/[0.05]" />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 hidden justify-center md:flex"
        >
          <div className="flex animate-bounce flex-col items-center gap-1 text-white/20">
            <span className="text-[0.65rem] font-display tracking-widest uppercase">Découvrir</span>
            <ChevronDown size={16} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
