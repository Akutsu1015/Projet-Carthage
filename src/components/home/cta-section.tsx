import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { UserPlus, LayoutDashboard } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06)_0%,transparent_70%)] py-20 text-center">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <ScrollReveal>
          <Image
            src="/images/hero/franz_hopper_086.jpg"
            alt="Franz Hopper, créateur du Projet Carthage"
            width={120}
            height={120}
            className="mx-auto mb-6 h-[120px] w-[120px] rounded-full border-[3px] border-lyoko-blue object-cover shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            loading="lazy"
          />
          <blockquote className="mb-4 font-display text-[clamp(1.3rem,3vw,2rem)] font-bold text-white">
            &laquo;&nbsp;Le code est votre arme. Lyoko compte sur vous.&nbsp;&raquo;
          </blockquote>
          <p className="mb-4 text-sm italic text-white/50">
            — Franz Hopper, créateur du Projet Carthage
          </p>
          <p className="mb-8 text-xs font-semibold tracking-wider text-lyoko-green">
            100% GRATUIT · SANS PUB · SANS ABONNEMENT · OPEN SOURCE
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-lyoko-blue to-[#0099cc] px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.5)]"
            >
              <UserPlus size={16} />
              Rejoindre la mission
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-xana-red px-6 py-3 font-display text-sm font-semibold text-xana-red transition-all hover:-translate-y-0.5 hover:bg-xana-red/10 hover:shadow-[0_0_30px_rgba(255,34,68,0.3)]"
            >
              <LayoutDashboard size={16} />
              Mon Dashboard
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
