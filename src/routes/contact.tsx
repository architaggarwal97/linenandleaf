import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Phone, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { createOrder } from "@/lib/orders.functions";
import { walletPayForOrder } from "@/lib/wallet.functions";
import { useWallet } from "@/lib/wallet-client";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { openWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "Book a Pickup — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Book a free doorstep pickup in Sarojini Nagar by WhatsApp, phone or a quick form. We confirm your slot straight away.";

type ContactSearch = {
  name?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  items?: string | undefined;
  date?: string | undefined;
  slot?: string | undefined;
};

const SLOTS = ["Morning (9 AM – 12 PM)", "Afternoon (12 – 4 PM)", "Evening (4 – 8 PM)"];

const SLOT_KEYS = ["morning", "afternoon", "evening"] as const;

function slotKey(label: string): "morning" | "afternoon" | "evening" | undefined {
  const i = SLOTS.indexOf(label);
  return i >= 0 ? SLOT_KEYS[i] : undefined;
}

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    name: typeof search['name'] === "string" ? search['name'] : undefined,
    phone: typeof search['phone'] === "string" ? search['phone'] : undefined,
    address: typeof search['address'] === "string" ? search['address'] : undefined,
    items: typeof search['items'] === "string" ? search['items'] : undefined,
    date: typeof search['date'] === "string" ? search['date'] : undefined,
    slot: typeof search['slot'] === "string" ? search['slot'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/contact" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/contact" }],
    scripts: [breadcrumbScript("/contact", "Book a Pickup")],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();
  const [details, setDetails] = useState({
    name: search.name ?? "",
    phone: search.phone ?? "",
    address: search.address ?? "",
    notes: search.items ?? "",
    date: search.date ?? "",
    slot: search.slot && SLOTS.includes(search.slot) ? search.slot : "",
    referrer: "",
  });

  const saveOrder = useServerFn(createOrder);
  const wallet = useWallet();
  const payWallet = useServerFn(walletPayForOrder);
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [payMessage, setPayMessage] = useState<string | null>(null);

  const payFromWallet = async () => {
    const amount = Number(payAmount);
    if (!amount || paying) return;
    setPaying(true);
    setPayError(null);
    try {
      const res = await payWallet({
        data: { amount, note: reference ? `Order ${reference}` : "Order payment" },
      });
      if (!res.ok) {
        setPayError("That's more than your wallet balance.");
        if (res.state) await wallet.refresh();
      } else {
        await wallet.refresh();
        setPayMessage(
          `₹${amount.toLocaleString("en-IN")} paid from your wallet. New balance ₹${Math.round(
            res.state?.balance ?? 0,
          ).toLocaleString("en-IN")}.`,
        );
      }
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Could not take that payment.");
    } finally {
      setPaying(false);
    }
  };
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // The button stays disabled until hydration finishes, so a tap on a slow
  // connection can't fire a native form GET and silently lose the booking.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const whatsappMessage = (ref?: string | null) =>
    [
      "Hi Linen & Leaf! I'd like to schedule a pickup.",
      "",
      ref ? `*Reference:* ${ref}` : "",
      `*Name:* ${details.name}`,
      `*Phone:* ${details.phone}`,
      `*Address:* ${details.address}`,
      details.date ? `*Preferred date:* ${details.date}` : "",
      details.slot ? `*Preferred slot:* ${details.slot}` : "",
      details.notes ? `*Items / Notes:* ${details.notes}` : "",
      details.referrer ? `*Referred by:* ${details.referrer}` : "",
      "",
      "Please confirm the pickup time.",
    ]
      .filter((line, i, arr) => line !== "" || (i > 0 && arr[i - 1] !== ""))
      .join("\n");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving || !hydrated) return;
    setSaveError(null);
    // Opened synchronously so browsers don't block the WhatsApp window.
    openWhatsApp(whatsappMessage());
    setSaving(true);
    try {
      const notes = [details.notes, details.date ? `Preferred date: ${details.date}` : ""]
        .filter(Boolean)
        .join(" | ");
      const result = await saveOrder({
        data: {
          customer_name: details.name,
          whatsapp_number: details.phone,
          pickup_address: details.address,
          preferred_window: slotKey(details.slot),
          service_notes: notes || undefined,
          referred_by_phone: details.referrer || undefined,
        },
      });
      setReference(result.orderReference);
    } catch (err) {
      console.error(err);
      setSaveError(
        "We couldn't save your booking automatically, but your WhatsApp message will still reach us.",
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
      <PageHero
        eyebrow="Book a Pickup"
        title="Free doorstep pickup, confirmed on WhatsApp."
        description="Fill in the form and we'll continue the conversation on WhatsApp — or just call us. Whatever's easiest."
      />

      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="bg-white rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-slate-800">Schedule your pickup</h2>
            <p className="text-slate-500 font-light mt-2 mb-8">
              Enter your details below. We'll confirm your slot on WhatsApp.
            </p>
            {reference ? (
              <div
                aria-live="polite"
                className="mb-8 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-5 text-teal-900"
              >
                <p className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /> Pickup request received
                </p>
                <p className="mt-2 text-sm font-light">
                  Your reference:{" "}
                  <span className="font-display text-lg font-bold tracking-wide">{reference}</span>
                </p>
                <p className="mt-2 text-sm font-light">
                  Save this code — quote it on WhatsApp or over the phone and we'll pull up your order
                  instantly.
                </p>
                <ol className="mt-3 space-y-1 text-sm font-light list-decimal pl-5">
                  <li>We confirm your slot on WhatsApp within working hours.</li>
                  <li>Our rider collects your items from your door — free pickup.</li>
                  <li>Follow progress anytime on the Track Order page using this reference.</li>
                  <li>
                    Pay on delivery by UPI ({site.upiId}) or from your Linen &amp; Leaf wallet.
                  </li>
                </ol>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(whatsappMessage(reference))}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-white px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" /> Send reference on WhatsApp
                  </button>
                  <Link
                    to="/track"
                    search={{
                      ref: reference,
                      tel:
                        details.phone.replace(/\D/g, "").length >= 10
                          ? `+91${details.phone.replace(/\D/g, "").slice(-10)}`
                          : undefined,
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-teal-300 text-teal-700 hover:bg-teal-100 px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    Track this order
                  </Link>
                </div>

                {wallet.loggedIn && wallet.state.balance > 0 ? (
                  <div className="mt-5 rounded-2xl border border-teal-200 bg-white/70 p-4">
                    <p className="text-sm font-medium text-teal-900">
                      Pay from your wallet — balance ₹
                      {Math.round(wallet.state.balance).toLocaleString("en-IN")}
                    </p>
                    {payMessage ? (
                      <p className="mt-2 text-sm font-light text-teal-800">{payMessage}</p>
                    ) : (
                      <>
                        <div className="mt-3 flex gap-2">
                          <input
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value.replace(/\D/g, ""))}
                            inputMode="numeric"
                            placeholder="Amount to pay"
                            className="w-full rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                          />
                          <button
                            type="button"
                            disabled={paying || !Number(payAmount)}
                            onClick={() => void payFromWallet()}
                            className="shrink-0 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {paying ? "Paying…" : "Pay"}
                          </button>
                        </div>
                        {payError ? (
                          <p className="mt-2 text-sm text-rose-600">{payError}</p>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pickup Address
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 resize-none"
                  placeholder="e.g. Flat 402, Block B, Sarojini Nagar..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Preferred Pickup Date <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={details.date}
                    onChange={(e) => setDetails({ ...details, date: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="slot" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Preferred Time Slot <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    id="slot"
                    value={details.slot}
                    onChange={(e) => setDetails({ ...details, slot: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                  >
                    <option value="">Any time</option>
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1.5">
                  What are we picking up? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 resize-none"
                  placeholder="e.g. 3 shirts, 1 suit, 1 saree"
                />
              </div>
              <div>
                <label htmlFor="referrer" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Referred by <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="referrer"
                  type="tel"
                  value={details.referrer}
                  onChange={(e) => setDetails({ ...details, referrer: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                  placeholder="Friend's WhatsApp number"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Add your friend's number and you both get ₹100 in your wallet once this first order
                  is delivered.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving || !hydrated}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-70 disabled:hover:translate-y-0 text-white px-6 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:-translate-y-1 mt-4"
              >
                {!hydrated ? (
                  <>
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> Loading…
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> Saving your booking…
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5 shrink-0" /> Continue on WhatsApp
                  </>
                )}
              </button>
              {saveError ? (
                <p className="text-sm text-amber-700 bg-amber-50 rounded-2xl px-4 py-3">{saveError}</p>
              ) : null}
            </form>
          </Reveal>

          <aside className="space-y-6">
            <div className="p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
              <h2 className="font-display text-lg font-bold text-slate-800 mb-5">Reach us directly</h2>
              <ul className="space-y-4 text-sm text-slate-600 font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <address className="not-italic leading-relaxed">{site.address}</address>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <a className="hover:text-teal-700" href={whatsappLink()} target="_blank" rel="noreferrer">
                    WhatsApp {site.whatsappNumber}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-600 shrink-0" />
                  <a className="hover:text-teal-700" href={site.phoneHref}>
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600 shrink-0" />
                  <span>Open Daily: 9:00 AM – 9:00 PM</span>
                </li>
              </ul>
              <p className="mt-5 pt-5 border-t border-slate-200 text-sm text-teal-700 font-light leading-relaxed">
                Walk-ins welcome — come see the process live, no appointment needed.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
              <p className="text-sm text-teal-900 font-light leading-relaxed">
                Pickup and delivery are free within Sarojini Nagar and nearby localities. Not sure if we cover you?
                Send us your PIN code and we'll tell you straight away.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
