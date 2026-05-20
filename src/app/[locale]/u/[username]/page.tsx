import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileClient, { Profile, Stats } from "@/components/profile-client";

async function fetchProfile(username: string): Promise<{ profile: Profile; stats: Stats } | null> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/db/profile/${encodeURIComponent(username)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.success) return null;
  return data;
}

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ username: string; locale: string }> }): Promise<Metadata> {
  const { username, locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata_pages" });
  const data = await fetchProfile(username);
  
  if (!data) return { title: t("profile_title", { username }) };
  const { profile } = data;
  
  return {
    title: t("profile_title", { username: `${profile.displayName} (@${profile.username})` }),
    description: `Niveau ${profile.level} · ${profile.xp} XP · ${profile.rankedPoints} pts ranked. ${t("profile_description", { username: profile.displayName })}`,
    openGraph: {
      title: t("profile_title", { username: profile.displayName }),
      description: `Niveau ${profile.level} · ${profile.xp} XP`,
      type: "profile",
    },
  };
}

export default async function PublicProfile({ params }: { params: Promise<{ username: string; locale: string }> }) {
  const { username, locale } = await params;
  const data = await fetchProfile(username);
  if (!data) notFound();
  
  return <ProfileClient profile={data.profile} stats={data.stats} />;
}

