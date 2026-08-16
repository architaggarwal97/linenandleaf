import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Camera, Zap, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript } from "@/lib/seo";

const TITLE = "How It Works — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "From booking a pickup on WhatsApp to tagged photo checkpoints and doorstep delivery — the full Linen & Leaf process, step by step.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/how-it-works" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/how-it-works" }],
    scripts: [breadcrumbScript("/how-it-works", "How It Works")],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    step: "01",
    icon: Phone,
    title: "Book a pickup",
    desc: "Message us on WhatsApp, call, or fill in the booking form. Tell us roughly what you're sending and where you are.",
    detail: [
      "We confirm your address and a pickup slot in the same conversation.",
      "Pickup and delivery are free within our service area.",
      "No app to install and no account to create.",
    ],
  },
  {
    step: "02",
    icon: Camera,
    title: "We collect, tag and photograph",
    desc: "Our rider collects your garments at the door. Each piece is individually tagged and photographed before it enters the plant.",
    detail: [
      "Every item gets a unique tag that stays with it end to end.",
      "Photos record the condition of each garment at intake.",
      "Existing stains or damage are flagged to you before cleaning.",
    ],
  },
  {
    step: "03",
    icon: Zap,
    title: "Cleaned on modern low-water equipment",
    desc: "Garments are cleaned and finished on modern commercial-grade dry-cleaning equipment, with the right process chosen per fabric.",
    detail: [
      "Solvent-based dry cleaning uses 99% less water than a conventional wash.",
      "Steam sanitisation and finishing on every order.",
      "You get updates on WhatsApp as your order moves through each stage.",
    ],
  },
  {
    step: "04",
    icon: MapPin,
    title: "Delivered back to your door",
    desc: "Your garments come back pressed, covered and ready to wear, at a time that suits you.",
    detail: [
      "We confirm a delivery window before we set out.",
      "Fast turnaround — ask us for current timing when you book.",
      "Anything not right? Tell us and we'll re-do it.",
    ],
  },
];

function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="Four steps, all handled over WhatsApp."
        description="No apps, no queues, no guesswork. Here's exactly what happens between your message and your garments coming home."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {steps.map(({ step, icon: Icon, title, desc, detail }) => (
            <article
              key={step}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-[0.2em]">Step {step}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2 mb-3">{title}</h2>
                  <p className="text-slate-500 font-light leading-relaxed">{desc}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-600 font-light list-disc pl-5">
                    {detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-teal-800 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">Ready when you are.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-teal-900 px-8 py-4 rounded-full font-medium hover:-translate-y-1 transition-transform"
            >
              Book a Pickup
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
