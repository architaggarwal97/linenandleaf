import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "Answers on turnaround times, pricing, garment care and delivery." },
      { property: "og:title", content: "FAQ — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "Answers on turnaround times, pricing, garment care and delivery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="FAQ" description="Answers on turnaround times, pricing, garment care and delivery." />;
}
