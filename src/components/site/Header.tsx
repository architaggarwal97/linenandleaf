import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, ChevronDown } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { navLinks, site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const links = navLinks.filter((l) => l.to !== "/" && l.to !== "/contact");
  const { location } = useRouterState();
  const currentPath = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

  const isParentActive = (link: (typeof links)[number]) =>
    isActive(link.to) || (link.children?.some((c) => isActive(c.to)) ?? false);

  const openAbout = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutOpen(true);
  };

  const closeAbout = () => {
    aboutTimeoutRef.current = setTimeout(() => setAboutOpen(false), 150);
  };

  return (
    <nav
      className={`sticky top-0 bg-white/70 backdrop-blur-xl border-b z-50 transition-all duration-300 ${
        scrolled ? "shadow-[0_8px_30px_rgb(0,0,0,0.05)] border-slate-200/70" : "border-slate-100/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" aria-label={site.name} className="relative z-50">
            <Wordmark />
          </Link>

          <div className="hidden lg:flex space-x-7 items-center">
            {links.map((link) =>
              link.children ? (
                <div
                  key={link.to}
                  className="relative after:absolute after:top-full after:left-0 after:right-0 after:h-3 after:bg-transparent after:content-['']"
                  onMouseEnter={openAbout}
                  onMouseLeave={closeAbout}
                  onFocus={openAbout}
                  onBlur={closeAbout}
                >
                  <Link
                    to={link.to}
                    className={`relative inline-flex items-center gap-1 text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full ${
                      isParentActive(link)
                        ? "text-teal-700 font-semibold after:w-full"
                        : "text-slate-500 hover:text-teal-600"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        aboutOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ${
                      aboutOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-2 min-w-[10rem]">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isActive(child.to)
                              ? "text-teal-700 bg-teal-50 font-semibold"
                              : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
                  activeProps={{ className: "text-teal-700 font-semibold" }}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          <div className="lg:hidden flex items-center relative z-50">
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="text-slate-600 hover:text-teal-600 p-2 rounded-full transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              <div className="relative w-7 h-7 flex items-center justify-center">
                <span
                  className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-out ${
                    open ? "rotate-45 translate-y-0" : "-translate-y-2"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-out ${
                    open ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-out ${
                    open ? "-rotate-45 translate-y-0" : "translate-y-2"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!open}
        className={`lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-3xl border-b border-slate-100 shadow-2xl transition-all duration-300 ease-out origin-top ${
          open ? "opacity-100 translate-y-0 visible scale-100" : "opacity-0 -translate-y-4 invisible scale-[0.98]"
        }`}
      >
          <div className="flex flex-col px-6 py-8 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {links.map((link, i) => {
              const active = isParentActive(link);
              return (
                <div key={link.to} className="flex flex-col">
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-300 ${
                      active
                        ? "text-teal-700 bg-teal-50/80 font-semibold"
                        : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                    }`}
                    style={{
                      transitionDelay: open ? `${i * 35}ms` : "0ms",
                      opacity: open ? 1 : 0,
                      transform: open ? "translateY(0)" : "translateY(-8px)",
                    }}
                  >
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300 ${
                        active ? "bg-teal-600 opacity-100" : "bg-teal-400 opacity-0 group-hover:opacity-40"
                      }`}
                    />
                    {link.label}
                  </Link>
                  {link.children ? (
                    <div className="pl-8 pr-2 pt-1 pb-1 space-y-1">
                      {link.children.map((child, ci) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className={`group relative flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isActive(child.to)
                              ? "text-teal-700 bg-teal-50/60 font-semibold"
                              : "text-slate-500 hover:text-teal-700 hover:bg-slate-50/60"
                          }`}
                          style={{
                            transitionDelay: open ? `${(i + 1 + ci) * 35}ms` : "0ms",
                            opacity: open ? 1 : 0,
                            transform: open ? "translateY(0)" : "translateY(-8px)",
                          }}
                        >
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full transition-all duration-300 ${
                              isActive(child.to)
                                ? "bg-teal-500 opacity-100"
                                : "bg-teal-400 opacity-0 group-hover:opacity-40"
                            }`}
                          />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

          <div
            className="pt-4 space-y-3 transition-all duration-300"
            style={{
              transitionDelay: open ? `${links.length * 35}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-8px)",
            }}
          >
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-teal-800 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl font-semibold transition-colors"
            >
              Book a Pickup
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-green-500/20 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
