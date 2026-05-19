"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Zap, Sword, Brain, Trophy, ChevronRight } from "lucide-react";
import { useVideoTransition } from "@/components/video-transition";

const FEATURES = [
    { icon: Zap, label: "Canvas & Animation", color: "#00d4ff" },
    { icon: Sword, label: "Combat & Collisions", color: "#ff2244" },
    { icon: Brain, label: "IA Ennemis & FSM", color: "#a855f7" },
    { icon: Trophy, label: "Boss Final XANA", color: "#fbbf24" },
];

export function GameDevBanner() {
    const { playTransition } = useVideoTransition();

    return (
        <section className="relative overflow-hidden py-16">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,34,68,0.08)_0%,transparent_70%)]" />
                <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.06)_0%,transparent_70%)]" />
                <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="overflow-hidden rounded-3xl border border-xana-red/20 bg-gradient-to-br from-[#1a0a12] via-dark-card to-[#0a0a1e] shadow-[0_0_60px_rgba(255,34,68,0.1)]"
                >
                    <div className="grid items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
                        {/* Left content */}
                        <div>
                            {/* Badge */}
                            <div className="mb-4 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-xana-red/30 bg-xana-red/10 px-3 py-1 font-display text-[0.65rem] font-bold tracking-widest text-xana-red">
                                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-xana-red" />
                                    NOUVEAU MODULE
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-carthage-gold/20 bg-carthage-gold/10 px-3 py-1 font-display text-[0.65rem] font-bold tracking-wider text-carthage-gold">
                                    30 NIVEAUX
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="mb-3 font-display text-[clamp(1.5rem,4vw,2.8rem)] font-black leading-tight tracking-wider text-white">
                                <Gamepad2 className="mr-3 inline-block text-xana-red" size={36} />
                                CRÉE TON{" "}
                                <span className="bg-gradient-to-r from-xana-red to-[#ff6b6b] bg-clip-text text-transparent">
                                    PREMIER JEU
                                </span>
                            </h2>

                            <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
                                Apprends à développer un <strong className="text-white/90">shoot&apos;em up complet</strong> en JavaScript avec le Canvas.
                                Du premier pixel au <strong className="text-xana-red">boss final XANA</strong>, maîtrise le game dev
                                avec les personnages de <strong className="text-lyoko-blue">Code Lyoko</strong>.
                            </p>

                            {/* Feature pills */}
                            <div className="mb-8 flex flex-wrap gap-2">
                                {FEATURES.map((f) => (
                                    <span
                                        key={f.label}
                                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
                                        style={{
                                            borderColor: `${f.color}20`,
                                            background: `${f.color}08`,
                                            color: `${f.color}cc`,
                                        }}
                                    >
                                        <f.icon size={13} />
                                        {f.label}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => playTransition("/exercises/gamedev")}
                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-xana-red to-[#cc1133] px-7 py-3.5 font-display text-sm font-bold tracking-wide text-white shadow-[0_4px_25px_rgba(255,34,68,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,34,68,0.5)]"
                            >
                                <Gamepad2 size={18} />
                                Jouer maintenant
                                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Right — Game Preview visual */}
                        <div className="hidden md:block">
                            <div className="relative h-[280px] w-[260px]">
                                {/* Mini game canvas mockup */}
                                <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0a0a2e] p-4 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                                    {/* Stars */}
                                    <div className="absolute left-6 top-6 h-1 w-1 rounded-full bg-white/40" />
                                    <div className="absolute left-[60%] top-8 h-1.5 w-1.5 rounded-full bg-lyoko-blue/50" />
                                    <div className="absolute left-[30%] top-[30%] h-1 w-1 rounded-full bg-white/30" />
                                    <div className="absolute left-[80%] top-[25%] h-1 w-1 rounded-full bg-carthage-gold/40" />
                                    <div className="absolute left-[15%] top-[55%] h-1.5 w-1.5 rounded-full bg-lyoko-purple/40" />

                                    {/* Ground */}
                                    <div className="absolute bottom-4 left-4 right-4 h-6 rounded bg-lyoko-green/30" />

                                    {/* Player (yellow square) */}
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute bottom-10 left-6 h-8 w-6 rounded-sm bg-carthage-gold shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                                    />

                                    {/* Bullets */}
                                    <motion.div
                                        animate={{ x: [0, 180] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        className="absolute bottom-[52px] left-14 h-1 w-3 rounded-full bg-lyoko-green shadow-[0_0_8px_rgba(0,255,136,0.6)]"
                                    />
                                    <motion.div
                                        animate={{ x: [0, 180] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
                                        className="absolute bottom-[52px] left-14 h-1 w-3 rounded-full bg-lyoko-green shadow-[0_0_8px_rgba(0,255,136,0.6)]"
                                    />

                                    {/* Enemy (gray block with red eye) */}
                                    <motion.div
                                        animate={{ y: [0, 30, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute right-8 top-[40%]"
                                    >
                                        <div className="h-10 w-10 rounded bg-gray-500/80 shadow-[0_0_15px_rgba(255,34,68,0.3)]">
                                            <div className="flex h-full items-center justify-center">
                                                <div className="h-3 w-3 rounded-full border border-xana-red/60 bg-xana-red/40" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Boss */}
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute right-6 top-4"
                                    >
                                        <div className="h-14 w-14 rounded-lg bg-[#4b0082] shadow-[0_0_20px_rgba(75,0,130,0.5)]">
                                            <div className="flex h-full items-center justify-center">
                                                <div className="h-5 w-5 animate-pulse rounded-full bg-xana-red/70 shadow-[0_0_10px_rgba(255,34,68,0.5)]" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* HUD mockup */}
                                    <div className="absolute left-4 top-4 flex items-center gap-2">
                                        <div className="h-2 w-16 rounded-full bg-gray-700">
                                            <div className="h-full w-[70%] rounded-full bg-lyoko-green" />
                                        </div>
                                        <span className="font-mono text-[8px] text-white/50">SCORE: 1337</span>
                                    </div>
                                </div>

                                {/* Glow */}
                                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-xana-red/10 via-transparent to-lyoko-purple/10 blur-2xl" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
