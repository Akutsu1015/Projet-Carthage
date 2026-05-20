import { NextRequest, NextResponse } from "next/server";
import { trackPageView, updateSessionDuration } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/api-auth";
import { getSessionUser } from "@/lib/db";

/* ═══ POST — track a page view ═══ */

export async function POST(req: NextRequest) {
  try {
    // sendBeacon and some clients send empty bodies on tab close — treat as no-op.
    const raw = await req.text();
    if (!raw) return NextResponse.json({ success: true });
    let body: any;
    try { body = JSON.parse(raw); } catch { return NextResponse.json({ success: false, error: "bad_json" }, { status: 400 }); }
    const { path, sessionId, durationMs } = body;

    if (!path || !sessionId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Resolve user ID from session if available
    let userId: number | null = null;
    const token = getTokenFromRequest(req);
    if (token) {
      const dbUser = getSessionUser(token);
      if (dbUser) userId = dbUser.id;
    }

    const referrer = body.referrer || "";
    const userAgent = body.userAgent || "";

    if (durationMs && durationMs > 0) {
      updateSessionDuration(sessionId, durationMs);
    } else {
      trackPageView(path, sessionId, userId, referrer, userAgent);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Analytics API] error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
