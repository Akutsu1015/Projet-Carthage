import { NextRequest, NextResponse } from "next/server";
import { isIpBanned } from "@/lib/db";

/**
 * Get client IP from request headers.
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Check if the request's IP is banned in the database.
 * Returns a 403 response if banned, null otherwise.
 */
export function checkIpBan(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);
  if (ip !== "unknown" && isIpBanned(ip)) {
    return NextResponse.json(
      { success: false, error: "Accès bloqué. Contactez l'administrateur." },
      { status: 403 }
    );
  }
  return null;
}
