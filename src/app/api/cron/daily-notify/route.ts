import { NextRequest, NextResponse } from "next/server";
import { getDb, getTodaysChallenge } from "@/lib/db";
import { sendPushToUser, isPushEnabled } from "@/lib/push";

/**
 * Cron endpoint — pushes today's daily-challenge notification to every user
 * who has opted into web push AND hasn't yet completed today's challenge.
 *
 * Auth: requires `Authorization: Bearer <CRON_SECRET>` header.
 * Schedule with: `0 9 * * *` (09:00 UTC) — set up via system cron, Vercel cron,
 * or a managed service (Upstash Cron, EasyCron, etc.).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, error: "CRON_SECRET non configuré" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isPushEnabled()) {
    return NextResponse.json({ success: false, error: "Push non configuré" }, { status: 503 });
  }

  const challenge = getTodaysChallenge();
  if (!challenge) return NextResponse.json({ success: false, error: "Aucun défi" }, { status: 500 });

  const db = getDb();
  const recipients = db.prepare(
    `SELECT id FROM users
     WHERE push_subscription IS NOT NULL
       AND id NOT IN (SELECT user_id FROM daily_completions WHERE day = ?)`
  ).all(challenge.day) as { id: number }[];

  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const out = await sendPushToUser(r.id, {
      title: "Défi du jour disponible !",
      body: `Module ${challenge.module_id} — +50 XP bonus si tu le résous.`,
      url: `/exercises/${challenge.module_id}?daily=${challenge.day}`,
      tag: `daily-${challenge.day}`,
    });
    if (out.ok) sent++; else failed++;
  }

  return NextResponse.json({ success: true, day: challenge.day, sent, failed, total: recipients.length });
}
