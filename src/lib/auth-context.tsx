"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export interface UserData {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: { type: "image"; url: string } | { type: "initials"; initials: string; color: string } | null;
  xp: number;
  level: number;
  streak: number;
  progress: Record<string, string[]>;
  badges: string[];
  stats: { totalExercises: number; completedExercises: number; totalTime: number; bestStreak: number };
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProgress: (courseType: string, exerciseId: string) => void;
  addXp: (amount: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session cookie on mount via API
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/db/auth", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  // ── LOGIN ──
  const login = useCallback(async (emailOrUsername: string, password: string) => {
    try {
      const res = await fetch("/api/db/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "login", emailOrUsername, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Identifiants incorrects." };
    } catch {
      return { success: false, error: "Erreur de connexion au serveur." };
    }
  }, []);

  // ── REGISTER ──
  const register = useCallback(async (username: string, email: string, password: string, displayName: string) => {
    try {
      const res = await fetch("/api/db/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "register", username, email, password, displayName }),
      });
      const data = await res.json();
      if (data.success) {
        // No user set — email verification required first
        return { success: true, message: data.message, requiresVerification: data.requiresVerification };
      }
      return { success: false, error: data.error || "Erreur d'inscription." };
    } catch {
      return { success: false, error: "Erreur de connexion au serveur." };
    }
  }, []);

  // ── LOGOUT ──
  const logout = useCallback(async () => {
    try {
      await fetch("/api/db/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "logout" }),
      });
    } catch { /* ignore */ }
    setUser(null);
  }, []);

  // ── UPDATE PROGRESS (save to SQLite) ──
  const updateProgress = useCallback((courseType: string, exerciseId: string) => {
    // Optimistic local update
    setUser((prev) => {
      if (!prev) return prev;
      const progress = { ...prev.progress };
      if (!progress[courseType]) progress[courseType] = [];
      if (!progress[courseType].includes(exerciseId)) {
        progress[courseType] = [...progress[courseType], exerciseId];
      }
      return {
        ...prev,
        progress,
        stats: { ...prev.stats, completedExercises: prev.stats.completedExercises + 1 },
      };
    });

    // Persist to SQLite
    fetch("/api/db/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ moduleId: courseType, exerciseId, xp: 25 }),
    }).catch(() => { /* offline: local state is still updated */ });
  }, []);

  // ── ADD XP ──
  const addXp = useCallback((amount: number) => {
    // Optimistic local update
    setUser((prev) => {
      if (!prev) return prev;
      const xp = prev.xp + amount;
      const level = Math.floor(xp / 1000) + 1;
      return { ...prev, xp, level };
    });

    // Persist to SQLite (XP is also added via progress endpoint, but this handles standalone XP)
    fetch("/api/db/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "addXp", amount }),
    }).catch(() => { /* offline fallback */ });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProgress, addXp, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
