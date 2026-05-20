"use client";

import Link from "next/link";
import { Trophy, Swords, Flame, Star, Calendar, Award } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

export interface Profile {
  username: string;
  displayName: string;
  avatarType: string;
  avatarValue: string;
  avatarColor: string;
  level: number;
  xp: number;
  rankedPoints: number;
  createdAt: string;
  bio: string | null;
}

export interface Stats {
  totalCompleted: number;
  perModule: { module_id: string; count: number }[];
  badges: { badge_id: string; awarded_at: string }[];
  battles: { wins: number; losses: number };
  streak: number;
}

export default function ProfileClient({ profile, stats }: { profile: Profile; stats: Stats }) {
  const { t } = useTranslation();

  const winRate = stats.battles.wins + stats.battles.losses > 0
    ? Math.round((stats.battles.wins / (stats.battles.wins + stats.battles.losses)) * 100)
    : 0;

  // We format it with the native Date object.
  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div
            className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 text-3xl font-bold"
            style={{ borderColor: profile.avatarColor, color: profile.avatarColor, background: `${profile.avatarColor}1a` }}
          >
            {profile.avatarValue || profile.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-bold truncate">{profile.displayName}</h1>
            <p className="text-sm text-white/40">@{profile.username}</p>
            <p className="mt-1 text-xs text-white/30">
              <Calendar size={11} className="mr-1 inline" />
              {t("profile.member_since").replace("%{date}", memberSince)}
            </p>
            {profile.bio && <p className="mt-3 text-sm text-white/70">{profile.bio}</p>}
          </div>
          <div className="flex gap-3 sm:flex-col sm:items-end">
            <Badge label={t("profile.level")} value={profile.level} color="text-carthage-gold" />
            <Badge label="XP" value={profile.xp.toLocaleString()} color="text-lyoko-blue" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={<Trophy size={18} className="text-carthage-gold" />} label={t("profile.exercises")} value={stats.totalCompleted} />
        <StatBox icon={<Swords size={18} className="text-lyoko-purple" />} label={t("profile.battles_won")} value={`${stats.battles.wins} (${winRate}%)`} />
        <StatBox icon={<Flame size={18} className="text-xana-red" />} label={t("profile.streak")} value={t("profile.days").replace("%{count}", stats.streak.toString())} />
        <StatBox icon={<Star size={18} className="text-lyoko-blue" />} label={t("profile.ranked")} value={profile.rankedPoints} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">{t("profile.module_progression")}</h2>
        {stats.perModule.length === 0 ? (
          <p className="text-sm text-white/40">{t("profile.no_exercises")}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.perModule.map((p) => (
              <Link
                key={p.module_id}
                href={`/exercises/${p.module_id}`}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="text-xs uppercase tracking-wide text-white/40">{p.module_id}</div>
                <div className="mt-1 font-display text-2xl font-bold">{p.count}</div>
                <div className="text-xs text-white/30">{t("profile.exercises_count")}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">
          <Award size={16} className="mr-1 inline text-carthage-gold" />
          {t("profile.badges").replace("%{count}", stats.badges.length.toString())}
        </h2>
        {stats.badges.length === 0 ? (
          <p className="text-sm text-white/40">{t("profile.no_badges")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((b) => (
              <span
                key={b.badge_id}
                className="rounded-full border border-carthage-gold/30 bg-carthage-gold/10 px-3 py-1 text-xs text-carthage-gold"
                title={new Date(b.awarded_at).toLocaleDateString(undefined)}
              >
                {b.badge_id}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Badge({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-center">
      <div className="text-[0.65rem] uppercase tracking-wide text-white/40">{label}</div>
      <div className={`font-display text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase text-white/40">{icon} {label}</div>
      <div className="font-display text-xl font-bold">{value}</div>
    </div>
  );
}
