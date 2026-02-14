"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useVideoTransition } from "@/components/video-transition";
import { MODULES } from "@/lib/constants";
import {
  Star, Trophy, Flame, BookOpen, ArrowRight, Lock, Play,
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu, Loader2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { playTransition } = useVideoTransition();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lyoko-blue" />
      </div>
    );
  }

  const xpForNextLevel = user.level * 1000;
  const xpProgress = ((user.xp % 1000) / 1000) * 100;

  const totalCompleted = Object.values(user.progress).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-lyoko-blue/10 bg-gradient-to-br from-dark-surface to-dark-bg py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center lg:px-8">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-lyoko-blue/40 text-2xl font-bold shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            style={{
              background: user.avatar?.type === "image"
                ? `url(${user.avatar.url}) center/cover`
                : user.avatar?.type === "initials"
                  ? user.avatar.color
                  : "linear-gradient(135deg, #00d4ff, #00ff88)",
            }}
          >
            {user.avatar?.type === "initials" && user.avatar.initials}
            {!user.avatar && user.displayName.substring(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">
              <span className="bg-gradient-to-r from-lyoko-blue to-lyoko-green bg-clip-text text-transparent">
                {user.displayName}
              </span>
            </h1>
            <p className="text-sm text-white/50">@{user.username} · Niveau {user.level}</p>
            {/* XP Bar */}
            <div className="mt-2 max-w-md">
              <div className="mb-1 flex items-center justify-between text-xs text-white/40">
                <span>{user.xp} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lyoko-blue to-lyoko-green transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Star, label: "XP Total", value: user.xp.toLocaleString(), color: "text-carthage-gold" },
            { icon: Trophy, label: "Niveau", value: user.level.toString(), color: "text-lyoko-purple" },
            { icon: Flame, label: "Streak", value: `${user.streak} jours`, color: "text-xana-red" },
            { icon: BookOpen, label: "Exercices", value: totalCompleted.toString(), color: "text-lyoko-green" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center transition-all hover:border-lyoko-blue/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]">
              <Icon className={`mx-auto mb-2 ${color}`} size={24} />
              <p className="font-display text-2xl font-extrabold">{value}</p>
              <p className="mt-0.5 text-xs text-white/50">{label}</p>
            </div>
          ))}
        </div>

        {/* Courses */}
        <h2 className="mb-4 font-display text-lg font-bold text-white">
          <BookOpen className="mb-0.5 mr-2 inline-block text-lyoko-blue" size={20} />
          Mes Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MODULES.map((mod) => {
            const Icon = ICON_MAP[mod.icon] ?? Braces;
            const completed = user.progress[mod.id]?.length || 0;
            const pct = mod.levels > 0 ? Math.round((completed / mod.levels) * 100) : 0;

            return (
              <div key={mod.id} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-all hover:border-white/15">
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ background: `${mod.color}15`, color: mod.color }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{mod.name}</h3>
                      <p className="text-xs text-white/40">{mod.levels > 0 ? `${mod.levels} niveaux` : "Bientôt"}</p>
                    </div>
                  </div>

                  {mod.available && mod.levels > 0 && (
                    <>
                      <div className="mb-1 flex justify-between text-xs text-white/40">
                        <span>{completed}/{mod.levels}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: mod.color }} />
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-white/5 px-5 py-3">
                  {mod.available ? (
                    <button onClick={() => playTransition(mod.href)} className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-lyoko-blue transition-colors hover:text-lyoko-blue/80">
                      <Play size={12} /> {completed > 0 ? "Continuer" : "Commencer"} <ArrowRight size={12} />
                    </button>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 text-xs text-white/25">
                      <Lock size={12} /> Prochainement
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
