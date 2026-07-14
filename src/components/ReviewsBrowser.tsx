"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { StaffItem, TeacherReview } from "@/lib/supabase";
import { site } from "@/lib/site";

export type ReviewTeacher = StaffItem & {
  reviews: TeacherReview[];
  classIds: string[];
};

type ClassOpt = { id: string; title: string };

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= Math.round(value) ? "text-gold-500" : "text-leaf-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function ratingWord(avg: number) {
  if (avg >= 4.5) return "Excellent";
  if (avg >= 4) return "Great";
  if (avg >= 3) return "Good";
  if (avg >= 2) return "Fair";
  return "Poor";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Shrink the font until `text` fits within `maxW`; returns the size used.
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  weight: string,
  family: string,
  startSize: number
) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxW && size > 22) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

// Draw a portrait, poster-style share card for a teacher → PNG blob.
async function drawTeacherCard(
  t: ReviewTeacher,
  avg: number,
  count: number
): Promise<Blob | null> {
  const W = 1080;
  const H = 1400;
  const PAD = 64;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = W / 2;
  // Use the site's actual Lexend font (pulled from the loaded page) on the
  // canvas. Wait for fonts to be ready so the glyphs are available.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
  const family =
    getComputedStyle(document.body).fontFamily || "'Lexend', sans-serif";
  const serif = family;
  const sans = family;

  // background
  ctx.fillStyle = "#fbf7ef";
  ctx.fillRect(0, 0, W, H);

  // ---- photo frame ----
  const fx = PAD;
  const fy = 80;
  const fw = W - PAD * 2;
  const fh = 860;
  ctx.save();
  roundRectPath(ctx, fx, fy, fw, fh, 28);
  ctx.clip();
  ctx.fillStyle = "#303c18";
  ctx.fillRect(fx, fy, fw, fh);
  let drewPhoto = false;
  if (t.image_url) {
    try {
      const img = await loadImage(t.image_url);
      const ratio = Math.max(fw / img.width, fh / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      ctx.drawImage(img, cx - w / 2, fy + fh / 2 - h / 2, w, h);
      drewPhoto = true;
    } catch {
      /* fall back to initials below */
    }
  }
  if (!drewPhoto) {
    ctx.fillStyle = "#fbf7ef";
    ctx.textAlign = "center";
    ctx.font = `700 200px ${sans}`;
    ctx.fillText(initials(t.name), cx, fy + fh / 2 + 68);
  }
  ctx.restore();
  // thin frame border
  ctx.strokeStyle = "rgba(48,60,24,0.15)";
  ctx.lineWidth = 2;
  roundRectPath(ctx, fx, fy, fw, fh, 28);
  ctx.stroke();

  // ---- name ----
  ctx.textAlign = "center";
  const nameSize = fitFont(ctx, t.name, fw - 40, "700", serif, 76);
  ctx.fillStyle = "#222a12";
  ctx.font = `700 ${nameSize}px ${serif}`;
  ctx.fillText(t.name, cx, 1030);

  // subjects
  if (t.subjects) {
    const subSize = fitFont(ctx, t.subjects, fw - 60, "400", sans, 30);
    ctx.fillStyle = "#78600c";
    ctx.font = `500 ${subSize}px ${sans}`;
    ctx.fillText(t.subjects, cx, 1078);
  }

  // ---- info panel ----
  const panelY = 1108;
  const panelH = 180;
  ctx.fillStyle = "#f3ecdc";
  roundRectPath(ctx, PAD, panelY, W - PAD * 2, panelH, 24);
  ctx.fill();

  // divider
  ctx.strokeStyle = "rgba(48,60,24,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, panelY + 34);
  ctx.lineTo(cx, panelY + panelH - 34);
  ctx.stroke();

  const leftX = PAD + (W - PAD * 2) / 4;
  const rightX = W - PAD - (W - PAD * 2) / 4;

  // left: rating
  ctx.fillStyle = "#6b7842";
  ctx.font = `700 24px ${sans}`;
  ctx.fillText("RATING", leftX, panelY + 52);
  ctx.fillStyle = "#78600c";
  ctx.font = `700 60px ${serif}`;
  ctx.fillText(count > 0 ? avg.toFixed(1) : "New", leftX, panelY + 116);
  // small stars
  const rounded = Math.round(avg);
  ctx.font = `26px ${sans}`;
  ctx.textAlign = "left";
  const starW = ctx.measureText("★").width;
  const starsX = leftX - (starW * 5) / 2;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = count > 0 && i < rounded ? "#a5871f" : "#c9cdb4";
    ctx.fillText("★", starsX + i * starW, panelY + 152);
  }
  ctx.textAlign = "center";

  // right: reviews
  ctx.fillStyle = "#6b7842";
  ctx.font = `700 24px ${sans}`;
  ctx.fillText("REVIEWS", rightX, panelY + 52);
  ctx.fillStyle = "#303c18";
  ctx.font = `700 60px ${serif}`;
  ctx.fillText(String(count), rightX, panelY + 116);
  ctx.fillStyle = "#4a5233";
  ctx.font = `500 24px ${sans}`;
  ctx.fillText(
    count === 0 ? "be the first" : count === 1 ? "student" : "students",
    rightX,
    panelY + 150
  );

  // ---- footer ----
  const footY = H - 56;
  ctx.strokeStyle = "rgba(48,60,24,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, footY - 30);
  ctx.lineTo(W - PAD, footY - 30);
  ctx.stroke();
  ctx.fillStyle = "#303c18";
  ctx.font = `700 28px ${sans}`;
  ctx.textAlign = "left";
  ctx.fillText("DURIAN ACADEMY", PAD, footY);
  ctx.fillStyle = "#6b7842";
  ctx.font = `500 26px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillText(site.url.replace(/^https?:\/\//, ""), W - PAD, footY);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export default function ReviewsBrowser({
  teachers,
  classes,
}: {
  teachers: ReviewTeacher[];
  classes: ClassOpt[];
}) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? teachers
        : teachers.filter((t) => t.classIds.includes(active)),
    [active, teachers]
  );

  const chip = (value: string, label: string) => {
    const isActive = active === value;
    return (
      <button
        key={value}
        onClick={() => setActive(value)}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
          isActive
            ? "border-leaf-600 bg-leaf-600 text-cream"
            : "border-leaf-200 text-leaf-700 hover:border-gold-400 hover:bg-leaf-50"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      {classes.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2.5">
          {chip("All", "All classes")}
          {classes.map((c) => chip(c.id, c.title))}
        </div>
      )}

      <div className="mt-10 space-y-8">
        {filtered.map((t) => (
          <TeacherReviewCard key={t.id} teacher={t} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-leaf-100 bg-white px-4 py-8 text-center text-sm text-ink-soft">
            No teachers in this class yet.
          </p>
        )}
      </div>
    </>
  );
}

export function TeacherReviewCard({ teacher: t }: { teacher: ReviewTeacher }) {
  const reviews = t.reviews;
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.stars, 0) / count : 0;

  const [preview, setPreview] = useState<{ url: string; file: File } | null>(
    null
  );
  const [building, setBuilding] = useState(false);

  // Build the card as a PNG in the browser and open a preview (no auto-download).
  async function openCard() {
    if (building) return;
    setBuilding(true);
    const blob = await drawTeacherCard(t, avg, count);
    setBuilding(false);
    if (!blob) return;
    const file = new File([blob], `${t.slug ?? "teacher"}-durian-academy.png`, {
      type: "image/png",
    });
    setPreview({ url: URL.createObjectURL(blob), file });
  }

  function closePreview() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  async function shareFile() {
    if (!preview) return;
    if (navigator.canShare?.({ files: [preview.file] })) {
      try {
        await navigator.share({ files: [preview.file], title: t.name });
        return;
      } catch {
        /* cancelled */
      }
    } else {
      downloadFile();
    }
  }

  function downloadFile() {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview.url;
    link.download = preview.file.name;
    link.click();
  }

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.stars === star).length,
  }));

  return (
    <article className="overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-card">
      {/* header */}
      <div className="flex items-center gap-4 border-b border-leaf-50 p-6">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-leaf-600 text-base font-semibold text-cream ring-4 ring-leaf-50">
          {t.image_url ? (
            <Image
              src={t.image_url}
              alt={t.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            initials(t.name)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold text-ink">{t.name}</h2>
          {t.subjects && (
            <p className="truncate text-sm text-ink-soft">{t.subjects}</p>
          )}
        </div>
      </div>

      {/* score + distribution */}
      <div className="grid gap-6 border-b border-leaf-50 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-center rounded-2xl bg-leaf-50 px-6 py-5 text-center">
          <span className="font-display text-5xl font-semibold leading-none text-leaf-700">
            {count > 0 ? avg.toFixed(1) : "—"}
          </span>
          <span className="mt-1 text-xs font-medium text-ink-soft">out of 5</span>
          {count > 0 && (
            <>
              <Stars value={avg} className="mt-2 text-sm" />
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-leaf-600">
                {ratingWord(avg)}
              </span>
            </>
          )}
        </div>

        <div>
          {count > 0 ? (
            <div className="space-y-1.5">
              {dist.map(({ star, n }) => {
                const pct = count > 0 ? (n / count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-8 shrink-0 text-ink-soft">{star}★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-leaf-50">
                      <span
                        className="block h-full rounded-full bg-gold-400"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-right tabular-nums text-ink-soft">
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">
              No reviews yet. Students with a class code can be the first.
            </p>
          )}
        </div>
      </div>

      {/* review list */}
      {reviews.length > 0 && (
        <ul className="divide-y divide-leaf-50">
          {reviews.map((r) => (
            <li key={r.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-600">
                    {r.stars}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {r.name?.trim() || "Anonymous"}
                    </p>
                    <p className="text-[11px] text-ink-soft/70">
                      {fmtDate(r.created_at)}
                    </p>
                  </div>
                </div>
                <Stars value={r.stars} className="text-sm" />
              </div>
              {r.review && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {r.review}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* share this teacher's rating card */}
      <div className="flex items-center justify-between gap-3 border-t border-leaf-50 bg-cream/40 px-6 py-4">
        <p className="text-xs text-ink-soft">
          Loved a class? Share this teacher&apos;s rating.
        </p>
        <button
          onClick={openCard}
          disabled={building}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
          </svg>
          {building ? "Creating…" : "Share card"}
        </button>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closePreview}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-cream shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-ink">Share card</p>
              <button
                onClick={closePreview}
                aria-label="Close"
                className="rounded-full p-1.5 text-ink-soft hover:bg-leaf-50"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={`${t.name} rating card`}
                className="mx-auto w-full rounded-xl border border-leaf-100"
              />
            </div>
            <div className="flex gap-3 p-4">
              <button
                onClick={shareFile}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
              >
                Share
              </button>
              <button
                onClick={downloadFile}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-leaf-300 px-4 py-2.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
