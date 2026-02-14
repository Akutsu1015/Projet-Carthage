import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BookOpen, UserCog, Globe, Skull } from "lucide-react";

const STORY_CARDS = [
  {
    image: "/images/hero/franz_hopper_136.jpg",
    alt: "Franz Hopper, créateur du supercalculateur et de Lyoko",
    icon: UserCog,
    title: "Franz Hopper",
    text: 'Scientifique de génie, Franz Hopper a créé le <strong class="text-lyoko-blue">supercalculateur</strong> et le monde virtuel <strong class="text-lyoko-green">Lyoko</strong>. Son projet ultime\u00a0: <em>Carthage</em>, un programme capable de contrer toute menace numérique.',
  },
  {
    image: "/images/hero/franz_hopper_372.jpg",
    alt: "Le monde virtuel Lyoko composé de secteurs numériques",
    icon: Globe,
    title: "Le Monde de Lyoko",
    text: "Lyoko est un univers virtuel composé de secteurs numériques. C'est là que se joue la bataille contre XANA. Chaque ligne de code que vous écrivez renforce les défenses de ce monde.",
  },
  {
    image: "/images/hero/franz_hopper_374.jpg",
    alt: "XANA, l'intelligence artificielle malveillante",
    icon: Skull,
    title: "La Menace XANA",
    iconColor: "text-xana-red",
    text: '<strong class="text-xana-red">XANA</strong> est une intelligence artificielle malveillante qui cherche à détruire Lyoko et envahir le monde réel. Seule la maîtrise complète du code peut l\'arrêter.',
  },
];

export function StorySection() {
  return (
    <section id="story" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold">
            <BookOpen className="mb-1 mr-2 inline-block text-lyoko-blue" size={28} />
            L&apos;Histoire du{" "}
            <span className="text-lyoko-blue">Projet Carthage</span>
          </h2>
          <p className="mb-12 text-center text-sm text-white/50">
            Le projet ultime de Franz Hopper pour sauver l&apos;humanité
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {STORY_CARDS.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <article className="group h-full overflow-hidden rounded-2xl border border-lyoko-blue/10 bg-dark-card transition-all duration-400 hover:-translate-y-1 hover:border-lyoko-blue/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={400}
                  height={250}
                  className="h-[200px] w-full object-cover saturate-[0.9] transition-all group-hover:saturate-100 md:h-[250px]"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="mb-2 flex items-center gap-2 font-display text-base text-lyoko-blue">
                    <card.icon size={18} className={card.iconColor ?? ""} />
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-white/60"
                    dangerouslySetInnerHTML={{ __html: card.text }}
                  />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
