import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { posts } from "@/lib/blog";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

const TITLE = "Blog — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Garment care tips, fabric guides and updates from Linen & Leaf — eco-friendly dry cleaning in Sarojini Nagar, New Delhi.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [{ title: TITLE }, ...socialMeta(TITLE, DESCRIPTION)],
    scripts: [breadcrumbScript("/blog", "Blog")],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="bg-[#fafafa]">
      <PageHero
        eyebrow="From the Press Room"
        title="Garment Care, Decoded"
        description="Practical tips on fabrics, stains, storage and eco-friendly cleaning — written by the team that handles your clothes every day."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 pt-4 -mx-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => (
            <Reveal key={post.slug}>
              <article className="flex h-full w-[85vw] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 sm:w-[350px] md:w-auto md:shrink md:snap-none">
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {post.date}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 font-medium text-teal-800">
                    {post.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-snug text-stone-900">
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
                >
                  Read article
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-stone-900">
            Have a garment question we haven't covered?
          </h2>
          <p className="mt-3 text-stone-600">
            Message us on WhatsApp and we'll point you in the right direction.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappLink("Hi Linen & Leaf! I have a garment care question.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Chat on WhatsApp
            </a>
            <Link
              to="/services"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-teal-700 hover:text-teal-800"
            >
              See Services & Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
