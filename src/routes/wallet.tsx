import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Wallet, MessageCircle, Info, ArrowRight, ShoppingBag, Smartphone, Copy, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { useSavedBasket, saveBasket, type SavedBasket } from "@/lib/basket";
import { useWallet } from "@/lib/wallet-client";
import { WalletAccount } from "@/components/site/WalletAccount";
import { site, upiPaymentLink } from "@/lib/site";

const TITLE = "Wallet — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Add money to your Linen & Leaf wallet and get a 10% bonus credit. Use it for dry cleaning, laundry, and specialist garment care in Sarojini Nagar.";

const PRESET_AMOUNTS = [1000, 2000, 5000] as const;

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/wallet" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/wallet" }],
    scripts: [breadcrumbScript("/wallet", "Wallet")],
  }),
  component: WalletPage,
});

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function basketSummaryText(basket: SavedBasket) {
  const lines = basket.lines
    .map((line) =>
      line.price > 0
        ? `- ${line.qty}× ${line.label} @ ₹${line.price}${line.from ? "+" : ""} each = ₹${line.qty * line.price}${line.from ? "+" : ""}`
        : `- ${line.qty}× ${line.label}`,
    )
    .join("\n");
  const addonLine = basket.addons.length
    ? `\nAdd-ons: ${basket.addons.map((a) => (a.price > 0 ? `${a.label} (+₹${a.price}/item)` : a.label)).join(", ")}`
    : "";
  const totalLine =
    basket.totalPrice > 0
      ? `\nEstimated total: ₹${basket.totalPrice}${basket.isFrom ? "+" : ""}`
      : "";
  return `Hi Linen & Leaf! I'd like to confirm this basket:\n\n${lines}${addonLine}\n\nTotal items: ${basket.totalItems}${totalLine}\n\nPlease confirm pricing and pickup availability.`;
}

