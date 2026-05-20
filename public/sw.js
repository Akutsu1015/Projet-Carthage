/* Projet Carthage — minimal service worker.
 * Network-first for documents, cache-first for static assets and images.
 * No precache (avoids breaking on every deploy); the SW just provides a
 * smarter caching layer + an offline fallback for the homepage. */

const CACHE_VERSION = "carthage-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try {
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    } catch (_) { /* offline page is best-effort */ }
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Drop old caches
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const STATIC_DEST = new Set(["style", "script", "font", "image"]);

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: "Projet Carthage", body: event.data.text() }; }
  const { title = "Projet Carthage", body = "", url = "/", tag } = payload;

  event.waitUntil((async () => {
    // If the app is focused, post the payload to the client so it can show
    // an in-app toast instead of a (potentially redundant) system notification.
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const focused = all.find((c) => c.focused);
    if (focused) {
      focused.postMessage({ type: "carthage-push", payload });
      return;
    }
    // Otherwise show the system notification.
    await self.registration.showNotification(title, {
      body,
      tag,
      icon: "/images/carthage_logo.png",
      badge: "/favicon.png",
      data: { url },
    });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      if (c.url.endsWith(url) && "focus" in c) return c.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never touch API / auth / SSE / sockets / dev tooling
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data/") || url.pathname.startsWith("/socket.io/")) return;
  if (url.origin !== self.location.origin) return;

  // Cache-first for static-looking assets
  if (STATIC_DEST.has(req.destination)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok && res.type === "basic") cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch (e) {
        return hit || Response.error();
      }
    })());
    return;
  }

  // Network-first for documents, fall back to cached homepage if offline
  if (req.destination === "document") {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        return res;
      } catch (_) {
        const cache = await caches.open(CACHE_VERSION);
        const offline = await cache.match(OFFLINE_URL);
        return offline || new Response("Hors-ligne", { status: 503, headers: { "Content-Type": "text/plain" } });
      }
    })());
  }
});
