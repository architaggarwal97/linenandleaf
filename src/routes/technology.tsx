import { createFileRoute } from "@tanstack/react-router";
import { Droplet, Cpu, Camera, Shield, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Technology & Process — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Modern commercial-grade dry-cleaning equipment, low-water processing and photo-tagged accountability on every garment we handle.";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/technology" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/technology" }],
    scripts: [breadcrumbScript("/technology", "Technology & Process")],
  }),
  component: TechnologyPage,
});

const blocks = [
  {
    icon: Droplet,
    title: "99% less water",
    desc: "Solvent-based dry cleaning recirculates and filters its solvent instead of flushing fresh water through every cycle. Compared with a conventional wash, water use drops by around 99% — a meaningful difference in a city under real water stress.",
  },
  {
    icon: Cpu,
    title: "Modern commercial-grade equipment",
    desc: "We run modern commercial-grade dry-cleaning and finishing machines rather than domestic hardware. Controlled drum action, calibrated drying and proper steam finishing mean less mechanical stress on fibres and a sharper finish.",
  },
  {
    icon: Sparkles,
    title: "Fabric-specific processing",
    desc: "Every garment is assessed before processing. Wool, silk, embellished ethnic wear and everyday cotton each follow a different route through the plant, with cycle, temperature and finishing chosen per fabric.",
  },
  {
    icon: Camera,
    title: "Photo-tagged accountability",
    desc: "Each item is tagged and photographed at intake and again after cleaning. Nothing gets mixed up between orders, and you can see the condition of your garments at each checkpoint.",
  },
  {
    icon: Leaf,
    title: "Hygiene-first handling",
    desc: "Steam sanitisation and allergen removal are standard on every order. Clean and soiled garments are kept physically separated through the plant.",
  },
  {
    icon: Shield,
    title: "Garment care guarantee",
    desc: "Zero-shrinkage and zero-colour-bleed promise, backed by the photo record. If something isn't right, we re-do it.",
  },
];

function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology & Process"
        title="Better cleaning, far less water."
        description="The equipment and process behind every Linen & Leaf order — and why it treats your clothes and the city's water supply better."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map(({ icon: Icon, title, desc }, i) => (
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

      <section className="py-16 md:py-20 bg-teal-50 border-y border-teal-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">See it for yourself</h2>
          <p className="text-slate-600 font-light leading-relaxed">
            You're welcome to visit us at Sarojini Nagar Market and watch the process firsthand. No appointment needed —
            just drop by during opening hours.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f8faf9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 tracking-tight">
            A note on turnaround
          </h2>
          <p className="text-slate-500 font-light leading-relaxed">
            We aim for a fast turnaround on every order, but timing depends on the garment and the day's load. Ask us
            for current timing when you book and we'll confirm it upfront rather than promise a number we can't keep.
          </p>
        </div>
      </section>
    </>
  );
}
