// Google Analytics 4 (gtag.js) — measurement ID is public by design (it ships
// in every page's HTML), so it lives here rather than in a server-only secret.
// If you ever create a new GA4 property/tag, update this one value.
export const GA_MEASUREMENT_ID = "G-XK7CV55PRK";

/** Scripts rendered into <head> on every page, exactly as Google's snippet specifies. */
export function gaHeadScripts() {
  return [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
      async: true,
    },
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
    },
  ];
}
