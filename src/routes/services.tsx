import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Plus, Minus, Shield, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, servicesScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { RewardsStrip } from "@/components/site/RewardsStrip";

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

const CATALOGUE = [
  {
    group: "Everyday Wear",
    items: [
      { key: "shirt", label: "Shirt", price: 150 },
      { key: "trousers", label: "Trousers", price: 150 },
      { key: "tshirt", label: "T-Shirt", price: 150 },
      { key: "kurtaCotton", label: "Kurta (Cotton)", price: 150 },
      { key: "spotClean", label: "Spot-Clean & Steam Press Only", price: 60, from: true, note: "₹60 – ₹80" },
    ],
  },
  {
    group: "Premium Dry Clean",
    items: [
      { key: "premiumShirt", label: "Men's Shirt / T-Shirt (Dry Clean)", price: 190 },
      { key: "shirtIron", label: "Men's Shirt / T-Shirt (Steam Iron)", price: 65 },
      { key: "suitDry", label: "Men's 2-Piece Suit (Dry Clean)", price: 780 },
      { key: "suitIron", label: "Men's 2-Piece Suit (Steam Iron)", price: 270 },
      { key: "suit", label: "2-Piece Suit", price: 450 },
    ],
  },
  {
    group: "Blazers, Coats & Jackets",
    items: [
      { key: "blazer", label: "Blazer / Coat — Short", price: 300 },
      { key: "puffer", label: "Puffer Jacket — Long", price: 600 },
    ],
  },
  {
    group: "Ethnic & Occasion Wear",
    items: [
      { key: "kurta", label: "Women's Kurta", price: 265, from: true, note: "₹265+" },
      { key: "kurtaIron", label: "Women's Kurta (Steam Iron)", price: 95, from: true, note: "₹95+" },
      { key: "heavyKurta", label: "Heavy Kurta", price: 350 },
      { key: "heavyDhoti", label: "Heavy Dhoti", price: 300 },
      { key: "lehenga", label: "Women's Lehenga", price: 1000, from: true, note: "₹1000+" },
      { key: "lehengaIron", label: "Women's Lehenga (Steam Iron)", price: 350, from: true, note: "₹350+" },
      { key: "weddingSuit", label: "Wedding Suit (3 pcs)", price: 600 },
      {
        key: "sherwani",
        label: "Designer Wedding Suit / Sherwani",
        price: 850,
        from: true,
        note: "₹850 – ₹1500+",
      },
    ],
  },
  {
    group: "Accessories",
    items: [{ key: "handbag", label: "Leather Handbag", price: 2800, from: true, note: "₹2800+" }],
  },
] as const;

type ItemKey = (typeof CATALOGUE)[number]["items"][number]["key"];
type CatalogItem = { key: ItemKey; label: string; price: number; from?: boolean; note?: string };

const ALL_ITEMS: CatalogItem[] = CATALOGUE.flatMap((g) => g.items.map((i) => ({ ...i })));



const ITEMS = Object.fromEntries(ALL_ITEMS.map((i) => [i.key, i.label])) as Record<ItemKey, string>;
const PRICES = Object.fromEntries(ALL_ITEMS.map((i) => [i.key, i.price])) as Record<ItemKey, number>;
const FROM_KEYS = new Set<ItemKey>(ALL_ITEMS.filter((i) => i.from).map((i) => i.key));


const ADDONS = {
  starch: { label: "Starch", price: 25 },
  polish: { label: "Polish", price: 50 },
  hanger: { label: "Hanger Packing", price: 50 },
  button: { label: "Button Stitching", price: 50 },
} as const;

type AddonKey = keyof typeof ADDONS;

const rateCard: { group: string; rows: { name: string; dry: string; iron?: string }[] }[] = [
  {
    group: "Dry Clean & Steam Iron",
    rows: [
      { name: "Men's Shirt / T-Shirt", dry: "₹190", iron: "₹65" },
      { name: "Men's 2-Piece Suit", dry: "₹780", iron: "₹270" },
      { name: "Women's Kurta", dry: "₹265+", iron: "₹95+" },
      { name: "Women's Lehenga", dry: "₹1000+", iron: "₹350+" },
      { name: "Leather Handbag", dry: "₹2800+", iron: "—" },
    ],
  },
  {
    group: "Everyday & Occasion Wear",
    rows: [
      { name: "Shirt", dry: "₹150" },
      { name: "Trousers", dry: "₹150" },
      { name: "Kurta (Cotton)", dry: "₹150" },
      { name: "T-Shirt", dry: "₹150" },
      { name: "Blazer / Coat — Short", dry: "₹300" },
      { name: "2-Piece Suit", dry: "₹450" },
      { name: "Heavy Kurta", dry: "₹350" },
      { name: "Heavy Dhoti", dry: "₹300" },
      { name: "Puffer Jacket — Long", dry: "₹600" },
      { name: "Wedding Suit (3 pcs)", dry: "₹600" },
      { name: "Designer Wedding Suit / Sherwani", dry: "₹850 – ₹1500+" },
      { name: "Spot-Clean & Steam Press Only", dry: "₹60 – ₹80" },
    ],
  },
  {
    group: "Add-ons",
    rows: [
      { name: "Starch", dry: "+₹25" },
      { name: "Polish", dry: "+₹50" },
      { name: "Hanger Packing", dry: "+₹50" },
      { name: "Button Stitching", dry: "+₹50" },
    ],
  },
];

