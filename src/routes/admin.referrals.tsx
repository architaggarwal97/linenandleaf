import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Gift, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  adminCreditReferral,
  adminListReferrals,
  REFERRAL_CREDIT,
  type AdminReferral,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/referrals")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminReferralsPage,
});

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

function AdminReferralsPage() {
  const list = useServerFn(adminListReferrals);
  const credit = useServerFn(adminCreditReferral);

  const [rows, setRows] = useState<AdminReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await list());
    } catch (err) {
      console.error(err);
      setError("Could not load referrals.");
    } finally {
      setLoading(false);
    }
  }, [list]);

  useEffect(() => {
    void load();
  }, [load]);

  const onCredit = async (row: AdminReferral) => {
    if (busyId) return;
    setBusyId(row.id);
    setError(null);
    try {
      const updated = await credit({ data: { id: row.id } });
      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not credit that referral.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Referrals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Credit ₹{REFERRAL_CREDIT} to both wallets once the friend's first order is delivered.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-slate-200 p-3 text-slate-500"
          aria-label="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      {loading ? (
        <div className="mt-10 grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          No referred bookings yet. They appear here when a new customer names the person who
          referred them.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-slate-800">
                    {row.order_reference}
                  </p>
                  <p className="text-sm text-slate-600">{row.friend_name}</p>
                  <p className="text-sm text-slate-400">{row.friend_phone}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {STATUS_LABEL[row.status] ?? row.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Referred by <span className="font-medium text-slate-700">{row.referrer_phone}</span>
                {row.first_order ? "" : " · not their first order"}
              </p>

              {row.credited_at ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
                  <CheckCircle2 className="h-4 w-4" /> ₹{REFERRAL_CREDIT} credited to both wallets
                </p>
              ) : (
                <button
                  type="button"
                  disabled={!row.eligible || busyId === row.id}
                  onClick={() => void onCredit(row)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-4 text-base font-semibold text-white transition hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-500"
                >
                  <Gift className="h-4 w-4" />
                  {row.eligible
                    ? `Credit ₹${REFERRAL_CREDIT} to both`
                    : row.first_order
                      ? "Waiting on delivery"
                      : "Not a first order"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
