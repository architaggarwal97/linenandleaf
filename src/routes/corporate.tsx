import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Users,
  CalendarCheck,
  Camera,
  MessageCircle,
  ArrowRight,
  Send,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Corporate & Bulk Laundry — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Bulk dry cleaning and laundry for offices, hotels, PGs, and boutiques in South Delhi. Custom pricing, scheduled pickups, and photo-checkpoint transparency.";

const volumeOptions = [
  { value: "", label: "Select approximate volume" },
  { value: "Small (under 50 items/week)", label: "Small — under 50 items/week" },
  { value: "Medium (50–150 items/week)", label: "Medium — 50–150 items/week" },
  { value: "Large (150–500 items/week)", label: "Large — 150–500 items/week" },
  { value: "Enterprise (500+ items/week)", label: "Enterprise — 500+ items/week" },
  { value: "Not sure yet", label: "Not sure yet — let's discuss" },
];

const benefits = [
  {
    icon: Building2,
    title: "Built for scale",
    desc: "From boutique linen to hotel housekeeping, we handle recurring volume with consistent quality and turnaround.",
  },
  {
    icon: Users,
    title: "Dedicated point of contact",
    desc: "One WhatsApp thread for pickup scheduling, special instructions, and billing — no call-centre maze.",
  },
  {
    icon: CalendarCheck,
    title: "Pickup scheduling that fits you",
    desc: "Daily, alternate-day, or weekly collections. We plan around your operational hours, not ours.",
  },
  {
    icon: Camera,
    title: "Same photo-checkpoint transparency",
    desc: "Every batch is photographed at collection and after cleaning, so you can reconcile items easily.",
  },
];

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/corporate" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/corporate" }],
    scripts: [breadcrumbScript("/corporate", "Corporate & Bulk")],
  }),
  component: CorporatePage,
});

function CorporatePage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    volume: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit =
    form.businessName.trim() &&
    form.contactName.trim() &&
    form.phone.trim().length >= 10 &&
    form.volume;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const message = `Hi Linen & Leaf! I'd like to discuss a corporate/bulk laundry arrangement.

Business: ${form.businessName.trim()}
Contact: ${form.contactName.trim()}
Phone: ${form.phone.trim()}${form.email.trim() ? `\nEmail: ${form.email.trim()}` : ""}
Approximate volume: ${form.volume}${form.notes.trim() ? `\n\nNotes: ${form.notes.trim()}` : ""}

Please share next steps and a convenient time to talk.`;

    openWhatsApp(message);
    setSubmitted(true);
  };

  return (
    <div>
      <PageHero
        eyebrow="Corporate & Bulk"
        title="Regular laundry and dry cleaning for offices, hotels, PGs, and boutiques."
        description="Bulk orders get custom pricing, scheduled pickups, and the same photo-checkpoint transparency we use for every individual order — so nothing gets lost in the wash."
      />

      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Benefits */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 100}>
                <div className="h-full rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                    <b.icon className="h-6 w-6 text-teal-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{b.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Inquiry form */}
          <Reveal delay={200}>
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto rounded-[2rem] bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Send className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Let's talk bulk
                  </h2>
                  <p className="text-sm text-slate-500 font-light">
                    Tell us a little about your needs and we'll reply on WhatsApp.
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-teal-50/60 border border-teal-100 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-teal-700 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900">WhatsApp opened</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    If it didn't open automatically, make sure WhatsApp is installed. You can also{" "}
                    <Link
                      to="/contact"
                      className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                    >
                      book a regular pickup
                    </Link>{" "}
                    instead.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                        Business / organisation name
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        required
                        value={form.businessName}
                        onChange={(e) => update("businessName", e.target.value)}
                        placeholder="e.g. The Willow Hotel"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-2">
                        Contact person
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        inputMode="tel"
                        minLength={10}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email (optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-slate-700 mb-2">
                      Approximate weekly or monthly volume
                    </label>
                    <select
                      id="volume"
                      required
                      value={form.volume}
                      onChange={(e) => update("volume", e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 appearance-none"
                    >
                      {volumeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                      Anything else we should know? (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Item types, pickup timing, billing preferences, special care instructions..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full flex justify-center items-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                      canSubmit
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 hover:-translate-y-1"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Send inquiry via WhatsApp
                  </button>

                  <p className="text-xs text-slate-400 font-light text-center">
                    No account needed. We'll reply with a custom plan and next steps.
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          {/* Bottom link */}
          <Reveal delay={300}>
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                Prefer to start with a one-time order?{" "}
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                >
                  See services & pricing <ArrowRight className="inline h-4 w-4" />
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
