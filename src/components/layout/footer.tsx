import Link from "next/link";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";

const PAYPAL_DONATE_URL = "https://www.paypal.com/donate?business=baptpro%40outlook.com&currency_code=EUR&item_name=Don+pour+Projet+Carthage";

const FOOTER_SECTIONS = [
  {
    title: "MISSIONS",
    links: [
      { label: "Bloc Fullstack", href: "/#missions" },
      { label: "Bloc Mobile", href: "/#missions" },
      { label: "Bloc Desktop", href: "/#missions" },
    ],
  },
  {
    title: "MODULES",
    links: [
      { label: "Front-End", href: "/exercises/frontend" },
      { label: "JavaScript", href: "/exercises/javascript" },
      { label: "Python", href: "/exercises/python" },
      { label: "Dart & Flutter", href: "/exercises/dart" },
      { label: "React", href: "/exercises/react" },
      { label: "Node.js", href: "/exercises/nodejs" },
      { label: "C / C++", href: "/exercises/cpp" },
      { label: "C# .NET", href: "/exercises/csharp" },
    ],
  },
  {
    title: "NAVIGATION",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Badges", href: "/badges" },
      { label: "Tous les modules", href: "/exercises" },
      { label: "Connexion", href: "/login" },
      { label: "Inscription", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-lyoko-blue/10 bg-dark-surface">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <Image src="/images/carthage_logo.png" alt="" width={40} height={40} />
              <span className="font-display text-lg font-bold tracking-wider text-lyoko-blue">
                PROJET CARTHAGE
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/40">
              Le projet ultime de Franz Hopper. Apprenez à coder, sauvez Lyoko,
              exterminez XANA. <strong className="text-lyoko-green">100% gratuit, sans pub, sans abonnement.</strong>
            </p>
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-4 py-2 text-sm font-semibold text-carthage-gold transition-all hover:border-carthage-gold/50 hover:bg-carthage-gold/20"
            >
              <Heart size={14} />
              Soutenir le projet
              <ExternalLink size={12} className="opacity-50" />
            </a>
          </div>

          {/* Link Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 font-display text-xs font-semibold tracking-widest text-lyoko-blue">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-lyoko-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-white/5" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} PROJET CARTHAGE. Inspiré par Code Lyoko.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://quiztimes.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-lyoko-blue"
            >
              Découvrir mon site de quiz le plus complet d&apos;internet
            </a>
            <p className="flex items-center gap-1 text-xs text-white/30">
              Fait avec <Heart size={12} className="text-xana-red" /> pour sauver le monde
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
