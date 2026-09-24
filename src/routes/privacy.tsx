import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "Privacy Notice — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "How Linen & Leaf collects, uses and protects your personal data under India's Digital Personal Data Protection Act, 2023 — and how to exercise your rights.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://linenandleaf.lovable.app/privacy" },
      ...socialMeta(TITLE, DESCRIPTION),
    ],
    links: [{ rel: "canonical", href: "https://linenandleaf.lovable.app/privacy" }],
    scripts: [breadcrumbScript("/privacy", "Privacy Notice")],
  }),
  component: PrivacyPage,
});

const sections: Array<{ h: string; body: React.ReactNode }> = [
  {
    h: "Who we are",
    body: (
      <p>
        Linen &amp; Leaf Dry Cleaners ("we", "us") is the Data Fiduciary for personal data collected
        through this website and our WhatsApp service. Address: {site.address}.
      </p>
    ),
  },
  {
    h: "What we collect",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Name, WhatsApp number and pickup address when you book a pickup.</li>
        <li>Preferred pickup date/time and notes about your garments.</li>
        <li>A friend's name and number if you refer someone (please tell them first).</li>
        <li>Order amounts, payment status, wallet balance and transactions.</li>
        <li>Photos of your garments taken at pickup and after cleaning.</li>
        <li>Reviews you choose to share with us.</li>
        <li>Anonymous usage statistics through Google Analytics (pages visited, device type).</li>
      </ul>
    ),
  },
  {
    h: "Why we use it",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>To collect, clean and return your garments and keep you updated on WhatsApp.</li>
        <li>To run your wallet, cashback and referral rewards.</li>
        <li>To issue receipts and keep accounting and tax records.</li>
        <li>To understand how the website is used so we can improve it.</li>
      </ul>
    ),
  },
  {
    h: "Consent",
    body: (
      <p>
        We process your data on the basis of the consent you give when you submit a booking,
        referral or wallet sign-in. You may withdraw consent at any time by messaging us on
        WhatsApp. Withdrawing consent does not affect processing already done, but we may be unable
        to serve orders that are still in progress.
      </p>
    ),
  },
  {
    h: "Who we share it with",
    body: (
      <p>
        We do not sell your data. It is stored with our cloud hosting and database providers, a
        Google Sheets record used by our staff, and Google Analytics — each acting as a Data
        Processor on our behalf. We may disclose data where required by law.
      </p>
    ),
  },
  {
    h: "How long we keep it",
    body: (
      <p>
        We keep customer records for 3 years after your last order, to meet accounting and tax
        obligations, and then delete them. Garment photos and referral details are deleted sooner if
        you ask us to.
      </p>
    ),
  },
  {
    h: "How we protect it",
    body: (
      <p>
        Your data is stored in access-controlled systems. Order lookups need both your number and
        order reference, staff tools are PIN-protected, and photos are kept in private storage. If a
        personal data breach occurs, we will inform you and the Data Protection Board of India as
        required.
      </p>
    ),
  },
  {
    h: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act, 2023 you can:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Ask for a summary of the personal data we hold about you and who it was shared with.</li>
          <li>Ask us to correct, complete or update it.</li>
          <li>Ask us to erase it (unless the law requires us to keep it).</li>
          <li>Withdraw your consent.</li>
          <li>Nominate another person to exercise these rights if you die or become incapacitated.</li>
          <li>Raise a grievance with us, and then with the Data Protection Board of India.</li>
        </ul>
        <p className="mt-3">
          To make any request, message us on{" "}
          <a className="text-teal-700 underline" href={whatsappLink()} target="_blank" rel="noreferrer">
            WhatsApp {site.whatsappNumber}
          </a>{" "}
          from the number you used with us. We aim to respond within 7 days.
        </p>
      </>
    ),
  },
  {
    h: "Grievance Officer",
    body: (
      <p>
        Archit Aggarwal — WhatsApp {site.whatsappNumber}, phone {site.phone}, or in person at{" "}
        {site.address}.
      </p>
    ),
  },
  {
    h: "Children",
    body: (
      <p>
        Our services are meant for adults. We do not knowingly collect data from anyone under 18
        without verifiable consent from a parent or guardian.
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Your data" title="Privacy Notice" subtitle="Last updated: September 2026" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10 text-slate-700 leading-relaxed">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="font-serif text-2xl text-slate-900 mb-3">{s.h}</h2>
            {s.body}
          </div>
        ))}
      </section>
    </>
  );
}
