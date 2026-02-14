import { NextRequest, NextResponse } from "next/server";

const PHP_API_URL = process.env.PHP_API_URL || "http://localhost/formation_code/api/auth.php";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    const res = await fetch(`${PHP_API_URL}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (data.success && data.data?.user) {
      return NextResponse.json({ success: true, user: data.data.user, message: data.data.message });
    }

    return NextResponse.json(
      { success: false, error: data.error || "Erreur serveur" },
      { status: res.ok ? 200 : 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Le serveur d'authentification n'est pas disponible." },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  // Check which OAuth providers are available
  if (action === "oauth_status") {
    return NextResponse.json({
      success: true,
      discord: !!DISCORD_CLIENT_ID && !DISCORD_CLIENT_ID.includes("YOUR_"),
      google: !!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_"),
    });
  }

  if (action === "discord_url" || action === "google_url") {
    // Block if placeholder credentials
    if (action === "discord_url" && (!DISCORD_CLIENT_ID || DISCORD_CLIENT_ID.includes("YOUR_"))) {
      return NextResponse.json({ success: false, error: "Discord OAuth non configuré." }, { status: 503 });
    }
    if (action === "google_url" && (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("YOUR_"))) {
      return NextResponse.json({ success: false, error: "Google OAuth non configuré." }, { status: 503 });
    }

    try {
      const res = await fetch(`${PHP_API_URL}?action=${action}`);
      const data = await res.json();
      if (data.url && (data.url.includes("YOUR_") || data.url.includes("undefined"))) {
        return NextResponse.json({ success: false, error: "OAuth non configuré sur le serveur." }, { status: 503 });
      }
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { success: false, error: "Service OAuth indisponible." },
        { status: 503 }
      );
    }
  }

  return NextResponse.json({ success: false, error: "Action non reconnue" }, { status: 400 });
}
