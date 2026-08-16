import { site } from "@/lib/site";

export function whatsappLink(message = "Hi Linen & Leaf! I'd like to schedule a pickup.") {
  return `${site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message?: string) {
  window.open(whatsappLink(message), "_blank", "noopener");
}
