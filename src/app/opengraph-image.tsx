import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PROJET CARTHAGE – Apprenez à coder dans l'univers de Code Lyoko";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050a18 0%, #0a1628 50%, #0f1f3a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #00d4ff, #00ff88, #a855f7)",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              letterSpacing: "6px",
              background: "linear-gradient(90deg, #00d4ff, #00ff88)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PROJET CARTHAGE
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            Apprenez à coder dans l&apos;univers de Code Lyoko
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "24px",
            }}
          >
            {[
              { label: "Exercices", value: "552+" },
              { label: "Modules", value: "4" },
              { label: "Langages", value: "8" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#00d4ff" }}>{s.value}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "2px",
          }}
        >
          projet-carthage.fr
        </div>
      </div>
    ),
    { ...size }
  );
}
