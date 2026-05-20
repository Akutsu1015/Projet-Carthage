import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface ActiveRow {
  id: string;
  mode: string;
  difficulty: string;
  challenge_title: string | null;
  creator_id: number;
  creator_name: string | null;
  creator_avatar_color: string | null;
  opponent_id: number | null;
  opponent_name: string | null;
  opponent_avatar_color: string | null;
  started_at: string | null;
}

/** Returns all currently-running battles, so other users can spectate them. */
export async function GET() {
  const rows = getDb().prepare(
    `SELECT b.id, b.mode, b.difficulty, b.started_at,
            ch.title AS challenge_title,
            b.creator_id, c.display_name AS creator_name, c.avatar_color AS creator_avatar_color,
            b.opponent_id, o.display_name AS opponent_name, o.avatar_color AS opponent_avatar_color
     FROM code_battles b
     LEFT JOIN users c ON c.id = b.creator_id
     LEFT JOIN users o ON o.id = b.opponent_id
     LEFT JOIN battle_challenges ch ON ch.id = b.challenge_id
     WHERE b.status = 'active'
     ORDER BY b.started_at DESC LIMIT 50`
  ).all() as ActiveRow[];

  return NextResponse.json({ success: true, battles: rows });
}
