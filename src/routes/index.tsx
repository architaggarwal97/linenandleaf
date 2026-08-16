import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplet, Eye, Clock, Cpu, Zap, MessageCircle, ArrowRight, Phone, Camera, MapPin, ShieldCheck } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "Linen & Leaf | Eco Friendly Dry Cleaners";
const DESCRIPTION =
  "Experience premium garment care with 99% less water. Linen & Leaf offers fast, eco-friendly dry cleaning in South Delhi & Sarojini Nagar. Book a free pickup!";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [
      { rel: "canonical", href: "https://linenandleaf.lovable.app/" },
      // Hero headline uses the Fraunces display face — preload the latin
      // variable subset so above-the-fold text paints without a swap flash.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        href: "https://fonts.gstatic.com/s/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeP2Xz5c.woff2",
      },
    ],
    scripts: [breadcrumbScript("/", "Home")],
  }),
  component: Home,
});

const usps = [
  {
    icon: Droplet,
    tint: "bg-teal-50 text-teal-500",
    title: "99% Less Water",
    desc: "Solvent-based dry cleaning that uses a fraction of the water of a conventional wash — better for your fabrics and the planet.",
  },
  {
    icon: Eye,
    tint: "bg-blue-50 text-blue-500",
    title: "Live Order Updates",
    desc: "Tagged photo checkpoints at pickup and after cleaning, sent straight to your WhatsApp. You always know where your order is.",
  },
  {
    icon: Clock,
    tint: "bg-amber-50 text-amber-500",
    title: "Fast Turnaround",
    desc: "Quick, reliable delivery back to your door. Ask us for current timing when you book — we'll confirm it upfront.",
  },
  {
    icon: Cpu,
    tint: "bg-purple-50 text-purple-500",
    title: "Best-in-Class Equipment",
    desc: "Modern commercial-grade dry-cleaning and finishing equipment. Precision care, not just a neighbourhood press.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-amber-50 text-amber-600",
    title: "Independent & Authentic",
    desc: "We are a proudly independent, founder-led business in Sarojini Nagar — not a distant corporate franchise. Your clothes never leave our local facility.",
  },
];

const steps = [
  { step: "01", icon: Phone, title: "Book a Pickup", desc: "WhatsApp, call, or use the form. We confirm your slot." },
  { step: "02", icon: Camera, title: "Collect & Tag", desc: "We collect, tag and photograph every garment." },
  { step: "03", icon: Zap, title: "Clean & Update", desc: "Cleaned on modern low-water equipment, with updates as it moves." },
  { step: "04", icon: MapPin, title: "Delivered Back", desc: "Returned to your door, crisply pressed." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-[#fdfefd]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-50/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-teal-50 border border-teal-100/60 text-teal-700 text-xs sm:text-sm font-medium mb-8 sm:mb-10 shadow-sm">
              <Zap className="h-4 w-4 fill-current text-amber-400 shrink-0" />
              <span>South Delhi's Fastest Premium Garment Care</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-800 mb-6 sm:mb-8 leading-[1.15] md:leading-[1.1] text-balance">
              <span className="font-extrabold text-teal-900 bg-teal-100/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl inline-block transform -rotate-1 mb-3 sm:mb-4 shadow-sm border border-teal-200/50">
                99% Less Water.
              </span>
              <br />
              Cleaner clothes,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400 block sm:inline">
                fully tracked.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-0">
              Modern, eco-conscious garment care in Sarojini Nagar. Doorstep pickup and delivery, photo checkpoints
              on every order, and total transparency — minus the guesswork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full px-4 sm:px-0">
              <Link
                to="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-xl shadow-teal-900/10 hover:-translate-y-1"
              >
                Book a Pickup <ArrowRight className="h-5 w-5 text-teal-200" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
              The Standard Has Changed
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
              Four things we do differently from a traditional neighbourhood presser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {usps.map(({ icon: Icon, tint, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2"
              >
                <div
                  className={`h-14 w-14 sm:h-16 sm:w-16 ${tint} rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">{title}</h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="py-20 md:py-28 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
              Four simple steps, all handled over WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 relative">
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0 border-t-2 border-dashed border-teal-200/60 z-0" />
            {steps.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 sm:mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-[0.65rem] sm:text-xs font-bold text-teal-200 mb-1 uppercase tracking-wider">
                    {step}
                  </span>
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light px-2">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-teal-700 font-medium hover:text-teal-600 transition-colors"
            >
              See the full process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-800 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Ready to upgrade your garment care?
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Book a free doorstep pickup in Sarojini Nagar and nearby localities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-900 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium transition-all duration-300 hover:-translate-y-1"
            >
              Book a Pickup <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-xl shadow-green-900/20 hover:-translate-y-1"
            >
              <MessageCircle className="h-6 w-6 shrink-0" /> Start a WhatsApp Chat
            </a>
          </div>
          <p className="mt-8 text-teal-100/70 text-sm sm:text-base font-light">
            Prefer to see it in person? Drop by our Sarojini Nagar outlet anytime.
          </p>
        </div>
      </section>
    </>
  );
}
