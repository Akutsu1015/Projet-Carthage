"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, BookOpen, Crosshair, GraduationCap, LayoutDashboard, LogIn, Rocket, LogOut, User, Medal, Volume2, VolumeX, Trophy, Sun, Moon, Heart, Swords, Code } from "lucide-react";

const PAYPAL_DONATE_URL = "https://www.paypal.com/donate?business=baptpro%40outlook.com&currency_code=EUR&item_name=Don+pour+Projet+Carthage";
import { useAuth } from "@/lib/auth-context";
import { useSound } from "@/lib/sound-manager";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { href: "/#story", label: "Histoire", icon: BookOpen },
  { href: "/#missions", label: "Missions", icon: Crosshair },
  { href: "/exercises", label: "Modules", icon: GraduationCap },
  { href: "/battle", label: "Battle", icon: Swords },
  { href: "/playground", label: "Playground", icon: Code },
  { href: "/leaderboard", label: "Classement", icon: Trophy },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toggle: toggleSound, enabled: soundEnabled } = useSound();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
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
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
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
              <Link href="/leaderboard" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-[#ffd700]">
                <Trophy size={14} />
              </Link>
              <Link href="/badges" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-white/60 transition-colors hover:text-carthage-gold">
                <Medal size={14} />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 transition-all hover:border-lyoko-blue/30">
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/5 bg-dark-bg/95 px-4 pb-4 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1 py-3">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-lyoko-blue"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link href="/badges" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-carthage-gold">
                  <Medal size={16} /> Badges
                </Link>
              </li>
            )}
          </ul>
          <a
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-lg border border-carthage-gold/30 bg-carthage-gold/10 px-3 py-2.5 text-sm font-semibold text-carthage-gold transition-all hover:bg-carthage-gold/20"
          >
            <Heart size={16} />
            Soutenir le projet (Don)
          </a>
          <div className="flex items-center justify-between border-t border-white/5 py-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60"
            >
              {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
              {mounted && (theme === "dark" ? "Mode clair" : "Mode sombre")}
            </button>
            <button
              onClick={toggleSound}
              className="rounded-lg p-2 text-white/40"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
          <div className="flex gap-2 border-t border-white/5 pt-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 py-2 text-sm font-medium text-white/80">
                  <User size={14} /> {user.displayName}
                </Link>
                <button onClick={() => { logout(); setOpen(false); }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-xana-red/30 px-4 py-2 text-sm font-medium text-xana-red">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 py-2 text-sm font-medium text-white/80">
                  <LogIn size={14} /> Connexion
                </Link>
                <Link href="/#missions" onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-lyoko-blue to-[#0099cc] py-2 text-sm font-semibold text-white">
                  <Rocket size={14} /> Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
