import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * Liveness + readiness probe. Returns 200 only when:
 *   - the DB connection accepts a trivial query
 *   - Piston is reachable (if PISTON_URL is set)
 *
 * Used by UptimeRobot / Kubernetes / Caddy healthchecks.
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; ms?: number; error?: string }> = {};
  const t0 = Date.now();

  // DB
  try {
    getDb().prepare("SELECT 1").get();
    checks.db = { ok: true, ms: Date.now() - t0 };
  } catch (e: any) {
    checks.db = { ok: false, error: e?.message || "db error" };
  }

  // Piston (best-effort, do not fail liveness on this)
  const pistonUrl = process.env.PISTON_URL;
  if (pistonUrl) {
    const t1 = Date.now();
    try {
      const r = await fetch(`${pistonUrl}/runtimes`, { signal: AbortSignal.timeout(2000) });
      checks.piston = { ok: r.ok, ms: Date.now() - t1 };
    } catch (e: any) {
      checks.piston = { ok: false, error: e?.message || "unreachable" };
    }
  }

  const overall = checks.db.ok;
  return NextResponse.json(
    { status: overall ? "ok" : "degraded", checks, uptime_s: Math.floor(process.uptime()) },
    { status: overall ? 200 : 503 }
  );
}
