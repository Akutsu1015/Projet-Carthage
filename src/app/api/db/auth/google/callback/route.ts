import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail, createOAuthUser, createSession, updateLastLogin,
} from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const REDIRECT_URI = `${APP_URL}/api/db/auth/google/callback`;

/* ═══ GET — Google OAuth callback ═══ */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const error = req.nextUrl.searchParams.get("error");
    const savedState = req.cookies.get("oauth_state")?.value;

    // Handle errors from Google
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Connexion Google annulée.")}`, APP_URL));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=Code+manquant", APP_URL));
    }

    // CSRF check
    if (!state || state !== savedState) {
      return NextResponse.redirect(new URL("/login?error=Session+invalide", APP_URL));
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(new URL("/login?error=Erreur+d%27authentification+Google", APP_URL));
    }

    const tokens = await tokenRes.json();

    // Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(new URL("/login?error=Impossible+de+récupérer+le+profil", APP_URL));
    }

    const googleUser = await userInfoRes.json() as {
      id: string;
      email: string;
      name: string;
      picture?: string;
      verified_email?: boolean;
    };

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=Email+non+disponible", APP_URL));
    }

    // Find or create user in SQLite
    let dbUser = getUserByEmail(googleUser.email);

    if (!dbUser) {
      // Create new user from Google profile
      dbUser = createOAuthUser(
        googleUser.email,
        googleUser.name || googleUser.email.split("@")[0],
        "google",
        googleUser.picture,
      );
    } else {
      // Update last login for existing user
      updateLastLogin(dbUser.id);
    }

    // Create session
    const token = createSession(dbUser.id);

    // Redirect to dashboard with session cookie
    const res = NextResponse.redirect(new URL("/dashboard", APP_URL));
    res.cookies.set("carthage_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    // Clear the oauth_state cookie
    res.cookies.delete("oauth_state");
    return res;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=Erreur+serveur+OAuth", APP_URL));
  }
}
