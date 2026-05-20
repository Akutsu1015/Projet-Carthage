"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

/** Convert URL-safe base64 (VAPID) → Uint8Array for PushManager.subscribe. */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = atob(raw);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return arr;
}

/**
 * Push notification opt-in button. Hidden when push is disabled server-side
 * (no VAPID keys) or unsupported by the browser.
 */
export function PushToggle() {
  const { t } = useTranslation();
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(ok);
    if (!ok) return;

    fetch("/api/db/push")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.success && d.publicKey) setPublicKey(d.publicKey); })
      .catch(() => {});

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(!!sub))
      .catch(() => {});
  }, []);

  if (!supported || !publicKey) return null;

  const enable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
      await fetch("/api/db/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      setEnabled(true);
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await fetch("/api/db/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsubscribe: true }),
      });
      setEnabled(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={enabled ? disable : enable}
      disabled={busy}
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
        enabled
          ? "border-lyoko-green/30 bg-lyoko-green/10 text-lyoko-green hover:bg-lyoko-green/20"
          : "border-white/20 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
      }`}
      title={enabled ? t("settings_components.disable_title") : t("settings_components.enable_title")}
    >
      {enabled ? <Bell size={14} /> : <BellOff size={14} />}
      {enabled ? t("settings_components.notif_on") : t("settings_components.enable_title")}
    </button>
  );
}
