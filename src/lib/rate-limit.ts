// In-memory rate limiter with sliding window
// Works per-IP and per-route for anti-DDoS / anti-bot protection

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter(t => now - t < 120_000);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, 300_000);

export interface RateLimitConfig {
  windowMs: number;   // time window in ms
  maxRequests: number; // max requests per window
}

// Preset configs for different route types
export const RATE_LIMITS = {
  // Auth routes: strict (prevent brute force)
  auth: { windowMs: 60_000, maxRequests: 10 } as RateLimitConfig,
  // API mutations (POST): moderate
  api_write: { windowMs: 60_000, maxRequests: 30 } as RateLimitConfig,
  // API reads (GET): lenient
  api_read: { windowMs: 60_000, maxRequests: 100 } as RateLimitConfig,
  // Battle submit: strict (prevent spam)
  battle_submit: { windowMs: 60_000, maxRequests: 15 } as RateLimitConfig,
  // Code execution: strict
  execute: { windowMs: 60_000, maxRequests: 20 } as RateLimitConfig,
  // General page loads: very lenient
  general: { windowMs: 60_000, maxRequests: 200 } as RateLimitConfig,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  limit: number;
}

export function checkRateLimit(ip: string, route: string, config: RateLimitConfig): RateLimitResult {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(t => t > windowStart);

  const remaining = Math.max(0, config.maxRequests - entry.timestamps.length);
  const oldestInWindow = entry.timestamps.length > 0 ? entry.timestamps[0] : now;
  const resetMs = oldestInWindow + config.windowMs - now;

  if (entry.timestamps.length >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetMs, limit: config.maxRequests };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: remaining - 1, resetMs, limit: config.maxRequests };
}

// Global IP ban list (for severe abuse)
const bannedIPs = new Set<string>();
const banExpiry = new Map<string, number>();

export function banIP(ip: string, durationMs: number = 3600_000) {
  bannedIPs.add(ip);
  banExpiry.set(ip, Date.now() + durationMs);
}

export function isIPBanned(ip: string): boolean {
  if (!bannedIPs.has(ip)) return false;
  const expiry = banExpiry.get(ip);
  if (expiry && Date.now() > expiry) {
    bannedIPs.delete(ip);
    banExpiry.delete(ip);
    return false;
  }
  return true;
}

// Suspicious request pattern detection
const suspiciousPatterns = new Map<string, { count: number; firstSeen: number }>();

export function trackSuspicious(ip: string): boolean {
  const now = Date.now();
  const entry = suspiciousPatterns.get(ip);

  if (!entry || now - entry.firstSeen > 300_000) {
    suspiciousPatterns.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  entry.count++;

  // If more than 50 rate-limited requests in 5 minutes, auto-ban for 1 hour
  if (entry.count > 50) {
    banIP(ip, 3600_000);
    suspiciousPatterns.delete(ip);
    return true;
  }

  return false;
}
