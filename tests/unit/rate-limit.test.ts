import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, RATE_LIMITS, banIP, isIPBanned } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Different IP per test to avoid cross-test pollution since the store is module-level.
    // Use Math.random + test name to be safe.
  });

  it("allows requests under the limit", () => {
    const ip = `ip-${Math.random()}`;
    const cfg = { windowMs: 1000, maxRequests: 3 };
    expect(checkRateLimit(ip, "test", cfg).allowed).toBe(true);
    expect(checkRateLimit(ip, "test", cfg).allowed).toBe(true);
    expect(checkRateLimit(ip, "test", cfg).allowed).toBe(true);
  });

  it("blocks when the limit is exceeded", () => {
    const ip = `ip-${Math.random()}`;
    const cfg = { windowMs: 60_000, maxRequests: 2 };
    checkRateLimit(ip, "burst", cfg);
    checkRateLimit(ip, "burst", cfg);
    const r = checkRateLimit(ip, "burst", cfg);
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("isolates buckets by route", () => {
    const ip = `ip-${Math.random()}`;
    const cfg = { windowMs: 60_000, maxRequests: 1 };
    expect(checkRateLimit(ip, "routeA", cfg).allowed).toBe(true);
    expect(checkRateLimit(ip, "routeA", cfg).allowed).toBe(false);
    // Different bucket gets its own budget
    expect(checkRateLimit(ip, "routeB", cfg).allowed).toBe(true);
  });

  it("isolates buckets by IP", () => {
    const cfg = { windowMs: 60_000, maxRequests: 1 };
    expect(checkRateLimit("ip-alpha", "shared", cfg).allowed).toBe(true);
    expect(checkRateLimit("ip-alpha", "shared", cfg).allowed).toBe(false);
    expect(checkRateLimit("ip-beta", "shared", cfg).allowed).toBe(true);
  });

  it("exposes a positive resetMs after blocking", () => {
    const ip = `ip-${Math.random()}`;
    const cfg = { windowMs: 60_000, maxRequests: 1 };
    checkRateLimit(ip, "reset", cfg);
    const blocked = checkRateLimit(ip, "reset", cfg);
    expect(blocked.allowed).toBe(false);
    expect(blocked.resetMs).toBeGreaterThan(0);
    expect(blocked.resetMs).toBeLessThanOrEqual(cfg.windowMs);
  });

  it("RATE_LIMITS presets are sane", () => {
    expect(RATE_LIMITS.auth.maxRequests).toBeGreaterThan(0);
    expect(RATE_LIMITS.execute.maxRequests).toBeGreaterThan(0);
    // Auth should be stricter than general
    expect(RATE_LIMITS.auth.maxRequests).toBeLessThan(RATE_LIMITS.general.maxRequests);
  });
});

describe("IP ban", () => {
  it("bans and unbans after expiry", () => {
    const ip = `ip-ban-${Math.random()}`;
    expect(isIPBanned(ip)).toBe(false);
    banIP(ip, 50); // 50ms
    expect(isIPBanned(ip)).toBe(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(isIPBanned(ip)).toBe(false);
        resolve();
      }, 80);
    });
  });
});
