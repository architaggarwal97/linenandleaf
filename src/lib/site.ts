export const site = {
  name: "Linen & Leaf Dry Cleaners",
  address: "1st Floor, Shop No. 108, Sarojini Nagar Market, New Delhi 110023",
  whatsappNumber: "+91 88004 46635",
  whatsappUrl: "https://wa.me/918800446635",
  phone: "+91 98186 61308",
  phoneHref: "tel:+919818661308",
  whatsappTelHref: "tel:+918800446635",
  upiId: "9818661308@ptyes",
  upiPayeeName: "Linen & Leaf",
  upiQrUrl: "/__l5e/assets-v1/6bcf8b39-91e4-449b-8a78-3ac24391f12e/paytm-upi-qr.jpg",
};

/** Builds a UPI deep link that opens any UPI app (Paytm, GPay, PhonePe) prefilled. */
export function upiPaymentLink(amount?: number, note = "Linen & Leaf payment") {
  const params = new URLSearchParams({
    pa: site.upiId,
    pn: site.upiPayeeName,
    cu: "INR",
    tn: note,
  });
  if (amount && amount > 0) params.set("am", String(amount));
  return `upi://pay?${params.toString()}`;
}

export type NavLink = {
  to: string;
  label: string;
  children?: NavLink[];
};

export const navLinks: NavLink[] = [
  { to: "/", label: "Home" },
  {
    to: "/technology",
    label: "Technology & Process",
    children: [
      { to: "/services", label: "Services & Pricing" },
      { to: "/how-it-works", label: "How It Works" },
    ],
  },
  { to: "/service-area", label: "Service Area" },
  {
    to: "/about",
    label: "About",
    children: [
      { to: "/blog", label: "Blog" },
      { to: "/faq", label: "FAQ" },
      { to: "/refer", label: "Refer & Earn" },
      { to: "/corporate", label: "Corporate" },
    ],
  },
  { to: "/wallet", label: "Wallet" },
  { to: "/track", label: "Track Order" },
  { to: "/contact", label: "Book a Pickup" },
];
