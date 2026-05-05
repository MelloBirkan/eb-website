import { ImageResponse } from "next/og";

export const alt = "EvenBetter — Skills curadas para acessibilidade em iOS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#d8e2dc",
          backgroundImage:
            "radial-gradient(ellipse 800px 600px at 8% -8%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(ellipse 760px 560px at 112% 28%, rgba(38,107,101,0.22), transparent 62%), radial-gradient(ellipse 640px 540px at 50% 110%, rgba(38,107,101,0.16), transparent 60%)",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#1f4e4a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#1f4e4a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 19 L11 13 L13 15 L19 7"
                stroke="#b6efd9"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 7 L19 7 L19 12"
                stroke="#b6efd9"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: "#1f4e4a",
            }}
          >
            EvenBetter
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 16,
              fontFamily: "ui-monospace, monospace",
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#3a5552",
            }}
          >
            TCC II · Mackenzie · 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.95,
              letterSpacing: -3,
              fontWeight: 700,
              color: "#1f4e4a",
              maxWidth: 980,
            }}
          >
            Skills curadas para acessibilidade em iOS.
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.4,
              color: "#3a5552",
              maxWidth: 800,
            }}
          >
            Framework para Codex, Claude Code e o plugin EvenBetter iOS.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#266b65",
          }}
        >
          <span>31% &mdash; 69%</span>
          <span style={{ color: "#a9d4c4" }}>·</span>
          <span style={{ color: "#3a5552" }}>cobertura de a11y · Zhong et al., 2025</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
