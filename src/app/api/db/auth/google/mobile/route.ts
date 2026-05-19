import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail, createOAuthUser, createSession, upgradeUserFromOAuth, getFullUserData,
} from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

/* ═══ POST — Mobile Google Sign-In (idToken verification) ═══ */

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "idToken manquant." },
        { status: 400 }
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: "Google OAuth non configuré sur le serveur." },
        { status: 503 }
      );
    }

    // Verify the ID token with Google
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!verifyRes.ok) {
      console.error("Google tokeninfo failed:", await verifyRes.text());
      return NextResponse.json(
        { success: false, error: "Token Google invalide ou expiré." },
        { status: 401 }
      );
    }

    const tokenInfo = await verifyRes.json() as {
      aud: string;
      sub: string;
      email: string;
      email_verified: string;
      name?: string;
      picture?: string;
    };

    // Verify the token was issued for our app
    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: "Token non destiné à cette application." },
        { status: 401 }
      );
    }

    if (!tokenInfo.email) {
      return NextResponse.json(
        { success: false, error: "Email non disponible dans le profil Google." },
        { status: 400 }
      );
    }

    // Find or create user in SQLite
    let dbUser = getUserByEmail(tokenInfo.email);

    if (!dbUser) {
      // Create new user from Google profile
      dbUser = createOAuthUser(
        tokenInfo.email,
        tokenInfo.name || tokenInfo.email.split("@")[0],
        "google",
        tokenInfo.picture,
      );
    } else {
      // Update existing user with OAuth verification
      upgradeUserFromOAuth(dbUser.id, "google");
    }

    // Create session and return Bearer token (no cookie for mobile)
    const token = createSession(dbUser.id);
    const userData = getFullUserData(dbUser.id);

    return NextResponse.json({
      success: true,
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Mobile Google OAuth error:", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur OAuth." },
      { status: 500 }
    );
  }
}
