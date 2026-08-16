import { createFileRoute } from "@tanstack/react-router";
import { DryCleaningLanding } from "@/components/DryCleaningLanding";

const TITLE = "Linen & Leaf Dry Cleaners — Sarojini Nagar, New Delhi";
const DESCRIPTION =
  "Premium eco-conscious dry cleaning in Sarojini Nagar, New Delhi. 99% less water, live order tracking and doorstep pickup and delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: DryCleaningLanding,
});
