import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "An independent, eco-conscious dry cleaner built in Sarojini Nagar Market." },
      { property: "og:title", content: "About — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "An independent, eco-conscious dry cleaner built in Sarojini Nagar Market." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="About" description="An independent, eco-conscious dry cleaner built in Sarojini Nagar Market." />;
}
