import webpush from "web-push";
import { getDb } from "@/lib/db";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:noreply@gamematcher.fr";

let configured = false;
function configure() {
  if (configured) return PUBLIC_KEY && PRIVATE_KEY;
  if (PUBLIC_KEY && PRIVATE_KEY) {
    webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
    configured = true;
    return true;
  }
  return false;
}

export function isPushEnabled() {
  return Boolean(PUBLIC_KEY && PRIVATE_KEY);
}

export function getPushPublicKey() {
  return PUBLIC_KEY;
}

/**
 * Send a push to a single user. Best-effort: clears the subscription if
 * Push gateway returns 410 (Gone) or 404.
 */
export async function sendPushToUser(userId: number, payload: { title: string; body: string; url?: string; tag?: string }) {
  if (!configure()) return { ok: false, reason: "not_configured" };
  const db = getDb();
  const row = db.prepare("SELECT push_subscription FROM users WHERE id = ?").get(userId) as { push_subscription: string | null } | undefined;
  if (!row?.push_subscription) return { ok: false, reason: "no_subscription" };
  let sub: webpush.PushSubscription;
  try { sub = JSON.parse(row.push_subscription); }
  catch { return { ok: false, reason: "bad_subscription" }; }
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return { ok: true };
  } catch (e: any) {
    const code = e?.statusCode;
    if (code === 404 || code === 410) {
      db.prepare("UPDATE users SET push_subscription = NULL WHERE id = ?").run(userId);
    }
    return { ok: false, reason: `gateway_${code || "error"}` };
  }
}
