import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { saveBasket } from "@/lib/basket";
import { MessageCircle, Plus, Minus, Shield, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, servicesScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Dry Cleaning Prices in Sarojini Nagar, Delhi | Linen & Leaf";
const DESCRIPTION =
  "Itemised dry cleaning, laundry and steam pressing rates for Sarojini Nagar and South Delhi. Low-water cleaning — build your basket for a WhatsApp quote.";

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

const CATALOGUE = [
  {
    group: "Everyday Wear",
    items: [
      { key: "shirt", label: "Shirt" },
      { key: "trousers", label: "Trousers" },
      { key: "tshirt", label: "T-Shirt" },
      { key: "kurtaCotton", label: "Kurta (Cotton)" },
      { key: "spotClean", label: "Spot-Clean & Steam Press Only" },
    ],
  },
  {
    group: "Premium Dry Clean",
    items: [
      { key: "premiumShirt", label: "Men's Shirt / T-Shirt (Dry Clean)" },
      { key: "shirtIron", label: "Men's Shirt / T-Shirt (Steam Iron)" },
      { key: "suitDry", label: "Men's 2-Piece Suit (Dry Clean)" },
      { key: "suitIron", label: "Men's 2-Piece Suit (Steam Iron)" },
      { key: "suit", label: "2-Piece Suit" },
    ],
  },
  {
    group: "Blazers, Coats & Jackets",
    items: [
      { key: "blazer", label: "Blazer / Coat — Short" },
      { key: "puffer", label: "Puffer Jacket — Long" },
    ],
  },
  {
    group: "Ethnic & Occasion Wear",
    items: [
      { key: "kurta", label: "Women's Kurta" },
      { key: "kurtaIron", label: "Women's Kurta (Steam Iron)" },
      { key: "heavyKurta", label: "Heavy Kurta" },
      { key: "heavyDhoti", label: "Heavy Dhoti" },
      { key: "lehenga", label: "Women's Lehenga" },
      { key: "lehengaIron", label: "Women's Lehenga (Steam Iron)" },
      { key: "weddingSuit", label: "Wedding Suit (3 pcs)" },
      { key: "sherwani", label: "Designer Wedding Suit / Sherwani" },
    ],
  },
] as const;

type ItemKey = (typeof CATALOGUE)[number]["items"][number]["key"];
type CatalogItem = { key: ItemKey; label: string };

const ALL_ITEMS: CatalogItem[] = CATALOGUE.flatMap((g) => g.items.map((i) => ({ ...i })));

const ITEMS = Object.fromEntries(ALL_ITEMS.map((i) => [i.key, i.label])) as Record<ItemKey, string>;

const ADDONS = {
  starch: { label: "Starch" },
  polish: { label: "Polish" },
  hanger: { label: "Hanger Packing" },
  button: { label: "Button Stitching" },
} as const;

type AddonKey = keyof typeof ADDONS;

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
  const keys = Object.keys(ITEMS) as ItemKey[];
  const addonKeys = Object.keys(ADDONS) as AddonKey[];

  const [cart, setCart] = useState<Record<ItemKey, number>>(
    () => Object.fromEntries(keys.map((k) => [k, 0])) as Record<ItemKey, number>,
  );
  const [addons, setAddons] = useState<Record<AddonKey, boolean>>({
    starch: false,
    polish: false,
    hanger: false,
    button: false,
  });
  const [pulse, setPulse] = useState(0);
  const [popped, setPopped] = useState<string | null>(null);

  const selected = keys.filter((k) => cart[k] > 0);
  const activeAddons = addonKeys.filter((k) => addons[k]);
  const totalItems = keys.reduce((sum, k) => sum + cart[k], 0);
  const summary = selected.map((k) => `${cart[k]} ${ITEMS[k]}`).join(", ");
  const hasItems = totalItems > 0;

  // Persist the basket locally (no account needed) so the wallet page can show it.
  useEffect(() => {
    saveBasket({
      lines: selected.map((k) => ({
        key: k,
        label: ITEMS[k],
        qty: cart[k],
        price: 0,
        from: false,
      })),
      addons: activeAddons.map((k) => ({ key: k, label: ADDONS[k].label, price: 0 })),
      totalItems,
      totalPrice: 0,
      isFrom: false,
      updatedAt: Date.now(),
    });
  }, [cart, addons, selected, activeAddons, totalItems]);

  const update = (key: ItemKey, delta: number) => {
    const next = Math.max(0, cart[key] + delta);
    if (next === cart[key]) return;
    setCart({ ...cart, [key]: next });
    setPulse((p) => p + 1);
    setPopped(`${key}:${delta}:${Date.now()}`);
  };

  const requestQuote = () => {
    if (!hasItems) return;
    const list = selected.map((k) => `- ${cart[k]}x ${ITEMS[k]}`).join("\n");
    const addonLine = activeAddons.length
      ? `\nAdd-ons: ${activeAddons.map((k) => ADDONS[k].label).join(", ")}`
      : "";
    openWhatsApp(
      `Hi Linen & Leaf! I'd like to request an exact quote for:\n\n${list}${addonLine}\n\nPlease confirm pricing and current turnaround time.`,
    );
  };

  return (
    <>
      <PageHero
        eyebrow="Services & Pricing"
        title="Dry cleaning prices in Sarojini Nagar, New Delhi."
        description="Transparent, itemised rates for dry cleaning, laundry and steam pressing across Sarojini Nagar and South Delhi. We confirm the full quote on WhatsApp before we begin — no hidden fees."
      />

      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <Reveal
              as="article"
              key={title}
              delay={i * 70}
              className="bg-white rounded-3xl p-8 ll-card"
            >
              <div className="h-14 w-14 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-teal-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-800 mb-2">{title}</h2>
              <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote builder */}
      <section
        id="order-builder"
        className="py-16 md:py-24 bg-teal-950 text-white relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-800/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="bg-teal-900/40 backdrop-blur-xl border border-teal-800/50 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 text-center tracking-tight">Build Your Basket</h2>
            <p className="text-center text-teal-200/60 text-sm font-light mb-8">
              Select what you'd like cleaned and we'll quote it exactly on WhatsApp.
            </p>

            <div className="space-y-8">
              {CATALOGUE.map((group) => (
                <div key={group.group}>
                  <p className="text-xs uppercase tracking-widest text-teal-200/60 mb-3">{group.group}</p>
                  <div className="space-y-4">
                    {group.items.map((item) => {
                      const key = item.key as ItemKey;
                      const count = cart[key];
                      return (
                        <div
                          key={key}
                          className={`flex justify-between items-center gap-3 sm:gap-4 pb-4 border-b transition-colors duration-300 ${
                            count > 0 ? "border-teal-600/60" : "border-teal-800/50"
                          }`}
                        >
                          <div className="min-w-0">
                            <p
                              className={`text-sm sm:text-lg font-medium transition-colors duration-300 ${
                                count > 0 ? "text-white" : "text-teal-100/90"
                              }`}
                            >
                              {item.label}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-3 rounded-full p-1 border shrink-0 transition-colors duration-300 ${
                              count > 0 ? "bg-teal-900/80 border-teal-500/60" : "bg-teal-950/60 border-teal-800/50"
                            }`}
                          >
                            <button
                              type="button"
                              aria-label={`Remove one ${item.label}`}
                              disabled={count === 0}
                              onClick={() => update(key, -1)}
                              className="ll-press p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-all duration-150 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span
                              key={`${key}-${count}`}
                              aria-live="polite"
                              className={`w-5 text-center text-white font-medium tabular-nums ${popped ? "ll-pop" : ""}`}
                            >
                              {count}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one ${item.label}`}
                              onClick={() => update(key, 1)}
                              className="ll-press p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-all duration-150"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Add-ons */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-teal-200/60 mb-3">Add-ons</p>
              <div className="flex flex-wrap gap-2">
                {addonKeys.map((k) => {
                  const on = addons[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setAddons({ ...addons, [k]: !on });
                        setPulse((p) => p + 1);
                      }}
                      className={`ll-press rounded-full px-4 py-2 text-xs sm:text-sm font-medium border transition-all duration-300 ${
                        on
                          ? "bg-teal-400 text-teal-950 border-teal-300"
                          : "bg-teal-950/50 text-teal-100 border-teal-800/60 hover:border-teal-600"
                      }`}
                    >
                      {ADDONS[k].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live selection summary */}
            <div
              className={`mt-8 p-5 rounded-2xl border transition-all duration-300 ${
                hasItems ? "bg-teal-900/60 border-teal-500/40" : "bg-teal-950/40 border-teal-800/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  key={pulse}
                  className={`ll-badge-pop inline-flex h-9 min-w-9 px-2 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors duration-300 ${
                    hasItems ? "bg-teal-400 text-teal-950" : "bg-teal-800/70 text-teal-300"
                  }`}
                >
                  {totalItems}
                </span>
                <p className="text-sm font-medium text-white">
                  Your Selection
                  <span className="block text-xs font-light text-teal-200/70">
                    {hasItems
                      ? `${totalItems} item${totalItems > 1 ? "s" : ""} — ${summary}`
                      : "Nothing selected yet"}
                  </span>
                </p>
              </div>
              {hasItems ? (
                <ul className="mt-4 flex flex-wrap gap-2" aria-live="polite">
                  {selected.map((k) => (
                    <li
                      key={k}
                      className="ll-pop rounded-full bg-teal-950/60 border border-teal-700/50 px-3 py-1 text-xs text-teal-100"
                    >
                      {cart[k]}× {ITEMS[k]}
                    </li>
                  ))}
                  {activeAddons.map((k) => (
                    <li
                      key={k}
                      className="ll-pop rounded-full bg-teal-400/15 border border-teal-400/40 px-3 py-1 text-xs text-teal-100"
                    >
                      + {ADDONS[k].label}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              onClick={requestQuote}
              disabled={!hasItems}
              aria-disabled={!hasItems}
              className={`w-full mt-6 px-4 py-4 rounded-2xl text-[0.8125rem] sm:text-base font-semibold whitespace-nowrap transition-all duration-300 flex justify-center items-center gap-2 ${
                hasItems
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 hover:-translate-y-1 cursor-pointer"
                  : "bg-slate-600/40 text-slate-300/70 border border-slate-600/50 cursor-not-allowed"
              }`}
            >
              <MessageCircle className={`h-5 w-5 shrink-0 ${hasItems ? "text-white" : "text-slate-400/60"}`} />
              <span>{hasItems ? "Request Exact Quote on WhatsApp" : "Get a Custom Quote"}</span>
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
