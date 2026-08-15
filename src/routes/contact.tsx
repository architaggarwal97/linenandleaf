import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Pickup — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "Book a pickup by WhatsApp, phone or a quick form." },
      { property: "og:title", content: "Book a Pickup — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "Book a pickup by WhatsApp, phone or a quick form." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="Book a Pickup" description="Book a pickup by WhatsApp, phone or a quick form." />;
}
