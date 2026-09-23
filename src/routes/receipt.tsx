import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Download, ReceiptText } from "lucide-react";
import { orderReceipt, type PaymentReceipt } from "@/lib/orders.functions";
import { PageHero } from "@/components/site/PageHero";
import { site } from "@/lib/site";

const TITLE = "Payment Receipt — Linen & Leaf Dry Cleaners";
const DESCRIPTION =
  "Download a payment receipt for your Linen & Leaf order, with amount, payment method and timestamp.";

export const Route = createFileRoute("/receipt")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"].trim().slice(0, 20) : undefined,
    tel: typeof search["tel"] === "string" ? search["tel"].trim().slice(0, 30) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReceiptPage,
});

function formatPrefillPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return value;
}

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function ReceiptPage() {
  const search = Route.useSearch();
  const load = useServerFn(orderReceipt);
  const [phone, setPhone] = useState(() => formatPrefillPhone(search.tel ?? ""));
  const [reference, setReference] = useState((search.ref ?? "").toUpperCase());
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (tel: string, ref: string) => {
    if (!tel.trim() || !ref.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setReceipt(await load({ data: { whatsapp_number: tel, order_reference: ref } }));
    } catch (err) {
      console.error(err);
      setError("We couldn't load that receipt just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.ref && search.tel) {
      void run(formatPrefillPhone(search.tel), search.ref.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(phone, reference);
  };

  return (
    <>
      <div className="print:hidden">
        <PageHero
          eyebrow="Receipts"
          title="Your payment receipt"
          description="Enter your WhatsApp number and order reference to view and download the receipt for a paid order."
        />
      </div>

      <section className="py-16 md:py-24 bg-[#fafafa] print:bg-white print:py-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-10 print:shadow-none print:rounded-none print:p-0">
            <form onSubmit={submit} className="space-y-5 print:hidden">
              <div>
                <label
                  htmlFor="receipt-phone"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  WhatsApp number
                </label>
                <input
                  id="receipt-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700"
                />
              </div>
              <div>
                <label
                  htmlFor="receipt-ref"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Order reference
                </label>
                <input
                  id="receipt-ref"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="LL-0001"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 shadow-lg shadow-teal-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> Loading…
                  </>
                ) : (
                  <>
                    <ReceiptText className="h-5 w-5 shrink-0" /> Show my receipt
                  </>
                )}
              </button>
              {error ? (
                <p className="text-sm text-amber-700 bg-amber-50 rounded-2xl px-4 py-3">{error}</p>
              ) : null}
            </form>

            {receipt && !receipt.found ? (
              <p className="mt-8 text-sm text-slate-600 bg-slate-50 rounded-2xl px-4 py-4 print:hidden">
                We couldn't find a paid order with those details. Double-check the reference and
                number — a receipt only appears once payment has been recorded. Still stuck?{" "}
                <a
                  href={site.whatsappUrl}
                  className="text-teal-700 underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message us on WhatsApp
                </a>
                .
              </p>
            ) : null}

            {receipt?.found ? (
              <div className="mt-10 print:mt-0">
                <div className="border border-slate-200 rounded-3xl p-6 sm:p-8 print:border-0 print:p-0">
                  <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <p className="font-display text-2xl font-bold tracking-wide text-slate-900">
                        Linen &amp; Leaf
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{site.address}</p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
                      Receipt
                    </p>
                  </div>

                  <dl className="divide-y divide-slate-100">
                    <Row label="Order reference" value={receipt.orderReference ?? "—"} strong />
                    <Row label="Customer" value={receipt.customerName ?? "—"} />
                    <Row label="Amount paid" value={money(receipt.amount ?? 0)} strong />
                    <Row
                      label="Payment method"
                      value={receipt.method === "wallet" ? "Linen & Leaf wallet" : "Paytm / cash"}
                    />
                    <Row
                      label="Paid on"
                      value={
                        receipt.paidAt
                          ? new Date(receipt.paidAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                              timeZone: "Asia/Kolkata",
                            })
                          : "—"
                      }
                    />
                    {receipt.method === "wallet" && receipt.walletAfter !== null ? (
                      <>
                        <Row
                          label="Wallet balance before"
                          value={money(receipt.walletBefore ?? 0)}
                        />
                        <Row label="Wallet balance after" value={money(receipt.walletAfter ?? 0)} />
                      </>
                    ) : null}
                  </dl>

                  <p className="mt-6 text-xs text-slate-500">
                    Thank you for choosing Linen &amp; Leaf. Questions about this payment? Message
                    us on WhatsApp at {site.whatsappNumber}.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex flex-1 items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 shadow-lg shadow-teal-600/20"
                  >
                    <Download className="h-5 w-5 shrink-0" /> Download receipt
                  </button>
                  <Link
                    to="/track"
                    search={{ ref: receipt.orderReference, tel: `+91${phone.replace(/\D/g, "").slice(-10)}` }}
                    className="flex flex-1 items-center justify-center gap-2 border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl text-base font-medium"
                  >
                    Track this order
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd
        className={`text-right text-sm ${strong ? "font-semibold text-slate-900" : "text-slate-700"}`}
      >
        {value}
      </dd>
    </div>
  );
}
