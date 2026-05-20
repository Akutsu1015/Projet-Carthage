"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";

interface Toast {
  id: number;
  title: string;
  body: string;
  url?: string;
}

/**
 * Listens for `carthage-push` messages from the service worker and shows them
 * as in-app toasts instead of OS notifications when the tab is focused.
 *
 * Auto-dismiss after 6 seconds, click to navigate.
 */
export function PushToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const onMessage = (e: MessageEvent) => {
      if (!e.data || e.data.type !== "carthage-push" || !e.data.payload) return;
      const p = e.data.payload;
      const t: Toast = {
        id: Date.now() + Math.random(),
        title: String(p.title || "Carthage"),
        body: String(p.body || ""),
        url: typeof p.url === "string" ? p.url : undefined,
      };
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 6000);
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[150] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => {
        const inner = (
          <>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-lyoko-blue/15 text-lyoko-blue">
              <Bell size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{t.title}</div>
              <div className="line-clamp-2 text-xs text-white/60">{t.body}</div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setToasts((prev) => prev.filter((x) => x.id !== t.id));
              }}
              className="rounded p-1 text-white/30 hover:bg-white/5 hover:text-white"
              aria-label="Fermer"
            >
              <X size={12} />
            </button>
          </>
        );
        const cls = "pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-white/10 bg-dark-bg/95 p-3 shadow-xl backdrop-blur animate-slide-in-right";
        return t.url
          ? <Link key={t.id} href={t.url} className={cls}>{inner}</Link>
          : <div key={t.id} className={cls}>{inner}</div>;
      })}
    </div>
  );
}
