import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";
import {
  adminStats,
  adminSheetFeed,
  adminListPendingNotifications,
  adminMarkNotified,
  adminListPendingReviews,
  adminMarkReviewRequested,
  adminListAwaitingReferrals,
  adminCompleteReferral,
  adminListCreditFailures,
  adminRetryCreditFailure,
  adminDismissCreditFailure,
  type AdminStats,
  type AwaitingReferral,
  type CreditFailure,
  type PendingNotification,
  type PendingReview,
  type SheetFeed,
  type SheetFeedEntry,
} from "@/lib/admin.functions";


export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

function AdminOverview() {
  const loadStats = useServerFn(adminStats);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadFeed = useServerFn(adminSheetFeed);
  const [feed, setFeed] = useState<SheetFeed | null>(null);
  const [syncing, setSyncing] = useState(false);
  const loadNotifications = useServerFn(adminListPendingNotifications);
  const markNotified = useServerFn(adminMarkNotified);
  const [pending, setPending] = useState<PendingNotification[] | null>(null);
  const loadReviews = useServerFn(adminListPendingReviews);
  const markReviewRequested = useServerFn(adminMarkReviewRequested);
  const [reviews, setReviews] = useState<PendingReview[] | null>(null);
  const loadAwaiting = useServerFn(adminListAwaitingReferrals);
  const completeReferral = useServerFn(adminCompleteReferral);
  const [awaiting, setAwaiting] = useState<AwaitingReferral[] | null>(null);
  const loadFailures = useServerFn(adminListCreditFailures);
  const retryFailure = useServerFn(adminRetryCreditFailure);
  const dismissFailure = useServerFn(adminDismissCreditFailure);
  const [failures, setFailures] = useState<CreditFailure[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      setSyncing(true);
      try {
        const [nextStats, nextFeed, nextPending, nextAwaiting, nextFailures, nextReviews] = await Promise.all([
          loadStats(),
          loadFeed().catch(() => null),
          loadNotifications().catch(() => null),
          loadAwaiting().catch(() => null),
          loadFailures().catch(() => null),
          loadReviews().catch(() => null),
        ]);
        if (!active) return;
        setStats(nextStats);
        setError(null);
        if (nextFeed) setFeed(nextFeed);
        if (nextPending) setPending(nextPending);
        if (nextAwaiting) setAwaiting(nextAwaiting);
        if (nextFailures) setFailures(nextFailures);
        if (nextReviews) setReviews(nextReviews);
      } catch {
        if (active && !stats) setError("Could not load the dashboard.");
      } finally {
        if (active) setSyncing(false);
      }
    };

    void refresh();
    const timer = setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadStats, loadFeed]);

  const notify = async (n: PendingNotification) => {
    window.open(n.whatsappUrl, "_blank", "noopener");
    setPending((prev) => (prev ?? []).filter((p) => p.id !== n.id));
    try {
      await markNotified({ data: { id: n.id } });
    } catch {
      setPending(await loadNotifications().catch(() => null));
    }
  };

  const askReview = async (r: PendingReview) => {
    window.open(r.whatsappUrl, "_blank", "noopener");
    setReviews((prev) => (prev ?? []).filter((p) => p.id !== r.id));
    try {
      await markReviewRequested({ data: { id: r.id } });
    } catch {
      setReviews(await loadReviews().catch(() => null));
    }
  };

  const creditReferral = async (r: AwaitingReferral) => {
    setBusyId(r.id);
    try {
      await completeReferral({ data: { id: r.id } });
    } catch {
      /* failure is recorded server-side and shows in the problems card */
    } finally {
      setBusyId(null);
      setAwaiting(await loadAwaiting().catch(() => null));
      setFailures(await loadFailures().catch(() => null));
      setPending(await loadNotifications().catch(() => null));
    }
  };

  const retry = async (f: CreditFailure) => {
    setBusyId(f.id);
    try {
      await retryFailure({ data: { id: f.id } });
    } catch {
      /* stays listed */
    } finally {
      setBusyId(null);
      setFailures(await loadFailures().catch(() => null));
      setPending(await loadNotifications().catch(() => null));
    }
  };

  const dismiss = async (f: CreditFailure) => {
    setFailures((prev) => (prev ?? []).filter((p) => p.id !== f.id));
    await dismissFailure({ data: { id: f.id } }).catch(() => null);
  };


  if (error) return <p className="mt-8 text-sm text-rose-600">{error}</p>;

  if (!stats) {
    return (
      <div className="mt-16 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  const cards = [
    { label: "Active orders", value: stats.active },
    { label: "New today", value: stats.today },
    { label: "Unpaid", value: stats.unpaid },
    { label: "All orders", value: stats.total },
  ];

  return (
    <div className="mt-5">
      <h1 className="font-display text-2xl font-bold text-slate-800">Overview</h1>

      {failures && failures.length > 0 ? (
        <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <p className="text-sm font-semibold text-rose-800">Wallet credits that failed</p>
          </div>
          <ul className="mt-3 space-y-2">
            {failures.map((f) => (
              <li key={f.id} className="rounded-2xl bg-white px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  {f.kind === "referral" ? "Referral bonus" : "Cashback"}
                  {f.amount ? ` · ₹${f.amount.toLocaleString("en-IN")}` : ""}
                  {f.order_reference ? ` · ${f.order_reference}` : ""}
                </p>
                <p className="mt-0.5 break-words text-[11px] text-rose-700">{f.message}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === f.id}
                    onClick={() => void retry(f)}
                    className="rounded-full bg-teal-700 px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                  >
                    {busyId === f.id ? "Trying…" : "Try again"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void dismiss(f)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600"
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {awaiting && awaiting.length > 0 ? (
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <p className="text-sm font-semibold text-slate-800">Referrals awaiting confirmation</p>
          <ul className="mt-3 space-y-2">
            {awaiting.map((r) => (
              <li key={r.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  +91 {r.referring_phone} → +91 {r.referred_phone}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  First order delivered{r.order_reference ? ` · ${r.order_reference}` : ""} — credit
                  ₹100 to both?
                </p>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => void creditReferral(r)}
                  className="mt-2 rounded-full bg-teal-700 px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                >
                  {busyId === r.id ? "Crediting…" : "Credit ₹100 to both"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}



      <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800">Pending notifications</p>
          {pending && pending.length > 0 ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              {pending.length} waiting
            </span>
          ) : null}
        </div>

        {!pending ? (
          <p className="mt-3 text-sm text-slate-500">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Everyone has been told about their cashback and referral bonuses.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {pending.map((n) => (
              <li key={n.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">+91 {n.phone}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      ₹{n.amount.toLocaleString("en-IN")} ·{" "}
                      {n.kind === "referral" ? "Referral bonus" : "Cashback"} · balance ₹
                      {n.balance.toLocaleString("en-IN")}
                    </p>
                    {n.note ? (
                      <p className="mt-0.5 text-[11px] text-slate-400">{n.note}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void notify(n)}
                    className="shrink-0 rounded-full bg-green-500 px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    Notify via WhatsApp
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>


      {reviews && reviews.length > 0 ? (
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">Review requests</p>
            <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
              {reviews.length} to ask
            </span>
          </div>
          <Link
            to="/admin/testimonials"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-700"
          >
            View saved testimonials <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <ul className="mt-3 space-y-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{r.customerName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      +91 {r.phone} · {r.orderReference} · delivered
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void askReview(r)}
                    className="shrink-0 rounded-full bg-teal-700 px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    Ask for a review
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          >
            <p className="font-display text-3xl font-bold text-teal-800">{c.value}</p>
            <p className="mt-1 text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-slate-800">Orders by stage</p>
        <ul className="mt-3 space-y-2">
          {Object.entries(stats.byStatus).map(([key, count]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{STATUS_LABELS[key] ?? key}</span>
              <span className="font-semibold text-slate-800">{count}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/admin/orders"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
        >
          Manage orders <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-slate-800">Wallet credits</p>
        <p className="mt-2 font-display text-3xl font-bold text-teal-800">
          ₹{stats.walletBalance.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          outstanding across {stats.walletCustomers} customer
          {stats.walletCustomers === 1 ? "" : "s"}
        </p>
        <Link
          to="/admin/wallet"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
        >
          Manage wallet credits <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800">Live sheet activity</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <RefreshCw
              className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-teal-600" : ""}`}
            />
            {feed
              ? `updated ${new Date(feed.fetchedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "syncing"}
          </span>
        </div>

        {!feed ? (
          <p className="mt-3 text-sm text-slate-500">Loading recent activity…</p>
        ) : !feed.available ? (
          <p className="mt-3 text-sm text-slate-500">
            No sheet activity yet. New bookings, top-ups and referrals will appear here
            automatically.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            <FeedGroup label="New bookings" entries={feed.orders} details />
            <FeedGroup label="Top-up requests" entries={feed.topUps} />
            <FeedGroup label="Referrals" entries={feed.referrals} />
          </div>
        )}
      </div>
    </div>
  );
}

function FeedGroup({
  label,
  entries,
  details = false,
}: {
  label: string;
  entries: SheetFeedEntry[];
  details?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">Nothing yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {entries.map((e) => (
            <li key={e.key} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">{e.title}</p>
              {e.subtitle ? (
                <p className="mt-0.5 text-xs text-slate-500">{e.subtitle}</p>
              ) : null}
              {e.meta ? (
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {new Date(e.meta).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : null}
              {details ? (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {e.status ? (
                    <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
                      {STATUS_LABELS[e.status] ?? e.status}
                    </span>
                  ) : null}
                  {typeof e.amount === "number" ? (
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      ₹{e.amount.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                  {typeof e.cashback === "number" && e.cashback > 0 ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                      Cashback ₹{e.cashback.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                  {e.status ? (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        e.paid ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {e.paid ? "Paid" : "Unpaid"}
                    </span>
                  ) : null}
                  {e.whatsappUrl ? (
                    <a
                      href={e.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-green-500 px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      Send confirmation
                    </a>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
