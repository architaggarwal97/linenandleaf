import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { Button } from "@/components/ui/button";
import { navLinks, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = navLinks.filter((l) => l.to !== "/" && l.to !== "/contact");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="site-container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="shrink-0" aria-label={site.name} onClick={() => setOpen(false)}>
          <Wordmark size="sm" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild size="sm">
            <Link to="/contact">Book a Pickup</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="site-container flex flex-col py-3" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm text-muted-foreground last:border-0"
                activeProps={{ className: "text-foreground font-semibold" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 py-4 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Book a Pickup
                </Link>
              </Button>
              <Button asChild variant="whatsapp" className="flex-1">
                <a href={site.whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
