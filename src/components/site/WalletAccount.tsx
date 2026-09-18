import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, LogOut, RefreshCw, Wallet } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { openWhatsApp } from "@/lib/whatsapp";
import type { WalletState } from "@/lib/wallet.functions";

type Props = {
  wallet: {
    state: WalletState;
    ready: boolean;
    loggedIn: boolean;
    sendCode: (phone: string) => Promise<void>;
    verify: (phone: string, code: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
  };
};

function money(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

const TYPE_LABEL: Record<string, string> = {
  topup: "Top-up",
  deduction: "Paid from wallet",
  cashback: "Cashback earned",
  referral: "Referral bonus",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

export function WalletAccount({ wallet }: Props) {
  const { state, ready, loggedIn } = wallet;
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPhone = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await wallet.sendCode(phone);
      setStep("code");
      openWhatsApp(
        `Hi Linen & Leaf! Please send me my wallet sign-in code for ${phone}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start sign-in.");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const ok = await wallet.verify(phone, code);
      if (!ok) setError("That code isn't right or has expired. Request a new one.");
      else setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <div className="mb-8 grid h-40 place-items-center rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <Reveal className="mb-8 rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
            <Wallet className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Check your wallet balance
            </h2>
            <p className="text-sm font-light text-slate-500">
              Sign in with your WhatsApp number — we&apos;ll send you a 6-digit code.
            </p>
          </div>
        </div>

        {step === "phone" ? (
          <form onSubmit={submitPhone} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="WhatsApp number"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="ll-press shrink-0 rounded-2xl bg-teal-800 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="6-digit code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base tracking-[0.3em] text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="ll-press shrink-0 rounded-2xl bg-teal-800 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {busy ? "Checking…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError(null);
              }}
              className="shrink-0 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-medium text-slate-600"
            >
              Change number
            </button>
          </form>
        )}

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        <p className="mt-4 text-xs font-light text-slate-400">
          We send the code to you on WhatsApp. It expires in 10 minutes.
        </p>
      </Reveal>
    );
  }

  return (
    <Reveal className="mb-8 rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Wallet balance</p>
          <p className="font-display text-4xl font-bold text-teal-800 tabular-nums">
            {money(state.balance)}
          </p>
          <p className="mt-1 text-sm font-light text-slate-500">
            Signed in as +91 {state.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void wallet.refresh()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => void wallet.signOut()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-sm font-semibold text-slate-800">Transaction history</p>
        {state.transactions.length === 0 ? (
          <p className="mt-3 text-sm font-light text-slate-500">
            Nothing here yet. Top up below to get started.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {state.transactions.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    {TYPE_LABEL[t.type]}
                    {t.status === "pending" ? " · awaiting confirmation" : ""}
                    {t.status === "cancelled" ? " · cancelled" : ""}
                  </p>
                  <p className="text-xs font-light text-slate-400">
                    {new Date(t.created_at).toLocaleString("en-IN")}
                    {t.note ? ` · ${t.note}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    t.status !== "confirmed"
                      ? "text-slate-400"
                      : t.type === "deduction"
                        ? "text-rose-600"
                        : "text-emerald-700"
                  }`}
                >
                  {t.type === "deduction" ? "−" : "+"}
                  {money(t.amount + (t.type === "topup" ? t.bonus : 0))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {state.orders.length > 0 ? (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">Your orders</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {state.orders.map((o) => (
              <li key={o.id}>
                <Link
                  to="/track"
                  search={{ ref: o.order_reference, tel: `+91${state.phone ?? ""}` }}
                  className="group flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 transition-colors group-hover:text-teal-700">
                      {o.order_reference}
                    </p>
                    <p className="text-xs font-light text-slate-400">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {o.order_amount !== null ? (
                      <span className="text-sm font-semibold tabular-nums text-slate-600">
                        ₹{Math.round(o.order_amount).toLocaleString("en-IN")}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-light text-slate-400">
            Tap an order to see its full status on the tracking page.
          </p>
        </div>
      ) : null}

      {state.referrals.length > 0 ? (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">Your referrals</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {state.referrals.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    {r.role === "referrer"
                      ? `You referred +91 ${r.other_phone}`
                      : `Referred by +91 ${r.other_phone}`}
                  </p>
                  <p className="text-xs font-light text-slate-400">
                    {r.status === "completed"
                      ? `₹100 credited on ${new Date(
                          r.completed_at ?? r.created_at,
                        ).toLocaleDateString("en-IN")}`
                      : "Pending — credited after the first order is delivered"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    r.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {r.status === "completed" ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Reveal>
  );
}
