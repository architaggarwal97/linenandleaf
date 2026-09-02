import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { getPost, posts, type Block } from "@/lib/blog";
import { whatsappLink } from "@/lib/whatsapp";
import { breadcrumbScript, socialMeta } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) return {};
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        ...socialMeta(post.metaTitle, post.metaDescription),
      ],
      scripts: [breadcrumbScript(`/blog/${post.slug}`, post.title)],
    };
  },
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPostPage,
});

/** Renders inline **bold** and bracketed CTAs as real links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-stone-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const label = part.slice(1, -1);
          const isWhatsApp = /whatsapp/i.test(label);
          if (isWhatsApp) {
            return (
              <a
                key={i}
                href={whatsappLink("Hi Linen & Leaf! I read your blog and have a question.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900"
              >
                {label}
              </a>
            );
          }
          return (
            <Link
              key={i}
              to="/contact"
              className="font-semibold text-teal-700 underline underline-offset-4 hover:text-teal-900"
            >
              {label}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h2") {
    return (
      <h2 className="mt-10 text-2xl font-semibold leading-snug text-stone-900">
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="mt-4 space-y-3 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="list-disc text-stone-600 leading-relaxed">
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "note") {
    return (
      <p className="mt-10 rounded-2xl bg-teal-50/70 p-6 text-sm italic leading-relaxed text-stone-700">
        <RichText text={block.text} />
      </p>
    );
  }
  return (
    <p className="mt-5 leading-relaxed text-stone-600">
      <RichText text={block.text} />
    </p>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-[#fafafa]">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All articles
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 font-medium text-teal-800">
            {post.tag}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readingTime}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-8">
          {post.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-stone-900">Keep reading</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2"
                >
                  <span className="text-xs font-medium text-teal-800">{p.tag}</span>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-stone-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
