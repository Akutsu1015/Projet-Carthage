import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken, createSession, getFullUserData } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mailer";

/* ═══ GET — Verify email token ═══ */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Token manquant." }, { status: 400 });
    }

    const user = verifyEmailToken(token);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Lien invalide ou expiré. Veuillez vous reconnecter et demander un nouveau lien.",
      }, { status: 400 });
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.display_name);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    // Create/refresh session
    const sessionToken = createSession(user.id);
    const userData = getFullUserData(user.id);

    const res = NextResponse.json({ success: true, user: userData });
    res.cookies.set("carthage_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Email verification error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
