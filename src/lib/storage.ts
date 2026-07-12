import "server-only";
import { getAdminSupabase } from "./supabaseAdmin";

const BUCKET = "media";

/**
 * Uploads an image File to Supabase Storage and returns its public URL.
 * Returns null if there's no file. Throws on a real upload error.
 */
export async function uploadImage(
  file: File | null,
  folder: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const db = getAdminSupabase();
  const { error } = await db.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
