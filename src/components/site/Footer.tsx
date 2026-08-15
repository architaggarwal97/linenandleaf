import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Wordmark";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="site-container grid gap-10 py-14 md:grid-cols-3 md:py-16">
        <div>
          <Wordmark size="md" withTagline />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Eco-conscious dry cleaning and laundry for Sarojini Nagar — 99% less water, fully
            tracked, delivered to your door.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Visit us</h2>
          <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed text-muted-foreground">
            <p>{site.address}</p>
            <p>
              <a className="hover:text-foreground" href={site.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp {site.whatsappNumber}
              </a>
            </p>
            <p>
              <a className="hover:text-foreground" href={site.phoneHref}>
                Call {site.phone}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="site-container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Linen &amp; Leaf Dry Cleaners. Sarojini Nagar, New Delhi.</p>
          <p>Pickup &amp; delivery, six days a week.</p>
        </div>
      </div>
    </footer>
  );
}
