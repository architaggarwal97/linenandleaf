import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw } from "lucide-react";
import {
  adminCancelTopUp,
  adminConfirmTopUp,
  adminListLoginCodes,
  adminListPendingTopUps,
  type LoginCodeRequest,
  type PendingTopUp,
} from "@/lib/admin.functions";

export function AdminTopUps() {
  const listPending = useServerFn(adminListPendingTopUps);
  const listCodes = useServerFn(adminListLoginCodes);
  const confirm = useServerFn(adminConfirmTopUp);
  const cancel = useServerFn(adminCancelTopUp);

  const [pending, setPending] = useState<PendingTopUp[]>([]);
  const [codes, setCodes] = useState<LoginCodeRequest[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([listPending(), listCodes()]);
      setPending(p);
      setCodes(c);
    } catch (err) {
      console.error(err);
      setError("Could not load top-up requests.");
    } finally {
      setLoading(false);
    }
  }, [listCodes, listPending]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleConfirm = async (row: PendingTopUp) => {
    const raw = amounts[row.id] ?? String(row.amount);
    const amount = Number(raw);
    if (!amount || amount <= 0) return;
    setBusyId(row.id);
    setError(null);
    try {
      await confirm({ data: { id: row.id, amount } });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm that top-up.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (row: PendingTopUp) => {
    setBusyId(row.id);
    try {
      await cancel({ data: { id: row.id } });
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Sign-in codes to send</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500"
            aria-label="Refresh"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
        </div>
        {codes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No one is waiting for a code.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {codes.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">+91 {c.phone}</p>
                  <p className="text-xs text-slate-400">
                    expires {new Date(c.expires_at).toLocaleTimeString("en-IN")}
                  </p>
                </div>
                <a
                  href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(
                    `Your Linen & Leaf wallet sign-in code is ${c.code}. It expires in 10 minutes.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green-500 px-3 py-2 text-sm font-bold tracking-[0.2em] text-white"
                >
                  {c.code}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-slate-800">Pending top-ups</p>
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No top-up requests waiting.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {pending.map((row) => {
              const value = amounts[row.id] ?? String(row.amount);
              const received = Number(value) || 0;
              return (
                <li key={row.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-800">+91 {row.phone}</p>
                      <p className="text-xs text-slate-400">
                        asked for ₹{row.amount.toLocaleString("en-IN")} ·{" "}
                        {new Date(row.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                      ₹{row.balance.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={value}
                      onChange={(e) =>
                        setAmounts({ ...amounts, [row.id]: e.target.value.replace(/\D/g, "") })
                      }
                      inputMode="numeric"
                      placeholder="Amount received"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-teal-500"
                    />
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void handleConfirm(row)}
                      className="shrink-0 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {busyId === row.id ? "…" : "Confirm"}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Credits ₹{Math.round(received * 1.1).toLocaleString("en-IN")} (incl. 10%
                      bonus)
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleCancel(row)}
                      className="text-xs font-medium text-rose-600"
                    >
                      Cancel request
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
