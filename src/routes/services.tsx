import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "Transparent per-garment pricing for dry cleaning, laundry, press-only and specialist care." },
      { property: "og:title", content: "Services & Pricing — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "Transparent per-garment pricing for dry cleaning, laundry, press-only and specialist care." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="Services & Pricing" description="Transparent per-garment pricing for dry cleaning, laundry, press-only and specialist care." />;
}
