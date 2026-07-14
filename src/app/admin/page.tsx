import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminAuthConfigured, isLoggedIn } from "@/lib/adminAuth";
import { getAdminSupabase, isAdminConfigured } from "@/lib/supabaseAdmin";
import type {
  ClassItem,
  ProductItem,
  StaffItem,
  ClassTeacher,
  ReviewCode,
} from "@/lib/supabase";
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
  addClassTeacher,
  removeClassTeacher,
  generateReviewCodes,
  deleteReviewCode,
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

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export default async function AdminPage() {
  if (!adminAuthConfigured()) return <SetupNotice />;
  if (!(await isLoggedIn())) redirect("/admin/login");

  let classes: ClassItem[] = [];
  let products: ProductItem[] = [];
  let staff: StaffItem[] = [];
  let links: ClassTeacher[] = [];
  let codes: ReviewCode[] = [];
  let dbError = "";

  if (isAdminConfigured()) {
    const db = getAdminSupabase();
    const [c, p, s, l, rc] = await Promise.all([
      db.from("classes").select("*").order("created_at", { ascending: false }),
      db.from("products").select("*").order("created_at", { ascending: false }),
      db
        .from("staff")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      db
        .from("class_teachers")
        .select("*, staff(*)")
        .order("sort_order", { ascending: true }),
      db
        .from("review_codes")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (c.error || p.error || s.error || l.error || rc.error)
      dbError =
        c.error?.message ||
        p.error?.message ||
        s.error?.message ||
        l.error?.message ||
        rc.error?.message ||
        "";
    classes = (c.data as ClassItem[]) || [];
    products = (p.data as ProductItem[]) || [];
    staff = (s.data as StaffItem[]) || [];
    links = (l.data as ClassTeacher[]) || [];
    codes = (rc.data as ReviewCode[]) || [];
  } else {
    dbError = "Supabase isn't configured yet — see setup steps.";
  }

  const teachers = staff.filter((s) => s.kind === "teacher");
  const coreMembers = staff.filter((s) => s.kind !== "teacher");
  const linksByClass = new Map<string, ClassTeacher[]>();
  for (const link of links) {
    const arr = linksByClass.get(link.class_id) ?? [];
    arr.push(link);
    linksByClass.set(link.class_id, arr);
  }
  const codesByClass = new Map<string, ReviewCode[]>();
  for (const rc of codes) {
    const arr = codesByClass.get(rc.class_id) ?? [];
    arr.push(rc);
    codesByClass.set(rc.class_id, arr);
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-10 border-b border-leaf-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
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

      <div className="mx-auto max-w-3xl space-y-12 px-5 py-10">
        {dbError && (
          <p className="rounded-lg bg-gold-500/10 px-4 py-3 text-sm text-gold-600">
            {dbError}
          </p>
        )}

        {/* quick jump — makes a long admin page easy to navigate */}
        <nav className="flex flex-wrap gap-2 text-sm">
          {[
            { href: "#classes", label: "Classes", n: classes.length },
            { href: "#products", label: "Products", n: products.length },
            { href: "#core", label: "Core", n: coreMembers.length },
            { href: "#teachers", label: "Teachers", n: teachers.length },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 font-semibold text-leaf-700 hover:border-gold-400 hover:bg-leaf-50"
            >
              {s.label}
              <span className="rounded-full bg-leaf-50 px-1.5 text-xs text-leaf-600">
                {s.n}
              </span>
            </a>
          ))}
        </nav>

        {/* ===== CLASSES ===== */}
        <section id="classes" className="scroll-mt-20">
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
                thumb={c.image_url}
                fallback={initials(c.title)}
                editForm={
                  <>
                    <ClassForm item={c} />
                    <ClassTeachersManager
                      classId={c.id}
                      teachers={teachers}
                      links={linksByClass.get(c.id) ?? []}
                    />
                    <ReviewCodesManager
                      classId={c.id}
                      codes={codesByClass.get(c.id) ?? []}
                    />
                  </>
                }
                deleteAction={deleteClass}
                id={c.id}
              />
            ))}
          </div>
        </section>

        {/* ===== PRODUCTS ===== */}
        <section id="products" className="scroll-mt-20">
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
                thumb={p.image_url}
                fallback={initials(p.title)}
                editForm={<ProductForm item={p} />}
                deleteAction={deleteProduct}
                id={p.id}
              />
            ))}
          </div>
        </section>

        {/* ===== CORE MEMBERS ===== */}
        <section id="core" className="scroll-mt-20">
          <SectionTitle
            title="Core members"
            count={coreMembers.length}
            hint="Shown on /core · max 6"
          />
          <AddDetails label="Add a core member">
            <StaffForm defaultKind="core" />
          </AddDetails>
          <div className="mt-4 space-y-3">
            {coreMembers.length === 0 && <Empty>No core members yet.</Empty>}
            {coreMembers.map((s) => (
              <RowCard
                key={s.id}
                title={s.name}
                subtitle={[s.role, s.subjects].filter(Boolean).join(" · ")}
                published={s.published}
                thumb={s.image_url}
                fallback={initials(s.name)}
                round
                editForm={<StaffForm item={s} />}
                deleteAction={deleteStaff}
                id={s.id}
              />
            ))}
          </div>
        </section>

        {/* ===== TEACHERS ===== */}
        <section id="teachers" className="scroll-mt-20">
          <SectionTitle
            title="Teachers"
            count={teachers.length}
            hint="Linked to classes · not on /core"
          />
          <AddDetails label="Add a teacher">
            <StaffForm defaultKind="teacher" />
          </AddDetails>
          <div className="mt-4 space-y-3">
            {teachers.length === 0 && <Empty>No teachers yet.</Empty>}
            {teachers.map((s) => (
              <RowCard
                key={s.id}
                title={s.name}
                subtitle={[s.role, s.subjects].filter(Boolean).join(" · ")}
                published={s.published}
                thumb={s.image_url}
                fallback={initials(s.name)}
                round
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
  thumb,
  fallback,
  round,
}: {
  title: string;
  subtitle: string;
  published: boolean;
  editForm: React.ReactNode;
  deleteAction: (fd: FormData) => Promise<void>;
  id: string;
  thumb?: string | null;
  fallback?: React.ReactNode;
  round?: boolean;
}) {
  const shape = round ? "rounded-full" : "rounded-lg";
  return (
    <details className="group rounded-xl border border-leaf-100 bg-white">
      {/* clicking anywhere on the row opens the editor */}
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden ${shape} bg-leaf-50 text-sm font-semibold text-leaf-600`}
        >
          {thumb ? (
            <Image
              src={thumb}
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            fallback
          )}
        </span>
        <div className="min-w-0 flex-1">
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
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
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

function StaffForm({
  item,
  defaultKind = "core",
}: {
  item?: StaffItem;
  defaultKind?: "core" | "teacher";
}) {
  return (
    <form action={saveStaff} className="space-y-3">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <L label="Name *">
          <input name="name" required defaultValue={item?.name ?? ""} className={input} />
        </L>
        <L label="Type">
          <select
            name="kind"
            defaultValue={item?.kind ?? defaultKind}
            className={input}
          >
            <option value="core">Core member (shown on /core)</option>
            <option value="teacher">Teacher (hidden, linked to classes)</option>
          </select>
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

// Assign teachers (staff of kind='teacher') to a class, each with the subjects
// they cover. Rendered inside a class's Edit panel — as a sibling of ClassForm,
// never nested (these are separate <form>s).
function ClassTeachersManager({
  classId,
  teachers,
  links,
}: {
  classId: string;
  teachers: StaffItem[];
  links: ClassTeacher[];
}) {
  return (
    <div className="mt-4 rounded-xl border border-leaf-100 bg-cream/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        Teachers in this class
      </p>

      {teachers.length === 0 ? (
        <p className="mt-2 text-xs text-ink-soft">
          No teachers yet — add a staff member with Type “Teacher” first.
        </p>
      ) : (
        <>
          <div className="mt-3 space-y-2">
            {links.length === 0 && (
              <p className="text-xs text-ink-soft">No teachers linked yet.</p>
            )}
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-leaf-100 bg-white px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <span className="font-semibold text-ink">
                    {link.staff?.name ?? "—"}
                  </span>
                  {link.subjects && (
                    <span className="text-ink-soft"> · {link.subjects}</span>
                  )}
                </div>
                <form action={removeClassTeacher}>
                  <input type="hidden" name="id" value={link.id} />
                  <button className="shrink-0 text-xs font-semibold text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>

          <form
            action={addClassTeacher}
            className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input type="hidden" name="class_id" value={classId} />
            <select name="teacher_id" required className={input}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              name="subjects"
              placeholder="Subjects (e.g. AP Calculus, AP Physics)"
              className={input}
            />
            <button className="rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream hover:bg-leaf-700">
              Add
            </button>
          </form>
        </>
      )}
    </div>
  );
}

// Generate & manage class access codes. Students need a code to review the
// class's teachers. Codes are shown here so you can hand them out.
function ReviewCodesManager({
  classId,
  codes,
}: {
  classId: string;
  codes: ReviewCode[];
}) {
  return (
    <div className="mt-4 rounded-xl border border-leaf-100 bg-cream/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        Review access codes
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Give one code to each student. A code can review each teacher in this
        class once.
      </p>

      {codes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {codes.map((rc) => (
            <span
              key={rc.id}
              className="inline-flex items-center gap-2 rounded-lg border border-leaf-100 bg-white px-2.5 py-1.5 text-sm"
            >
              <code className="font-mono font-semibold tracking-wider text-ink">
                {rc.code}
              </code>
              {rc.label && (
                <span className="text-xs text-ink-soft">{rc.label}</span>
              )}
              <form action={deleteReviewCode}>
                <input type="hidden" name="id" value={rc.id} />
                <button
                  className="text-xs font-semibold text-red-600 hover:underline"
                  aria-label="Delete code"
                >
                  ✕
                </button>
              </form>
            </span>
          ))}
        </div>
      )}

      <form
        action={generateReviewCodes}
        className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr_auto]"
      >
        <input type="hidden" name="class_id" value={classId} />
        <input
          type="number"
          name="count"
          min={1}
          max={50}
          defaultValue={10}
          className={`${input} sm:w-24`}
          aria-label="How many codes"
        />
        <input
          name="label"
          placeholder="Label (optional, e.g. July batch)"
          className={input}
        />
        <button className="rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream hover:bg-leaf-700">
          Generate
        </button>
      </form>
    </div>
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
