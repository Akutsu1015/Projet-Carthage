"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Medal, Lock, Star, Flame, BookOpen, Code, Trophy, Zap, Target, Shield,
  Crown, Gem, Palette, Braces, Terminal, Monitor, Smartphone, Atom, Server, Cpu,
  Rocket, Award, GraduationCap, Swords,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  requirement: number;
  type: string;
  category: string;
}

const BADGES: Badge[] = [
  // ═══ PROGRESSION GLOBALE ═══
  { id: "first_exercise", name: "Premier Pas", desc: "Complétez votre premier exercice", icon: Star, color: "#fbbf24", requirement: 1, type: "exercises", category: "Progression" },
  { id: "ten_exercises", name: "Apprenti", desc: "Complétez 10 exercices", icon: BookOpen, color: "#00d4ff", requirement: 10, type: "exercises", category: "Progression" },
  { id: "fifty_exercises", name: "Guerrier du Code", desc: "Complétez 50 exercices", icon: Code, color: "#00ff88", requirement: 50, type: "exercises", category: "Progression" },
  { id: "hundred_exercises", name: "Maître Lyoko", desc: "Complétez 100 exercices", icon: Trophy, color: "#a855f7", requirement: 100, type: "exercises", category: "Progression" },
  { id: "two_hundred", name: "Légende", desc: "Complétez 200 exercices", icon: Shield, color: "#ff2244", requirement: 200, type: "exercises", category: "Progression" },
  { id: "five_hundred", name: "Transcendé", desc: "Complétez 500 exercices", icon: Crown, color: "#ffd700", requirement: 500, type: "exercises", category: "Progression" },
  { id: "all_exercises", name: "Dieu du Code", desc: "Complétez les 1102 exercices", icon: Gem, color: "#ff00ff", requirement: 1102, type: "exercises", category: "Progression" },

  // ═══ XP ═══
  { id: "xp_1000", name: "Énergie", desc: "Atteignez 1 000 XP", icon: Zap, color: "#fbbf24", requirement: 1000, type: "xp", category: "XP" },
  { id: "xp_5000", name: "Surpuissant", desc: "Atteignez 5 000 XP", icon: Zap, color: "#00d4ff", requirement: 5000, type: "xp", category: "XP" },
  { id: "xp_10000", name: "Supernova", desc: "Atteignez 10 000 XP", icon: Zap, color: "#a855f7", requirement: 10000, type: "xp", category: "XP" },
  { id: "xp_20000", name: "Transcendance", desc: "Atteignez 20 000 XP", icon: Rocket, color: "#ff2244", requirement: 20000, type: "xp", category: "XP" },

  // ═══ STREAK ═══
  { id: "streak_3", name: "Régulier", desc: "3 jours de streak", icon: Flame, color: "#ff6644", requirement: 3, type: "streak", category: "Streak" },
  { id: "streak_7", name: "Déterminé", desc: "7 jours de streak", icon: Flame, color: "#ff4422", requirement: 7, type: "streak", category: "Streak" },
  { id: "streak_14", name: "Infatigable", desc: "14 jours de streak", icon: Flame, color: "#ff2244", requirement: 14, type: "streak", category: "Streak" },
  { id: "streak_30", name: "Machine de Guerre", desc: "30 jours de streak", icon: Swords, color: "#ff0044", requirement: 30, type: "streak", category: "Streak" },

  // ═══ MODULES — FRONT-END (250) ═══
  { id: "all_frontend", name: "Architecte Web", desc: "Complétez les 250 exercices Front-End", icon: Palette, color: "#e34c26", requirement: 250, type: "module_frontend", category: "Modules" },

  // ═══ MODULES — JAVASCRIPT (102) ═══
  { id: "all_js", name: "Maître JS", desc: "Complétez les 102 exercices JavaScript", icon: Braces, color: "#f7df1e", requirement: 102, type: "module_javascript", category: "Modules" },

  // ═══ MODULES — PYTHON (120) ═══
  { id: "all_python", name: "Pythoniste", desc: "Complétez les 120 exercices Python", icon: Terminal, color: "#3776ab", requirement: 120, type: "module_python", category: "Modules" },

  // ═══ MODULES — C# .NET (80) ═══
  { id: "all_csharp", name: "Architecte .NET", desc: "Complétez les 120 exercices C# .NET", icon: Monitor, color: "#68217a", requirement: 120, type: "module_csharp", category: "Modules" },

  // ═══ MODULES — DART & FLUTTER (80) ═══
  { id: "all_dart", name: "Maître Flutter", desc: "Complétez les 150 exercices Dart", icon: Smartphone, color: "#02569B", requirement: 150, type: "module_dart", category: "Modules" },

  // ═══ MODULES — REACT (80) ═══
  { id: "all_react", name: "React Sensei", desc: "Complétez les 120 exercices React", icon: Atom, color: "#61dafb", requirement: 120, type: "module_react", category: "Modules" },

  // ═══ MODULES — NODE.JS (80) ═══
  { id: "all_nodejs", name: "Backend Master", desc: "Complétez les 120 exercices Node.js", icon: Server, color: "#68a063", requirement: 120, type: "module_nodejs", category: "Modules" },

  // ═══ MODULES — C/C++ (80) ═══
  { id: "all_cpp", name: "Guerrier Système", desc: "Complétez les 120 exercices C/C++", icon: Cpu, color: "#00599C", requirement: 120, type: "module_cpp", category: "Modules" },

  // ═══ NIVEAUX ═══
  { id: "level_5", name: "Recrue", desc: "Atteignez le niveau 5", icon: Award, color: "#00d4ff", requirement: 5, type: "level", category: "Niveaux" },
  { id: "level_10", name: "Combattant", desc: "Atteignez le niveau 10", icon: Award, color: "#00ff88", requirement: 10, type: "level", category: "Niveaux" },
  { id: "level_20", name: "Vétéran", desc: "Atteignez le niveau 20", icon: GraduationCap, color: "#a855f7", requirement: 20, type: "level", category: "Niveaux" },
];

