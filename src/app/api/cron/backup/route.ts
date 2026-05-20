import { NextRequest, NextResponse } from "next/server";
import { takeBackup, purgeOldBackups } from "@/lib/backup";

/**
 * Cron endpoint — takes a SQLite backup and purges files older than
 * BACKUP_RETENTION_DAYS (default 14).
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>`
 * Schedule with: `0 3 * * *` (03:00 UTC)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ success: false, error: "CRON_SECRET non configuré" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await takeBackup();
    const purged = purgeOldBackups();
    return NextResponse.json({ success: true, ...result, purged });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "backup failed" }, { status: 500 });
  }
}
