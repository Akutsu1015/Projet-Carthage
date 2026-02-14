import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSessionUser,
  createBattle,
  joinBattle,
  submitBattleSolution,
  forfeitBattle,
  getBattleWithDetails,
  getWaitingBattles,
  getUserBattleHistory,
  cancelBattle,
  getAllChallenges,
  getRankedLeaderboard,
  getUserBattleStats,
  getChallengeCount,
} from "@/lib/db";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("carthage_session")?.value;
  if (!token) return null;
  return getSessionUser(token);
}

function formatUser(u: any) {
  return u ? { id: u.id, displayName: u.display_name, username: u.username, avatarType: u.avatar_type, avatarValue: u.avatar_value, avatarColor: u.avatar_color, level: u.level, rankedPoints: u.ranked_points } : null;
}

// GET — list waiting battles, battle details, challenges, history, leaderboard, stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const battleId = searchParams.get("id");

    if (action === "challenges") {
      const challenges = getAllChallenges();
      return NextResponse.json({ success: true, challenges });
    }

    if (action === "challenge-count") {
      const counts = getChallengeCount();
      return NextResponse.json({ success: true, ...counts });
    }

    if (action === "ranked-leaderboard") {
      const leaderboard = getRankedLeaderboard(50);
      return NextResponse.json({ success: true, leaderboard });
    }

    if (action === "stats") {
      const user = await getUser();
      if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });
      const stats = getUserBattleStats(user.id);
      return NextResponse.json({ success: true, stats });
    }

    if (battleId) {
      const data = getBattleWithDetails(battleId);
      if (!data) return NextResponse.json({ success: false, error: "Battle introuvable" }, { status: 404 });
      return NextResponse.json({
        success: true,
        battle: data.battle,
        challenge: data.challenge,
        creator: formatUser(data.creator),
        opponent: formatUser(data.opponent),
        winner: data.winner ? { id: data.winner.id, displayName: data.winner.display_name } : null,
      });
    }

    const user = await getUser();
    const userId = user ? user.id : undefined;

    if (action === "history" && userId) {
      const history = getUserBattleHistory(userId);
      return NextResponse.json({ success: true, history });
    }

    // List waiting battles, optionally filtered by mode
    const mode = searchParams.get("mode");
    const waiting = getWaitingBattles(userId);
    const filtered = mode ? waiting.filter((b: any) => b.mode === mode) : waiting;
    return NextResponse.json({ success: true, battles: filtered });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST — create, join, submit, cancel
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const { challengeId, difficulty, mode } = body;
      const battle = createBattle(user.id, { challengeId, difficulty, mode: mode || "casual" });
      return NextResponse.json({ success: true, battle });
    }

    if (action === "join") {
      const { battleId } = body;
      if (!battleId) return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
      const battle = joinBattle(battleId, user.id);
      if (!battle) return NextResponse.json({ success: false, error: "Impossible de rejoindre cette battle" }, { status: 400 });
      return NextResponse.json({ success: true, battle });
    }

    if (action === "submit") {
      const { battleId, code, timeMs, antiCheat: acFlags } = body;
      if (!battleId || code === undefined || !timeMs) return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 });

      // Log anti-cheat flags if suspicious
      if (acFlags?.flagged) {
        console.warn(`[ANTI-CHEAT] User ${user.id} (${user.display_name}) flagged in battle ${battleId}: ${acFlags.flags?.join(", ")} | tabs=${acFlags.tabSwitches} pastes=${acFlags.largePastes} devtools=${acFlags.devToolsOpened} speed=${acFlags.suspiciousSpeed}`);
      }

      const battle = submitBattleSolution(battleId, user.id, code, timeMs);
      if (!battle) return NextResponse.json({ success: false, error: "Impossible de soumettre" }, { status: 400 });
      return NextResponse.json({ success: true, battle, flagged: !!acFlags?.flagged });
    }

    if (action === "forfeit") {
      const { battleId } = body;
      if (!battleId) return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
      const battle = forfeitBattle(battleId, user.id);
      if (!battle) return NextResponse.json({ success: false, error: "Impossible d'abandonner" }, { status: 400 });
      return NextResponse.json({ success: true, battle });
    }

    if (action === "cancel") {
      const { battleId } = body;
      const ok = cancelBattle(battleId, user.id);
      if (!ok) return NextResponse.json({ success: false, error: "Impossible d'annuler" }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Action inconnue" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
