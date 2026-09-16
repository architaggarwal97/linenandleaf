// Client-side downscale + JPEG re-encode so photo uploads stay small on mobile data.
export async function compressImage(
  file: File,
  maxSide = 1280,
  quality = 0.72,
): Promise<{ dataUrl: string; contentType: string }> {
  const fallback = async () => ({
    dataUrl: await fileToDataUrl(file),
    contentType: file.type || "image/jpeg",
  });

  if (typeof document === "undefined" || !file.type.startsWith("image/")) return fallback();

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback();
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return { dataUrl: canvas.toDataURL("image/jpeg", quality), contentType: "image/jpeg" };
  } catch {
    return fallback();
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}
