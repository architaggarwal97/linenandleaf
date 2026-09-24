import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2, Search, Wallet, Smartphone, AlertTriangle } from "lucide-react";
import {
  adminListPayments,
  type AdminPaymentHistory,
  type AdminPayment,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Payment History — Linen & Leaf Staff" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPaymentsPage,
});

type Filter = "all" | "wallet" | "counter";

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function when(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function PaymentCard({ p }: { p: AdminPayment }) {
  const isWallet = p.method === "wallet";
  return (
    <li className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isWallet ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-800"
            }`}
          >
            {isWallet ? <Wallet className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
            {isWallet ? "Wallet debit" : "Paytm / cash"}
          </span>
          <p className="mt-2 truncate text-base font-semibold text-slate-800">
            {p.customerName ?? "Unknown customer"}
          </p>
          <p className="text-sm text-slate-500">+91 {p.phone}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-bold text-slate-800">{inr(p.amount)}</p>
          <p className="mt-0.5 text-xs text-slate-500">{when(p.paidAt)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {p.orderReference ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
            {p.orderReference}
          </span>
        ) : null}
        {p.orderStatus ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {STATUS_LABELS[p.orderStatus] ?? p.orderStatus}
          </span>
        ) : null}
        {p.orderAmount !== null && p.orderAmount !== p.amount ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Order total {inr(p.orderAmount)}
          </span>
        ) : null}
        {isWallet && !p.orderId ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5" /> No linked order
          </span>
        ) : null}
      </div>

      {isWallet && p.walletBefore !== null && p.walletAfter !== null ? (
        <p className="mt-2 text-xs text-slate-500">
          Wallet {inr(p.walletBefore)} → {inr(p.walletAfter)}
        </p>
      ) : null}
      {isWallet && !p.orderId && p.note ? (
        <p className="mt-1 text-xs text-slate-500">Note: {p.note}</p>
      ) : null}
    </li>
  );
}

function AdminPaymentsPage() {
  const load = useServerFn(adminListPayments);
  const [data, setData] = useState<AdminPaymentHistory | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const refresh = useCallback(
    async (term: string, method: Filter) => {
      setLoading(true);
      setError(false);
      try {
        setData(await load({ data: { search: term, method } }));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [load],
  );

  useEffect(() => {
    void refresh("", "all");
  }, [refresh]);

  const t = data?.totals;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-800">Payments</h1>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
        >
          Orders <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {t ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              From wallets
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-800">
              {inr(t.walletAmount)}
            </p>
            <p className="text-xs text-slate-500">{t.walletCount} payment{t.walletCount === 1 ? "" : "s"}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Paytm / cash
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-800">
              {inr(t.counterAmount)}
            </p>
            <p className="text-xs text-slate-500">{t.counterCount} payment{t.counterCount === 1 ? "" : "s"}</p>
          </div>
        </div>
      ) : null}

      {t && t.unlinkedWalletDebits > 0 ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {t.unlinkedWalletDebits} wallet debit{t.unlinkedWalletDebits === 1 ? "" : "s"} could not be
          matched to an order — usually older manual deductions made before orders were linked.
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void refresh(search, filter);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reference, name or phone"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-base outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-teal-700 px-5 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["all", "All"],
            ["wallet", "Wallet"],
            ["counter", "Paytm / cash"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setFilter(key);
              void refresh(search, key);
            }}
            className={`rounded-full px-3 py-2.5 text-sm font-semibold transition ${
              filter === key ? "bg-teal-700 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-center text-sm text-rose-600">
          Could not load payments. Please try again.
        </p>
      ) : null}

      {!data || loading ? (
        <div className="grid place-items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      ) : data.payments.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No payments found.</p>
      ) : (
        <ul className="space-y-3">
          {data.payments.map((p) => (
            <PaymentCard key={p.id} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
