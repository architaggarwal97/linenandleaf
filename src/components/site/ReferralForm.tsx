import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitReferral } from "@/lib/referral-form.functions";

const empty = {
  referrer_name: "",
  referrer_phone: "",
  friend_name: "",
  friend_phone: "",
  notes: "",
};

export function ReferralForm() {
  const send = useServerFn(submitReferral);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const field = (key: keyof typeof empty) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await send({
        data: {
          referrer_name: form.referrer_name,
          referrer_phone: form.referrer_phone,
          friend_name: form.friend_name,
          friend_phone: form.friend_phone,
          notes: form.notes || undefined,
        },
      });
      setForm(empty);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not save that referral.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <CheckCircle2 className="mx-auto h-10 w-10 text-teal-600" />
        <h3 className="mt-4 font-serif text-xl text-slate-900">Referral noted</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          We've recorded it. Once their first order is delivered, ₹100 lands in both wallets.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-700"
        >
          Add another referral
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:p-9"
    >
      <h3 className="font-serif text-xl text-slate-900 md:text-2xl">Submit a referral</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Prefer not to use WhatsApp? Add the details here and we'll take it from there.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ref-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Your name
          </label>
          <input
            id="ref-name"
            required
            {...field("referrer_name")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="ref-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Your WhatsApp number
          </label>
          <input
            id="ref-phone"
            type="tel"
            required
            {...field("referrer_phone")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="10-digit number"
          />
        </div>
        <div>
          <label htmlFor="friend-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Friend's name
          </label>
          <input
            id="friend-name"
            required
            {...field("friend_name")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="Who are you referring?"
          />
        </div>
        <div>
          <label htmlFor="friend-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Friend's WhatsApp number
          </label>
          <input
            id="friend-phone"
            type="tel"
            required
            {...field("friend_phone")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="10-digit number"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="ref-notes" className="mb-1.5 block text-sm font-medium text-slate-700">
          Anything we should know? <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="ref-notes"
          rows={2}
          {...field("notes")}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          placeholder="e.g. best time to call, area they live in"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-4 text-base font-semibold text-white transition hover:bg-teal-800 disabled:opacity-70"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Submit referral
          </>
        )}
      </button>

      {error ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      ) : null}
    </form>
  );
}
