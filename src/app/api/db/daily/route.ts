import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getTodaysChallenge, completeDailyChallenge, getDailyStreak, getDb } from "@/lib/db";

/** GET — return today's challenge + the user's daily completion status. */
export async function GET(req: NextRequest) {
  const challenge = getTodaysChallenge();
  if (!challenge) return NextResponse.json({ success: false, error: "Aucun défi disponible" }, { status: 503 });

  const user = getAuthUser(req);
  let completed = false;
  let streak = 0;
  if (user) {
    const row = getDb()
      .prepare("SELECT 1 FROM daily_completions WHERE user_id = ? AND day = ?")
      .get(user.id, challenge.day);
    completed = !!row;
    streak = getDailyStreak(user.id);
  }

  return NextResponse.json({
    success: true,
    challenge,
    completed,
    streak,
  });
}

/** POST — mark today's challenge as completed (call after the user solves it). */
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });

  let durationS = 0;
  try {
    const body = await req.json().catch(() => ({}));
    durationS = Math.max(0, Math.min(86_400, Number(body?.durationS) || 0));
  } catch { /* ignore */ }

  const result = completeDailyChallenge(user.id, durationS);
  return NextResponse.json({ success: true, ...result });
}
