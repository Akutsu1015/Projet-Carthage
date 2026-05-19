import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/db";

/**
 * Extract session token from cookie OR Authorization header.
 * Supports both web (httpOnly cookie) and mobile (Bearer token).
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  // 1. Try cookie first (web)
  const cookieToken = req.cookies.get("carthage_session")?.value;
  if (cookieToken) return cookieToken;

  // 2. Try Authorization header (mobile)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * Get authenticated user from request (cookie or Bearer token).
 */
export function getAuthUser(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return getSessionUser(token);
}
