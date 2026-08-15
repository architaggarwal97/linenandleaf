import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "Four simple steps from pickup to doorstep delivery." },
      { property: "og:title", content: "How It Works — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "Four simple steps from pickup to doorstep delivery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="How It Works" description="Four simple steps from pickup to doorstep delivery." />;
}
