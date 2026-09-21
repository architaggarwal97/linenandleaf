import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Star, Trash2, ArrowLeft, MessageSquareQuote } from "lucide-react";
import {
  adminListTestimonials,
  adminAddTestimonial,
  adminDeleteTestimonial,
  type AdminTestimonial,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Linen & Leaf Staff" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminTestimonialsPage,
});

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${
            n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
      ))}
    </span>
  );
}

function AdminTestimonialsPage() {
  const list = useServerFn(adminListTestimonials);
  const add = useServerFn(adminAddTestimonial);
  const remove = useServerFn(adminDeleteTestimonial);

  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    list()
      .then((res) => active && setItems(res))
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, [list]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await add({
        data: { customerName, phone, orderReference, rating, review },
      });
      setCustomerName("");
      setPhone("");
      setOrderReference("");
      setRating(5);
      setReview("");
      setItems(await list());
      setNote("Testimonial saved.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not save the testimonial.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      await remove({ data: { id } });
      setItems((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not delete the testimonial.");
    } finally {
      setBusy(false);
    }
  }

  if (loadError) {
    return (
      <p className="mt-10 text-center text-sm text-rose-600">
        Could not load testimonials. Please try again.
      </p>
    );
  }

  if (!items) {
    return (
      <div className="mt-16 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-800">Testimonials</h1>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>

      <form
        onSubmit={(e) => void onAdd(e)}
        className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        <p className="text-sm font-semibold text-slate-800">Add a review</p>
        <p className="mt-1 text-xs text-slate-500">
          Enter a review a customer shared with you — on Google, WhatsApp, or in person.
        </p>
        <div className="mt-4 space-y-3">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              inputMode="tel"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500"
            />
            <input
              value={orderReference}
              onChange={(e) => setOrderReference(e.target.value)}
              placeholder="Order ref (optional)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className="rounded-full p-1.5"
              >
                <Star
                  className={`h-6 w-6 ${
                    n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What the customer said…"
            required
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save testimonial"}
          </button>
          {note ? <p className="text-center text-xs text-slate-500">{note}</p> : null}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <MessageSquareQuote className="mx-auto h-6 w-6 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">
            No reviews saved yet. Ask a happy customer, then add their words here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.id}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{t.customer_name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.phone ? `+91 ${t.phone}` : "No phone"}
                    {t.order_reference ? ` · ${t.order_reference}` : ""}
                    {" · "}
                    {new Date(t.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onDelete(t.id)}
                  disabled={busy}
                  aria-label={`Delete review from ${t.customer_name}`}
                  className="shrink-0 rounded-full p-2 text-slate-400 hover:text-rose-600 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2">
                <Stars rating={t.rating} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{t.review}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
