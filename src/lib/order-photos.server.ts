import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const ORDER_PHOTO_BUCKET = "order-photos";
const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

/** Turns a stored storage path into a temporary viewable URL. Returns null on failure. */
export async function signOrderPhoto(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabaseAdmin.storage
    .from(ORDER_PHOTO_BUCKET)
    .createSignedUrl(path, SIGNED_TTL);
  if (error || !data) {
    console.error("Could not sign order photo", error);
    return null;
  }
  return data.signedUrl;
}

/** Uploads a data URL and returns the storage path. */
export async function uploadOrderPhoto(
  orderId: string,
  kind: "pickup" | "delivery",
  dataUrl: string,
  contentType: string,
): Promise<string> {
  const base64 = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : dataUrl;
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const ext = contentType === "image/png" ? "png" : "jpg";
  const path = `${orderId}/${kind}-${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(ORDER_PHOTO_BUCKET)
    .upload(path, binary, { contentType, upsert: true });
  if (error) {
    console.error("Order photo upload failed", error);
    throw new Error("Could not upload that photo.");
  }
  return path;
}
