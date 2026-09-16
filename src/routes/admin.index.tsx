import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ArrowRight } from "lucide-react";
import { adminStats, type AdminStats } from "@/lib/admin.functions";

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

  useEffect(() => {
    let active = true;
    loadStats()
      .then((res) => active && setStats(res))
      .catch(() => active && setError("Could not load the dashboard."));
    return () => {
      active = false;
    };
  }, [loadStats]);

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
    </div>
  );
}
