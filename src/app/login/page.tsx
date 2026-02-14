"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Loader2,
  CheckCircle, AlertTriangle, Sparkles, BookOpen, Trophy,
} from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-dark-bg"><Loader2 className="h-8 w-8 animate-spin text-lyoko-blue" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(decodeURIComponent(err));
    if (searchParams.get("registered")) setSuccess("Compte cr\u00e9\u00e9 avec succ\u00e8s ! Connectez-vous.");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email.trim(), password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* ═══ LEFT — Branding Panel ═══ */}
      <div className="force-dark relative hidden w-[480px] flex-shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#040d1f] via-[#081428] to-[#0a0f2e] p-10 lg:flex">
        {/* Glow effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-lyoko-blue/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-lyoko-purple/[0.06] blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        {/* Top */}
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/images/carthage_logo.png" alt="" width={44} height={44} className="drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
            <span className="font-display text-base font-extrabold tracking-[3px] text-lyoko-blue">PROJET CARTHAGE</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Apprenez le code.<br />
            <span className="bg-gradient-to-r from-lyoko-blue to-lyoko-green bg-clip-text text-transparent">Sauvez Lyoko.</span>
          </h2>
          <p className="max-w-[320px] text-sm leading-relaxed text-white/40">
            1100+ exercices interactifs dans 8 langages. 100% gratuit, sans pub. Progressez, gagnez de l&apos;XP et d&eacute;bloquez des badges.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Sparkles, text: "Quiz, puzzles et d\u00e9fis de code", color: "text-carthage-gold", bg: "bg-carthage-gold/10 border-carthage-gold/20" },
            { icon: BookOpen, text: "8 modules : Front-End, JS, Python, C#...", color: "text-lyoko-blue", bg: "bg-lyoko-blue/10 border-lyoko-blue/20" },
            { icon: Trophy, text: "Syst\u00e8me XP, niveaux et badges", color: "text-lyoko-green", bg: "bg-lyoko-green/10 border-lyoko-green/20" },
          ].map(({ icon: Icon, text, color, bg }) => (
            <div key={text} className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 backdrop-blur-sm">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${bg}`}>
                <Icon size={17} className={color} />
              </div>
              <span className="text-[0.82rem] text-white/60">{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs text-white/15">Code Lyoko &copy; MoonScoop &mdash; Fan Project</p>
      </div>

      {/* ═══ RIGHT — Login Form ═══ */}
      <div className="flex flex-1 items-center justify-center bg-dark-bg px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src="/images/carthage_logo.png" alt="" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" />
            <span className="font-display text-sm font-bold tracking-[2px] text-lyoko-blue">PROJET CARTHAGE</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-wide text-white">Connexion</h1>
            <p className="mt-2 text-sm text-white/40">Entrez vos identifiants pour acc&eacute;der &agrave; votre espace</p>
          </div>

          {/* Alerts */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-lyoko-green/20 bg-lyoko-green/[0.05] p-4">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-lyoko-green" />
              <p className="text-sm text-lyoko-green">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-xana-red/20 bg-xana-red/[0.05] p-4">
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-xana-red" />
              <p className="text-sm text-xana-red">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-white/60">
                Email ou nom d&apos;utilisateur
              </label>
              <div className="group relative">
                <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-blue/60" />
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  required
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-blue/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-white/60">
                Mot de passe
              </label>
              <div className="group relative">
                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-blue/60" />
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-12 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-blue/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/60"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="relative flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-lyoko-blue font-display text-sm font-bold tracking-wide text-white shadow-[0_4px_24px_rgba(0,212,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,212,255,0.35)] disabled:pointer-events-none disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
              <div className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent bg-[length:200%_100%]" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/20">ou continuer avec</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Google OAuth */}
          <a
            href="/api/db/auth/google"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white/80"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77-.01-.54z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </a>

          {/* Spacer + Register link */}
          <div className="mt-6">
            <Link
              href="/register"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-lyoko-green/30 text-sm font-medium text-lyoko-green transition-all hover:border-lyoko-green/50 hover:bg-lyoko-green/10"
            >
              Cr&eacute;er un compte <ArrowRight size={14} />
            </Link>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-white/50 transition-colors hover:text-lyoko-blue">
              &larr; Retour &agrave; l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
