"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap, LayoutDashboard, LogIn, Rocket,
  LogOut, User, Medal, Volume2, VolumeX, Trophy, Sun, Moon, Heart, Swords, Code,
  Crown, Languages, Zap, Menu, X as XIcon, Shield, Award,
} from "lucide-react";

const PAYPAL_DONATE_URL =
  "https://www.paypal.com/donate?business=baptpro%40outlook.com&currency_code=EUR&item_name=Don+pour+Projet+Carthage";

import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/sound-manager";
import { useTheme } from "next-themes";

// ─── Nav link definitions ────────────────────────────────────────────────────

const NAV_LINKS_DESKTOP = [
  { href: "/exercises",     label: "Modules",       icon: GraduationCap },
  { href: "/battle",        label: "Battle",        icon: Swords },
  { href: "/playground",    label: "Playground",    icon: Code },
  { href: "/leaderboard",   label: "Classement",    icon: Trophy },
  { href: "/certification", label: "Certification", icon: Award },
  { href: "/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
];

// ─── Language toggle ─────────────────────────────────────────────────────────

const LANGS = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English",  flag: "🇬🇧" },
] as const;
type Lang = "fr" | "en";

function useLanguage() {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const stored = localStorage.getItem("site-lang") as Lang | null;
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);
  const toggle = () => {
    setLangState((prev) => {
      const next: Lang = prev === "fr" ? "en" : "fr";
      localStorage.setItem("site-lang", next);
      return next;
    });
  };
  return { lang, toggle };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggle: toggleSound, enabled: soundEnabled } = useSound();
  const { theme, setTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close mobile menu when viewport reaches lg
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const nextLang    = LANGS.find((l) => l.code !== lang) ?? LANGS[1];

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-lyoko-blue/15 bg-dark-bg/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Accueil PROJET CARTHAGE">
            <Image
              src="/images/carthage_logo.png"
              alt=""
              width={36}
              height={36}
              className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
              priority
            />
            <span className="font-display text-sm font-extrabold tracking-[2px] text-lyoko-blue lg:text-base">
              PROJET CARTHAGE
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-1 lg:flex" role="navigation">
            {NAV_LINKS_DESKTOP.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.85rem] font-medium text-white/70 transition-colors hover:text-lyoko-blue hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                >
                  <Icon size={15} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={PAYPAL_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-3 py-1.5 text-xs font-semibold text-carthage-gold transition-all hover:border-carthage-gold/50 hover:bg-carthage-gold/20"
              title="Faire un don pour soutenir le projet"
            >
              <Heart size={13} />
              Faire un don
            </a>

            {/* Language flag toggle — desktop */}
            <button
              onClick={toggleLang}
              title={`Passer en ${nextLang.label}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-lyoko-blue/30 hover:text-white"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="uppercase tracking-wider">{currentLang.code}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              title={mounted ? (theme === "dark" ? "Mode clair" : "Mode sombre") : "Changer de thème"}
            >
              {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
            </button>
            <button
              onClick={toggleSound}
              className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              title={soundEnabled ? "Couper le son" : "Activer le son"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-red-400/70 transition-colors hover:text-red-400 hover:drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" title="Admin Dashboard">
                    <Shield size={14} />
                  </Link>
                )}
                <Link href="/leaderboard" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-[#ffd700]">
                  <Trophy size={14} />
                </Link>
                <Link href="/badges" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-carthage-gold">
                  <Medal size={14} />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:border-lyoko-blue/30"
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                    style={{ background: user.avatar?.type === "initials" ? user.avatar.color : "linear-gradient(135deg, #00d4ff, #00ff88)" }}
                  >
                    {user.avatar?.type === "initials" ? user.avatar.initials : user.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-medium text-white/80">{user.displayName}</span>
                  <span className="rounded bg-lyoko-blue/10 px-1.5 py-0.5 font-display text-[0.6rem] text-lyoko-blue">Nv.{user.level}</span>
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-xana-red/10 hover:text-xana-red"
                  title="Déconnexion"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:border-lyoko-blue/40 hover:text-lyoko-blue"
                >
                  <LogIn size={14} />
                  Connexion
                </Link>
                <Link
                  href="/#missions"
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-lyoko-blue to-[#0099cc] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.5)]"
                >
                  <Rocket size={14} />
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger trigger only */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                href="/dashboard"
                aria-label="Mon profil"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1"
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                  style={{ background: user.avatar?.type === "initials" ? user.avatar.color : "linear-gradient(135deg, #00d4ff, #00ff88)" }}
                >
                  {user.avatar?.type === "initials" ? user.avatar.initials : user.displayName.substring(0, 2).toUpperCase()}
                </div>
                <span className="rounded bg-lyoko-blue/10 px-1.5 py-0.5 font-display text-[0.6rem] text-lyoko-blue">Nv.{user.level}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-white/80 hover:bg-white/5 hover:text-white"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] flex w-[88vw] max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-dark-bg shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-display text-sm font-bold tracking-[2px] text-lyoko-blue">MENU</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* User block */}
        {user ? (
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:border-lyoko-blue/30"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: user.avatar?.type === "initials" ? user.avatar.color : "linear-gradient(135deg, #00d4ff, #00ff88)" }}
            >
              {user.avatar?.type === "initials" ? user.avatar.initials : user.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user.displayName}</div>
              <div className="flex items-center gap-2 text-[0.7rem] text-white/50">
                <span className="rounded bg-lyoko-blue/10 px-1.5 py-0.5 font-display text-lyoko-blue">Nv.{user.level}</span>
                <span>{user.xp} XP</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="mx-4 mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90"
            >
              <LogIn size={15} /> Connexion
            </Link>
            <Link
              href="/#missions"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-lyoko-blue to-[#0099cc] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,212,255,0.3)]"
            >
              <Rocket size={15} /> Commencer
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="mt-4 flex flex-col gap-1 px-2" aria-label="Navigation principale">
          {NAV_LINKS_DESKTOP.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-lyoko-blue"
            >
              <Icon size={18} className="text-white/40" />
              {label}
            </Link>
          ))}
          {user && user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400/80 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <Shield size={18} className="text-red-400/40" />
              Admin
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/badges"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-carthage-gold"
              >
                <Medal size={18} className="text-white/40" />
                Badges
              </Link>
            </>
          )}
        </nav>

        {/* Actions row */}
        <div className="mt-auto border-t border-white/10 p-4">
          <a
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center justify-center gap-2 rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-4 py-2.5 text-sm font-semibold text-carthage-gold"
          >
            <Heart size={15} /> Faire un don
          </a>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleLang}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70"
              aria-label={`Passer en ${nextLang.label}`}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="uppercase tracking-wider">{currentLang.code}</span>
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-white/10 p-2.5 text-white/60 hover:text-white"
              aria-label={mounted ? (theme === "dark" ? "Mode clair" : "Mode sombre") : "Changer de thème"}
            >
              {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
            </button>
            <button
              onClick={toggleSound}
              className="rounded-lg border border-white/10 p-2.5 text-white/60 hover:text-white"
              aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            {user && (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="rounded-lg border border-xana-red/30 p-2.5 text-xana-red hover:bg-xana-red/10"
                aria-label="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
