const ORIGIN = "https://linenandleaf.lovable.app";

const PROVIDER = {
  "@type": "DryCleaningOrLaundry",
  name: "Linen & Leaf Dry Cleaners",
  url: ORIGIN,
  telephone: "+91-88004-46635",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Floor, Shop No. 108, Sarojini Nagar Market",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110023",
    addressCountry: "IN",
  },
};

const AREA_SERVED = [
  "Sarojini Nagar",
  "RK Puram",
  "Netaji Nagar",
  "INA Colony",
  "Vasant Vihar",
  "Safdarjung Enclave",
].map((name) => ({ "@type": "Place", name }));

export function servicesScript(
  services: Array<{ name: string; description: string; type?: string }>,
) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": services.map((s) => ({
        "@type": "Service",
        "@id": `${ORIGIN}/services#${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: s.name,
        description: s.description,
        serviceType: s.type ?? s.name,
        category: "Dry Cleaning & Laundry",
        provider: PROVIDER,
        areaServed: AREA_SERVED,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "INR",
          url: `${ORIGIN}/services`,
        },
      })),
    }),
  };
}


export function breadcrumbScript(path: string, name: string) {
  const itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${ORIGIN}/`,
    },
  ];

  if (path !== "/") {
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      name: name,
      item: `${ORIGIN}${path}`,
    });
  }

  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    }),
  };
}
