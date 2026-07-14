import { ImageResponse } from "next/og";
import {
  getPublicSupabase,
  type StaffItem,
  type TeacherReview,
} from "@/lib/supabase";

export const alt = "Durian Academy teacher rating";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const db = getPublicSupabase();

  let teacher: StaffItem | null = null;
  let reviews: TeacherReview[] = [];
  if (db) {
    const column = UUID.test(slug) ? "id" : "slug";
    const t = await db
      .from("staff")
      .select("*")
      .eq(column, slug)
      .eq("published", true)
      .maybeSingle();
    teacher = (t.data as StaffItem) || null;
    if (teacher) {
      const r = await db
        .from("teacher_reviews")
        .select("*")
        .eq("teacher_id", teacher.id);
      reviews = (r.data as TeacherReview[]) || [];
    }
  }

  const name = teacher?.name ?? "Durian Academy";
  const subjects = teacher?.subjects ?? "";
  const count = reviews.length;
  const avg =
    count > 0 ? reviews.reduce((s, r) => s + r.stars, 0) / count : 0;
  const rounded = Math.round(avg);

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
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#303c18",
              color: "#fbf7ef",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            D
          </div>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#303c18" }}>
            Durian Academy
          </span>
        </div>

        {/* teacher + rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {teacher?.image_url ? (
            <img
              src={teacher.image_url}
              alt=""
              width={220}
              height={220}
              style={{
                width: 220,
                height: 220,
                borderRadius: 28,
                objectFit: "cover",
                border: "6px solid #303c18",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 180,
                height: 180,
                borderRadius: 90,
                background: "#303c18",
                color: "#fbf7ef",
                fontSize: 70,
                fontWeight: 800,
              }}
            >
              {initials(name)}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 800, color: "#222a12" }}>
              {name}
            </span>
            {subjects ? (
              <span style={{ fontSize: 30, color: "#4a5233", marginTop: 4 }}>
                {subjects}
              </span>
            ) : null}
            <div
              style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}
            >
              <span style={{ fontSize: 72, fontWeight: 800, color: "#78600c" }}>
                {count > 0 ? avg.toFixed(1) : "New"}
              </span>
              {count > 0 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 40, color: "#a5871f", letterSpacing: 4 }}>
                    {"★★★★★".slice(0, rounded)}
                    <span style={{ color: "#dce1cb" }}>
                      {"★★★★★".slice(rounded)}
                    </span>
                  </span>
                  <span style={{ fontSize: 24, color: "#4a5233" }}>
                    {count} student review{count === 1 ? "" : "s"}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 28, color: "#4a5233" }}>
                  Be the first to review
                </span>
              )}
            </div>
          </div>
        </div>

        <span style={{ fontSize: 26, color: "#6b7842" }}>
          Verified student reviews · durianacademy.com
        </span>
      </div>
    ),
    { ...size }
  );
}
