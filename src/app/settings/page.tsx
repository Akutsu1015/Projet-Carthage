"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BioEditor } from "@/components/bio-editor";
import { AvatarEditor } from "@/components/avatar-editor";
import { PushToggle } from "@/components/push-toggle";
import { ArrowLeft, User, Bell, FileText, Shield, Smile } from "lucide-react";

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [savedBio, setSavedBio] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) setSavedBio((user as any).bio || "");
  }, [user]);

  if (loading) return <div className="p-8 text-white/40">Chargement…</div>;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-white">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold">Paramètres</h1>
      </div>

      {/* ─── Profil ─── */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <User size={16} className="text-lyoko-blue" />
          <h2 className="font-display text-base font-bold">Profil</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/40">Nom affiché</label>
            <p className="text-sm text-white">{user.displayName}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-white/40">Nom d'utilisateur</label>
            <p className="text-sm text-white/70">@{user.username}</p>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wide text-white/40">Bio publique</label>
            <BioEditor initial={savedBio} onSaved={(b) => { setSavedBio(b); refreshUser(); }} />
          </div>
          <div>
            <Link
              href={`/u/${user.username}`}
              className="inline-flex items-center gap-1 text-xs text-lyoko-blue hover:underline"
            >
              <FileText size={11} /> Voir mon profil public →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Avatar ─── */}
      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Smile size={16} className="text-lyoko-purple" />
          <h2 className="font-display text-base font-bold">Avatar</h2>
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
          <h2 className="font-display text-base font-bold">Notifications</h2>
        </div>
        <p className="mb-4 text-sm text-white/60">
          Reçois une notification quand un adversaire rejoint ta battle, ou pour le défi du jour. Tu peux désactiver à tout moment.
        </p>
        <PushToggle />
        <p className="mt-3 text-xs text-white/30">
          Si ce bouton n'apparaît pas, ton navigateur ne supporte pas les push notifications ou le serveur n'est pas configuré.
        </p>
      </section>

      {/* ─── Sécurité ─── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield size={16} className="text-lyoko-green" />
          <h2 className="font-display text-base font-bold">Sécurité</h2>
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
            Se déconnecter
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Révoquer toutes les sessions sur tous tes appareils ?")) return;
              await fetch("/api/db/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout_all" }),
              });
              router.replace("/login");
            }}
            className="rounded-lg border border-xana-red/30 bg-xana-red/5 px-4 py-2 text-sm text-xana-red hover:bg-xana-red/10"
          >
            Déconnecter tous les appareils
          </button>
        </div>
      </section>
    </main>
  );
}
