import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Lock,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { adminLogin, adminLogout, adminSessionStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — Linen & Leaf" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Today", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, exact: false },
  { to: "/admin/wallet", label: "Wallet", icon: Wallet, exact: false },
  { to: "/admin/overview", label: "Business", icon: TrendingUp, exact: false },
] as const;


function AdminLayout() {
  const checkSession = useServerFn(adminSessionStatus);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    checkSession()
      .then((res) => {
        if (!active) return;
        setAuthed(res.authed);
        setConfigured(res.configured);
        setReady(true);
      })
      .catch(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [checkSession]);

  const submitPin = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setBusy(true);
      setAuthError(null);
      try {
        const res = await login({ data: { pin } });
        if (res.ok) {
          setAuthed(true);
          setPin("");
        } else if (res.reason === "unconfigured") {
          setConfigured(false);
          setAuthError("Staff PIN is not set up yet.");
        } else {
          setAuthError("Incorrect PIN.");
        }
      } catch (err) {
        console.error(err);
        setAuthError("Something went wrong. Try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy, login, pin],
  );

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <form
          onSubmit={submitPin}
          className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-center font-display text-xl font-bold text-slate-800">Staff access</h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enter the shared staff PIN to open the dashboard.
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-lg tracking-[0.3em] outline-none focus:border-teal-500"
          />
          {authError ? <p className="mt-3 text-center text-sm text-rose-600">{authError}</p> : null}
          {!configured ? (
            <p className="mt-3 text-center text-xs text-slate-500">
              Ask the owner to add the staff PIN in the project settings.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-2xl bg-teal-700 px-4 py-4 text-base font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Linen &amp; Leaf Staff
        </p>
        <button
          type="button"
          onClick={async () => {
            await logout();
            setAuthed(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600"
        >
          <LogOut className="h-4 w-4" /> Lock
        </button>
      </div>

      <Outlet />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-2xl grid-cols-4">
          {TABS.map((tab) => {
            const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
                  active ? "text-teal-700" : "text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
