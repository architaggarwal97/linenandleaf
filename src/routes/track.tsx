import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PackageSearch, Loader2, Check, MessageCircle } from "lucide-react";
import { trackOrder, type TrackOrderResult, type OrderStatus } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "Track Your Order — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Check the status of your Linen & Leaf dry-cleaning order with your WhatsApp number and order reference.";

export const Route = createFileRoute("/track")({
  // Optional pre-fill from the wallet's order history: /track?ref=LL-0001&tel=98xxxxxxx
  // (named `tel` rather than `phone` — the hosting layer rewrites URLs that
  // carry a `phone` query parameter, since it treats it as personal data.)
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"].trim().slice(0, 20) : undefined,
    tel: typeof search["tel"] === "string" ? search["tel"].trim().slice(0, 30) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/track" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/track" }],
    scripts: [breadcrumbScript("/track", "Track Order")],
  }),
  component: TrackPage,
});

const STAGES: { key: OrderStatus; label: string }[] = [
  { key: "requested", label: "Requested" },
  { key: "picked_up", label: "Picked Up" },
  { key: "in_process", label: "In Process" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
];

function TrackPage() {
  const lookup = useServerFn(trackOrder);
  const search = Route.useSearch();
  const [phone, setPhone] = useState(search.tel ?? "");
  const [reference, setReference] = useState((search.ref ?? "").toUpperCase());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLookup = async (nextPhone: string, nextRef: string) => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await lookup({
        data: { whatsapp_number: nextPhone, order_reference: nextRef },
      });
      setResult(res);
    } catch (err) {
      console.error(err);
      setError("We couldn't check your order just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    void runLookup(phone, reference);
  };

  // Arriving with both a reference and phone pre-filled (from the wallet's
  // order list) runs the lookup once, so nothing needs re-entering.
  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current) return;
    if (!search.tel || !search.ref) return;
    autoRan.current = true;
    void runLookup(search.tel, search.ref.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live updates: once an order is found, subscribe to changes on that one row.
  // If the connection drops, we simply keep showing the last known status.
  const orderId = result?.found ? result.id : undefined;
  useEffect(() => {
    if (!orderId) return;
    const channel = supabase
      .channel(`track-order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          const next = (payload.new as { status?: string } | null)?.status;
          if (!next || !STAGES.some((s) => s.key === next)) return;
          setResult((prev) =>
            prev?.found ? { ...prev, status: next as OrderStatus } : prev,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const currentIndex =
    result?.found && result.status ? STAGES.findIndex((s) => s.key === result.status) : -1;

  return (
    <>
      <PageHero
        eyebrow="Track Order"
        title="Where's my order?"
        description="Enter the WhatsApp number and reference code from your booking confirmation — like LL-0001 — and we'll show you exactly where things stand."
      />

      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="bg-white rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-10">
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="track-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  id="track-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                  placeholder="+91 99999 99999"
                />
              </div>
              <div>
                <label htmlFor="track-ref" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Order Reference
                </label>
                <input
                  id="track-ref"
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 uppercase"
                  placeholder="LL-0001"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white px-6 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 shadow-lg shadow-teal-600/20 hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> Checking…
                  </>
                ) : (
                  <>
                    <PackageSearch className="h-5 w-5 shrink-0" /> Track my order
                  </>
                )}
              </button>
              {error ? (
                <p className="text-sm text-amber-700 bg-amber-50 rounded-2xl px-4 py-3">{error}</p>
              ) : null}
            </form>

            {result?.found ? (
              <div aria-live="polite" className="mt-10">
                <p className="text-sm text-slate-500 font-light mb-1">
                  Order <span className="font-display font-bold text-slate-800">{result.orderReference}</span>
                  {result.createdAt
                    ? ` · placed ${new Date(result.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`
                    : ""}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
                  </span>
                  Live updates on — this page refreshes itself as we work on your order.
                </p>
                <ol className="mt-6 space-y-0">
                  {STAGES.map((stage, i) => {
                    const done = i < currentIndex;
                    const current = i === currentIndex;
                    return (
                      <li key={stage.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                              current
                                ? "border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-110"
                                : done
                                  ? "border-teal-500 bg-teal-50 text-teal-600"
                                  : "border-slate-200 bg-slate-50 text-slate-300"
                            }`}
                          >
                            {done ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-bold">{i + 1}</span>
                            )}
                          </div>
                          {i < STAGES.length - 1 ? (
                            <div
                              className={`w-0.5 flex-1 min-h-8 ${i < currentIndex ? "bg-teal-400" : "bg-slate-200"}`}
                            />
                          ) : null}
                        </div>
                        <div className="pb-8 pt-1.5">
                          <p
                            className={`font-display text-base font-bold ${
                              current ? "text-teal-700" : done ? "text-slate-700" : "text-slate-400"
                            }`}
                          >
                            {stage.label}
                          </p>
                          {current ? (
                            <p className="text-xs text-teal-600 font-medium mt-0.5">You're here</p>
                          ) : null}
                          {stage.key === "picked_up" && result.pickupPhotoUrl ? (
                            <figure className="mt-3">
                              <img
                                src={result.pickupPhotoUrl}
                                alt={`Your garments photographed at pickup for order ${result.orderReference}`}
                                loading="lazy"
                                className="w-full max-w-xs rounded-2xl object-cover shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                              />
                              <figcaption className="mt-1.5 text-xs text-slate-500 font-light">
                                Photographed as we collected your items.
                              </figcaption>
                            </figure>
                          ) : null}
                          {stage.key === "ready" && result.deliveryPhotoUrl ? (
                            <figure className="mt-3">
                              <img
                                src={result.deliveryPhotoUrl}
                                alt={`Your garments photographed after cleaning for order ${result.orderReference}`}
                                loading="lazy"
                                className="w-full max-w-xs rounded-2xl object-cover shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                              />
                              <figcaption className="mt-1.5 text-xs text-slate-500 font-light">
                                Photographed after cleaning, before it comes back to you.
                              </figcaption>
                            </figure>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="text-sm text-slate-500 font-light leading-relaxed border-t border-slate-100 pt-5">
                  Questions about this order?{" "}
                  <a
                    href={whatsappLink(
                      `Hi Linen & Leaf! I'd like an update on order ${result.orderReference}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-700 font-medium hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : null}

            {result && !result.found ? (
              <div
                aria-live="polite"
                className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5"
              >
                <p className="font-display text-base font-bold text-slate-800">
                  Hmm, we couldn't find that one.
                </p>
                <p className="mt-2 text-sm text-slate-500 font-light leading-relaxed">
                  Double-check the WhatsApp number and reference code — it looks like LL-0001 and is
                  shown right after you book. Still stuck? Send us a message and we'll look it up
                  for you.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={whatsappLink("Hi Linen & Leaf! I need help finding my order.")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-white px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" /> Message us on WhatsApp
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    Book a new pickup
                  </Link>
                </div>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>
    </>
  );
}
