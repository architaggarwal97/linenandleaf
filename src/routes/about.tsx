import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin, Users, Leaf } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "About — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "An independent, founder-led dry cleaner in Sarojini Nagar Market — not a franchise. Your clothes never leave our local facility.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/about" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/about" }],
    scripts: [breadcrumbScript("/about", "About")],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Independent & Authentic",
    desc: "We are a proudly independent, founder-led business — not a distant corporate franchise. Your clothes never leave our local facility, and the people who answer your WhatsApp are the people who handle your garments.",
  },
  {
    icon: MapPin,
    title: "Everything stays local",
    desc: "Your garments never leave our local facility. No third-party subcontracting, no long transfers across the city, no mystery about where your clothes are.",
  },
  {
    icon: Leaf,
    title: "Eco-conscious by design",
    desc: "Low-water processing isn't a marketing add-on for us — it's how the plant is built. Better for fabrics, and far kinder to a city short on water.",
  },
  {
    icon: Users,
    title: "Accountable to our neighbours",
    desc: "Most of our customers live or trade within walking distance. That's the strongest quality guarantee there is.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="An independent garment care business in Sarojini Nagar."
        description="Linen & Leaf was started to fix what's frustrating about traditional dry cleaning: no visibility, vague pricing and no accountability when something goes wrong."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:gap-8 md:grid-cols-2">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <Reveal
              as="article"
              key={title}
              delay={i * 70}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50"
            >
              <div className="h-14 w-14 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{title}</h2>
              <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f8faf9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">Come say hello</h2>
          <address className="not-italic text-slate-500 font-light leading-relaxed">{site.address}</address>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center bg-teal-800 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-medium transition-colors"
          >
            Book a Pickup
          </Link>
        </div>
      </section>
    </>
  );
}