const services = [
  {
    icon: Sparkles,
    title: "Dry Cleaning",
    desc: "Solvent-based cleaning for suits, ethnic wear, woollens and delicate fabrics, finished on commercial-grade equipment.",
    price: "From ₹149 per item",
  },
  {
    icon: Leaf,
    title: "Laundry & Press",
    desc: "Everyday wear washed, dried and crisply pressed. Press-only service available if you just need finishing.",
    price: "From ₹60 per item",
  },
  {
    icon: Shield,
    title: "Specialist Garment Care",
    desc: "Bridal, embellished and designer pieces handled individually, with photo checkpoints at every stage.",
    price: "From ₹850 per item",
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
  const itemsPrice = keys.reduce((sum, k) => sum + cart[k] * PRICES[k], 0);
  const addonsPrice = activeAddons.reduce((sum, k) => sum + ADDONS[k].price * totalItems, 0);
  const totalPrice = itemsPrice + addonsPrice;
  const isFrom = selected.some((k) => FROM_KEYS.has(k));
  const totalLabel = `₹${totalPrice}${isFrom ? "+" : ""}`;
  const hasItems = totalItems > 0;
  const summary = selected.map((k) => `${cart[k]} ${ITEMS[k]}`).join(", ");


  const update = (key: ItemKey, delta: number) => {
    const next = Math.max(0, cart[key] + delta);
    if (next === cart[key]) return;
    setCart({ ...cart, [key]: next });
    setPulse((p) => p + 1);
    setPopped(`${key}:${delta}:${Date.now()}`);
  };

  const requestQuote = () => {
    if (!hasItems) return;
    const list = selected
      .map(
        (k) =>
          `- ${cart[k]}x ${ITEMS[k]} @ ₹${PRICES[k]}${FROM_KEYS.has(k) ? "+" : ""} each = ₹${cart[k] * PRICES[k]}${FROM_KEYS.has(k) ? "+" : ""}`,
      )
      .join("\n");
    const addonLine = activeAddons.length
      ? `\nAdd-ons: ${activeAddons.map((k) => `${ADDONS[k].label} (+₹${ADDONS[k].price}/item)`).join(", ")}`
      : "";
    openWhatsApp(
      `Hi Linen & Leaf! I'd like to book this estimate:\n\n${list}${addonLine}\n\nTotal items: ${totalItems}\nEstimated total: ${totalLabel}\n\nPlease confirm pricing and current turnaround time.`,
    );

  };

  return (
    <>
      <PageHero
        eyebrow="Services & Pricing"
        title="Transparent, itemised garment care."
        description="We price per garment and confirm the full quote on WhatsApp before we begin — no hidden fees, no surprises at the door."
      />

      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 sm:gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, price }, i) => (
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
              <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base mb-4">{desc}</p>
              <p className="text-sm font-semibold text-teal-700">{price}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <RewardsStrip total={totalPrice} />

      {/* Quote builder */}
      <section className="py-16 md:py-24 bg-teal-950 text-white relative overflow-hidden">
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
                      const lineTotal = count * item.price;
                      const note = "note" in item ? item.note : undefined;
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
                            <p className="text-xs sm:text-sm text-teal-200/50 font-light">
                              {note ?? `₹${item.price}`} each
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
                          {count > 0 ? (
                            <p className="hidden sm:block text-sm font-semibold text-teal-200 tabular-nums w-20 text-right">
                              ₹{lineTotal}
                              {FROM_KEYS.has(key) ? "+" : ""}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>


            {/* Add-ons */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-teal-200/60 mb-3">Add-ons (per garment)</p>
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
                      {ADDONS[k].label} +₹{ADDONS[k].price}
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
              <div className="flex items-center justify-between">
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
                <div className="text-right">
                  <p className="text-xs text-teal-200/60 font-light">Estimated total</p>
                  <p className={`text-xl sm:text-2xl font-bold tabular-nums ${hasItems ? "text-white" : "text-teal-300/50"}`}>
                    {totalLabel}
                  </p>
                </div>
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
              <span>{hasItems ? "Book this Estimate via WhatsApp" : "Get a Custom Quote"}</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* Full rate card */}
      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-center">
              Full Rate Card
            </h2>
            <p className="mt-3 text-center text-slate-500 font-light text-sm sm:text-base">
              Indicative per-garment pricing. Final quote is confirmed on WhatsApp after we see the garment.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {rateCard.map((section, i) => {
              const hasIron = section.rows.some((r) => r.iron);
              return (
                <Reveal
                  key={section.group}
                  delay={i * 70}
                  className={`bg-white rounded-[2rem] p-6 sm:p-8 ll-card ${
                    section.group === "Everyday & Occasion Wear" ? "lg:row-span-2" : ""
                  }`}
                >
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-5">{section.group}</h3>

                  {hasIron ? (
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 mb-1 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <span>Service</span>
                      <span className="text-right">Dry Clean</span>
                      <span className="text-right">Steam Iron</span>
                    </div>
                  ) : null}

                  <ul className="divide-y divide-slate-100">
                    {section.rows.map((row) => (
                      <li
                        key={row.name}
                        className={`py-3 items-baseline ${
                          hasIron ? "grid grid-cols-[1fr_auto_auto] gap-4" : "flex justify-between gap-4"
                        }`}
                      >
                        <span className="text-sm sm:text-base text-slate-700 font-medium">{row.name}</span>
                        <span className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap text-right">
                          {row.dry}
                        </span>
                        {row.iron ? (
                          <span className="text-sm font-semibold text-slate-500 tabular-nums whitespace-nowrap text-right">
                            {row.iron}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  {hasIron ? (
                    <p className="mt-4 text-xs text-slate-400 font-light">
                      Steam iron is press/finish only; dry clean includes full cleaning + finishing.
                    </p>
                  ) : null}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
