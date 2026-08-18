import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Plus, Minus, Shield, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, servicesScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Services & Pricing — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Dry cleaning, laundry, steam pressing and specialist garment care in Sarojini Nagar. Build your basket and get an exact quote on WhatsApp.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/services" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/services" }],
    scripts: [
      breadcrumbScript("/services", "Services & Pricing"),
      servicesScript(
        services.map((s) => ({ name: s.title, description: s.desc })),
      ),
    ],
  }),
  component: ServicesPage,
});

const ITEMS = {
  shirt: "Men's Shirt",
  suit: "2-Piece Suit",
  kurta: "Women's Kurta / Suit Set",
  lehenga: "Heavy Bridal / Lehenga",
  saree: "Saree",
  trousers: "Trousers",
} as const;

type ItemKey = keyof typeof ITEMS;

const services = [
  {
    icon: Sparkles,
    title: "Dry Cleaning",
    desc: "Solvent-based cleaning for suits, ethnic wear, woollens and delicate fabrics, finished on commercial-grade equipment.",
  },
  {
    icon: Leaf,
    title: "Laundry & Press",
    desc: "Everyday wear washed, dried and crisply pressed. Press-only service available if you just need finishing.",
  },
  {
    icon: Shield,
    title: "Specialist Garment Care",
    desc: "Bridal, embellished and designer pieces handled individually, with photo checkpoints at every stage.",
  },
];

function ServicesPage() {
  const [cart, setCart] = useState<Record<ItemKey, number>>({
    shirt: 0,
    suit: 0,
    kurta: 0,
    lehenga: 0,
    saree: 0,
    trousers: 0,
  });
  const [pulse, setPulse] = useState(0);
  const [popped, setPopped] = useState<string | null>(null);

  const keys = Object.keys(ITEMS) as ItemKey[];
  const selected = keys.filter((k) => cart[k] > 0);
  const totalItems = keys.reduce((sum, k) => sum + cart[k], 0);
  const hasItems = totalItems > 0;
  const summary = selected.map((k) => `${cart[k]} ${ITEMS[k]}`).join(", ");

  const update = (key: ItemKey, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, prev[key] + delta);
      if (next === prev[key]) return prev;
      setPulse((p) => p + 1);
      return { ...prev, [key]: next };
    });
    setPopped(`${key}:${delta}:${Date.now()}`);
  };

  const requestQuote = () => {
    if (!hasItems) return;
    const list = selected.map((k) => `- ${cart[k]}x ${ITEMS[k]}`).join("\n");
    openWhatsApp(
      `Hi Linen & Leaf! I'd like an exact quote for these items:\n\n${list}\n\nTotal items: ${totalItems}\n\nPlease share pricing and current turnaround time.`,
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Services & Pricing"
        title="Transparent, itemised garment care."
        description="We price per garment and confirm the full quote on WhatsApp before we begin — no hidden fees, no surprises at the door."
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <Reveal
              as="article"
              key={title}
              delay={i * 70}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50"
            >
              <div className="h-14 w-14 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-800 mb-3">{title}</h2>
              <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote builder */}
      <section className="py-16 md:py-24 bg-teal-950 text-white relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-800/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="bg-teal-900/40 backdrop-blur-xl border border-teal-800/50 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 text-center tracking-tight">Build Your Basket</h2>
            <p className="text-center text-teal-200/60 text-sm font-light mb-8">
              Select what you'd like cleaned and we'll quote it exactly on WhatsApp.
            </p>

            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key} className="flex justify-between items-center gap-3 sm:gap-4 pb-4 border-b border-teal-800/50">
                  <p className="min-w-0 text-sm sm:text-lg text-teal-100/90 font-light">{ITEMS[key]}</p>
                  <div className="flex items-center gap-3 bg-teal-950/60 rounded-full p-1 border border-teal-800/50 shrink-0">
                    <button
                      type="button"
                      aria-label={`Remove one ${ITEMS[key]}`}
                      onClick={() => update(key, -1)}
                      className="p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-5 text-center text-white font-medium">{cart[key]}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${ITEMS[key]}`}
                      onClick={() => update(key, 1)}
                      className="p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-teal-950/40 p-5 rounded-2xl border border-teal-800/30">
              <p className="text-teal-100/60 font-light text-sm mb-2">
                {totalItems === 0 ? "Nothing selected yet" : `${totalItems} item${totalItems > 1 ? "s" : ""} selected`}
              </p>
              <ul className="text-white text-sm space-y-1">
                {keys
                  .filter((k) => cart[k] > 0)
                  .map((k) => (
                    <li key={k}>
                      {cart[k]}× {ITEMS[k]}
                    </li>
                  ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={requestQuote}
              className="w-full mt-6 bg-white hover:bg-teal-50 text-teal-950 px-4 py-4 rounded-2xl text-[0.8125rem] sm:text-base font-semibold whitespace-nowrap transition-all duration-300 flex justify-center items-center gap-2 hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5 shrink-0 text-green-500" />
              <span>Get an exact quote via WhatsApp</span>
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
