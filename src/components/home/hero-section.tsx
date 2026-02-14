"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Crosshair, BookOpen } from "lucide-react";
import { ParticlesCanvas } from "@/components/ui/particles-canvas";

const HERO_IMAGES = [
  { src: "/images/hero/franz_hopper_236.jpg", alt: "Franz Hopper au supercalculateur", title: "Franz Hopper programme le supercalculateur" },
  { src: "/images/hero/franz_hopper_371.jpg", alt: "Code Lyoko", title: "Le monde virtuel Lyoko" },
  { src: "/images/hero/franz_hopper_369.jpg", alt: "Lyoko - Aelita", title: "Aelita dans le Cœur de Lyoko" },
  { src: "/images/hero/franz_hopper_373.jpg", alt: "XANA", title: "La menace XANA" },
  { src: "/images/hero/franz_hopper_025.jpg", alt: "L'équipe", title: "L'équipe au complet" },
];

const PILLS = [
  { icon: "sparkles", label: "100% GRATUIT", color: "lyoko-green" },
  { icon: "code", label: "8 langages", color: "lyoko-blue" },
  { icon: "layers", label: "1100+ exercices", color: "lyoko-purple" },
  { icon: "gamepad-2", label: "Gamifié & immersif", color: "carthage-gold" },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,212,255,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(168,85,247,0.06)_0%,transparent_50%)] bg-dark-bg"
    >
      <ParticlesCanvas />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center">
        {/* Universe Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lyoko-blue/20 bg-lyoko-blue/8 px-3 py-1 font-display text-[0.7rem] font-semibold tracking-wider text-lyoko-blue">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lyoko-blue" />
            UNIVERS CODE LYOKO
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lyoko-green/20 bg-lyoko-green/8 px-3 py-1 font-display text-[0.7rem] font-semibold tracking-wider text-lyoko-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lyoko-green" />
            100% GRATUIT — SANS PUB
          </span>
        </motion.div>

        {/* XANA Eye */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="animate-xana-pulse mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-xana-red shadow-[0_0_30px_rgba(255,34,68,0.3),inset_0_0_20px_rgba(255,34,68,0.1)]"
        >
          <Eye className="h-8 w-8 text-xana-red" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-3 font-mono text-sm tracking-wider text-lyoko-blue/80 md:text-base"
        >
          &gt; TRANSMISSION INTERCEPTÉE... PROJET CARTHAGE ACTIVÉ_
        </motion.p>

        {/* Main Title - H1 for SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="my-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-tight tracking-wider text-white [text-shadow:0_0_20px_rgba(0,212,255,0.5),0_0_60px_rgba(0,212,255,0.2)]"
        >
          DÉTRUISEZ <span className="animate-glitch text-xana-red [text-shadow:0_0_20px_rgba(255,34,68,0.8)]">XANA</span>
          <br />
          <span className="text-lyoko-blue">MAÎTRISEZ LE CODE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-2 font-display text-[clamp(0.7rem,1.5vw,0.95rem)] tracking-[2px] text-carthage-gold"
        >
          APPRENEZ À CODER DANS L&apos;UNIVERS DE CODE LYOKO
        </motion.p>

        {/* Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mb-6 max-w-[700px] text-base leading-relaxed text-white/70"
        >
          Bienvenue dans le <strong className="text-lyoko-blue">Projet Carthage</strong>, une plateforme{" "}
          <strong className="text-lyoko-green">100% gratuite et sans publicité</strong> de
          formation au code plongée dans l&apos;univers de <strong className="text-lyoko-green">Code Lyoko</strong>.
          Franz Hopper a créé le <strong className="text-lyoko-blue">supercalculateur</strong> et le monde virtuel{" "}
          <strong className="text-lyoko-green">Lyoko</strong>, mais <strong className="text-xana-red">XANA</strong>,
          l&apos;intelligence artificielle malveillante, menace de tout détruire.
          Votre mission&nbsp;: apprendre la programmation à travers <strong>1100+ exercices interactifs</strong>,{" "}
          <strong>3 blocs de compétences</strong> (Fullstack, Mobile, Desktop), XP, badges et classement
          pour exterminer XANA une bonne fois pour toutes.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {PILLS.map((pill) => (
            <span
              key={pill.label}
              className={`rounded-full border border-${pill.color}/15 bg-${pill.color}/8 px-3 py-1 text-xs text-white/70`}
            >
              {pill.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          <Link
            href="#missions"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-lyoko-blue to-[#0099cc] px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.5)]"
          >
            <Crosshair size={16} />
            Accepter la mission
          </Link>
          <Link
            href="#story"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-xana-red px-6 py-3 font-display text-sm font-semibold text-xana-red transition-all hover:-translate-y-0.5 hover:bg-xana-red/10 hover:shadow-[0_0_30px_rgba(255,34,68,0.3)]"
          >
            <BookOpen size={16} />
            Lire l&apos;histoire
          </Link>
        </motion.div>

        {/* Hero Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {HERO_IMAGES.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              title={img.title}
              width={120}
              height={80}
              className="h-14 w-20 rounded-lg border border-lyoko-blue/20 object-cover opacity-70 saturate-[0.8] transition-all hover:scale-110 hover:-translate-y-1 hover:border-lyoko-blue hover:opacity-100 hover:shadow-[0_8px_30px_rgba(0,212,255,0.3)] hover:saturate-[1.2] md:h-20 md:w-[120px]"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
