import { ImageResponse } from "next/og";
import { MODULES } from "@/lib/constants";

export const runtime = "edge";
export const alt = "PROJET CARTHAGE — Module d'exercices";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params;
  const mod = MODULES.find((m) => m.id === moduleId);
  const moduleName = mod?.name || moduleId;
  const moduleColor = mod?.color || "#00d4ff";
  const levels = mod?.levels || 0;
  const description = mod?.description || "Module d'exercices interactifs";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #050a18 0%, #0a1628 50%, #0f1f3a 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: moduleColor,
          }}
        />

        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${moduleColor}33 0%, transparent 70%)`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: `2px solid ${moduleColor}`,
              background: `${moduleColor}1a`,
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: moduleColor,
              }}
            />
            <div style={{ display: "flex", fontSize: "16px", letterSpacing: "2px", color: moduleColor, fontWeight: 700 }}>
              MODULE
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "88px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            {moduleName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 24px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", fontSize: "36px", fontWeight: 800, color: moduleColor }}>
                {`${levels}+`}
              </div>
              <div style={{ display: "flex", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>exercices</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "4px",
              color: "#00d4ff",
            }}
          >
            PROJET CARTHAGE
          </div>
          <div style={{ display: "flex", fontSize: "14px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
            gamematcher.fr
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
