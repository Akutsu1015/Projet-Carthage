"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { BookOpen, UserCog, Globe, Skull } from "lucide-react";

const STORY_CARDS = [
  {
    image: "/images/hero/franz_hopper_136.jpg",
    icon: UserCog,
    key: "hopper",
    color: "#00d4ff",
    step: "01",
  },
  {
    image: "/images/hero/franz_hopper_372.jpg",
    icon: Globe,
    key: "lyoko",
    color: "#00ff88",
    step: "02",
  },
  {
    image: "/images/hero/franz_hopper_374.jpg",
    icon: Skull,
    key: "xana",
    color: "#ff2244",
    step: "03",
  },
];

export function StorySection() {
  const { t } = useTranslation();

  return (
    <section id="story" className="relative overflow-hidden py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-surface/50 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <BookOpen className="mb-1 mr-2 inline-block text-lyoko-blue" size={28} />
            {t("home.story_heading")}{" "}
            <span className="text-lyoko-blue">{t("home.story_heading_blue")}</span>
          </h2>
          <p className="mb-14 text-center text-sm text-white/50">
            {t("home.story_subtitle")}
          </p>
        </ScrollReveal>

        {/* Timeline connector (desktop only) */}
        <div className="pointer-events-none absolute left-1/2 top-[280px] hidden h-[calc(100%-320px)] w-px -translate-x-1/2 bg-gradient-to-b from-lyoko-blue/20 via-lyoko-green/20 to-xana-red/20 lg:block" />

        <div className="grid gap-8 md:grid-cols-3">
          {STORY_CARDS.map((card, i) => (
            <ScrollReveal key={card.key} delay={i * 0.15}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.12]"
              >
                {/* Step number */}
                <div
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold"
                  style={{
                    background: `${card.color}18`,
                    border: `1px solid ${card.color}30`,
                    color: card.color,
                  }}
                >
                  {card.step}
                </div>

                {/* Image with gradient overlay */}
                <div className="relative h-[220px] overflow-hidden md:h-[250px]">
                  <Image
                    src={card.image}
                    alt={t("home.story." + card.key + ".alt")}
                    width={400}
                    height={250}
                    className="h-full w-full object-cover saturate-[0.85] transition-all duration-500 group-hover:scale-105 group-hover:saturate-100"
                    loading="lazy"
                  />
                  {/* Bottom gradient fade */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-24"
                    style={{
                      background: `linear-gradient(to top, var(--color-dark-card, #0f1f3a), transparent)`,
                    }}
                  />
                  {/* Color accent overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `${card.color}08` }}
                  />
                </div>

                <div className="relative p-6">
                  <h3
                    className="mb-2 flex items-center gap-2 font-display text-base font-semibold"
                    style={{ color: card.color }}
                  >
                    <card.icon size={18} />
                    {t("home.story." + card.key + ".title")}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-white/55"
                    dangerouslySetInnerHTML={{ __html: t("home.story." + card.key + ".text") }}
                  />
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }}
                />
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
