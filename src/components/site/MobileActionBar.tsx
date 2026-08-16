import { Link } from "@tanstack/react-router";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Persistent thumb-reach actions on small screens. Hidden from sm: upward,
 * where the header already exposes both CTAs.
 */
export function MobileActionBar() {
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgb(0,0,0,0.06)]">
      <div className="flex items-center gap-2.5">
        <Link
          to="/contact"
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-teal-800 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]"
        >
          <CalendarCheck className="h-4 w-4 shrink-0" /> Book a Pickup
        </Link>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Linen &amp; Leaf on WhatsApp"
          className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4 shrink-0" /> Chat
        </a>
      </div>
    </div>
  );
}
