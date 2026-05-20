import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

interface BattleRow {
  id: string;
  challenge_id: number;
  status: string;
  mode: string;
  difficulty: string;
  creator_id: number;
  creator_name: string | null;
  creator_code: string | null;
  creator_time: number | null;
  opponent_id: number | null;
  opponent_name: string | null;
  opponent_code: string | null;
  opponent_time: number | null;
  winner_id: number | null;
  started_at: string | null;
  finished_at: string | null;
  challenge_title: string | null;
  challenge_template: string | null;
}

/**
 * Returns a finished battle's full state for the replay UI.
 * Only participants OR admins can fetch a battle's code submissions.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = getAuthUser(req);

  const db = getDb();
  const row = db.prepare(
    `SELECT b.*, c.display_name AS creator_name, o.display_name AS opponent_name,
            ch.title AS challenge_title, ch.template AS challenge_template
     FROM code_battles b
     LEFT JOIN users c ON c.id = b.creator_id
     LEFT JOIN users o ON o.id = b.opponent_id
     LEFT JOIN battle_challenges ch ON ch.id = b.challenge_id
     WHERE b.id = ?`
  ).get(id) as BattleRow | undefined;

  if (!row) return NextResponse.json({ success: false, error: "Battle introuvable" }, { status: 404 });
  if (row.status === "active") return NextResponse.json({ success: false, error: "Battle en cours" }, { status: 409 });

  const isParticipant = user && (user.id === row.creator_id || user.id === row.opponent_id);
  const isAdmin = user?.role === "admin";
  if (!isParticipant && !isAdmin) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    battle: {
      id: row.id,
      mode: row.mode,
      difficulty: row.difficulty,
      status: row.status,
      challengeTitle: row.challenge_title,
      template: row.challenge_template,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      winnerId: row.winner_id,
      creator: { id: row.creator_id, name: row.creator_name, code: row.creator_code, timeMs: row.creator_time },
      opponent: { id: row.opponent_id, name: row.opponent_name, code: row.opponent_code, timeMs: row.opponent_time },
    },
  });
}
