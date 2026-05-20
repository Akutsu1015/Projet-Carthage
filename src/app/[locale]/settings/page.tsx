"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import { BioEditor } from "@/components/bio-editor";
import { AvatarEditor } from "@/components/avatar-editor";
import { PushToggle } from "@/components/push-toggle";
import { ArrowLeft, User, Bell, FileText, Shield, Smile } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [savedBio, setSavedBio] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) setSavedBio((user as any).bio || "");
  }, [user]);

  if (isLoading) return <div className="p-8 text-white/40">{t("settings.loading")}</div>;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> {t("settings.dashboard")}
        </Link>
        <h1 className="font-display text-2xl font-bold">{t("settings.title")}</h1>
      </div>

      {/* ─── Profil ─── */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <User size={16} className="text-lyoko-blue" />
          <h2 className="font-display text-base font-bold">{t("settings.profile.title")}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/40">{t("settings.profile.display_name")}</label>
            <p className="text-sm text-white">{user.displayName}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/40">{t("settings.profile.username")}</label>
            <p className="text-sm text-white/70">@{user.username}</p>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-white/40">{t("settings.profile.public_bio")}</label>
            <BioEditor initial={savedBio} onSaved={(b) => { setSavedBio(b); refreshUser(); }} />
          </div>
          <div>
            <Link
              href={`/u/${user.username}`}
              className="inline-flex items-center gap-1 text-xs text-lyoko-blue hover:underline"
            >
              <FileText size={11} /> {t("settings.profile.view_public")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Avatar ─── */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Smile size={16} className="text-lyoko-purple" />
          <h2 className="font-display text-base font-bold">{t("settings.avatar.title")}</h2>
        </div>
        <AvatarEditor
          initialValue={(user as any).avatar?.initials || (user as any).avatar?.value || ""}
          initialColor={(user as any).avatar?.color || "#00d4ff"}
          displayName={user.displayName}
          onSaved={() => refreshUser()}
        />
      </section>

      {/* ─── Notifications ─── */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell size={16} className="text-carthage-gold" />
          <h2 className="font-display text-base font-bold">{t("settings.notifications.title")}</h2>
        </div>
        <p className="mb-4 text-sm text-white/60">
          {t("settings.notifications.desc")}
        </p>
        <PushToggle />
        <p className="mt-3 text-xs text-white/30">
          {t("settings.notifications.unsupported")}
        </p>
      </section>

      {/* ─── Sécurité ─── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield size={16} className="text-lyoko-green" />
          <h2 className="font-display text-base font-bold">{t("settings.security.title")}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/db/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout" }),
              });
              router.replace("/login");
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
          >
            {t("settings.security.logout")}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm(t("settings.security.logout_confirm"))) return;
              await fetch("/api/db/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout_all" }),
              });
              router.replace("/login");
            }}
            className="rounded-lg border border-xana-red/30 bg-xana-red/5 px-4 py-2 text-sm text-xana-red hover:bg-xana-red/10"
          >
            {t("settings.security.logout_all")}
          </button>
        </div>
      </section>
    </main>
  );
}
