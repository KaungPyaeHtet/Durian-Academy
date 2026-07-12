import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminAuthConfigured, isLoggedIn } from "@/lib/adminAuth";
import { getAdminSupabase, isAdminConfigured } from "@/lib/supabaseAdmin";
import type { ClassItem, ProductItem, StaffItem } from "@/lib/supabase";
import { programs } from "@/lib/site";
import { LogoMark } from "@/components/Logo";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import {
  saveClass,
  deleteClass,
  saveProduct,
  deleteProduct,
  saveStaff,
  deleteStaff,
  logout,
} from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-leaf-100 bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-leaf-400 focus:bg-white";
const labelCls =
  "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft";
const MODES = ["In-person", "Online", "Hybrid"];

export default async function AdminPage() {
  if (!adminAuthConfigured()) return <SetupNotice />;
  if (!(await isLoggedIn())) redirect("/admin/login");

  let classes: ClassItem[] = [];
  let products: ProductItem[] = [];
  let staff: StaffItem[] = [];
  let dbError = "";

  if (isAdminConfigured()) {
    const db = getAdminSupabase();
    const [c, p, s] = await Promise.all([
      db.from("classes").select("*").order("created_at", { ascending: false }),
      db.from("products").select("*").order("created_at", { ascending: false }),
      db
        .from("staff")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);
    if (c.error || p.error || s.error)
      dbError = c.error?.message || p.error?.message || s.error?.message || "";
    classes = (c.data as ClassItem[]) || [];
    products = (p.data as ProductItem[]) || [];
    staff = (s.data as StaffItem[]) || [];
  } else {
    dbError = "Supabase isn't configured yet — see setup steps.";
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 border-b border-leaf-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="font-display font-semibold text-leaf-600">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-medium text-ink-soft hover:text-leaf-600">
              View site ↗
            </Link>
            <form action={logout}>
              <button className="rounded-full border border-leaf-200 px-3 py-1.5 font-semibold text-leaf-700 hover:bg-leaf-50">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-12 px-5 py-10">
        {dbError && (
          <p className="rounded-lg bg-gold-500/10 px-4 py-3 text-sm text-gold-600">
            {dbError}
          </p>
        )}

        {/* ===== CLASSES ===== */}
        <section>
          <SectionTitle
            title="Classes"
            count={classes.length}
            hint="Announcements shown on /classes"
          />
          <AddDetails label="Add a class">
            <ClassForm />
          </AddDetails>
          <div className="mt-4 space-y-3">
            {classes.length === 0 && <Empty>No classes yet.</Empty>}
            {classes.map((c) => (
              <RowCard
                key={c.id}
                title={c.title}
                subtitle={[c.subject, c.schedule].filter(Boolean).join(" · ")}
                published={c.published}
                editForm={<ClassForm item={c} />}
                deleteAction={deleteClass}
                id={c.id}
              />
            ))}
          </div>
        </section>

        {/* ===== PRODUCTS ===== */}
        <section>
          <SectionTitle
            title="Products & services"
            count={products.length}
            hint="Shown on /products"
          />
          <AddDetails label="Add a product / service">
            <ProductForm />
          </AddDetails>
          <div className="mt-4 space-y-3">
            {products.length === 0 && <Empty>No products yet.</Empty>}
            {products.map((p) => (
              <RowCard
                key={p.id}
                title={p.title}
                subtitle={[p.category, p.price].filter(Boolean).join(" · ")}
                published={p.published}
                editForm={<ProductForm item={p} />}
                deleteAction={deleteProduct}
                id={p.id}
              />
            ))}
          </div>
        </section>

        {/* ===== TEACHERS & STAFF ===== */}
        <section>
          <SectionTitle
            title="Teachers & staff"
            count={staff.length}
            hint="Shown on /staff (lower order number = shown first)"
          />
          <AddDetails label="Add a teacher / staff member">
            <StaffForm />
          </AddDetails>
          <div className="mt-4 space-y-3">
            {staff.length === 0 && <Empty>No staff yet.</Empty>}
            {staff.map((s) => (
              <RowCard
                key={s.id}
                title={s.name}
                subtitle={[s.role, s.subjects].filter(Boolean).join(" · ")}
                published={s.published}
                editForm={<StaffForm item={s} />}
                deleteAction={deleteStaff}
                id={s.id}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- small building blocks ---------- */

function SectionTitle({
  title,
  count,
  hint,
}: {
  title: string;
  count: number;
  hint: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        <p className="text-xs text-ink-soft">{hint}</p>
      </div>
      <span className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-semibold text-leaf-600">
        {count}
      </span>
    </div>
  );
}

function AddDetails({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-xl border border-dashed border-leaf-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-leaf-600">
        + {label}
      </summary>
      <div className="border-t border-leaf-100 p-4">{children}</div>
    </details>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-leaf-100 bg-white px-4 py-6 text-center text-sm text-ink-soft">
      {children}
    </p>
  );
}

function RowCard({
  title,
  subtitle,
  published,
  editForm,
  deleteAction,
  id,
}: {
  title: string;
  subtitle: string;
  published: boolean;
  editForm: React.ReactNode;
  deleteAction: (fd: FormData) => Promise<void>;
  id: string;
}) {
  return (
    <div className="rounded-xl border border-leaf-100 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{title}</p>
          {subtitle && <p className="truncate text-xs text-ink-soft">{subtitle}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            published
              ? "bg-leaf-50 text-leaf-600"
              : "bg-gold-500/10 text-gold-600"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>
      <details className="border-t border-leaf-100">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-semibold text-leaf-600">
          Edit
        </summary>
        <div className="border-t border-leaf-100 p-4">
          {editForm}
          <form action={deleteAction} className="mt-4 border-t border-leaf-100 pt-4">
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmit
              message="Delete this permanently? This cannot be undone."
              className="text-sm font-semibold text-red-600 hover:underline"
            >
              Delete
            </ConfirmSubmit>
          </form>
        </div>
      </details>
    </div>
  );
}

/* ---------- forms ---------- */

function ClassForm({ item }: { item?: ClassItem }) {
  return (
    <form action={saveClass} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <L label="Title *">
          <input name="title" required defaultValue={item?.title ?? ""} className={input} />
        </L>
        <L label="Subject">
          <select name="subject" defaultValue={item?.subject ?? ""} className={input}>
            <option value="">—</option>
            {programs.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </L>
        <L label="Schedule">
          <input
            name="schedule"
            placeholder="Mon / Wed / Fri, 5–7pm"
            defaultValue={item?.schedule ?? ""}
            className={input}
          />
        </L>
        <L label="Starts on">
          <input type="date" name="starts_on" defaultValue={item?.starts_on ?? ""} className={input} />
        </L>
        <L label="Seats">
          <input type="number" name="seats" min={0} defaultValue={item?.seats ?? ""} className={input} />
        </L>
        <L label="Fee">
          <input name="fee" placeholder="Contact us / 150,000 MMK" defaultValue={item?.fee ?? ""} className={input} />
        </L>
        <L label="Mode">
          <select name="mode" defaultValue={item?.mode ?? ""} className={input}>
            <option value="">—</option>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </L>
        <L label="Summary (one line)">
          <input name="summary" defaultValue={item?.summary ?? ""} className={input} />
        </L>
      </div>
      <ImageField current={item?.image_url} />
      <L label="Description">
        <MarkdownEditor name="description" defaultValue={item?.description ?? ""} />
      </L>
      <PublishRow defaultChecked={item?.published ?? false} />
      <SaveButton isEdit={!!item} />
    </form>
  );
}

function ProductForm({ item }: { item?: ProductItem }) {
  return (
    <form action={saveProduct} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <L label="Title *">
          <input name="title" required defaultValue={item?.title ?? ""} className={input} />
        </L>
        <L label="Category">
          <input
            name="category"
            placeholder="University Application"
            defaultValue={item?.category ?? ""}
            className={input}
          />
        </L>
        <L label="Price">
          <input name="price" placeholder="Contact us" defaultValue={item?.price ?? ""} className={input} />
        </L>
        <L label="Summary (one line)">
          <input name="summary" defaultValue={item?.summary ?? ""} className={input} />
        </L>
      </div>
      <ImageField current={item?.image_url} />
      <L label="Description">
        <MarkdownEditor name="description" defaultValue={item?.description ?? ""} />
      </L>
      <PublishRow defaultChecked={item?.published ?? false} />
      <SaveButton isEdit={!!item} />
    </form>
  );
}

function StaffForm({ item }: { item?: StaffItem }) {
  return (
    <form action={saveStaff} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <L label="Name *">
          <input name="name" required defaultValue={item?.name ?? ""} className={input} />
        </L>
        <L label="Role / title">
          <input
            name="role"
            placeholder="Founder & Instructor"
            defaultValue={item?.role ?? ""}
            className={input}
          />
        </L>
        <L label="Subjects">
          <input
            name="subjects"
            placeholder="AP Calculus, Physics"
            defaultValue={item?.subjects ?? ""}
            className={input}
          />
        </L>
        <L label="Display order">
          <input
            type="number"
            name="sort_order"
            defaultValue={item?.sort_order ?? 0}
            className={input}
          />
        </L>
      </div>
      <div>
        <span className={labelCls}>Photo</span>
        <ImageInline current={item?.image_url} />
      </div>
      <L label="Bio">
        <MarkdownEditor name="bio" defaultValue={item?.bio ?? ""} rows={6} />
      </L>
      <PublishRow defaultChecked={item?.published ?? false} />
      <SaveButton isEdit={!!item} />
    </form>
  );
}

function ImageField({ current }: { current?: string | null }) {
  return (
    <div>
      <span className={labelCls}>Image (shown on the card)</span>
      <ImageInline current={current} />
    </div>
  );
}

function ImageInline({ current }: { current?: string | null }) {
  return (
    <>
      {current && (
        <div className="mb-2 flex items-center gap-3">
          <Image
            src={current}
            alt=""
            width={80}
            height={56}
            className="h-14 w-20 rounded-lg object-cover"
          />
          <label className="flex items-center gap-1.5 text-xs text-ink-soft">
            <input type="checkbox" name="remove_image" className="h-3.5 w-3.5 accent-[#303c18]" />
            Remove
          </label>
          <input type="hidden" name="current_image_url" value={current} />
        </div>
      )}
      <input
        type="file"
        name="image"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-leaf-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream hover:file:bg-leaf-700"
      />
    </>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function PublishRow({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" name="published" defaultChecked={defaultChecked} className="h-4 w-4 accent-[#303c18]" />
      Published (visible on the public site)
    </label>
  );
}

function SaveButton({ isEdit }: { isEdit: boolean }) {
  return (
    <button className="rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-leaf-700">
      {isEdit ? "Save changes" : "Create"}
    </button>
  );
}

function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hero px-5">
      <div className="max-w-md rounded-2xl border border-leaf-100 bg-white p-8 text-center shadow-card">
        <h1 className="font-display text-xl font-semibold text-ink">
          Admin not configured
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          Set <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment, then
          restart the server.
        </p>
      </div>
    </main>
  );
}
