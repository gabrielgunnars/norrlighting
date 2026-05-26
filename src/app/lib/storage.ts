import { supabase } from "./supabase";

const BUCKET = "media";

/** True when a string is a fresh base64 data URL (needs uploading). */
export const isBase64 = (s: string) => s.startsWith("data:");

// ── Core upload helpers ──────────────────────────────────────────────────────

/** Upload a base64 data URL to Supabase Storage. Returns the public URL. */
export async function uploadBase64Image(
  base64: string,
  path: string
): Promise<string> {
  const res = await fetch(base64);
  const blob = await res.blob();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { upsert: true, contentType: blob.type || "image/jpeg" });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

/** Upload a raw File (video, etc.) to Supabase Storage. Returns the public URL. */
export async function uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

// ── Convenience resolvers ────────────────────────────────────────────────────

/**
 * Resolve an array of image strings:
 * - base64 strings → upload to Storage and replace with public URL
 * - existing URLs or empty strings → returned as-is
 */
export async function resolveImageArray(
  images: string[],
  folder: string
): Promise<string[]> {
  return Promise.all(
    images.map((img, i) =>
      img && isBase64(img)
        ? uploadBase64Image(img, `${folder}/${Date.now()}-${i}.jpg`)
        : img
    )
  );
}

/**
 * Resolve a single optional image (team photo, hero image…):
 * - base64 → upload and return URL
 * - URL / null → returned as-is
 */
export async function resolveImage(
  photo: string | null | undefined,
  path: string
): Promise<string | null> {
  if (!photo) return null;
  if (!isBase64(photo)) return photo;
  return uploadBase64Image(photo, path);
}
