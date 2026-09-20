import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  IndianRupee,
  ShoppingBag,
  Wallet,
  Gift,
  Users,
  Hourglass,
  ArrowRight,
} from "lucide-react";
import { adminBusinessOverview, type AdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/overview")({
  head: () => ({
    meta: [
      { title: "Business Overview — Linen & Leaf Staff" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOverviewPage,
});

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-slate-800">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

function AdminOverviewPage() {
  const load = useServerFn(adminBusinessOverview);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    load()
      .then((res) => active && setData(res))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [load]);

  if (error) {
    return (
      <p className="mt-10 text-center text-sm text-rose-600">
        Could not load the business overview. Please try again.
      </p>
    );
  }

  if (!data) {
    return (
      <div className="mt-16 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-800">Business overview</h1>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
        >
          Orders <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Total orders"
          value={String(data.totalOrders)}
          sub="All time"
        />
        <StatCard
          icon={<IndianRupee className="h-4 w-4" />}
          label="Revenue collected"
          value={inr(data.revenueCollected)}
          sub="Paid orders"
        />
        <StatCard
          icon={<Wallet className="h-4 w-4" />}
          label="Wallet balance out"
          value={inr(data.walletBalanceOutstanding)}
          sub="Prepaid value owed in service"
        />
        <StatCard
          icon={<Gift className="h-4 w-4" />}
          label="Cashback paid"
          value={inr(data.cashbackPaid)}
          sub="Confirmed wallet credits"
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Referral bonuses"
          value={inr(data.referralPaid)}
          sub={`${data.completedReferrals} completed referrals`}
        />
        <StatCard
          icon={<Hourglass className="h-4 w-4" />}
          label="Pending top-ups"
          value={String(data.pendingTopUps.count)}
          sub={
            data.pendingTopUps.count > 0
              ? `${inr(data.pendingTopUps.amount)} awaiting confirmation`
              : "Nothing waiting"
          }
        />
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Order pipeline
        </p>
        <div className="mt-4 space-y-3">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                {data.byStatus[key as keyof AdminOverview["byStatus"]] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {data.pendingTopUps.count > 0 ? (
        <Link
          to="/admin/wallet"
          className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
        >
          {data.pendingTopUps.count} top-up{data.pendingTopUps.count === 1 ? "" : "s"} need
          confirmation ({inr(data.pendingTopUps.amount)})
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
