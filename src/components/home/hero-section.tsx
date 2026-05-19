"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Eye, Crosshair, BookOpen, ChevronDown } from "lucide-react";
import { useRef, MouseEvent } from "react";
import { Hero3DScene } from "./hero-3d-scene";

const HERO_IMAGES = [
  { src: "/images/hero/franz_hopper_236.jpg", alt: "Franz Hopper au supercalculateur", title: "Franz Hopper programme le supercalculateur" },
  { src: "/images/hero/franz_hopper_371.jpg", alt: "Code Lyoko", title: "Le monde virtuel Lyoko" },
  { src: "/images/hero/franz_hopper_369.jpg", alt: "Lyoko - Aelita", title: "Aelita dans le Cœur de Lyoko" },
  { src: "/images/hero/franz_hopper_373.jpg", alt: "XANA", title: "La menace XANA" },
  { src: "/images/hero/franz_hopper_025.jpg", alt: "L'équipe", title: "L'équipe au complet" },
];

const PILLS = [
  { label: "100% GRATUIT", color: "lyoko-green" },
  { label: "8 langages", color: "lyoko-blue" },
  { label: "1100+ exercices", color: "lyoko-purple" },
  { label: "Gamifié & immersif", color: "carthage-gold" },
];

function MagneticButton({
  children,
  href,
  variant,
}: {
  children: React.ReactNode;
  href: string;
  variant: "primary" | "secondary";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === "primary"
      ? "bg-gradient-to-br from-lyoko-blue to-[#0099cc] text-white shadow-[0_4px_20px_rgba(0,212,255,0.35)] hover:shadow-[0_8px_40px_rgba(0,212,255,0.6)]"
      : "border-2 border-xana-red text-xana-red hover:bg-xana-red/10 hover:shadow-[0_0_30px_rgba(255,34,68,0.35)]";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-6 py-3 font-display text-sm font-semibold transition-shadow ${base}`}
    >
      {children}
    </motion.a>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 20 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 100, damping: 20 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen items-center overflow-hidden bg-dark-bg"
    >
      {/* 3D Scene background */}
      <Hero3DScene />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[15%] h-[420px] w-[420px] rounded-full bg-lyoko-blue/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[5%] bottom-[10%] h-[380px] w-[380px] rounded-full bg-[#a855f7]/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[45%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-xana-red/10 blur-[120px]"
        />
      </div>

      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,212,255,0.4) 2px, rgba(0,212,255,0.4) 3px)",
        }}
      />

      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
        className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center"
      >
        {/* Universe Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lyoko-blue/30 bg-lyoko-blue/10 px-3 py-1 font-display text-[0.7rem] font-semibold tracking-wider text-lyoko-blue backdrop-blur-md">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-lyoko-blue shadow-[0_0_8px_rgba(0,212,255,0.9)]"
            />
            UNIVERS CODE LYOKO
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lyoko-green/30 bg-lyoko-green/10 px-3 py-1 font-display text-[0.7rem] font-semibold tracking-wider text-lyoko-green backdrop-blur-md">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-lyoko-green shadow-[0_0_8px_rgba(0,255,136,0.9)]"
            />
            100% GRATUIT — SANS PUB
          </span>
        </motion.div>

        {/* XANA Eye */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.15, rotate: 15 }}
          className="animate-xana-pulse relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-xana-red shadow-[0_0_40px_rgba(255,34,68,0.5),inset_0_0_20px_rgba(255,34,68,0.15)]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-8px] rounded-full border border-dashed border-xana-red/40"
          />
          <Eye className="h-8 w-8 text-xana-red drop-shadow-[0_0_8px_rgba(255,34,68,0.8)]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-3 font-mono text-sm tracking-wider text-lyoko-blue/80 md:text-base"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            &gt;
          </motion.span>{" "}
          TRANSMISSION INTERCEPTÉE... PROJET CARTHAGE ACTIVÉ
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            _
          </motion.span>
        </motion.p>

        {/* Main Title - H1 for SEO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="my-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-tight tracking-wider text-white [text-shadow:0_0_30px_rgba(0,212,255,0.6),0_0_80px_rgba(0,212,255,0.3)]"
        >
          DÉTRUISEZ{" "}
          <span className="animate-glitch text-xana-red [text-shadow:0_0_25px_rgba(255,34,68,0.9)]">
            XANA
          </span>
          <br />
          <span className="bg-gradient-to-r from-lyoko-blue via-lyoko-green to-lyoko-blue bg-[length:200%_100%] bg-clip-text text-transparent [animation:gradient-shift_4s_linear_infinite]">
            MAÎTRISEZ LE CODE
          </span>
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
          className="mx-auto mb-6 max-w-[700px] text-base leading-relaxed text-white/75"
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
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } },
          }}
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {PILLS.map((pill) => (
            <motion.span
              key={pill.label}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`cursor-default rounded-full border border-${pill.color}/25 bg-${pill.color}/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md transition-colors hover:border-${pill.color}/50`}
            >
              {pill.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          <MagneticButton href="#missions" variant="primary">
            <Crosshair size={16} />
            Accepter la mission
          </MagneticButton>
          <MagneticButton href="#story" variant="secondary">
            <BookOpen size={16} />
            Lire l&apos;histoire
          </MagneticButton>
        </motion.div>

        {/* Hero Gallery */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 1.1 } },
          }}
          className="flex flex-wrap justify-center gap-2"
        >
          {HERO_IMAGES.map((img) => (
            <motion.div
              key={img.src}
              variants={{
                hidden: { opacity: 0, y: 20, rotateY: -20 },
                show: { opacity: 1, y: 0, rotateY: 0 },
              }}
              whileHover={{ scale: 1.12, y: -6, rotateY: 5 }}
              style={{ transformPerspective: 800 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                title={img.title}
                width={120}
                height={80}
                className="h-14 w-20 rounded-lg border border-lyoko-blue/25 object-cover opacity-75 saturate-[0.8] transition-all hover:border-lyoko-blue hover:opacity-100 hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:saturate-[1.2] md:h-20 md:w-[120px]"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-lyoko-blue/70 hover:text-lyoko-blue"
        aria-label="Défiler"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[0.65rem] tracking-widest">SCROLL</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  );
}
