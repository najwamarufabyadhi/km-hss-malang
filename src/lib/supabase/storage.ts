import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadImageToMedia(
  file: File,
  folder: "logos" | "members" | "posts"
): Promise<{ url?: string; error?: string }> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return { error: "Format gambar harus JPG, PNG, atau WebP." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Ukuran gambar maksimal 2 MB." };
  }

  const supabase = await createClient();
  const filePath = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: `Gagal mengunggah gambar: ${uploadError.message}` };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(filePath);
  return { url: data.publicUrl };
}

export async function deleteImageFromMedia(
  publicUrl: string | null | undefined
): Promise<void> {
  if (!publicUrl) return;

  const marker = "/storage/v1/object/public/media/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;

  const path = publicUrl.slice(idx + marker.length);
  if (!path) return;

  const supabase = await createClient();
  await supabase.storage.from("media").remove([path]);
}
