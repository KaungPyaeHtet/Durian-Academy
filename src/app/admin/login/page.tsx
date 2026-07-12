import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "../actions";
import { adminAuthConfigured, isLoggedIn } from "@/lib/adminAuth";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isLoggedIn()) redirect("/admin");
  const { error } = await searchParams;
  const configured = adminAuthConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-5">
      <div className="w-full max-w-sm rounded-2xl border border-leaf-100 bg-white p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <LogoMark size={44} />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Durian Academy Admin
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Sign in to manage content</p>
        </div>

        {!configured ? (
          <p className="mt-6 rounded-lg bg-gold-500/10 px-4 py-3 text-sm text-gold-600">
            Admin isn&apos;t configured yet. Set <code>ADMIN_PASSWORD</code> and{" "}
            <code>ADMIN_SESSION_SECRET</code> in your environment, then restart.
          </p>
        ) : (
          <form action={login} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Incorrect password. Try again.
              </p>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoFocus
                className="w-full rounded-xl border border-leaf-100 bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none focus:border-leaf-400 focus:bg-white"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-leaf-600 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
