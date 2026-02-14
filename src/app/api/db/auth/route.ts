import { NextRequest, NextResponse } from "next/server";
import {
  createUser, getUserByUsername, getUserByEmail, verifyPassword,
  createSession, getSessionUser, deleteSession, updateLastLogin,
  getFullUserData, createEmailVerification,
} from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";

/* ═══ POST — login / register / logout ═══ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ── REGISTER ──
    if (action === "register") {
      const { username, email, password, displayName } = body;
      if (!username || !email || !password) {
        return NextResponse.json({ success: false, error: "Tous les champs sont requis." }, { status: 400 });
      }
      if (username.length < 3) {
        return NextResponse.json({ success: false, error: "Le nom d'utilisateur doit faire au moins 3 caractères." }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: "Le mot de passe doit faire au moins 6 caractères." }, { status: 400 });
      }

      // Check duplicates
      if (getUserByUsername(username)) {
        return NextResponse.json({ success: false, error: "Ce nom d'utilisateur est déjà pris." }, { status: 409 });
      }
      if (getUserByEmail(email)) {
        return NextResponse.json({ success: false, error: "Cette adresse email est déjà utilisée." }, { status: 409 });
      }

      const dbUser = createUser(username, email, password, displayName || username);

      // Send verification email
      let emailSent = false;
      try {
        const verifyToken = createEmailVerification(dbUser.id);
        await sendVerificationEmail(email, displayName || username, verifyToken);
        emailSent = true;
      } catch (emailErr) {
        console.error("Failed to send verification email:", emailErr);
      }

      // Do NOT create session — user must verify email first
      return NextResponse.json({
        success: true,
        user: null,
        message: "Compte créé ! Un email de vérification a été envoyé. Confirmez votre adresse email avant de vous connecter.",
        emailSent,
        requiresVerification: true,
      });
    }

    // ── LOGIN ──
    if (action === "login") {
      const { emailOrUsername, password } = body;
      if (!emailOrUsername || !password) {
        return NextResponse.json({ success: false, error: "Email/username et mot de passe requis." }, { status: 400 });
      }

      // Find user by username or email
      let dbUser = getUserByUsername(emailOrUsername);
      if (!dbUser) dbUser = getUserByEmail(emailOrUsername);

      if (!dbUser || !dbUser.password_hash) {
        return NextResponse.json({ success: false, error: "Compte introuvable." }, { status: 401 });
      }

      if (!verifyPassword(password, dbUser.password_hash)) {
        return NextResponse.json({ success: false, error: "Mot de passe incorrect." }, { status: 401 });
      }

      // Block login if email is not verified
      if (!dbUser.email_verified) {
        return NextResponse.json({
          success: false,
          error: "Votre adresse email n'a pas encore été vérifiée. Consultez votre boîte de réception et cliquez sur le lien de confirmation.",
          requiresVerification: true,
        }, { status: 403 });
      }

      updateLastLogin(dbUser.id);
      const token = createSession(dbUser.id);
      const userData = getFullUserData(dbUser.id);

      const res = NextResponse.json({ success: true, user: userData });
      res.cookies.set("carthage_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    // ── LOGOUT ──
    if (action === "logout") {
      const token = req.cookies.get("carthage_session")?.value;
      if (token) deleteSession(token);

      const res = NextResponse.json({ success: true });
      res.cookies.delete("carthage_session");
      return res;
    }

    return NextResponse.json({ success: false, error: "Action non reconnue." }, { status: 400 });
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

/* ═══ GET — session check ═══ */

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      const res = NextResponse.json({ success: false, user: null });
      res.cookies.delete("carthage_session");
      return res;
    }

    // Block unverified users (except OAuth users who are auto-verified)
    if (!dbUser.email_verified) {
      const res = NextResponse.json({ success: false, user: null, requiresVerification: true });
      res.cookies.delete("carthage_session");
      return res;
    }

    const userData = getFullUserData(dbUser.id);
    return NextResponse.json({ success: true, user: userData });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
