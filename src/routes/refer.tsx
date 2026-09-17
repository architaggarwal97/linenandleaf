import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, MessageCircle, Users, Wallet, Camera, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink, openWhatsApp } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";
import { Reveal } from "@/components/site/Reveal";
import { ReferralForm } from "@/components/site/ReferralForm";

const TITLE = "Refer & Earn ₹100 — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Refer a friend to Linen & Leaf dry cleaning in Sarojini Nagar. Once they complete their first order, you both get ₹100 credited to your wallet.";

const SHARE_MESSAGE =
  "I've been using Linen & Leaf for dry cleaning — they photograph everything at pickup and after cleaning so you know exactly what's happening. Use my number when you book your first order and we both get ₹100 credited to our wallets: +91 88004 46635. Book here: https://wa.me/918800446635";

const steps = [
  {
    icon: MessageCircle,
    title: "Share with a friend",
    desc: "Send them the pre-filled WhatsApp message below — or just tell them to mention your name and number when they book.",
  },
  {
    icon: Camera,
    title: "They complete their first order",
    desc: "They book a pickup, we collect, clean, and deliver their garments — the usual Linen & Leaf experience.",
  },
  {
    icon: Wallet,
    title: "You both get ₹100",
    desc: "₹100 is credited to your Linen & Leaf wallet and to theirs, once that first order is delivered.",
  },
];

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/refer" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/refer" }],
    scripts: [breadcrumbScript("/refer", "Refer & Earn")],
  }),
  component: ReferPage,
});

function ReferPage() {
  return (
    <div>
      <PageHero
        eyebrow="Refer & Earn"
        title="Good care is worth sharing."
        description="Refer a friend to Linen & Leaf. Once they complete their first order, you both get ₹100 credited to your Linen & Leaf wallet — the same wallet you already use for top-ups and bonuses."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="h-full rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                    <step.icon className="h-6 w-6 text-teal-700" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                    Step {i + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-12 rounded-3xl bg-teal-950 p-8 text-center md:p-12">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-900">
                <Gift className="h-7 w-7 text-amber-300" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-white">
                ₹100 for you. ₹100 for them.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm md:text-base leading-relaxed text-teal-200/80">
                Tap below to open WhatsApp with a pre-filled message. Forward it to your friend —
                when they book, they simply mention your name and number.
              </p>
              <button
                onClick={() => openWhatsApp(SHARE_MESSAGE)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-semibold text-teal-950 transition-all hover:bg-amber-300 hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Share with a friend
              </button>
              <p className="mt-5 text-xs text-teal-300/60">
                No codes, no links to copy — your friend just mentions you when they book.
              </p>
            </div>
          </Reveal>

          <Reveal delay={175}>
            <div className="mt-10">
              <ReferralForm />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  One fair rule, stated plainly
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  The ₹100 credit lands only after your friend's first order is{" "}
                  <strong className="font-semibold text-slate-800">completed and delivered</strong>{" "}
                  — not just booked. This keeps the program honest for everyone and prevents misuse.
                  Credits are added manually by our team, usually within a day of delivery.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-teal-700" />
                  <h3 className="text-base font-semibold text-slate-900">How it's tracked</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  For now, referrals run on a simple mention: your friend tells us who referred them
                  when they book. We note it against your wallet and confirm both credits on
                  WhatsApp once their first order is delivered.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-teal-700" />
                  <h3 className="text-base font-semibold text-slate-900">Where the credit goes</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Referral rewards land in the same Linen &amp; Leaf wallet you use for top-ups —
                  no separate points or vouchers to keep track of.{" "}
                  <Link
                    to="/wallet"
                    className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                  >
                    See how the wallet works
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600">
                Questions about the program?{" "}
                <a
                  href={whatsappLink("Hi Linen & Leaf! I have a question about the referral program.")}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                >
                  Message us on WhatsApp
                </a>{" "}
                or{" "}
                <Link
                  to="/contact"
                  className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                >
                  book a pickup <ArrowRight className="inline h-4 w-4" />
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
