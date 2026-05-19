"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ExternalLink, Github } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

const PAYPAL_DONATE_URL = "https://www.paypal.com/donate?business=baptpro%40outlook.com&currency_code=EUR&item_name=Don+pour+Projet+Carthage";

export function Footer() {
  const { t } = useTranslation();

  const FOOTER_SECTIONS = [
    {
      title: t("footer.section_missions"),
      links: [
        { label: t("blocs_data.fullstack.name"), href: "/#missions" },
        { label: t("blocs_data.mobile.name"), href: "/#missions" },
        { label: t("blocs_data.desktop.name"), href: "/#missions" },
      ],
    },
    {
      title: t("footer.section_modules"),
      links: [
        { label: t("modules_data.frontend.name"), href: "/exercises/frontend" },
        { label: t("modules_data.javascript.name"), href: "/exercises/javascript" },
        { label: t("modules_data.python.name"), href: "/exercises/python" },
        { label: t("modules_data.dart.name"), href: "/exercises/dart" },
        { label: t("modules_data.react.name"), href: "/exercises/react" },
        { label: t("modules_data.nodejs.name"), href: "/exercises/nodejs" },
        { label: t("modules_data.cpp.name"), href: "/exercises/cpp" },
        { label: t("modules_data.csharp.name"), href: "/exercises/csharp" },
      ],
    },
    {
      title: t("footer.section_nav"),
      links: [
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("badges"), href: "/badges" },
        { label: t("exercises.title"), href: "/exercises" },
        { label: t("nav.login"), href: "/login" },
        { label: t("nav.register"), href: "/register" },
      ],
    },
  ];

  const GITHUB_URL = "https://github.com/Akutsu1015/Projet-Carthage";

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
            <p className="max-w-sm text-sm leading-7 text-white/40" dangerouslySetInnerHTML={{ __html: t("footer.slogan") }} />
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-4 py-2 text-sm font-semibold text-carthage-gold transition-all hover:border-carthage-gold/50 hover:bg-carthage-gold/20"
            >
              <Heart size={14} />
              {t("footer.support_btn")}
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

        {/* Open Source CTA */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center sm:flex-row sm:text-left">
          <Github size={28} className="flex-shrink-0 text-white/60" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80">{t("footer.open_source_title")}</p>
            <p className="text-xs text-white/40">{t("footer.open_source_desc")}</p>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-lyoko-blue/30 hover:bg-lyoko-blue/10 hover:text-white"
          >
            <Github size={14} />
            {t("footer.open_source_btn")}
            <ExternalLink size={12} className="opacity-50" />
          </a>
        </div>

        <hr className="my-8 border-white/5" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {t("footer.inspired")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href="https://quiztimes.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-lyoko-blue"
            >
              {t("footer.quiztimes")}
            </a>
            <p className="flex items-center gap-1 text-xs text-white/30">
              {t("footer.made_with_1")} <Heart size={12} className="text-xana-red" /> {t("footer.made_with_2")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
