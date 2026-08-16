import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";

const TITLE = "Book a Pickup — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Book a free doorstep pickup in Sarojini Nagar by WhatsApp, phone or a quick form. We confirm your slot straight away.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [details, setDetails] = useState({ name: "", phone: "", address: "", notes: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    openWhatsApp(
      `Hi Linen & Leaf! I'd like to schedule a pickup.\n\n*Name:* ${details.name}\n*Phone:* ${details.phone}\n*Address:* ${details.address}${
        details.notes ? `\n*Notes:* ${details.notes}` : ""
      }\n\nPlease confirm the pickup time.`,
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Book a Pickup"
        title="Free doorstep pickup, confirmed on WhatsApp."
        description="Fill in the form and we'll continue the conversation on WhatsApp — or just call us. Whatever's easiest."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-slate-100 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-800">Schedule your pickup</h2>
            <p className="text-slate-500 font-light mt-2 mb-8">
              Enter your details below. We'll confirm your slot on WhatsApp.
            </p>
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
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:-translate-y-1 mt-4"
              >
                <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Reach us directly</h2>
              <ul className="space-y-4 text-sm text-slate-600 font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <address className="not-italic leading-relaxed">{site.address}</address>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-teal-600 shrink-0" />
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
            </div>
            <div className="p-8 rounded-3xl bg-teal-50 border border-teal-100">
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