function WalletPage() {
  const { basket, ready } = useSavedBasket();
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const wallet = useWallet();

  const activeAmount = isCustom ? Number(custom) || 0 : amount;
  const bonus = Math.round(activeAmount * 0.1);
  const credited = activeAmount + bonus;
  const isValid = activeAmount >= 100;

  const selectPreset = (value: number) => {
    setAmount(value);
    setIsCustom(false);
    setCustom("");
  };

  const handleCustomChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setCustom(digits);
    setIsCustom(true);
  };

  const sendBasket = () => {
    if (!basket) return;
    openWhatsApp(basketSummaryText(basket));
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(site.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the ID is still visible to copy manually.
    }
  };

  const topUp = () => {
    if (!isValid) return;
    if (wallet.loggedIn) {
      void wallet.requestTopUp(activeAmount).catch((err) => console.error(err));
    }
    const basketPart = basket
      ? `\n\nI'd like to use this wallet credit toward the following basket:\n${basket.lines
          .map((line) =>
            line.price > 0
              ? `- ${line.qty}× ${line.label} = ₹${line.qty * line.price}${line.from ? "+" : ""}`
              : `- ${line.qty}× ${line.label}`,
          )
          .join("\n")}${
          basket.addons.length
            ? `\nAdd-ons: ${basket.addons.map((a) => (a.price > 0 ? `${a.label} (+₹${a.price}/item)` : a.label)).join(", ")}`
            : ""
        }${basket.totalPrice > 0 ? `\nEstimated total: ₹${basket.totalPrice}${basket.isFrom ? "+" : ""}` : ""}`
      : "";
    const message = `Hi Linen & Leaf! I'd like to top up my wallet with ${formatCurrency(activeAmount)}. Please credit ${formatCurrency(credited)} (${formatCurrency(bonus)} bonus). Service area: Sarojini Nagar.${basketPart}`;
    openWhatsApp(message);
  };

  return (
    <>
      <PageHero
        eyebrow="Wallet"
        title="Prepay and get 10% more to spend."
        description="Add money to your Linen & Leaf wallet and we'll credit a 10% bonus on top — usable on every service, every order."
      />

      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <WalletAccount wallet={wallet} />

          {ready && basket ? (
            <Reveal className="mb-8 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Your Saved Basket</h2>
                  <p className="text-sm text-slate-500 font-light">
                    {basket.totalItems} item{basket.totalItems > 1 ? "s" : ""} from the estimator
                  </p>
                </div>
              </div>

              <ul className="divide-y divide-slate-100">
                {basket.lines.map((line) => (
                  <li key={line.key} className="py-3 flex items-baseline justify-between gap-4">
                    <span className="text-sm sm:text-base text-slate-700 font-medium">
                      {line.qty}× {line.label}
                    </span>
                    {line.price > 0 ? (
                      <span className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        ₹{line.qty * line.price}
                        {line.from ? "+" : ""}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>

              {basket.addons.length ? (
                <p className="mt-4 text-xs text-slate-500 font-light">
                  Add-ons: {basket.addons.map((a) => (a.price > 0 ? `${a.label} (+₹${a.price}/item)` : a.label)).join(", ")}
                </p>
              ) : null}

              {basket.totalPrice > 0 ? (
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-base font-semibold text-slate-900">Estimated total</span>
                  <span className="text-2xl font-bold text-teal-800 tabular-nums">
                    ₹{basket.totalPrice}
                    {basket.isFrom ? "+" : ""}
                  </span>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  hash="order-builder"
                  className="ll-press inline-flex items-center gap-2 rounded-2xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Edit basket <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={sendBasket}
                  className="ll-press inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 shadow-lg shadow-green-500/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send basket on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => saveBasket(null)}
                  className="ll-press inline-flex items-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Clear basket
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-400 font-light">
                Top up your wallet to cover this order and get 10% extra credit.
              </p>
            </Reveal>
          ) : null}

          <Reveal className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Top Up Your Wallet</h2>
                <p className="text-sm text-slate-500 font-light">Choose an amount. Bonus is applied instantly.</p>
              </div>
            </div>

            {/* Quick-select buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              {PRESET_AMOUNTS.map((preset) => {
                const selected = !isCustom && amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`ll-press rounded-2xl px-4 py-4 text-sm sm:text-base font-semibold border transition-all duration-300 ${
                      selected
                        ? "bg-teal-800 text-white border-teal-800 shadow-lg shadow-teal-900/10"
                        : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50"
                    }`}
                    aria-pressed={selected}
                  >
                    {formatCurrency(preset)}
                  </button>
                );
              })}
            </div>

            {/* Custom input */}
            <div className="mb-8">
              <label htmlFor="customAmount" className="block text-sm font-medium text-slate-700 mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  id="customAmount"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1,500"
                  value={custom}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl border text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                    isCustom
                      ? "border-teal-500 bg-teal-50/30 text-slate-900"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                  }`}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 font-light">Minimum top-up ₹100.</p>
            </div>

            {/* Live calculation */}
            <div
              className={`rounded-2xl p-6 sm:p-8 mb-8 transition-all duration-300 ${
                isValid ? "bg-teal-50/60 border border-teal-100" : "bg-slate-50 border border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 font-medium">You add</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(activeAmount)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 font-medium">10% bonus</span>
                <span className="text-lg font-bold text-teal-700 tabular-nums">+{formatCurrency(bonus)}</span>
              </div>
              <div className="border-t border-teal-200/60 pt-4 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">Total credited</span>
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${isValid ? "text-teal-800" : "text-slate-400"}`}>
                  {formatCurrency(credited)}
                </span>
              </div>
              {isValid ? (
                <p className="mt-4 text-sm text-teal-700/80 font-medium">
                  {formatCurrency(activeAmount)} added becomes {formatCurrency(credited)} ({formatCurrency(bonus)} bonus credited)
                </p>
              ) : (
                <p className="mt-4 text-sm text-slate-400 font-light">Enter at least ₹100 to see your bonus.</p>
              )}
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={topUp}
              disabled={!isValid}
              className={`w-full flex justify-center items-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                isValid
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 hover:-translate-y-1"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              {basket ? "Top Up & Confirm Basket via WhatsApp" : "Top Up via WhatsApp"}
            </button>

            {/* Pay via UPI */}
            <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Or pay by UPI</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    Paytm, GPay, PhonePe or any UPI app — to our Paytm UPI ID.
                  </p>
                </div>
              </div>
              <div className="mb-4 flex justify-center">
                <figure className="text-center">
                  <img
                    src={site.upiQrUrl}
                    alt={`Scan to pay ${site.upiPayeeName} on UPI (${site.upiId})`}
                    className="mx-auto w-44 sm:w-52 rounded-xl border border-slate-200 shadow-sm"
                    loading="lazy"
                  />
                  <figcaption className="mt-2 text-xs text-slate-400 font-medium">
                    Scan with any UPI app to pay
                  </figcaption>
                </figure>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => void copyUpi()}
                  className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-teal-300"
                  aria-label={`Copy UPI ID ${site.upiId}`}
                >
                  <span>
                    <span className="block text-xs text-slate-400 font-medium">UPI ID</span>
                    <span className="block font-mono text-base font-semibold text-slate-900">{site.upiId}</span>
                  </span>
                  {upiCopied ? (
                    <Check className="h-5 w-5 shrink-0 text-teal-600" />
                  ) : (
                    <Copy className="h-5 w-5 shrink-0 text-slate-400" />
                  )}
                </button>
                <a
                  href={upiPaymentLink(isValid ? activeAmount : undefined, "Linen & Leaf wallet top-up")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    isValid
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "bg-teal-700/60 text-white/80"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Open UPI app{isValid ? ` · ${formatCurrency(activeAmount)}` : ""}
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-400 font-light">
                Send the payment, then confirm below or on WhatsApp — we credit your balance (plus the 10% bonus) as
                soon as it lands.
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <Info className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                {wallet.loggedIn
                  ? "Your request is logged as pending. Pay by UPI or cash on pickup — we credit your balance (plus the 10% bonus) as soon as the payment lands."
                  : "Sign in above to track your balance. Pay by UPI to the ID above, or confirm over WhatsApp."}
              </p>
            </div>
          </Reveal>

          {/* Back to services */}
          <Reveal delay={100} className="mt-8 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-teal-700 font-medium hover:text-teal-600 transition-colors"
            >
              See our services & pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
