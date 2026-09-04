import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { site } from "@/lib/site";
import { MobileActionBar } from "@/components/site/MobileActionBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Linen & Leaf Dry Cleaners" },
      { property: "og:site_name", content: "Linen & Leaf Dry Cleaners" },
      { name: "theme-color", content: "#0d9488" },
      { name: "apple-mobile-web-app-title", content: "Linen & Leaf" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },

    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "apple-touch-icon", sizes: "167x167", href: "/apple-touch-icon-167x167.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-touch-icon-120x120.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "DryCleaningOrLaundry"],
          "@id": "https://linenandleaf.lovable.app",
          name: site.name,
          url: "https://linenandleaf.lovable.app",
          telephone: site.whatsappNumber.replace(/\s/g, ""),
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: site.whatsappNumber.replace(/\s/g, ""),
              contactType: "WhatsApp",
              availableLanguage: ["English", "Hindi"],
            },
            {
              "@type": "ContactPoint",
              telephone: site.phone.replace(/\s/g, ""),
              contactType: "Phone",
              availableLanguage: ["English", "Hindi"],
            },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "1st Floor, Shop No. 108, Sarojini Nagar Market",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            postalCode: "110023",
            addressCountry: "IN",
          },
          description:
            "Independent eco-friendly dry cleaners and laundry service in Sarojini Nagar, South Delhi — low-water dry cleaning with 99% less water, doorstep pickup and photo-tagged tracking.",
          image: "https://linenandleaf.lovable.app/og-image.jpg",
          priceRange: "₹₹",
          currenciesAccepted: "INR",
          knowsAbout: [
            "Dry cleaning",
            "Low-water dry cleaning",
            "Eco-friendly dry cleaning",
            "Laundry and steam pressing",
            "Bridal and ethnic wear care",
          ],
          areaServed: [
            { "@type": "Place", name: "Sarojini Nagar" },
            { "@type": "Place", name: "RK Puram" },
            { "@type": "Place", name: "Netaji Nagar" },
            { "@type": "Place", name: "INA Colony" },
            { "@type": "Place", name: "Chanakyapuri" },
            { "@type": "Place", name: "Vasant Vihar" },
            { "@type": "Place", name: "Safdarjung Enclave" },
            { "@type": "City", name: "New Delhi" },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-teal-800 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <MobileActionBar />
      </div>
    </QueryClientProvider>
  );
}
