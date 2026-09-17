import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, RefreshCw, Check, IndianRupee, Camera } from "lucide-react";
import {
  ADMIN_STATUSES,
  adminAdvanceStatus,
  adminCompleteReferral,
  adminListOrders,
  adminPendingReferral,
  adminSetOrderAmount,
  adminSetPaid,
  adminUploadOrderPhoto,
  type AdminOrder,
  type AdminStatus,
  type PendingReferral,
} from "@/lib/admin.functions";
import { compressImage } from "@/lib/image";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const LABELS: Record<AdminStatus, string> = {
  requested: "Requested",
  picked_up: "Picked Up",
  in_process: "In Process",
  ready: "Ready",
  delivered: "Delivered",
};

function nextLabel(status: AdminStatus): string | null {
  const i = ADMIN_STATUSES.indexOf(status);
  const next = ADMIN_STATUSES[i + 1];
  return next ? LABELS[next] : null;
}

function AdminOrdersPage() {
  const listOrders = useServerFn(adminListOrders);
  const advance = useServerFn(adminAdvanceStatus);
  const setPaid = useServerFn(adminSetPaid);
  const uploadPhoto = useServerFn(adminUploadOrderPhoto);
  const saveAmount = useServerFn(adminSetOrderAmount);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState<string | null>(null);
  const [amountPrompt, setAmountPrompt] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState("");

  const refresh = useCallback(
    async (term: string) => {
      setLoading(true);
      setError(null);
      try {
        setOrders(await listOrders({ data: { search: term } }));
      } catch (err) {
        console.error(err);
        setError("Could not load orders. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [listOrders],
  );

  useEffect(() => {
    void refresh("");
  }, [refresh]);

  const applyRow = (row: AdminOrder) =>
    setOrders((prev) => prev.map((o) => (o.id === row.id ? row : o)));

  const nextStatus = (order: AdminOrder): AdminStatus | undefined =>
    ADMIN_STATUSES[ADMIN_STATUSES.indexOf(order.status) + 1];

  const onAdvance = async (order: AdminOrder) => {
    if (rowBusy || order.status === "delivered") return;
    const next = nextStatus(order);
    if ((next === "ready" || next === "delivered") && order.order_amount === null) {
      setAmountPrompt(order.id);
      setAmountValue("");
      return;
    }
    setRowBusy(order.id);
    try {
      applyRow(await advance({ data: { id: order.id } }));
    } catch (err) {
      console.error(err);
      setError("Could not update that order.");
    } finally {
      setRowBusy(null);
    }
  };

  const onSaveAmount = async (order: AdminOrder) => {
    const amount = Number(amountValue);
    if (!amount || amount <= 0 || rowBusy) return;
    setRowBusy(order.id);
    setError(null);
    try {
      const saved = await saveAmount({ data: { id: order.id, amount } });
      const next = nextStatus(saved);
      applyRow(
        next === "ready" || next === "delivered"
          ? await advance({ data: { id: saved.id } })
          : saved,
      );
      setAmountPrompt(null);
      setAmountValue("");
    } catch (err) {
      console.error(err);
      setError("Could not save that amount.");
    } finally {
      setRowBusy(null);
    }
  };

  const onTogglePaid = async (order: AdminOrder) => {
    if (rowBusy) return;
    setRowBusy(order.id);
    try {
      applyRow(await setPaid({ data: { id: order.id, paid: !order.paid } }));
    } catch (err) {
      console.error(err);
      setError("Could not update payment status.");
    } finally {
      setRowBusy(null);
    }
  };

  const onPickPhoto = async (
    order: AdminOrder,
    kind: "pickup" | "delivery",
    file: File | undefined,
  ) => {
    if (!file || photoBusy) return;
    setPhotoBusy(`${order.id}-${kind}`);
    setError(null);
    try {
      const { dataUrl, contentType } = await compressImage(file);
      applyRow(await uploadPhoto({ data: { id: order.id, kind, dataUrl, contentType } }));
    } catch (err) {
      console.error(err);
      setError("Could not upload that photo. Try again.");
    } finally {
      setPhotoBusy(null);
    }
  };

  return (
    <div className="mt-5">
      <h1 className="font-display text-2xl font-bold text-slate-800">Orders</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void refresh(search);
        }}
        className="mt-4 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reference, phone or name"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-11 pr-4 text-base shadow-sm outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          className="grid h-[56px] w-[56px] place-items-center rounded-2xl bg-teal-700 text-white"
          aria-label="Refresh orders"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-5 space-y-4">
        {!loading && orders.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            No orders found.
          </p>
        ) : null}

        {orders.map((order) => {
          const busy = rowBusy === order.id;
          const next = nextLabel(order.status);
          return (
            <article
              key={order.id}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-teal-700">
                    {order.order_reference}
                  </p>
                  <p className="truncate text-base font-semibold text-slate-800">
                    {order.customer_name}
                  </p>
                  <a
                    href={`tel:${order.whatsapp_number}`}
                    className="text-sm text-slate-500 underline-offset-2 hover:underline"
                  >
                    {order.whatsapp_number}
                  </a>
                </div>
                <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {LABELS[order.status]}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {new Date(order.created_at).toLocaleString("en-IN")}
                {order.preferred_window ? ` · ${order.preferred_window}` : ""}
                {order.order_amount !== null
                  ? ` · ₹${Math.round(order.order_amount).toLocaleString("en-IN")}`
                  : ""}
                {order.cashback_amount ? ` · cashback ₹${order.cashback_amount}` : ""}
              </p>

              {amountPrompt === order.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void onSaveAmount(order);
                  }}
                  className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-3"
                >
                  <label className="text-sm font-medium text-teal-900">
                    Final order amount (₹)
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={amountValue}
                      onChange={(e) => setAmountValue(e.target.value.replace(/\D/g, ""))}
                      inputMode="numeric"
                      autoFocus
                      placeholder="e.g. 1200"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={busy || !Number(amountValue)}
                      className="h-14 shrink-0 rounded-2xl bg-teal-700 px-5 text-base font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAmountPrompt(null)}
                    className="mt-2 text-sm text-slate-500 underline-offset-2 hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              ) : null}


              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={busy || !next}
                  onClick={() => void onAdvance(order)}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-teal-700 text-base font-semibold text-white transition active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {busy ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : next ? (
                    <>Mark {next}</>
                  ) : (
                    <>
                      <Check className="h-5 w-5" /> Completed
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onTogglePaid(order)}
                  className={`flex h-14 items-center justify-center gap-2 rounded-2xl text-base font-semibold transition active:scale-[0.98] ${
                    order.paid
                      ? "bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 text-slate-600"
                  }`}
                >
                  <IndianRupee className="h-4 w-4" />
                  {order.paid ? "Paid · tap to undo" : "Mark paid"}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["pickup", "delivery"] as const).map((kind) => {
                  const url =
                    kind === "pickup" ? order.pickup_photo_url : order.delivery_photo_url;
                  const label = kind === "pickup" ? "At pickup" : "After cleaning";
                  const uploading = photoBusy === `${order.id}-${kind}`;
                  return (
                    <label
                      key={kind}
                      className="flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-200 p-2 text-center text-xs font-medium text-slate-600 active:scale-[0.98]"
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={`${label} photo for ${order.order_reference}`}
                          className="h-16 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <Camera className="h-5 w-5 text-slate-400" />
                      )}
                      <span className="flex items-center gap-1">
                        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        {label}
                        {url ? " · replace" : ""}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="sr-only"
                        disabled={uploading}
                        onChange={(e) => {
                          void onPickPhoto(order, kind, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
