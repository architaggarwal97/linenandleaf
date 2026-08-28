import { Link } from "@tanstack/react-router";
import { MapPin, Clock, MessageCircle, Phone } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { navLinks, site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const localities = [
  "Sarojini Nagar",
  "Chanakyapuri",
  "RK Puram",
  "Netaji Nagar",
  "INA Colony",
  "Vasant Vihar",
  "Safdarjung Enclave",
];

export function Footer() {
  return (
    <footer className="bg-teal-950 text-teal-200/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-12">
          <div>
            <div className="mb-6">
              <Wordmark variant="dark" />
            </div>
            <p className="text-sm leading-relaxed font-light md:pr-8">
              Premium, eco-conscious garment care on modern commercial-grade dry-cleaning equipment, with
              doorstep pickup and delivery.
            </p>
          </div>

          <div>
            <h2 className="text-white font-medium mb-5 sm:mb-6 tracking-wide">Location &amp; Contact</h2>
            <address className="space-y-3 sm:space-y-4 text-sm font-light not-italic">
              <p className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-teal-500 shrink-0" />
                <span className="leading-relaxed">{site.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-teal-500 shrink-0" />
                <a className="hover:text-white transition-colors" href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp {site.whatsappNumber}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-500 shrink-0" />
                <a className="hover:text-white transition-colors" href={site.phoneHref}>
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-teal-500 shrink-0" />
                <span>Open Daily: 9:00 AM – 9:00 PM</span>
              </p>
            </address>
          </div>

          <div>
            <h2 className="text-white font-medium mb-5 sm:mb-6 tracking-wide">Explore</h2>
            <ul className="space-y-3 text-sm font-light">
              {navLinks.flatMap((link) =>
                link.children
                  ? [
                      { to: link.to, label: link.label },
                      ...link.children.map((c) => ({ to: c.to, label: `— ${c.label}` })),
                    ]
                  : [{ to: link.to, label: link.label }]
              ).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-medium mb-5 sm:mb-6 tracking-wide">Where We Serve</h2>
            <p className="text-sm font-light leading-relaxed mb-4">
              Pickup and delivery is currently available in Sarojini Nagar, Chanakyapuri and nearby localities:
            </p>
            <ul className="space-y-2 text-sm font-light">
              {localities.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-900/50 pt-8 mt-4 text-xs sm:text-sm text-center font-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Linen and Leaf Dry Cleaners. All rights reserved.</p>
          <p>Sarojini Nagar Market, New Delhi.</p>
        </div>
      </div>
    </footer>
  );
}
