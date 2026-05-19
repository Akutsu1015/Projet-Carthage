"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Eye, EyeOff, Rocket, User, Mail, Lock, UserCircle, ArrowRight, Loader2,
  AlertTriangle, CheckCircle, Sparkles, Code, Shield, Check, X,
} from "lucide-react";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  function getStrength(): number {
    let s = 0;
    if (password.length >= 6) s++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[@$!%*?&#]/.test(password)) s++;
    return s;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const result = await register(username.trim(), email.trim(), password, displayName.trim());
    if (result.success) {
      setSuccess("Compte créé ! Un email de vérification a été envoyé à " + email.trim() + ". Vérifiez votre boîte de réception (et vos spams) puis cliquez sur le lien de confirmation avant de vous connecter.");
      setLoading(false);
    } else {
      setError(result.error || "Erreur lors de l'inscription.");
      setLoading(false);
    }
  }

  const strength = getStrength();
  const strengthLabel = password.length === 0 ? "" : strength <= 1 ? "Faible" : strength <= 2 ? "Moyen" : strength <= 3 ? "Fort" : "Excellent";
  const strengthColor = password.length === 0 ? "bg-white/5" : strength <= 1 ? "bg-xana-red" : strength <= 2 ? "bg-carthage-gold" : "bg-lyoko-green";
  const strengthTextColor = password.length === 0 ? "" : strength <= 1 ? "text-xana-red" : strength <= 2 ? "text-carthage-gold" : "text-lyoko-green";
  const strengthWidth = password.length === 0 ? "0%" : `${Math.min(strength * 25, 100)}%`;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit = displayName && username.length >= 3 && email && password.length >= 6 && password === confirmPassword;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* ═══ LEFT — Branding Panel ═══ */}
      <div className="force-dark relative hidden w-[480px] flex-shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#041f0d] via-[#081a28] to-[#0a0f2e] p-10 lg:flex">
        {/* Glow effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-lyoko-green/[0.06] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-lyoko-blue/[0.05] blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(0,255,136,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        {/* Top */}
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <Image src="/images/carthage_logo.png" alt="" width={44} height={44} className="drop-shadow-[0_0_12px_rgba(0,255,136,0.3)]" />
            <span className="font-display text-base font-extrabold tracking-[3px] text-lyoko-green">PROJET CARTHAGE</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
            Rejoins l&apos;&eacute;quipe.<br />
            <span className="bg-gradient-to-r from-lyoko-green to-lyoko-blue bg-clip-text text-transparent">Deviens un guerrier du code.</span>
          </h2>
          <p className="max-w-[320px] text-sm leading-relaxed text-white/40">
            Cr&eacute;e ton compte gratuitement et acc&egrave;de &agrave; 1100+ exercices interactifs dans 8 langages. 100% gratuit, sans pub.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Sparkles, text: "Gratuit, sans limite de temps", color: "text-carthage-gold", bg: "bg-carthage-gold/10 border-carthage-gold/20" },
            { icon: Code, text: "\u00c9diteur de code int\u00e9gr\u00e9 avec preview", color: "text-lyoko-blue", bg: "bg-lyoko-blue/10 border-lyoko-blue/20" },
            { icon: Shield, text: "Progression sauv\u00e9e dans votre compte", color: "text-lyoko-green", bg: "bg-lyoko-green/10 border-lyoko-green/20" },
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

      {/* ═══ RIGHT — Register Form ═══ */}
      <div className="flex flex-1 items-center justify-center bg-dark-bg px-6 py-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src="/images/carthage_logo.png" alt="" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]" />
            <span className="font-display text-sm font-bold tracking-[2px] text-lyoko-green">PROJET CARTHAGE</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-wide text-white">Cr&eacute;er un compte</h1>
            <p className="mt-2 text-sm text-white/40">Remplissez les champs ci-dessous pour commencer</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-xana-red/20 bg-xana-red/[0.05] p-4">
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-xana-red" />
              <p className="text-sm text-xana-red">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-lyoko-green/20 bg-lyoko-green/[0.05] p-4">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-lyoko-green" />
              <p className="text-sm text-lyoko-green">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label htmlFor="reg-display" className="mb-2 block text-sm font-medium text-white/60">Nom d&apos;affichage</label>
              <div className="group relative">
                <UserCircle size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-green/60" />
                <input
                  id="reg-display"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Aelita Schaeffer"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-green/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:outline-none"
                />
              </div>
            </div>

            {/* Username + Email side by side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-user" className="mb-2 block text-sm font-medium text-white/60">Nom d&apos;utilisateur</label>
                <div className="group relative">
                  <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-green/60" />
                  <input
                    id="reg-user"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="min. 3 caract."
                    required
                    minLength={3}
                    autoComplete="username"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-green/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-white/60">Email</label>
                <div className="group relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-green/60" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@email.com"
                    required
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-4 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-green/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-pwd" className="mb-2 block text-sm font-medium text-white/60">Mot de passe</label>
              <div className="group relative">
                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-green/60" />
                <input
                  id="reg-pwd"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min. 6 caract\u00e8res"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-dark-surface/60 pl-11 pr-12 text-sm text-white placeholder:text-white/20 transition-all focus:border-lyoko-green/40 focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:outline-none"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/60" tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-white/[0.04]"}`} />
                    ))}
                  </div>
                  {strengthLabel && <span className={`text-xs font-medium ${strengthTextColor}`}>{strengthLabel}</span>}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="reg-confirm" className="mb-2 block text-sm font-medium text-white/60">Confirmer le mot de passe</label>
              <div className="group relative">
                <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-lyoko-green/60" />
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                  required
                  autoComplete="new-password"
                  className={`h-12 w-full rounded-xl border bg-dark-surface/60 pl-11 pr-12 text-sm text-white placeholder:text-white/20 transition-all focus:bg-dark-surface focus:shadow-[0_0_0_3px_rgba(0,255,136,0.08)] focus:outline-none ${
                    passwordsMatch ? "border-lyoko-green/40" : passwordsMismatch ? "border-xana-red/40" : "border-white/[0.08] focus:border-lyoko-green/40"
                  }`}
                />
                {passwordsMatch && (
                  <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-lyoko-green" />
                )}
                {passwordsMismatch && (
                  <X size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-xana-red" />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="relative mt-2 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-lyoko-green font-display text-sm font-bold tracking-wide text-dark-bg shadow-[0_4px_24px_rgba(0,255,136,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,255,136,0.3)] disabled:pointer-events-none disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-dark-bg" />
              ) : (
                <><Rocket size={16} /> Cr&eacute;er mon compte</>
              )}
              <div className="animate-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent bg-[length:200%_100%]" />
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

          {/* Login link */}
          <div className="mt-6">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-white/60 transition-all hover:border-lyoko-blue/30 hover:bg-lyoko-blue/[0.04] hover:text-lyoko-blue"
            >
              D&eacute;j&agrave; un compte ? Se connecter <ArrowRight size={14} />
            </Link>
          </div>

          {/* Back */}
          <div className="mt-5 text-center">
            <Link href="/" className="text-xs text-white/50 transition-colors hover:text-lyoko-blue">
              &larr; Retour &agrave; l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
