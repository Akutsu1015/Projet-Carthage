import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

interface ExecLogRow {
  id: number;
  user_id: number | null;
  username: string | null;
  ip: string | null;
  language: string;
  exit_code: number | null;
  code_len: number;
  duration_ms: number;
  error: string | null;
  created_at: string;
}

interface ExecLogStats {
  total: number;
  last24h: number;
  errors: number;
  byLanguage: Array<{ language: string; count: number }>;
  topUsers: Array<{ user_id: number; username: string | null; count: number }>;
  topIps: Array<{ ip: string; count: number }>;
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 500);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);
  const langFilter = url.searchParams.get("language") || "";
  const errorsOnly = url.searchParams.get("errors") === "1";

  const db = getDb();

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (langFilter) { where.push("el.language = ?"); params.push(langFilter); }
  if (errorsOnly) { where.push("(el.error IS NOT NULL OR el.exit_code != 0)"); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = db.prepare(
    `SELECT el.id, el.user_id, u.username, el.ip, el.language, el.exit_code,
            el.code_len, el.duration_ms, el.error, el.created_at
     FROM execution_log el
     LEFT JOIN users u ON u.id = el.user_id
     ${whereSql}
     ORDER BY el.id DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset) as ExecLogRow[];

  const stats: ExecLogStats = {
    total: (db.prepare("SELECT COUNT(*) as c FROM execution_log").get() as { c: number }).c,
    last24h: (db.prepare("SELECT COUNT(*) as c FROM execution_log WHERE created_at > datetime('now','-1 day')").get() as { c: number }).c,
    errors: (db.prepare("SELECT COUNT(*) as c FROM execution_log WHERE error IS NOT NULL OR exit_code != 0").get() as { c: number }).c,
    byLanguage: db.prepare(
      "SELECT language, COUNT(*) as count FROM execution_log GROUP BY language ORDER BY count DESC"
    ).all() as Array<{ language: string; count: number }>,
    topUsers: db.prepare(
      `SELECT el.user_id, u.username, COUNT(*) as count
       FROM execution_log el LEFT JOIN users u ON u.id = el.user_id
       WHERE el.user_id IS NOT NULL AND el.created_at > datetime('now','-7 day')
       GROUP BY el.user_id ORDER BY count DESC LIMIT 10`
    ).all() as Array<{ user_id: number; username: string | null; count: number }>,
    topIps: db.prepare(
      `SELECT ip, COUNT(*) as count FROM execution_log
       WHERE created_at > datetime('now','-1 day') AND ip IS NOT NULL
       GROUP BY ip ORDER BY count DESC LIMIT 10`
    ).all() as Array<{ ip: string; count: number }>,
  };

  return NextResponse.json({ success: true, rows, stats, limit, offset });
}
