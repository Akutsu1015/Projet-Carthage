"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { UserPlus, LayoutDashboard } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 text-center">
      {/* Animated background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_60%)]" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] top-[20%] h-[200px] w-[200px] rounded-full bg-lyoko-blue/10 blur-[80px]"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[20%] h-[180px] w-[180px] rounded-full bg-lyoko-purple/10 blur-[80px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 lg:px-8">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto mb-8 inline-block"
          >
            <Image
              src="/images/hero/franz_hopper_086.jpg"
              alt="Franz Hopper, créateur du Projet Carthage"
              width={120}
              height={120}
              className="h-[120px] w-[120px] rounded-full border-[3px] border-lyoko-blue object-cover shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(0,212,255,0.5)]"
              loading="lazy"
            />
          </motion.div>

          <blockquote className="mb-4 font-display text-[clamp(1.3rem,3vw,2rem)] font-bold text-white">
            &laquo;&nbsp;Le code est votre arme. Lyoko compte sur vous.&nbsp;&raquo;
          </blockquote>
          <p className="mb-4 text-sm italic text-white/50">
            — Franz Hopper, créateur du Projet Carthage
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-lyoko-green/25 bg-lyoko-green/8 px-4 py-1.5 font-display text-[0.65rem] font-bold tracking-widest text-lyoko-green">
              100% GRATUIT
            </span>
            <span className="rounded-full border border-lyoko-blue/25 bg-lyoko-blue/8 px-4 py-1.5 font-display text-[0.65rem] font-bold tracking-widest text-lyoko-blue">
              SANS PUB
            </span>
            <span className="rounded-full border border-lyoko-purple/25 bg-lyoko-purple/8 px-4 py-1.5 font-display text-[0.65rem] font-bold tracking-widest text-lyoko-purple">
              OPEN SOURCE
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-lyoko-blue to-[#0099cc] px-7 py-3.5 font-display text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,212,255,0.5)]"
            >
              <UserPlus size={16} className="transition-transform group-hover:scale-110" />
              Rejoindre la mission
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-xana-red px-7 py-3.5 font-display text-sm font-semibold text-xana-red transition-all hover:-translate-y-1 hover:bg-xana-red/10 hover:shadow-[0_0_30px_rgba(255,34,68,0.3)]"
            >
              <LayoutDashboard size={16} className="transition-transform group-hover:scale-110" />
              Mon Dashboard
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
