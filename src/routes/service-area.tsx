import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, CheckCircle2, Info } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";

const TITLE = "Service Area — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Free pickup and delivery in Sarojini Nagar and nearby localities — RK Puram, Netaji Nagar, INA Colony, Vasant Vihar and Safdarjung Enclave.";

export const Route = createFileRoute("/service-area")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/service-area" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/service-area" }],
  }),
  component: ServiceAreaPage,
});

const SERVED_PINCODES = ["110023", "110022", "110029", "110057", "110066"];

const localities = [
  "Sarojini Nagar (including GPRA flats and the market)",
  "RK Puram",
  "Netaji Nagar",
  "INA Colony",
  "Vasant Vihar",
  "Safdarjung Enclave",
];

function ServiceAreaPage() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<null | "served" | "unknown">(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const value = pin.trim();
    if (!value) return;
    setResult(SERVED_PINCODES.includes(value) ? "served" : "unknown");
  };

  return (
    <>
      <PageHero
        eyebrow="Service Area"
        title="Hyper-local, on purpose."
        description="We're a small independent operation in Sarojini Nagar Market. We keep our pickup radius tight so collections and deliveries stay quick and reliable."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">Check your PIN code</h2>
            <p className="text-slate-500 font-light leading-relaxed mb-8">
              Enter your PIN code to see whether we currently pick up from your area.
            </p>
            <form onSubmit={check} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                aria-label="PIN code"
                placeholder="Enter your PIN Code (e.g. 110023)"
                className="flex-1 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-700 hover:bg-teal-600 text-white px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-colors shadow-md shadow-teal-700/20"
              >
                Verify
              </button>
            </form>

            {result === "served" && (
              <div className="mt-6 flex items-start gap-3 p-5 rounded-2xl bg-teal-50 border border-teal-100">
                <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-teal-900 font-light leading-relaxed">
                  Good news — we pick up from {pin}. Message us on WhatsApp to book a slot.
                </p>
              </div>
            )}
            {result === "unknown" && (
              <div className="mt-6 flex items-start gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 font-light leading-relaxed">
                  <p>We don't have a confirmed route for {pin} yet.</p>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(`Hi Linen & Leaf! Do you pick up from PIN code ${pin}?`)}
                    className="mt-3 inline-flex items-center gap-2 text-amber-900 font-medium underline underline-offset-4"
                  >
                    <MessageCircle className="h-4 w-4" /> Ask us on WhatsApp
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" /> Our shop
              </h3>
              <address className="not-italic text-sm text-slate-500 font-light leading-relaxed">
                {site.address}
                <br />
                <a className="hover:text-teal-700" href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp {site.whatsappNumber}
                </a>
                <br />
                <a className="hover:text-teal-700" href={site.phoneHref}>
                  {site.phone}
                </a>
              </address>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">Localities we cover</h2>
            <p className="text-slate-500 font-light leading-relaxed mb-8">
              Free doorstep pickup and delivery is currently limited to Sarojini Nagar and the localities immediately
              around it. If you're just outside, ask us — we may still be able to help.
            </p>
            <ul className="space-y-4">
              {localities.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-3 p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
                >
                  <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-light">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
