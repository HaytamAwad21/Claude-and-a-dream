import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card layout (brand, headline, sub line, accent). */
export function ogCard({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0b",
          color: "#ede9e3",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 2 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 22, color: "#9a958e", letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 120, height: 8, background: "#c8ff2e", marginBottom: 32 }} />
          <div style={{ fontSize: title.length > 40 ? 72 : 96, fontWeight: 900, lineHeight: 1, textTransform: "uppercase" }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#9a958e", marginTop: 28 }}>{sub}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
