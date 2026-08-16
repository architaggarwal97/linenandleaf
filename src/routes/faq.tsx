import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { whatsappLink } from "@/lib/whatsapp";

const TITLE = "FAQ — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Answers on turnaround, pricing, garment care guarantees, pickup areas and how tracking updates work at Linen & Leaf.";

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
  {
    q: "What kinds of garments can I send?",
    a: "Shirts, trousers, suits, sarees, lehengas, jackets, coats, dresses, curtains, bedsheets and most everyday or occasion wear. If you're unsure, send us a photo on WhatsApp and we'll confirm.",
  },
  {
    q: "Do I need to be home for pickup or delivery?",
    a: "Not necessarily. You can leave garments with a neighbour, security guard or in a pre-agreed safe spot. We coordinate the handover details over WhatsApp.",
  },
  {
    q: "How do I pay?",
    a: "We accept UPI, cash and most major wallets. Payment is collected after you approve the quote and before delivery, unless you've arranged a prepaid wallet balance with us.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(faqJsonLd),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const focusButton = (index: number) => {
    const next = (index + faqs.length) % faqs.length;
    buttonRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusButton(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusButton(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusButton(0);
        break;
      case "End":
        event.preventDefault();
        focusButton(faqs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered plainly."
        description="If something isn't covered here, message us on WhatsApp — a real person will reply."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Frequently asked questions</h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <article
                  key={faq.q}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-teal-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                      : "bg-slate-50 border-transparent hover:border-teal-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-question-${index}`}
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      onClick={() => toggle(index)}
                      onKeyDown={(event) => onKeyDown(event, index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="w-full flex items-center justify-between gap-4 p-5 sm:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/50 focus-visible:ring-offset-2 rounded-2xl sm:rounded-3xl font-semibold text-slate-800 text-base sm:text-lg"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <span
                        className={`shrink-0 inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-teal-100/60 text-teal-700 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    hidden={!isOpen}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-8 pb-5 sm:pb-8 text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>


          <div className="text-center pt-10 sm:pt-12">
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
