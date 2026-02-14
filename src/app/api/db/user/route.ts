import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUser, updateUserXp, updateUserStreak, updateUserAvatar,
  addBadge, getUserBadges, getFullUserData,
} from "@/lib/db";

/* ═══ POST — update user data (xp, streak, avatar, badges) ═══ */

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // ── ADD XP ──
    if (action === "addXp") {
      const { amount } = body;
      if (!amount || amount <= 0) {
        return NextResponse.json({ success: false, error: "Montant XP invalide." }, { status: 400 });
      }
      const result = updateUserXp(dbUser.id, Number(amount));
      return NextResponse.json({ success: true, xp: result.xp, level: result.level });
    }

    // ── UPDATE STREAK ──
    if (action === "updateStreak") {
      const { streak } = body;
      updateUserStreak(dbUser.id, Number(streak));
      return NextResponse.json({ success: true });
    }

    // ── UPDATE AVATAR ──
    if (action === "updateAvatar") {
      const { type, value, color } = body;
      updateUserAvatar(dbUser.id, type, value, color || "#00d4ff");
      const userData = getFullUserData(dbUser.id);
      return NextResponse.json({ success: true, user: userData });
    }

    // ── ADD BADGE ──
    if (action === "addBadge") {
      const { badgeId } = body;
      if (!badgeId) {
        return NextResponse.json({ success: false, error: "badgeId requis." }, { status: 400 });
      }
      addBadge(dbUser.id, badgeId);
      const badges = getUserBadges(dbUser.id);
      return NextResponse.json({ success: true, badges });
    }

    // ── GET FULL USER DATA ──
    if (action === "getUser") {
      const userData = getFullUserData(dbUser.id);
      return NextResponse.json({ success: true, user: userData });
    }

    return NextResponse.json({ success: false, error: "Action non reconnue." }, { status: 400 });
  } catch (err) {
    console.error("User API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

/* ═══ GET — get current user data ═══ */

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, user: null });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      return NextResponse.json({ success: false, user: null });
    }

    const userData = getFullUserData(dbUser.id);
    return NextResponse.json({ success: true, user: userData });
  } catch (err) {
    console.error("User GET error:", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
