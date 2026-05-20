import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

interface BattleRow {
  id: string;
  mode: string;
  difficulty: string;
  status: string;
  creator_id: number;
  creator_name: string | null;
  creator_time: number | null;
  creator_flags: string | null;
  opponent_id: number | null;
  opponent_name: string | null;
  opponent_time: number | null;
  opponent_flags: string | null;
  winner_id: number | null;
  started_at: string | null;
  finished_at: string | null;
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 500);

  const db = getDb();
  const rows = db.prepare(
    `SELECT b.id, b.mode, b.difficulty, b.status,
            b.creator_id, c.display_name AS creator_name, b.creator_time, b.creator_flags,
            b.opponent_id, o.display_name AS opponent_name, b.opponent_time, b.opponent_flags,
            b.winner_id, b.started_at, b.finished_at
     FROM code_battles b
     LEFT JOIN users c ON c.id = b.creator_id
     LEFT JOIN users o ON o.id = b.opponent_id
     WHERE b.creator_flags IS NOT NULL OR b.opponent_flags IS NOT NULL
        OR (b.creator_time IS NOT NULL AND b.creator_time < 5000)
        OR (b.opponent_time IS NOT NULL AND b.opponent_time < 5000)
     ORDER BY b.id DESC LIMIT ?`
  ).all(limit) as BattleRow[];

  return NextResponse.json({ success: true, rows });
}
