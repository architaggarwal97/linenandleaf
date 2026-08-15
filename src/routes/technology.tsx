import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/site/PageStub";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology & Process — Linen & Leaf Dry Cleaners" },
      { name: "description", content: "The low-water machines, tagging system and live tracking behind every order." },
      { property: "og:title", content: "Technology & Process — Linen & Leaf Dry Cleaners" },
      { property: "og:description", content: "The low-water machines, tagging system and live tracking behind every order." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/technology" },
    ],
    links: [{ rel: "canonical", href: "/technology" }],
  }),
  component: Page,
});

function Page() {
  return <PageStub title="Technology & Process" description="The low-water machines, tagging system and live tracking behind every order." />;
}
