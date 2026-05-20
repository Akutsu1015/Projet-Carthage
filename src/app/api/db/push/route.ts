import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { getDb } from "@/lib/db";
import { getPushPublicKey, isPushEnabled, sendPushToUser } from "@/lib/push";

/** GET — return the VAPID public key so the client can subscribe. */
export async function GET() {
  if (!isPushEnabled()) {
    return NextResponse.json({ success: false, error: "Push non configuré" }, { status: 503 });
  }
  return NextResponse.json({ success: true, publicKey: getPushPublicKey() });
}

/**
 * POST — persist or clear the user's push subscription.
 * Body: `{ subscription }` to enroll, `{ unsubscribe: true }` to remove.
 */
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });

  let body: any = {};
  try { body = await req.json(); } catch { /* default */ }

  const db = getDb();

  if (body.unsubscribe) {
    db.prepare("UPDATE users SET push_subscription = NULL WHERE id = ?").run(user.id);
    return NextResponse.json({ success: true, subscribed: false });
  }

  if (!body.subscription || typeof body.subscription !== "object") {
    return NextResponse.json({ success: false, error: "Subscription manquante" }, { status: 400 });
  }

  db.prepare("UPDATE users SET push_subscription = ? WHERE id = ?")
    .run(JSON.stringify(body.subscription), user.id);

  // Send a confirmation push so the user knows it worked. Best-effort.
  void sendPushToUser(user.id, {
    title: "Notifications activées",
    body: "Tu seras prévenu des battles entrants et du défi du jour.",
    url: "/dashboard",
    tag: "carthage-welcome",
  });

  return NextResponse.json({ success: true, subscribed: true });
}
