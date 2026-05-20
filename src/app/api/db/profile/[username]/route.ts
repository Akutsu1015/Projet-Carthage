import { NextRequest, NextResponse } from "next/server";
import { getDb, getUserByUsername } from "@/lib/db";

interface BadgeRow { badge_id: string; awarded_at: string }
interface ProgressRow { module_id: string; count: number }
interface BattleStatRow { wins: number; losses: number; rank?: number }

/**
 * Public profile API: returns the safe subset of a user's data (no email, no settings,
 * no auth tokens). Used by /u/[username].
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ username: string }> }) {
  const { username } = await ctx.params;
  const user = getUserByUsername(username);
  if (!user) return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 });

  const db = getDb();

  const badges = db.prepare(
    "SELECT badge_id, awarded_at FROM user_badges WHERE user_id = ? ORDER BY awarded_at DESC"
  ).all(user.id) as BadgeRow[];

  const progress = db.prepare(
    "SELECT module_id, COUNT(*) as count FROM exercise_progress WHERE user_id = ? GROUP BY module_id"
  ).all(user.id) as ProgressRow[];

  const battles = db.prepare(
    `SELECT
       (SELECT COUNT(*) FROM code_battles WHERE (creator_id = ? OR opponent_id = ?) AND winner_id = ?) AS wins,
       (SELECT COUNT(*) FROM code_battles WHERE (creator_id = ? OR opponent_id = ?) AND winner_id IS NOT NULL AND winner_id != ?) AS losses
    `
  ).get(user.id, user.id, user.id, user.id, user.id, user.id) as BattleStatRow;

  // Streak: count consecutive days with progress (last 30 days).
  const days = db.prepare(
    `SELECT DISTINCT date(completed_at) as d FROM exercise_progress
     WHERE user_id = ? AND completed_at >= date('now', '-30 day') ORDER BY d DESC`
  ).all(user.id) as { d: string }[];
  let streak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < days.length; i++) {
    const dt = new Date(days[i].d + "T00:00:00Z");
    const expected = new Date(today.getTime() - i * 86400_000);
    if (dt.toISOString().slice(0, 10) === expected.toISOString().slice(0, 10)) streak++;
    else break;
  }

  return NextResponse.json({
    success: true,
    profile: {
      username: user.username,
      displayName: user.display_name,
      avatarType: user.avatar_type,
      avatarValue: user.avatar_value,
      avatarColor: user.avatar_color,
      level: user.level,
      xp: user.xp,
      rankedPoints: user.ranked_points,
      createdAt: user.created_at,
      bio: (user as any).bio ?? null,
    },
    stats: {
      totalCompleted: progress.reduce((s, p) => s + p.count, 0),
      perModule: progress,
      badges,
      battles: { wins: battles?.wins ?? 0, losses: battles?.losses ?? 0 },
      streak,
    },
  });
}
