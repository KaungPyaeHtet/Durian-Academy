import { ImageResponse } from "next/og";

// Branded share/embed card shown when the site is posted on Facebook, Messenger,
// etc. Keep the text Latin-only (the OG renderer has no Myanmar font).
export const alt =
  "Durian Academy — AP, SAT, IGCSE, A-Level & Myanmar G12 tuition and study-abroad guidance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #fbf7ef 0%, #f3ecdc 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#303c18",
              color: "#fbf7ef",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#303c18" }}>
              Durian Academy
            </span>
            <span style={{ fontSize: 22, color: "#78600c", fontWeight: 600 }}>
              make it BOLD
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#222a12",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Advanced Placement prep for Myanmar students
          </span>
          <span style={{ fontSize: 30, color: "#4a5233" }}>
            AP · College Board · Study-abroad guidance
          </span>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["AP", "College Board", "1–5 scoring"].map((t) => (
            <span
              key={t}
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                color: "#303c18",
                background: "#dce1cb",
                padding: "10px 22px",
                borderRadius: 999,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
