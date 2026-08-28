import { useState, type ElementType } from "react";
import { Link } from "@tanstack/react-router";
import { Package, Truck, Coins, Banknote, Lock, Check, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

type RewardTier = {
  icon: ElementType;
  label: string;
  threshold: number;
  detail: string;
};

/*
 * Rewards strip — lock states and progress rings are driven by the live
 * running total passed in as `total`. On pages without an estimator, pass 0
 * to show the locked preview state.
 */
const REWARDS: RewardTier[] = [
  {
    icon: Package,
    label: "Free Pickup",
    threshold: 200,
    detail: "We collect your garments from your doorstep at no charge.",
  },
  {
    icon: Truck,
    label: "Free Delivery",
    threshold: 500,
    detail: "Freshly finished garments returned to you, delivery free.",
  },
  {
    icon: Coins,
    label: "₹100 Cashback",
    threshold: 900,
    detail: "₹100 credited back to your Linen & Leaf wallet.",
  },
  {
    icon: Banknote,
    label: "₹200 Cashback",
    threshold: 1500,
    detail: "₹200 total credited back (replaces the ₹100 tier).",
  },
];

const RING = 2 * Math.PI * 46;

export function RewardsStrip({
  total,
  cta,
}: {
  total: number;
  /** Optional CTA rendered beneath the strip — used on the homepage to route to the live estimator. */
  cta?: { label: string; to: string };
}) {
  const [open, setOpen] = useState<string | null>(null);
  // Empty state: no basket total calculated yet (e.g. homepage preview).
  const isEmpty = total <= 0;

  return (
    <section className="py-10 md:py-12 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 ll-card">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-teal-600 mb-2">
              Rewards on every order
            </p>
            <p className="text-center text-sm font-light text-slate-500 mb-6">
              {isEmpty
                ? "No basket total yet — build your order on the Services page and watch these rewards unlock."
                : `Your basket is at ₹${total} — keep adding to unlock more.`}
            </p>

            <div className="-mx-6 sm:mx-0 px-6 sm:px-0 overflow-x-auto sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <ul className="flex sm:grid sm:grid-cols-4 gap-4 sm:gap-4 min-w-max sm:min-w-0">
                {REWARDS.map((reward) => {
                  const Icon = reward.icon;
                  const unlocked = total >= reward.threshold;
                  const progress = Math.min(100, (total / reward.threshold) * 100);
                  const showRing = progress > 0;
                  const isOpen = open === reward.label;
                  const tipId = `reward-tip-${reward.threshold}`;

                  return (
                    <li
                      key={reward.label}
                      className="relative w-[7.5rem] sm:w-auto shrink-0 flex flex-col items-center text-center"
                    >
                      <button
                        type="button"
                        aria-describedby={isOpen ? tipId : undefined}
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : reward.label)}
                        onMouseEnter={() => setOpen(reward.label)}
                        onMouseLeave={() => setOpen(null)}
                        onFocus={() => setOpen(reward.label)}
                        onBlur={() => setOpen(null)}
                        className="group flex flex-col items-center rounded-2xl p-2 min-h-[44px] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                      >
                        <span className="relative block h-20 w-20">
                          <svg
                            className="absolute inset-0 h-full w-full -rotate-90 text-slate-100"
                            viewBox="0 0 100 100"
                            aria-hidden="true"
                          >
                            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" />
                          </svg>

                          {showRing ? (
                            <svg
                              className={`absolute inset-0 h-full w-full -rotate-90 ${unlocked ? "text-teal-600" : "text-amber-500"}`}
                              viewBox="0 0 100 100"
                              aria-hidden="true"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={`${(progress / 100) * RING} ${RING}`}
                                className="transition-[stroke-dasharray] duration-700 ease-out"
                              />
                            </svg>
                          ) : null}

                          <span
                            className={`absolute inset-[5px] rounded-full flex items-center justify-center transition-colors duration-500 ${
                              unlocked ? "bg-teal-50 ll-unlock-pop" : "bg-slate-50"
                            }`}
                          >
                            <Icon
                              strokeWidth={1.75}
                              className={`h-7 w-7 transition-colors duration-500 ${
                                unlocked ? "text-teal-600" : "text-slate-400"
                              }`}
                            />
                          </span>

                          {unlocked ? (
                            <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center shadow-sm">
                              <Check strokeWidth={2.5} className="h-3.5 w-3.5 text-white" />
                            </span>
                          ) : (
                            <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm">
                              <Lock strokeWidth={1.75} className="h-3.5 w-3.5 text-slate-400" />
                            </span>
                          )}
                        </span>

                        <span
                          className={`mt-4 block text-sm font-semibold ${
                            unlocked ? "text-teal-700" : "text-slate-500"
                          }`}
                        >
                          {reward.label}
                        </span>
                        <span className="mt-1 block text-xs font-medium text-slate-400 tabular-nums">
                          {unlocked ? "Unlocked" : `Unlocks at ₹${reward.threshold}`}
                        </span>
                      </button>

                      <span
                        id={tipId}
                        role="tooltip"
                        className={`absolute bottom-full z-20 mb-1 w-52 rounded-xl bg-slate-900 px-3 py-2 text-xs font-light leading-relaxed text-white shadow-xl transition-all duration-200 ${
                          isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1"
                        }`}
                      >
                        <strong className="block font-semibold">
                          {reward.label} — ₹{reward.threshold}+
                        </strong>
                        {reward.detail}
                      </span>
                    </li>
                  );
                })}
          </ul>
            </div>

            {cta ? (
              <div className="mt-8 text-center">
                <Link
                  to={cta.to}
                  className="inline-flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 shadow-lg shadow-teal-900/10 hover:-translate-y-0.5"
                >
                  {cta.label} <ArrowRight className="h-4 w-4 text-teal-200" />
                </Link>
                {isEmpty ? (
                  <p className="mt-3 text-xs text-slate-400 font-light">
                    Add items in the estimator — your progress rings fill live as the total grows.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
