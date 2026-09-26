import { createFileRoute, Link } from "@tanstack/react-router";
import {
  WashingMachine,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { breadcrumbScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Self-Service Laundry — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Bring your own laundry and use our washing machines yourself, paying based on what you use. A do-it-yourself option at our Sarojini Nagar shop, separate from our pickup and delivery dry-cleaning service.";

const steps = [
  {
    title: "Come to the shop",
    desc: "Walk in with your laundry during opening hours — no booking needed, though a quick WhatsApp message first helps us make sure a machine is free.",
  },
  {
    title: "We get you set up",
    desc: "A member of staff shows you to the machine, explains the settings, and helps you pick a wash that suits your load.",
  },
  {
    title: "Wash it yourself",
    desc: "You load, start, and watch your own wash. Detergent is available at the counter if you haven't brought your own.",
  },
  {
    title: "Pay for what you use",
    desc: "Pricing depends on load size and wash type — message us on WhatsApp for current rates before you come.",
  },
];

const goodToKnow = [
  {
    title: "Who it's for",
    desc: "Bulky home loads, bedsheets and curtains that won't fit a home machine, students and PG residents without laundry access, or anyone who prefers to handle their own washing.",
  },
  {
    title: "What to bring",
    desc: "Your laundry, and your usual detergent if you have a preference. Detergent is available at the counter if you'd rather not carry it.",
  },
  {
    title: "How it's different",
    desc: "This is a do-it-yourself option. Our pickup-and-delivery dry cleaning is handled entirely by our staff with their own process — self-service machines are simply ours, used by you.",
  },
  {
    title: "Machine availability",
    desc: "Machines are shared, so availability varies through the day. A quick WhatsApp message before you leave home saves a wasted trip.",
  },
];

export const Route = createFileRoute("/self-service")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/self-service" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/self-service" }],
    scripts: [breadcrumbScript("/self-service", "Self-Service Laundry")],
  }),
  component: SelfServicePage,
});

function SelfServicePage() {
  const askMessage =
    "Hi Linen & Leaf! I'd like to ask about the self-service laundry — machine availability, opening hours, and current pricing.";

  return (
    <div>
      <PageHero
        eyebrow="Self-Service Laundry"
        title="Bring your laundry, use our machines yourself, pay based on what you use."
        description="A do-it-yourself washing option at our Sarojini Nagar shop — separate from our pickup-and-delivery dry-cleaning service. Pricing depends on load size and wash type; message us for current rates."
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => openWhatsApp(askMessage)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" />
            Ask about availability &amp; pricing
          </button>
          <Link
            to="/how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 px-6 py-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50"
          >
            About our pickup service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageHero>

      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Concept explainer */}
          <Reveal>
            <div className="max-w-3xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                <WashingMachine className="h-6 w-6 text-teal-700" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                What self-service here actually means
              </h2>
              <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
                You bring your own laundry to our shop in Sarojini Nagar Market, use our washing
                machines yourself, and pay based on what you use. It's the simple, hands-on option:
                you handle the washing, we provide the machines and a bit of guidance.
              </p>
              <p className="mt-3 text-base text-slate-600 font-light leading-relaxed">
                It's deliberately separate from our regular dry cleaning and laundry service — that
                one is collected from your doorstep, processed entirely by our staff, and tracked
                with photo updates. Self-service is just you and a machine, on your schedule.
              </p>
            </div>
          </Reveal>

          {/* Steps */}
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="h-full rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 mb-3">
                    Step {i + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Good to know */}
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
            {goodToKnow.map((g, i) => (
              <Reveal key={g.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-teal-100 bg-white p-7">
                  <div className="flex items-start gap-3">
                    <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{g.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pricing note + CTA */}
          <Reveal delay={200}>
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto rounded-[2rem] bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                <Clock className="h-6 w-6 text-teal-700" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Rates, hours &amp; machine availability
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl mx-auto">
                Pricing depends on load size and wash type, so we don't list fixed rates here.
                Message us on WhatsApp and we'll share current rates, opening hours, and which
                machines are free today.
              </p>
              <button
                onClick={() => openWhatsApp(askMessage)}
                className="mt-8 inline-flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-xl shadow-green-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" />
                Ask on WhatsApp
              </button>
              <p className="mt-5 text-xs text-slate-400 font-light">
                Or call {site.phone} · {site.address}
              </p>
            </div>
          </Reveal>

          {/* Cross-links */}
          <Reveal delay={300}>
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                Looking for doorstep pickup instead?{" "}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                >
                  Book a pickup <ArrowRight className="inline h-4 w-4" />
                </Link>
              </p>
              <p className="mt-3 text-sm text-slate-500 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                Staff-handled dry cleaning keeps its own process — this page covers the self-wash
                option only.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
