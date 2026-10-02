import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades + lifts children into view once, when they scroll into the viewport.
 * Falls back to visible content when IntersectionObserver is unavailable, and
 * respects prefers-reduced-motion via the .ll-reveal CSS rules.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Content is visible in the server HTML so phones paint it immediately;
  // only elements still below the fold after hydration get hidden + revealed.
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;
    setPending(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPending(false);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`ll-reveal ${pending ? "is-pending" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
