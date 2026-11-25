"use client";

import { useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  currentUrl?: string | null;
  aspectClass?: string;
  hint?: string;
}

const MAX_DIMENSION = 1600;
const COMPRESS_THRESHOLD_BYTES = 900 * 1024; // 900 KB

async function compressImageFile(file: File): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.size <= COMPRESS_THRESHOLD_BYTES
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/webp" : "image/jpeg";
      const ext = outputType === "image/webp" ? "webp" : "jpg";
      const baseName = file.name.replace(/\.[^.]+$/, "");

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], `${baseName}.${ext}`, {
              type: outputType,
              lastModified: Date.now(),
            })
          );
        },
        outputType,
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function ImageUploadField({
  name,
  label,
  currentUrl = null,
  aspectClass = "h-32 w-32",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [removeCurrent, setRemoveCurrent] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);

  const previewUrl = removeCurrent ? null : (localPreview ?? currentUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const processed = await compressImageFile(file);

    if (processed !== file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(processed);
      inputRef.current.files = dt.files;
    }

    const objectUrl = URL.createObjectURL(processed);
    setLocalPreview(objectUrl);
    setRemoveCurrent(false);
    setSizeInfo(`${Math.round(processed.size / 1024)} KB`);
  };

  const handleClear = () => {
    setLocalPreview(null);
    setRemoveCurrent(true);
    setSizeInfo(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <input
        type="hidden"
        name={`${name}_remove`}
        value={removeCurrent ? "true" : "false"}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface ${aspectClass}`}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground transition hover:bg-surface">
              <Upload className="h-4 w-4" />
              <span>{previewUrl ? "Ganti Gambar" : "Pilih Gambar"}</span>
              <input
                ref={inputRef}
                type="file"
                name={name}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            )}
          </div>
          <p className="text-xs text-muted">
            Format JPG, PNG, atau WebP. Maksimal 2 MB (gambar besar otomatis
            dikompres).
            {sizeInfo ? ` Ukuran siap unggah: ${sizeInfo}.` : ""}
            {hint ? ` ${hint}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
