"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BLOCS, MODULES } from "@/lib/constants";
import {
  Crosshair, Eye, Globe, Smartphone, Monitor,
  Palette, Braces, Terminal, Cpu, Atom, Server, ArrowRight, Lock,
  Radar, Cast, Microchip,
} from "lucide-react";
import { useEffect, useState } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Monitor, Palette, Braces, Terminal, Cpu, Atom, Server,
};

const SECTOR_ICON: Record<string, React.ElementType> = {
  fullstack: Radar,
  mobile: Cast,
  desktop: Microchip,
};

function XanaThreatBar() {
  const [power, setPower] = useState(100);

  useEffect(() => {
    let blocs = 0;
    try {
      const fe = JSON.parse(localStorage.getItem("frontend_completed_exercises") || "[]");
      const js = JSON.parse(localStorage.getItem("js_completed_exercises") || "[]");
      if (fe.length >= 200 && js.length >= 50) blocs++;
    } catch {}
    try {
      const cs = JSON.parse(localStorage.getItem("csharp_completed_exercises") || "[]");
      const py = JSON.parse(localStorage.getItem("python_completed_exercises") || "[]");
      if (cs.length >= 50 && py.length >= 50) blocs++;
    } catch {}
    setPower(Math.max(0, 100 - blocs * 33));
  }, []);

  return (
    <div className="mb-12 rounded-2xl border border-xana-red/15 bg-gradient-to-br from-xana-red/5 to-lyoko-purple/5 p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-display text-xs font-semibold text-xana-red">
          <Eye size={14} /> Puissance de XANA
        </span>
        <span className="font-mono text-xs text-white/50">{power}%</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-md bg-white/5">
        <div
          className="h-full rounded-md bg-gradient-to-r from-xana-red via-[#ff6644] to-carthage-gold shadow-[0_0_20px_rgba(255,34,68,0.4)] transition-all duration-[2s] ease-out"
          style={{ width: `${power}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs text-white/40">
        Chaque bloc complété réduit la puissance de XANA de 33%. Complétez les 3 pour l&apos;éliminer.
      </p>
    </div>
  );
}

export function MissionsSection() {
  return (
    <section id="missions" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <Crosshair className="mb-1 mr-2 inline-block text-xana-red" size={28} />
            Vos <span className="text-xana-red">3 Missions</span>
          </h2>
          <p className="mb-8 text-center text-sm text-white/50">
            Complétez les 3 blocs pour exterminer XANA définitivement
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <XanaThreatBar />
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {BLOCS.map((bloc, i) => {
            const BlocIcon = ICON_MAP[bloc.icon] ?? Globe;
            const SectorIcon = SECTOR_ICON[bloc.id] ?? Radar;
            const blocModules = bloc.modules.map((id) => MODULES.find((m) => m.id === id)!);

            return (
              <ScrollReveal key={bloc.id} delay={i * 0.15}>
                <div
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/6 bg-dark-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  style={{
                    ["--bloc-color" as string]: bloc.color,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${bloc.color}, transparent)` }}
                  />

                  {/* Icon */}
                  <div
                    className="mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-2xl border text-[1.8rem]"
                    style={{
                      background: `${bloc.color}15`,
                      borderColor: `${bloc.color}30`,
                      color: bloc.color,
                    }}
                  >
                    <BlocIcon size={28} />
                  </div>

                  <h3 className="mb-2 font-display text-lg text-white">{bloc.name}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/60">{bloc.description}</p>

                  <span
                    className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide"
                    style={{
                      background: `${bloc.color}10`,
                      borderColor: `${bloc.color}25`,
                      color: bloc.color,
                    }}
                  >
                    <SectorIcon size={12} />
                    {bloc.sector}
                  </span>

                  {/* Module list */}
                  <div className="space-y-2">
                    {blocModules.map((mod) => {
                      if (!mod) return null;
                      const ModIcon = ICON_MAP[mod.icon] ?? Braces;
                      return (
                        <div
                          key={mod.id}
                          className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/2 px-3 py-2.5 transition-all hover:border-white/10 hover:bg-white/5"
                        >
                          <ModIcon size={18} style={{ color: mod.color }} />
                          <span className="flex-1 text-sm font-medium text-white/80">
                            {mod.name}
                            {mod.levels > 0 && (
                              <span className="ml-1 text-xs text-white/40">({mod.levels} niveaux)</span>
                            )}
                          </span>
                          {mod.available ? (
                            <Link
                              href={mod.href}
                              className="flex items-center gap-1 text-xs text-lyoko-blue transition-colors hover:underline"
                            >
                              Lancer <ArrowRight size={12} />
                            </Link>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-white/30">
                              Bientôt <Lock size={12} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
