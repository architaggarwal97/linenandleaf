import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Lock,
  Search,
  Wallet,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import {
  adminSessionStatus,
  adminLogin,
  adminListCustomers,
  adminCustomerDetail,
  type AdminCustomer,
  type AdminCustomerDetail,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard — Linen & Leaf Staff" },
      {
        name: "description",
        content: "Staff-only view of Linen & Leaf customers, booking history and wallet balances.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Customer Dashboard — Linen & Leaf Staff" },
      {
        property: "og:description",
        content: "Staff-only view of Linen & Leaf customers, booking history and wallet balances.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CustomerDashboard,
});

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function PinGate({ onUnlocked }: { onUnlocked: () => void }) {
  const login = useServerFn(adminLogin);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        const res = await login({ data: { pin } });
        if (res.ok) onUnlocked();
        else if (res.reason === "unconfigured") setError("Staff PIN is not set up yet.");
        else setError("Incorrect PIN.");
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy, login, onUnlocked, pin],
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-center font-display text-xl font-bold text-slate-800">Staff access</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Enter the shared staff PIN to open the customer dashboard.
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-lg tracking-[0.3em] outline-none focus:border-teal-500"
        />
        {error ? <p className="mt-3 text-center text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-2xl bg-teal-700 px-4 py-4 text-base font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function CustomerCard({ customer }: { customer: AdminCustomer }) {
  const loadDetail = useServerFn(adminCustomerDetail);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async () => {
    const next = !open;
    setOpen(next);
    if (next && !detail && !loading) {
      setLoading(true);
      try {
        setDetail(await loadDetail({ data: { phone: customer.phone } }));
      } catch {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    }
  }, [customer.phone, detail, loadDetail, loading, open]);

  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <button type="button" onClick={toggle} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-800">{customer.name}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                customer.active ? "bg-teal-50 text-teal-800" : "bg-slate-100 text-slate-500"
              }`}
            >
              {customer.active ? "Active" : "Dormant"}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">+91 {customer.phone}</p>
          <p className="mt-2 text-xs text-slate-500">
            {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"} ·{" "}
            {inr(customer.totalSpent)} collected
            {customer.lastOrderAt ? ` · last ${fmtDate(customer.lastOrderAt)}` : ""}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
            <Wallet className="h-4 w-4" />
            {inr(customer.walletBalance)}
          </p>
          <p className="mt-2 flex justify-end text-slate-400">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </p>
        </div>
      </button>

      {open ? (
        <div className="mt-4 border-t border-slate-100 pt-4">
          {loading ? (
            <div className="grid place-items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
            </div>
          ) : detail && detail.orders.length > 0 ? (
            <ul className="space-y-2">
              {detail.orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{order.order_reference}</p>
                    <p className="text-xs text-slate-500">
                      {fmtDate(order.created_at)}
                      {order.order_amount !== null ? ` · ${inr(order.order_amount)}` : ""}
                      {order.cashback_amount ? ` · ${inr(order.cashback_amount)} cashback` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <p
                      className={`mt-1 text-[11px] font-semibold ${
                        order.paid ? "text-teal-700" : "text-amber-700"
                      }`}
                    >
                      {order.paid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No bookings yet for this customer.</p>
          )}

          <div className="mt-3 flex gap-2">
            <a
              href={`https://wa.me/91${customer.phone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-3 py-2 text-xs font-semibold text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={`tel:+91${customer.phone}`}
              className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Call
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CustomerDashboard() {
  const checkSession = useServerFn(adminSessionStatus);
  const listCustomers = useServerFn(adminListCustomers);

  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    checkSession()
      .then((res) => {
        if (!active) return;
        setAuthed(res.authed);
        setReady(true);
      })
      .catch(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [checkSession]);

  useEffect(() => {
    if (!authed) return;
    let active = true;
    const timer = setTimeout(() => {
      listCustomers({ data: { search } })
        .then((res) => active && (setCustomers(res), setError(false)))
        .catch(() => active && setError(true));
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [authed, listCustomers, search]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!authed) return <PinGate onUnlocked={() => setAuthed(true)} />;

  const activeCount = (customers ?? []).filter((c) => c.active).length;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> Staff dashboard
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-slate-800">Customers</h1>
      <p className="mt-1 text-sm text-slate-500">
        {customers
          ? `${customers.length} customer${customers.length === 1 ? "" : "s"} · ${activeCount} active in the last 60 days`
          : "Loading customers…"}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone or reference"
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>

      <div className="mt-4 space-y-3">
        {error ? (
          <p className="text-sm text-rose-600">Could not load customers. Please try again.</p>
        ) : !customers ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <ShoppingBag className="mx-auto h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No customers match that search.</p>
          </div>
        ) : (
          customers.map((c) => <CustomerCard key={c.phone} customer={c} />)
        )}
      </div>
    </div>
  );
}
