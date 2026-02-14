import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Zap, Star, Medal, Code, Volume2, Puzzle, HelpCircle, Flame, BarChart3,
} from "lucide-react";

const FEATURES = [
  { icon: Star, title: "Système XP", desc: "Gagnez de l'expérience à chaque exercice réussi", color: "carthage-gold" },
  { icon: Medal, title: "Badges", desc: "Débloquez des badges en progressant dans les modules", color: "lyoko-purple" },
  { icon: Code, title: "Éditeur Live", desc: "Codez directement dans le navigateur", color: "lyoko-green" },
  { icon: Volume2, title: "Sons & FX", desc: "Effets sonores immersifs à chaque action", color: "xana-red" },
  { icon: Puzzle, title: "Puzzles", desc: "Exercices de réordonnancement de code", color: "lyoko-blue" },
  { icon: HelpCircle, title: "Quiz", desc: "Testez vos connaissances à chaque étape", color: "lyoko-blue" },
  { icon: Flame, title: "Streaks", desc: "Maintenez votre série quotidienne", color: "lyoko-blue" },
  { icon: BarChart3, title: "Dashboard", desc: "Suivez votre progression en temps réel", color: "lyoko-blue" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <Zap className="mb-1 mr-2 inline-block text-lyoko-green" size={28} />
            Système de <span className="text-lyoko-green">Combat</span>
          </h2>
          <p className="mb-12 text-center text-sm text-white/50">
            Vos armes pour vaincre XANA
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FEATURES.map((feat, i) => (
            <ScrollReveal key={feat.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/5 bg-dark-card p-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-lyoko-blue/20">
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-${feat.color}/20 bg-${feat.color}/10 text-${feat.color}`}>
                  <feat.icon size={22} />
                </div>
                <h3 className="mb-1 font-display text-sm font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-white/50">{feat.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
