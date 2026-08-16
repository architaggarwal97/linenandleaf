import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink } from "@/lib/whatsapp";

const TITLE = "FAQ — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Answers on turnaround, pricing, garment care guarantees, pickup areas and how tracking updates work at Linen & Leaf.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How fast is your turnaround?",
    a: "We aim for a fast turnaround, but exact timing depends on the garment and the day's load. Ask us for current timing when you book and we'll confirm it upfront.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing is per garment and fully itemised. Build your basket on the Services & Pricing page and we'll send an exact quote on WhatsApp — you approve it before we start.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No. Pickup and delivery are free within our service area, and you always see the final quote before processing begins.",
  },
  {
    q: "What is your damage policy?",
    a: "We offer a zero-shrinkage, zero-colour-bleed guarantee. Every garment is tagged and photographed at intake and after cleaning, so there's a clear record if anything is disputed.",
  },
  {
    q: "How do I know where my order is?",
    a: "We send you updates and tagged photo checkpoints on WhatsApp as your order moves through pickup, cleaning and delivery.",
  },
  {
    q: "Which areas do you pick up from?",
    a: "Sarojini Nagar and nearby localities — RK Puram, Netaji Nagar, INA Colony, Vasant Vihar and Safdarjung Enclave. Check the Service Area page or just ask us.",
  },
  {
    q: "Do you handle bridal and designer wear?",
    a: "Yes. Embellished, bridal and designer pieces are handled individually with fabric-specific processing and extra photo documentation.",
  },
];

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered plainly."
        description="If something isn't covered here, message us on WhatsApp — a real person will reply."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {faqs.map((faq) => (
            <article
              key={faq.q}
              className="p-6 sm:p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-teal-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
            >
              <h2 className="font-semibold text-slate-800 mb-3">{faq.q}</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">{faq.a}</p>
            </article>
          ))}

          <div className="text-center pt-8">
            <a
              href={whatsappLink("Hi Linen & Leaf! I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg shadow-green-500/20"
            >
              <MessageCircle className="h-5 w-5" /> Ask us anything
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
