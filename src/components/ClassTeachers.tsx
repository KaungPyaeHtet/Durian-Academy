"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  getPublicSupabase,
  type ClassTeacher,
  type TeacherReview,
} from "@/lib/supabase";
import { REVIEWS_ENABLED } from "@/lib/site";
import { Markdown } from "@/components/Markdown";

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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ClassTeachers({ links }: { links: ClassTeacher[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeLink = links.find((l) => l.id === openId) ?? null;

  return (
    <section className="mt-10 border-t border-leaf-100 pt-8">
      <h2 className="font-display text-xl font-semibold text-ink">Teachers</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Tap a teacher to see their profile and leave a rating.
      </p>

      <ul className="mt-5 flex flex-wrap gap-3">
        {links.map((link) => {
          const t = link.staff!;
          return (
            <li key={link.id}>
              <button
                onClick={() => setOpenId(link.id)}
                className="flex items-center gap-3 rounded-full border border-leaf-100 bg-white py-1.5 pl-1.5 pr-4 text-left shadow-sm transition-colors hover:border-gold-400/50"
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-leaf-600 text-xs font-semibold text-cream">
                  {t.image_url ? (
                    <Image
                      src={t.image_url}
                      alt={t.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    initials(t.name)
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {t.name}
                  </span>
                  {link.subjects && (
                    <span className="block text-xs text-ink-soft">
                      {link.subjects}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {activeLink && (
        <TeacherModal link={activeLink} onClose={() => setOpenId(null)} />
      )}
    </section>
  );
}

function TeacherModal({
  link,
  onClose,
}: {
  link: ClassTeacher;
  onClose: () => void;
}) {
  const t = link.staff!;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-card sm:max-h-[88vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start gap-4 p-6 pb-4">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-leaf-600 text-lg font-semibold text-cream ring-4 ring-leaf-50">
            {t.image_url ? (
              <Image
                src={t.image_url}
                alt={t.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              initials(t.name)
            )}
          </span>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold text-ink">
              {t.name}
            </h3>
            {t.role && (
              <p className="text-sm font-semibold text-leaf-600">{t.role}</p>
            )}
            {link.subjects && (
              <p className="mt-0.5 text-sm text-ink-soft">
                Teaches: {link.subjects}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-leaf-50"
          >
            ✕
          </button>
        </div>

        {t.bio && (
          <div className="shrink-0 border-t border-leaf-100 px-6 py-4">
            <Markdown>{t.bio}</Markdown>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
          <Reviews
            teacherId={t.id}
            initialSum={t.rating_sum}
            initialCount={t.rating_count}
          />
        </div>
      </div>
    </div>
  );
}

function Reviews({
  teacherId,
  initialSum,
  initialCount,
}: {
  teacherId: string;
  initialSum: number;
  initialCount: number;
}) {
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [avg, setAvg] = useState(initialCount > 0 ? initialSum / initialCount : 0);
  const [count, setCount] = useState(initialCount);

  // form state
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [code, setCode] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!REVIEWS_ENABLED) return;
    const db = getPublicSupabase();
    if (!db) return;
    const { data } = await db
      .from("teacher_reviews")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });
    const rows = (data as TeacherReview[]) || [];
    setReviews(rows);
    if (rows.length > 0) {
      const total = rows.reduce((s, r) => s + r.stars, 0);
      setAvg(total / rows.length);
      setCount(rows.length);
    }
  }, [teacherId]);

  useEffect(() => {
    // async fetch; state updates happen after the await, not synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!code.trim()) {
      setError("Enter the class access code your teacher gave you.");
      return;
    }
    if (stars < 1) {
      setError("Please pick a star rating first.");
      return;
    }
    if (!anonymous && !name.trim()) {
      setError("Add your name, or choose to post anonymously.");
      return;
    }
    setPending(true);
    setError("");
    const db = getPublicSupabase();
    if (!db) {
      setError("Reviews aren’t available right now.");
      setPending(false);
      return;
    }
    // Reviews can only be submitted with a valid class code (checked server-side).
    const { data, error } = await db.rpc("submit_review", {
      p_code: code.trim(),
      p_teacher: teacherId,
      p_stars: stars,
      p_name: anonymous ? null : name.trim() || null,
      p_email: anonymous ? null : email.trim() || null,
      p_review: text.trim() || null,
    });
    setPending(false);
    if (error) {
      setError("Couldn’t save your review. Please try again.");
      return;
    }
    const status = data as string;
    if (status !== "ok") {
      const messages: Record<string, string> = {
        invalid_code: "That access code isn’t valid or is no longer active.",
        teacher_not_in_class: "This code isn’t for a class this teacher teaches.",
        already_reviewed: "This code has already reviewed this teacher.",
        invalid_stars: "Please pick a star rating first.",
      };
      setError(messages[status] ?? "Couldn’t save your review. Please try again.");
      return;
    }
    setDone(true);
    setStars(0);
    setCode("");
    setName("");
    setEmail("");
    setText("");
    load();
  }

  const inputCls =
    "w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-400";

  if (!REVIEWS_ENABLED) {
    return (
      <div className="mt-4 rounded-2xl border border-leaf-100 bg-white p-6 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          Reviews coming soon
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Student ratings for this teacher will be available shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-2xl border border-leaf-100 bg-white p-4">
      {/* summary */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            {count > 0 ? `${avg.toFixed(1)} / 5` : "No reviews yet"}
          </p>
          <p className="text-xs text-ink-soft">
            {count > 0
              ? `${count} review${count === 1 ? "" : "s"}`
              : "Be the first to review"}
          </p>
        </div>
        {count > 0 && <Stars value={avg} className="text-lg" />}
      </div>

      {/* existing reviews — only this list scrolls; the rest stays put */}
      {reviews.length > 0 && (
        <ul className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto border-t border-leaf-50 pt-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg bg-cream/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">
                  {r.name?.trim() || "Anonymous"}
                </span>
                <Stars value={r.stars} className="text-sm" />
              </div>
              {r.review && (
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {r.review}
                </p>
              )}
              <p className="mt-1 text-[11px] text-ink-soft/70">
                {fmtDate(r.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* write a review — pinned below the scrolling list */}
      {done ? (
        <p className="mt-4 shrink-0 border-t border-leaf-50 pt-4 text-sm font-medium text-leaf-600">
          Thanks for your review!
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 shrink-0 border-t border-leaf-50 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Write a review
          </p>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Class access code"
            className={`mt-2 ${inputCls}`}
          />
          <p className="mt-1 text-[11px] text-ink-soft/80">
            Only students given a code for this teacher’s class can review.
          </p>

          <div
            className="mt-3 flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onClick={() => setStars(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className={`text-2xl leading-none transition-colors ${
                  (hover || stars) >= n ? "text-gold-500" : "text-leaf-200"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Share your experience (optional)"
            className={`mt-2 ${inputCls}`}
          />

          <label className="mt-3 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 accent-[#303c18]"
            />
            Post anonymously
          </label>

          {!anonymous && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputCls}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (kept private)"
                className={inputCls}
              />
            </div>
          )}

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-3 rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700 disabled:opacity-60"
          >
            {pending ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}
    </div>
  );
}
