import { NextRequest, NextResponse } from "next/server";

// ─── Inline rate limiter (Edge-compatible, in-memory per instance) ───

const rateLimitStore = new Map<string, number[]>();
const bannedIPs = new Map<string, number>(); // ip → expiry timestamp
const suspiciousCounts = new Map<string, { count: number; first: number }>();

interface RLConfig { windowMs: number; max: number }

const RL: Record<string, RLConfig> = {
  auth:         { windowMs: 60_000, max: 10 },
  execute:      { windowMs: 60_000, max: 20 },
  battle_write: { windowMs: 60_000, max: 15 },
  api_write:    { windowMs: 60_000, max: 30 },
  api_read:     { windowMs: 60_000, max: 100 },
  general:      { windowMs: 60_000, max: 200 },
};

function rateLimit(ip: string, bucket: string, cfg: RLConfig): { ok: boolean; remaining: number; retryAfter: number } {
  const key = `${ip}:${bucket}`;
  const now = Date.now();
  const cutoff = now - cfg.windowMs;
  let ts = rateLimitStore.get(key);
  if (!ts) { ts = []; rateLimitStore.set(key, ts); }
  // Prune old
  while (ts.length > 0 && ts[0] <= cutoff) ts.shift();
  if (ts.length >= cfg.max) {
    const retryAfter = Math.ceil((ts[0] + cfg.windowMs - now) / 1000);
    return { ok: false, remaining: 0, retryAfter };
  }
  ts.push(now);
  return { ok: true, remaining: cfg.max - ts.length, retryAfter: 0 };
}

function markSuspicious(ip: string) {
  const now = Date.now();
  let e = suspiciousCounts.get(ip);
  if (!e || now - e.first > 300_000) { e = { count: 0, first: now }; suspiciousCounts.set(ip, e); }
  e.count++;
  if (e.count > 50) {
    bannedIPs.set(ip, now + 3600_000); // ban 1h
    suspiciousCounts.delete(ip);
  }
}

function isBanned(ip: string): boolean {
  const exp = bannedIPs.get(ip);
  if (!exp) return false;
  if (Date.now() > exp) { bannedIPs.delete(ip); return false; }
  return true;
}

// ─── Bot patterns ───

const BAD_BOTS = [
  /python-requests/i, /curl\//i, /wget\//i, /scrapy/i,
  /httpclient/i, /java\//i, /libwww/i, /lwp-trivial/i,
  /slimerjs/i, /phantomjs/i, /headlesschrome/i, /puppet/i,
];
const GOOD_BOTS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
  /baiduspider/i, /yandexbot/i, /facebot/i, /twitterbot/i,
  /linkedinbot/i, /whatsapp/i, /telegrambot/i, /discordbot/i,
];

// ─── Helpers ───

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function getBucket(pathname: string, method: string): { bucket: string; cfg: RLConfig } {
  if (pathname.startsWith("/api/db/auth") || pathname === "/api/db/login" || pathname === "/api/db/register")
    return { bucket: "auth", cfg: RL.auth };
  if (pathname === "/api/db/execute")
    return { bucket: "execute", cfg: RL.execute };
  if (pathname === "/api/db/battle" && method === "POST")
    return { bucket: "battle_write", cfg: RL.battle_write };
  if (pathname.startsWith("/api/") && method === "POST")
    return { bucket: "api_write", cfg: RL.api_write };
  if (pathname.startsWith("/api/") && method === "GET")
    return { bucket: "api_read", cfg: RL.api_read };
  return { bucket: "general", cfg: RL.general };
}

// ─── Middleware ───

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff2?|ttf|eot|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const ip = getIP(req);
  const ua = req.headers.get("user-agent") || "";

  // 1. IP ban check
  if (isBanned(ip)) {
    return new NextResponse(
      JSON.stringify({ error: "Accès bloqué. Réessayez plus tard." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Only apply bot detection + rate limiting on API routes
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  // 2. Bot detection
  const isGoodBot = GOOD_BOTS.some(p => p.test(ua));
  if (!isGoodBot) {
    if (BAD_BOTS.some(p => p.test(ua)) || !ua || ua.length < 10) {
      markSuspicious(ip);
      return new NextResponse(
        JSON.stringify({ error: "Requête non autorisée." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 3. Rate limiting
  const { bucket, cfg } = getBucket(pathname, req.method);
  const rl = rateLimit(ip, bucket, cfg);

  if (!rl.ok) {
    markSuspicious(ip);
    return new NextResponse(
      JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques secondes." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter),
          "X-RateLimit-Limit": String(cfg.max),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(cfg.max));
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
  return res;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
