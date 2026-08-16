const ORIGIN = "https://linenandleaf.lovable.app";

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
