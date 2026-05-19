import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const REDIRECT_URI = `${APP_URL}/api/db/auth/google/callback`;

/* ═══ GET — Start Google OAuth flow (redirect to Google) ═══ */
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  // Check if Google OAuth is configured
  if (action === "status") {
    return NextResponse.json({
      success: true,
      available: !!GOOGLE_CLIENT_ID,
    });
  }

  // Generate the Google OAuth consent URL
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ success: false, error: "Google OAuth non configuré." }, { status: 503 });
  }

  const redirectUri = REDIRECT_URI;
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    state,
    prompt: "select_account",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Store state in a short-lived cookie for CSRF protection
  const res = NextResponse.redirect(url);
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  return res;
}
