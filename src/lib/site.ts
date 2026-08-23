export const site = {
  name: "Linen & Leaf Dry Cleaners",
  address: "1st Floor, Shop No. 108, Sarojini Nagar Market, New Delhi 110023",
  whatsappNumber: "+91 88004 46635",
  whatsappUrl: "https://wa.me/918800446635",
  phone: "+91 98186 61308",
  phoneHref: "tel:+919818661308",
  whatsappTelHref: "tel:+918800446635",
};

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services & Pricing" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/technology", label: "Technology & Process" },
  { to: "/service-area", label: "Service Area" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/wallet", label: "Wallet" },
  { to: "/contact", label: "Book a Pickup" },
] as const;
