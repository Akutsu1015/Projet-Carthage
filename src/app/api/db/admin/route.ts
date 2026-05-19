import { NextRequest, NextResponse } from "next/server";
import {
  getAdminStats, getAllUsers, setUserRole, deleteUser, searchUsers, getSessionUser,
  getAnalyticsStats, getTopPages, getRecentVisits, getDailyViews,
  getBannedIps, banIp, unbanIp, adminCreateUser,
} from "@/lib/db";
import { getTokenFromRequest } from "@/lib/api-auth";

/** Check that the request comes from an admin user. */
function requireAdmin(req: NextRequest): { authorized: true; user: NonNullable<ReturnType<typeof getSessionUser>> } | { authorized: false; response: NextResponse } {
  const token = getTokenFromRequest(req);
  if (!token) {
    return { authorized: false, response: NextResponse.json({ success: false, error: "Non authentifié." }, { status: 401 }) };
  }
  const dbUser = getSessionUser(token);
  if (!dbUser) {
    return { authorized: false, response: NextResponse.json({ success: false, error: "Session invalide." }, { status: 401 }) };
  }
  if (dbUser.role !== "admin") {
    return { authorized: false, response: NextResponse.json({ success: false, error: "Accès refusé." }, { status: 403 }) };
  }
  return { authorized: true, user: dbUser };
}

/* ═══ GET ═══ */

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const url = req.nextUrl;
    const action = url.searchParams.get("action") || "stats";

    if (action === "stats") {
      const stats = getAdminStats();
      return NextResponse.json({ success: true, stats });
    }

    if (action === "users") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const result = getAllUsers(limit, offset);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "search") {
      const query = url.searchParams.get("q") || "";
      if (!query) return NextResponse.json({ success: true, users: [] });
      const users = searchUsers(query);
      return NextResponse.json({ success: true, users });
    }

    if (action === "analytics") {
      const analytics = getAnalyticsStats();
      const topPages = getTopPages();
      const dailyViews = getDailyViews();
      const recentVisits = getRecentVisits(30);
      return NextResponse.json({ success: true, analytics, topPages, dailyViews, recentVisits });
    }

    if (action === "bannedIps") {
      const ips = getBannedIps();
      return NextResponse.json({ success: true, ips });
    }

    return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
  } catch (err) {
    console.error("[Admin API] GET error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

/* ═══ POST ═══ */

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { action } = body;

    if (action === "setRole") {
      const { userId, role } = body;
      if (!userId || !role) {
        return NextResponse.json({ success: false, error: "userId et role requis." }, { status: 400 });
      }
      if (!["admin", "user", "moderator"].includes(role)) {
        return NextResponse.json({ success: false, error: "Rôle invalide." }, { status: 400 });
      }
      if (userId === auth.user.id && role !== "admin") {
        return NextResponse.json({ success: false, error: "Vous ne pouvez pas retirer votre propre rôle admin." }, { status: 400 });
      }
      const ok = setUserRole(userId, role);
      return NextResponse.json({ success: ok });
    }

    if (action === "deleteUser") {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ success: false, error: "userId requis." }, { status: 400 });
      }
      if (userId === auth.user.id) {
        return NextResponse.json({ success: false, error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 });
      }
      const ok = deleteUser(userId);
      return NextResponse.json({ success: ok });
    }

    if (action === "banIp") {
      const { ip, reason } = body;
      if (!ip) {
        return NextResponse.json({ success: false, error: "IP requise." }, { status: 400 });
      }
      const ok = banIp(ip, reason || "Banni par un admin", auth.user.id);
      return NextResponse.json({ success: ok });
    }

    if (action === "unbanIp") {
      const { ip } = body;
      if (!ip) {
        return NextResponse.json({ success: false, error: "IP requise." }, { status: 400 });
      }
      const ok = unbanIp(ip);
      return NextResponse.json({ success: ok });
    }

    if (action === "createUser") {
      const { username, email, password, displayName, role } = body;
      if (!username || !email || !password) {
        return NextResponse.json({ success: false, error: "username, email et password requis." }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: "Le mot de passe doit faire au moins 6 caractères." }, { status: 400 });
      }
      const userRole = ["admin", "moderator"].includes(role) ? role : "user";
      const newUser = adminCreateUser(username, email, password, displayName || username, userRole);
      if (!newUser) {
        return NextResponse.json({ success: false, error: "Nom d'utilisateur ou email déjà utilisé." }, { status: 409 });
      }
      return NextResponse.json({ success: true, user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role } });
    }

    return NextResponse.json({ success: false, error: "Action inconnue." }, { status: 400 });
  } catch (err) {
    console.error("[Admin API] POST error:", err);
    return NextResponse.json({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}
