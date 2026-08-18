import { Leaf } from "lucide-react";

export function Wordmark({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  return (
    <div className="flex items-center gap-3 group">
      <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
        <div
          className={`absolute inset-0 ${isDark ? "bg-teal-800/80" : "bg-teal-100"} rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md -rotate-12 group-hover:rotate-45 transition-transform duration-700 ease-in-out`}
        />
        <div
          className={`absolute inset-0.5 bg-gradient-to-br ${
            isDark ? "from-teal-500 to-emerald-400 shadow-teal-900/50" : "from-teal-600 to-teal-400 shadow-teal-600/30"
          } rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-500`}
        >
          <Leaf className={`h-4 w-4 ${isDark ? "text-teal-950" : "text-white"} drop-shadow-sm`} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex flex-col mt-0.5">
        <span
          className={`font-extrabold text-xl sm:text-[1.35rem] tracking-tight leading-none ${
            isDark ? "text-white" : "text-slate-800"
          }`}
        >
          Linen<span className={`${isDark ? "text-teal-500" : "text-teal-600"} font-light italic mx-0.5`}>{"&"}</span>
          Leaf
        </span>
        <span
          className={`text-[0.5rem] sm:text-[0.55rem] uppercase tracking-[0.25em] leading-none mt-1 font-bold ml-0.5 ${
            isDark ? "text-teal-500" : "text-slate-400"
          }`}
        >
          Garment Care
        </span>
      </div>
    </div>
  );
}
