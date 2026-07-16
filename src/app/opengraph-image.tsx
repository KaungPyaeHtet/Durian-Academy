import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Branded share/embed card shown when the site is posted on Facebook, Messenger,
// etc. Uses the Padauk Myanmar font (bundled) so the Burmese tagline renders.
export const alt =
  "Durian Academy — ထူးထူးခြားခြားနဲ့ သက်သက်သာသာ · exam prep and study-abroad guidance for Myanmar students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontsDir = join(process.cwd(), "src/app/_fonts");
  const [padaukBold, padaukRegular, logoPng] = await Promise.all([
    readFile(join(fontsDir, "Padauk-Bold.ttf")),
    readFile(join(fontsDir, "Padauk-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/logo bg remove.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logoPng.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px",
          background: "linear-gradient(135deg, #fbf7ef 0%, #f3ecdc 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={logoSrc} alt="" width={84} height={84} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 38, fontWeight: 800, color: "#303c18" }}>
              Durian Academy
            </span>
            <span style={{ fontSize: 22, color: "#78600c", fontWeight: 600 }}>
              make it BOLD
            </span>
          </div>
        </div>

        {/* Burmese tagline (hero) + English support line */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span
            style={{
              fontFamily: "Padauk",
              fontWeight: 700,
              fontSize: 78,
              color: "#78600c",
              lineHeight: 1.5,
            }}
          >
            ထူးထူးခြားခြားနဲ့
          </span>
          <span
            style={{
              fontFamily: "Padauk",
              fontWeight: 700,
              fontSize: 78,
              color: "#78600c",
              lineHeight: 1.5,
            }}
          >
            သက်သက်သာသာ
          </span>
          <span style={{ fontSize: 30, color: "#4a5233", marginTop: 8 }}>
            Quality teaching &amp; study-abroad guidance for Myanmar students
          </span>
        </div>

        {/* what we offer */}
        <div style={{ display: "flex", gap: 14 }}>
          {[
            "Quality teachers",
            "Classes",
            "Products for students & teachers",
          ].map((t) => (
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
    {
      ...size,
      fonts: [
        { name: "Padauk", data: padaukBold, weight: 700, style: "normal" },
        { name: "Padauk", data: padaukRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
