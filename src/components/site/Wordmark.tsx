import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  /** Visual size of the wordmark */
  size?: "sm" | "md" | "lg";
  /** Show the small "Dry Cleaners" descender line */
  withTagline?: boolean;
};

const sizes = {
  sm: "text-lg md:text-xl",
  md: "text-2xl md:text-[1.75rem]",
  lg: "text-3xl md:text-4xl",
};

export function Wordmark({ className, size = "md", withTagline = false }: WordmarkProps) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-display font-medium tracking-tight text-foreground",
          sizes[size],
        )}
      >
        Linen{" "}
        <span className="font-display italic font-normal text-brass" aria-hidden="true">
          &amp;
        </span>
        <span className="sr-only">and</span> Leaf
      </span>
      {withTagline ? (
        <span className="mt-1.5 text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground">
          Dry Cleaners
        </span>
      ) : null}
    </span>
  );
}