const CATEGORIES = ["Progression", "Modules", "XP", "Niveaux", "Streak"];

export default function BadgesPage() {
  const { user } = useAuth();

  const totalExercises = user
    ? Object.values(user.progress).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  function isUnlocked(badge: Badge): boolean {
    if (!user) return false;
    if (badge.type === "exercises") return totalExercises >= badge.requirement;
    if (badge.type === "xp") return user.xp >= badge.requirement;
    if (badge.type === "streak") return user.streak >= badge.requirement;
    if (badge.type === "level") return user.level >= badge.requirement;
    if (badge.type.startsWith("module_")) {
      const modId = badge.type.replace("module_", "");
      return (user.progress[modId]?.length || 0) >= badge.requirement;
    }
    return false;
  }

  function getProgress(badge: Badge): number {
    if (!user) return 0;
    let current = 0;
    if (badge.type === "exercises") current = totalExercises;
    else if (badge.type === "xp") current = user.xp;
    else if (badge.type === "streak") current = user.streak;
    else if (badge.type === "level") current = user.level;
    else if (badge.type.startsWith("module_")) {
      const modId = badge.type.replace("module_", "");
      current = user.progress[modId]?.length || 0;
    }
    return Math.min(100, Math.round((current / badge.requirement) * 100));
  }

  const unlockedCount = BADGES.filter(isUnlocked).length;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-white/5 bg-gradient-to-br from-dark-surface to-dark-bg py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-carthage-gold" />
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Badges</h1>
              <p className="text-sm text-white/50">{unlockedCount}/{BADGES.length} débloqués</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 space-y-10">
        {CATEGORIES.map((cat) => {
          const catBadges = BADGES.filter((b) => b.category === cat);
          if (catBadges.length === 0) return null;
          const catUnlocked = catBadges.filter(isUnlocked).length;
          return (
            <section key={cat}>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-white">{cat}</h2>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white/30">
                  {catUnlocked}/{catBadges.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {catBadges.map((badge) => {
                  const unlocked = isUnlocked(badge);
                  const progress = getProgress(badge);
                  const Icon = badge.icon;

                  return (
                    <div
                      key={badge.id}
                      className={`relative overflow-hidden rounded-2xl border p-5 text-center transition-all ${
                        unlocked
                          ? "border-white/15 bg-white/[0.05] shadow-lg"
                          : "border-white/5 bg-white/[0.02] opacity-60"
                      }`}
                    >
                      <div
                        className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                          unlocked ? "border-opacity-30" : "border-white/10 bg-white/5"
                        }`}
                        style={unlocked ? { borderColor: `${badge.color}50`, background: `${badge.color}15`, color: badge.color } : { color: "rgba(255,255,255,0.2)" }}
                      >
                        {unlocked ? <Icon size={28} /> : <Lock size={24} />}
                      </div>

                      <h3 className="mb-1 font-display text-sm font-bold text-white">{badge.name}</h3>
                      <p className="mb-3 text-xs text-white/40">{badge.desc}</p>

                      {!unlocked && (
                        <div className="mx-auto max-w-[120px]">
                          <div className="h-1 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: badge.color + "60" }} />
                          </div>
                          <p className="mt-1 text-[0.65rem] text-white/30">{progress}%</p>
                        </div>
                      )}

                      {unlocked && (
                        <div className="absolute -right-2 -top-2 rotate-12 rounded-full px-2 py-0.5 text-[0.6rem] font-bold" style={{ background: badge.color, color: "#000" }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
