"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Code, Users, BookOpen, Trophy } from "lucide-react";

const STATS = [
  { icon: Code, value: 1100, suffix: "+", label: "Exercices interactifs", color: "#00d4ff" },
  { icon: BookOpen, value: 8, suffix: "", label: "Modules de formation", color: "#00ff88" },
  { icon: Trophy, value: 3, suffix: "", label: "Blocs de compétences", color: "#fbbf24" },
  { icon: Users, value: 100, suffix: "%", label: "Gratuit & sans pub", color: "#a855f7" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lyoko-blue/[0.04] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12]"
              >
                {/* Hover glow bg */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at center, ${stat.color}06, transparent 70%)`,
                  }}
                />

                <div
                  className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${stat.color}12`,
                    border: `1px solid ${stat.color}25`,
                    color: stat.color,
                  }}
                >
                  <stat.icon size={20} />
                </div>

                <div className="relative" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                <p className="relative mt-2 text-xs font-medium text-white/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
