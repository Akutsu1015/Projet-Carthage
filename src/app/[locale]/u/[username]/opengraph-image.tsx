import { ImageResponse } from "next/og";
import { getUserByUsername, getDb } from "@/lib/db";

export const runtime = "nodejs"; // needs better-sqlite3, not edge-compatible
export const alt = "Profil PROJET CARTHAGE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = getUserByUsername(username);

  // Defensive defaults so we never throw 500 from a social-scraper request.
  const displayName = user?.display_name || username;
  const level = user?.level ?? 0;
  const xp = user?.xp ?? 0;
  const rankedPoints = (user as any)?.ranked_points ?? 0;
  const color = user?.avatar_color || "#00d4ff";
  const initials = (user?.avatar_value || displayName.slice(0, 2)).toUpperCase().slice(0, 3);

  let completed = 0;
  if (user) {
    try {
      const row = getDb()
        .prepare("SELECT COUNT(*) c FROM exercise_progress WHERE user_id = ?")
        .get(user.id) as { c: number };
      completed = row?.c ?? 0;
    } catch { /* ignore */ }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #050a18 0%, #0a1628 50%, #0f1f3a 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "70px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: color }} />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-200px",
            left: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          }}
        />

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "60px" }}>
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: `6px solid ${color}`,
              background: `${color}1f`,
              alignItems: "center",
              justifyContent: "center",
              fontSize: "92px",
              fontWeight: 900,
              color,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            <div style={{ display: "flex", fontSize: "20px", letterSpacing: "3px", color: "rgba(255,255,255,0.4)" }}>
              PROFIL
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "72px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {displayName}
            </div>
            <div style={{ display: "flex", fontSize: "22px", color: "rgba(255,255,255,0.5)" }}>
              @{user?.username || username}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
              <Stat color={color} label="Niveau" value={String(level)} />
              <Stat color="#fbbf24" label="XP" value={xp.toLocaleString()} />
              <Stat color="#00ff88" label="Exos" value={String(completed)} />
              <Stat color="#a855f7" label="Ranked" value={String(rankedPoints)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "30px",
            left: 0,
            right: 0,
            justifyContent: "space-between",
            paddingLeft: "70px",
            paddingRight: "70px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: "18px", fontWeight: 800, letterSpacing: "3px", color: "#00d4ff" }}>
            PROJET CARTHAGE
          </div>
          <div style={{ display: "flex", fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
            gamematcher.fr/u/{user?.username || username}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Stat({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "14px 22px",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ display: "flex", fontSize: "32px", fontWeight: 800, color }}>{value}</div>
      <div style={{ display: "flex", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{label}</div>
    </div>
  );
}
