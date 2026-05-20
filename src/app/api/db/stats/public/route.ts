import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * Public site-wide stats for the homepage. Cached at the edge for 10 minutes
 * so we don't hit SQLite on every visit.
 */
export const revalidate = 600;

export async function GET() {
  const db = getDb();

  try {
    const users = (db.prepare("SELECT COUNT(*) c FROM users").get() as { c: number }).c;
    const completed = (db.prepare("SELECT COUNT(*) c FROM exercise_progress").get() as { c: number }).c;
    const battles = (db.prepare("SELECT COUNT(*) c FROM code_battles WHERE status = 'finished'").get() as { c: number }).c;
    const xpTotal = (db.prepare("SELECT COALESCE(SUM(xp), 0) s FROM users").get() as { s: number }).s;
    const activeToday = (db.prepare(
      "SELECT COUNT(DISTINCT user_id) c FROM exercise_progress WHERE completed_at >= datetime('now','-1 day')"
    ).get() as { c: number }).c;

    return NextResponse.json({
      success: true,
      stats: {
        users,
        exercisesCompleted: completed,
        battlesPlayed: battles,
        totalXp: xpTotal,
        activeToday,
      },
    }, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400" },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}
