import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#fdfefd] pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {eyebrow ? (
          <p className="ll-rise text-xs font-bold uppercase tracking-[0.25em] text-teal-600 mb-4">{eyebrow}</p>
        ) : null}
        <h1 className="ll-rise ll-d1 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 leading-[1.15] max-w-3xl">
          {title}
        </h1>
        <p className="ll-rise ll-d2 mt-5 max-w-2xl text-base sm:text-lg text-slate-500 font-light leading-relaxed">
          {description}
        </p>
        {children ? <div className="ll-rise ll-d3 mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
