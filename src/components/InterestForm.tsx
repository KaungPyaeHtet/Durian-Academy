"use client";

import { useState } from "react";
import { programs } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

export function InterestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-leaf-100 bg-white p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50 text-2xl">
          🌱
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">
          Thank you!
        </h3>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          We&apos;ve received your details and our team will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-leaf-600 underline-offset-4 hover:underline"
        >
          Send another response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-card sm:p-7"
    >
      {/* honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Student or parent name"
            className={inputCls}
          />
        </Field>

        <Field label="Program of interest">
          <select name="program" defaultValue="" className={inputCls}>
            <option value="" disabled>
              Select a program
            </option>
            {programs.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </Field>

        <Field label="Email">
          <input
            name="email"
            type="email"
            maxLength={150}
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>

        <Field label="Phone / Viber">
          <input
            name="phone"
            type="tel"
            maxLength={40}
            placeholder="+95 9 …"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message">
          <textarea
            name="message"
            rows={3}
            maxLength={1500}
            placeholder="Tell us the student's grade, target exam and timeline."
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        Provide at least an email or phone so we can reach you.
      </p>

      {status === "error" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Register my interest"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-leaf-100 bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-leaf-400 focus:bg-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
