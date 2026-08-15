import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Droplets,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Timer,
  Wrench,
  IndianRupee,
  MessageCircle,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const TITLE = "Linen & Leaf Dry Cleaners — Sarojini Nagar, New Delhi";
const DESCRIPTION =
  "Premium eco-conscious dry cleaning in Sarojini Nagar, New Delhi. 99% less water than a conventional wash, live order tracking and doorstep pickup and delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const coreUsps = [
  {
    icon: Droplets,
    title: "99% less water",
    body: "Our cleaning cycle uses a fraction of the water a conventional wash needs — the same finish, a far lighter footprint.",
  },
  {
    icon: Radar,
    title: "Live order tracking",
    body: "Every garment is tagged at pickup. Follow it from collection to cleaning to delivery, in real time.",
  },
  {
    icon: Timer,
    title: "Fast delivery",
    body: "Standard turnaround in 48 hours across Sarojini Nagar, with same-day express on request.",
  },
  {
    icon: Wrench,
    title: "Best-in-class equipment",
    body: "Modern low-water machines and professional finishing presses, maintained to spec — not a back-room setup.",
  },
];

const supportingUsps = [
  {
    icon: ShieldCheck,
    title: "Garment care guarantee",
    body: "Fabrics are inspected and photographed before cleaning. If something isn't right, we make it right.",
  },
  {
    icon: IndianRupee,
    title: "Transparent pricing",
    body: "Clear per-garment rates quoted upfront. No surprise handling fees when your order comes back.",
  },
  {
    icon: Sparkles,
    title: "Hygiene-first processing",
    body: "Orders are kept separated end to end, with sanitised handling and sealed, breathable garment covers.",
  },
];

const steps = [
  {
    n: "01",
    title: "Book a pickup",
    body: "Message us on WhatsApp, call, or fill in the booking form. Pick a slot that suits you.",
  },
  {
    n: "02",
    title: "We collect, tag & photograph",
    body: "Your garments are itemised, barcoded and photographed at your door so nothing gets mixed up.",
  },
  {
    n: "03",
    title: "Cleaned & tracked",
    body: "Cleaning on modern low-water equipment, with live status updates at every stage of the process.",
  },
  {
    n: "04",
    title: "Delivered to your door",
    body: "Pressed, covered and returned to you — typically within 48 hours of collection.",
  },
];

const testimonials = [
  {
    quote:
      "Placeholder review — space reserved for early customer feedback once we open our doors in Sarojini Nagar.",
    name: "Customer name",
    detail: "Sarojini Nagar",
  },
  {
    quote:
      "Placeholder review — we'll publish verified reviews here from our first weeks of pickups and deliveries.",
    name: "Customer name",
    detail: "Netaji Nagar",
  },
  {
    quote:
      "Placeholder review — real words from real neighbours, added as soon as we have them. Nothing invented.",
    name: "Customer name",
    detail: "Safdarjung Enclave",
  },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/70">
        <div className="site-container grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <p className="eyebrow">Sarojini Nagar, New Delhi</p>
            <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Dry cleaning that uses{" "}
              <span className="italic text-primary">99% less water</span> — fully tracked, back in
              48 hours.
            </h1>
            <div className="rule-brass mt-7" />
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Linen &amp; Leaf is an independent dry cleaner and laundry built around modern
              low-water machines, careful handling and live order tracking. We pick up from your
              door and bring everything back pressed and ready to wear.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact">Book a Pickup</Link>
              </Button>
              <Button asChild size="lg" variant="whatsapp">
                <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle /> Chat on WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brass" />
              <span>{site.address}</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <p className="eyebrow">The promise</p>
            <dl className="mt-6 divide-y divide-border">
              {[
                ["99%", "less water than a conventional wash"],
                ["48h", "standard turnaround, express available"],
                ["100%", "of garments tagged and photographed"],
                ["6 days", "a week of pickups and deliveries"],
              ].map(([stat, label]) => (
                <div key={stat} className="flex items-baseline gap-5 py-4 first:pt-0 last:pb-0">
                  <dt className="font-display text-3xl text-primary sm:text-4xl">{stat}</dt>
                  <dd className="text-sm leading-snug text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="site-container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Linen &amp; Leaf</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Careful with clothes. Careful with water.</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Everything we've built — the equipment, the tagging, the tracking — exists so your
            garments come back exactly as they should, with far less waste along the way.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreUsps.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {supportingUsps.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-dashed border-border p-6">
              <div className="flex items-center gap-3">
                <Icon className="size-5 text-brass" />
                <h3 className="text-base">{title}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/50 py-16 md:py-24">
        <div className="site-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Four steps, no queueing.</h2>
            </div>
            <Button asChild variant="ink">
              <Link to="/how-it-works">See the full process</Link>
            </Button>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n} className="border-t-2 border-brass pt-5">
                <span className="font-display text-sm tracking-widest text-brass">{step.n}</span>
                <h3 className="mt-2 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust signals */}
      <section className="site-container py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Trust</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">What our neighbours will say</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We're just launching in Sarojini Nagar Market, so these are placeholders. Verified
            reviews from real customers will replace them as they come in.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li key={i} className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <Quote className="size-5 text-brass" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <p className="mt-5 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="site-container flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-xl">
            <h2 className="text-3xl text-primary-foreground sm:text-4xl">
              Ready for your first pickup?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
              Book a slot in under a minute, or send us a message — we'll confirm right away.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brass">
              <Link to="/contact">Book a Pickup</Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp">
              <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
