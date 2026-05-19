"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("carthage_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("carthage_sid", sid);
  }
  return sid;
}

export function useAnalytics() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(0);

  // Track page view on route change
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Send duration for previous page
    if (startTimeRef.current > 0) {
      const durationMs = Math.round(Date.now() - startTimeRef.current);
      const sid = sessionStorage.getItem("carthage_sid");
      if (sid && durationMs > 0) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, durationMs }),
        }).catch(() => {});
      }
    }

    // Track new page view
    startTimeRef.current = Date.now();
    const sessionId = getSessionId();
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        path: pathname,
        sessionId,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [pathname]);

  // Track duration on page unload
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      const durationMs = Math.round(Date.now() - startTimeRef.current);
      const sid = sessionStorage.getItem("carthage_sid");
      if (sid && durationMs > 0) {
        // Use sendBeacon for reliability on unload
        const blob = new Blob([JSON.stringify({ sessionId: sid, durationMs })], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
}
