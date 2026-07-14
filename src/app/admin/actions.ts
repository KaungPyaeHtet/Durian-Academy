"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isLoggedIn,
  passwordMatches,
} from "@/lib/adminAuth";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { uploadImage } from "@/lib/storage";
import { uniqueSlug } from "@/lib/slug";
import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

// Readable random code (no ambiguous chars like O/0, I/1).
function randomCode(len = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

/** On create, generate a slug. On edit, keep the existing one stable unless it's missing. */
async function ensureSlug(
  db: SupabaseClient,
  table: "classes" | "products" | "staff",
  id: string,
  title: string,
): Promise<string | undefined> {
  if (id) {
    const { data } = await db.from(table).select("slug").eq("id", id).maybeSingle();
    if (data?.slug) return undefined; // keep stable; don't overwrite
  }
  return uniqueSlug(db, table, title, id || undefined);
}

async function requireAuth() {
  if (!(await isLoggedIn())) {
    throw new Error("Not authorized");
  }
}

function str(v: FormDataEntryValue | null, max = 2000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
// Long-form rich text (descriptions, bios) — effectively unlimited.
const LONG = 100000;
function numOrNull(v: FormDataEntryValue | null) {
  const n = Number(str(v));
  return Number.isFinite(n) && str(v) !== "" ? n : null;
}
function orNull(s: string) {
  return s === "" ? null : s;
}

/** Resolve the image URL: new upload > removal > keep existing. */
async function resolveImage(
  formData: FormData,
  folder: string,
): Promise<string | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadImage(file, folder);
  }
  if (formData.get("remove_image") === "on") return null;
  return orNull(str(formData.get("current_image_url"), 500));
}

// ---------- auth ----------
export async function login(formData: FormData) {
  const password = str(formData.get("password"), 200);
  if (!passwordMatches(password)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- classes ----------
export async function saveClass(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  const row = {
    title: str(formData.get("title")),
    subject: orNull(str(formData.get("subject"))),
    summary: orNull(str(formData.get("summary"))),
    description: orNull(str(formData.get("description"), LONG)),
    schedule: orNull(str(formData.get("schedule"))),
    starts_on: orNull(str(formData.get("starts_on"))),
    seats: numOrNull(formData.get("seats")),
    fee: orNull(str(formData.get("fee"))),
    mode: orNull(str(formData.get("mode"))),
    image_url: await resolveImage(formData, "classes"),
    published: formData.get("published") === "on",
  };
  if (!row.title) redirect("/admin?error=title");

  const db = getAdminSupabase();
  const slug = await ensureSlug(db, "classes", id, row.title);
  const payload = slug ? { ...row, slug } : row;
  const res = id
    ? await db.from("classes").update(payload).eq("id", id)
    : await db.from("classes").insert(payload);
  if (res.error) throw new Error(res.error.message);

  revalidatePath("/classes");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteClass(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    const { error } = await getAdminSupabase().from("classes").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/classes");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- products ----------
export async function saveProduct(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  const row = {
    title: str(formData.get("title")),
    category: orNull(str(formData.get("category"))),
    summary: orNull(str(formData.get("summary"))),
    description: orNull(str(formData.get("description"), LONG)),
    price: orNull(str(formData.get("price"))),
    image_url: await resolveImage(formData, "products"),
    published: formData.get("published") === "on",
  };
  if (!row.title) redirect("/admin?error=title");

  const db = getAdminSupabase();
  const slug = await ensureSlug(db, "products", id, row.title);
  const payload = slug ? { ...row, slug } : row;
  const res = id
    ? await db.from("products").update(payload).eq("id", id)
    : await db.from("products").insert(payload);
  if (res.error) throw new Error(res.error.message);

  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    const { error } = await getAdminSupabase().from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- staff ----------
export async function saveStaff(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  const kind = str(formData.get("kind")) === "teacher" ? "teacher" : "core";
  const row = {
    name: str(formData.get("name")),
    role: orNull(str(formData.get("role"))),
    subjects: orNull(str(formData.get("subjects"))),
    bio: orNull(str(formData.get("bio"), LONG)),
    image_url: await resolveImage(formData, "staff"),
    sort_order: numOrNull(formData.get("sort_order")) ?? 0,
    kind,
    published: formData.get("published") === "on",
  };
  if (!row.name) redirect("/admin?error=name");

  const db = getAdminSupabase();
  const slug = await ensureSlug(db, "staff", id, row.name);
  const payload = slug ? { ...row, slug } : row;
  const res = id
    ? await db.from("staff").update(payload).eq("id", id)
    : await db.from("staff").insert(payload);
  if (res.error) throw new Error(res.error.message);

  revalidatePath("/core");
  revalidatePath("/classes/[slug]", "page"); // teacher edits show inside classes
  revalidatePath("/reviews");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- class ↔ teacher links ----------
export async function addClassTeacher(formData: FormData) {
  await requireAuth();
  const class_id = str(formData.get("class_id"));
  const teacher_id = str(formData.get("teacher_id"));
  if (!class_id || !teacher_id) redirect("/admin");

  const row = {
    class_id,
    teacher_id,
    subjects: orNull(str(formData.get("subjects"))),
    sort_order: numOrNull(formData.get("sort_order")) ?? 0,
  };
  // upsert on (class_id, teacher_id) so re-adding just updates the subjects
  const { error } = await getAdminSupabase()
    .from("class_teachers")
    .upsert(row, { onConflict: "class_id,teacher_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/classes");
  revalidatePath("/classes/[slug]", "page"); // refresh every class detail page
  revalidatePath("/admin");
  redirect("/admin");
}

export async function removeClassTeacher(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    const { error } = await getAdminSupabase()
      .from("class_teachers")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/classes");
  revalidatePath("/classes/[slug]", "page");
  revalidatePath("/admin");
  redirect("/admin");
}

// ---------- review access codes ----------
export async function generateReviewCodes(formData: FormData) {
  await requireAuth();
  const class_id = str(formData.get("class_id"));
  if (!class_id) redirect("/admin");
  const count = Math.min(Math.max(numOrNull(formData.get("count")) ?? 1, 1), 50);
  const label = orNull(str(formData.get("label")));

  const rows = Array.from({ length: count }, () => ({
    class_id,
    code: randomCode(6),
    label,
  }));
  const { error } = await getAdminSupabase().from("review_codes").insert(rows);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteReviewCode(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    const { error } = await getAdminSupabase()
      .from("review_codes")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteStaff(formData: FormData) {
  await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    const { error } = await getAdminSupabase().from("staff").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/core");
  revalidatePath("/admin");
  redirect("/admin");
}
