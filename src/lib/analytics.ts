// Google Analytics 4 (gtag.js) — measurement ID is public by design (it ships
// in every page's HTML), so it lives here rather than in a server-only secret.
// If you ever create a new GA4 property/tag, update this one value.
export const GA_MEASUREMENT_ID = "G-XK7CV55PRK";

/**
 * Scripts rendered into <head> on every page.
 *
 * The gtag.js library itself is ~100 KB of third-party JavaScript, so instead
 * of loading it in <head> (where it competes with first paint), we queue the
 * standard dataLayer stub inline and inject the real script once the window
 * has finished loading. Events queued before the script arrives are replayed
 * by gtag when it loads, so no page views are lost — this is Google's
 * officially supported lazy-loading pattern.
 */
export function gaHeadScripts() {
  return [
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');window.addEventListener('load',function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(s);});`,
    },
  ];
}
