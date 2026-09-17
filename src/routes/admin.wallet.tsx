import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, RefreshCw, Plus, X } from "lucide-react";
import {
  adminAddWalletEntry,
  adminListWallets,
  type WalletCustomer,
} from "@/lib/admin.functions";
import { AdminTopUps } from "@/components/site/AdminTopUps";

export const Route = createFileRoute("/admin/wallet")({
  component: AdminWalletPage,
});

const TYPE_LABELS: Record<string, string> = {
  topup: "Top-up",
  spend: "Spent",
  adjustment: "Adjustment",
};

function AdminWalletPage() {
  const listWallets = useServerFn(adminListWallets);
  const addEntry = useServerFn(adminAddWalletEntry);

  const [customers, setCustomers] = useState<WalletCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [form, setForm] = useState({
    whatsapp_number: "",
    customer_name: "",
    entry_type: "topup",
    amount: "",
    bonus: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const refresh = useCallback(
    async (term: string) => {
      setLoading(true);
      setError(null);
      try {
        setCustomers(await listWallets({ data: { search: term } }));
      } catch (err) {
        console.error(err);
        setError("Could not load wallet credits.");
      } finally {
        setLoading(false);
      }
    },
    [listWallets],
  );

  useEffect(() => {
    void refresh("");
  }, [refresh]);

  const amountNumber = Number(form.amount || 0);
  const suggestedBonus = form.entry_type === "topup" ? Math.round(amountNumber * 0.1) : 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError(null);
    try {
      await addEntry({
        data: {
          whatsapp_number: form.whatsapp_number,
          customer_name: form.customer_name,
          entry_type: form.entry_type,
          amount: Number(form.amount),
          bonus: form.entry_type === "topup" ? Number(form.bonus || suggestedBonus) : 0,
          note: form.note,
        },
      });
      setForm({
        whatsapp_number: "",
        customer_name: "",
        entry_type: "topup",
        amount: "",
        bonus: "",
        note: "",
      });
      setOpen(false);
      void refresh(search);
    } catch (err) {
      console.error(err);
      setFormError(err instanceof Error ? err.message : "Could not save that entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-slate-800">Wallet credits</h1>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? "Close" : "Add"}
        </button>
      </div>

      {open ? (
        <form
          onSubmit={submit}
          className="mt-4 space-y-3 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
          <input
            required
            value={form.whatsapp_number}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            placeholder="WhatsApp number"
            inputMode="tel"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none focus:border-teal-500"
          />
          <input
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            placeholder="Customer name (optional)"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none focus:border-teal-500"
          />
          <div className="grid grid-cols-3 gap-2">
            {(["topup", "spend", "adjustment"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, entry_type: t })}
                className={`rounded-2xl py-3 text-sm font-semibold transition ${
                  form.entry_type === t
                    ? "bg-teal-700 text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount ₹"
              inputMode="decimal"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none focus:border-teal-500"
            />
            <input
              value={form.entry_type === "topup" ? form.bonus : ""}
              disabled={form.entry_type !== "topup"}
              onChange={(e) => setForm({ ...form, bonus: e.target.value })}
              placeholder={`Bonus ₹${suggestedBonus || ""}`}
              inputMode="decimal"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none focus:border-teal-500 disabled:bg-slate-50"
            />
          </div>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Note (optional) — e.g. UPI top-up, order LL-0004"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none focus:border-teal-500"
          />
          {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-teal-700 text-base font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save entry"}
          </button>
          {form.entry_type === "topup" ? (
            <p className="text-xs text-slate-500">
              Leave bonus blank to apply the standard 10% (₹{suggestedBonus}).
            </p>
          ) : null}
        </form>
      ) : null}

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
            placeholder="Phone or name"
            className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-11 pr-4 text-base shadow-sm outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          className="grid h-[56px] w-[56px] place-items-center rounded-2xl bg-teal-700 text-white"
          aria-label="Refresh wallet credits"
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
        {!loading && customers.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            No wallet credits recorded yet.
          </p>
        ) : null}

        {customers.map((c) => {
          const isOpen = expanded === c.whatsapp_number;
          return (
            <article
              key={c.whatsapp_number}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : c.whatsapp_number)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-800">
                    {c.customer_name || "Customer"}
                  </p>
                  <p className="text-sm text-slate-500">{c.whatsapp_number}</p>
                </div>
                <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                  ₹{c.balance.toLocaleString("en-IN")}
                </span>
              </button>

              {isOpen ? (
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {c.entries.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-700">
                          {TYPE_LABELS[e.entry_type]}
                          {e.bonus ? ` + ₹${e.bonus} bonus` : ""}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(e.created_at).toLocaleString("en-IN")}
                          {e.note ? ` · ${e.note}` : ""}
                        </p>
                      </div>
                      <span
                        className={
                          e.entry_type === "spend"
                            ? "font-semibold text-rose-600"
                            : "font-semibold text-emerald-700"
                        }
                      >
                        {e.entry_type === "spend" ? "−" : "+"}₹{Math.abs(e.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
