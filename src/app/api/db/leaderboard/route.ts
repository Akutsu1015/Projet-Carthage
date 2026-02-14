import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, getLeaderboard, getGlobalLeaderboard } from "@/lib/db";

/* ═══ GET — fetch leaderboard data ═══ */

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = getSessionUser(token);
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 });
    }

    const tab = req.nextUrl.searchParams.get("tab") || "league";

    if (tab === "global") {
      const global = getGlobalLeaderboard(50);
      const userRank = global.findIndex(e => e.userId === dbUser.id) + 1;
      return NextResponse.json({
        success: true,
        tab: "global",
        data: global,
        userId: dbUser.id,
        userRank: userRank || null,
      });
    }

    // Default: league leaderboard
    const leaderboard = getLeaderboard(dbUser.id);
    return NextResponse.json({
      success: true,
      tab: "league",
      data: leaderboard,
      userId: dbUser.id,
    });
  } catch (err) {
    console.error("Leaderboard API error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
