import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/service-area")({
  head: () => ({
    meta: [
      { title: "Service Area — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "Free pickup and delivery across Sarojini Nagar and nearby South Delhi colonies." },
      { property: "og:title", content: "Service Area — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "Free pickup and delivery across Sarojini Nagar and nearby South Delhi colonies." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/service-area" },
    ],
    links: [{ rel: "canonical", href: "/service-area" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="Service Area" description="Free pickup and delivery across Sarojini Nagar and nearby South Delhi colonies." />;
}
