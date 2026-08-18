import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { navLinks, site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = navLinks.filter((l) => l.to !== "/" && l.to !== "/contact");

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" aria-label={site.name} onClick={() => setOpen(false)} className="relative z-50">
            <Wordmark />
          </Link>

          <div className="hidden lg:flex space-x-7 items-center">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-teal-600 after:transition-all after:duration-300 hover:after:w-full"
                activeProps={{ className: "text-teal-700 font-semibold" }}
              >
                {link.label}
              </Link>
            ))}
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
              className="text-slate-600 hover:text-teal-600 p-2 rounded-full transition-colors hover:bg-slate-100"
            >
              {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="flex flex-col px-6 py-8 space-y-6 bg-white/95 backdrop-blur-3xl">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-slate-700 transition-colors hover:text-teal-600"
              activeProps={{ className: "text-teal-700 font-semibold" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="w-full text-center bg-teal-800 text-white px-6 py-4 rounded-2xl font-semibold"
          >
            Book a Pickup
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </nav>
  );
}
