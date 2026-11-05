import { ImageResponse } from "next/og";
import { BRAND_COLORS, BRAND_PATHS, BRAND_TILE_RADIUS } from "../components/site/brand";

export const alt = "EvenBetter · Skills curadas para acessibilidade em iOS";
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
          <svg width="48" height="48" viewBox="0 0 512 512">
            <rect width="512" height="512" rx={512 * BRAND_TILE_RADIUS} fill={BRAND_COLORS.tile} />
            <path d={BRAND_PATHS.small.b} fill={BRAND_COLORS.b} fillRule="evenodd" />
            <path d={BRAND_PATHS.small.e} fill={BRAND_COLORS.e} />
          </svg>
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
            Artigo aceito na JIIHC 2026
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
            O seu agente de IA planeja, audita e corrige apps SwiftUI com o HIG da Apple e a WCAG 2.2.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: 0.5,
            color: "#266b65",
          }}
        >
          <span>16 skills · 49 cláusulas</span>
          <span style={{ color: "#a9d4c4" }}>·</span>
          <span style={{ color: "#3a5552" }}>SUS 79,5 com dez devs iOS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
