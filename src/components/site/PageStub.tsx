import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function PageStub({ title, description }: { title: string; description: string }) {
  return (
    <section className="site-container py-20 md:py-28">
      <p className="eyebrow">Linen &amp; Leaf</p>
      <h1 className="mt-3 text-3xl md:text-5xl">{title}</h1>
      <div className="rule-brass mt-5" />
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{description}</p>
      <p className="mt-6 text-sm text-muted-foreground">
        This page is coming soon. In the meantime, message us and we'll answer straight away.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="whatsapp" size="lg">
          <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp {site.whatsappNumber}
          </a>
        </Button>
        <Button asChild variant="ink" size="lg">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
