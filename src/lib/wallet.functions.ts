import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash } from "node:crypto";

export type WalletTransaction = {
  id: string;
  created_at: string;
  type: "topup" | "deduction";
  status: "pending" | "confirmed" | "cancelled";
  amount: number;
  bonus: number;
  resulting_balance: number | null;
  note: string | null;
};

export type WalletReferral = {
  id: string;
  status: "pending" | "completed";
  role: "referrer" | "referred";
  other_phone: string;
  created_at: string;
  completed_at: string | null;
};

export type WalletState = {
  phone: string | null;
  balance: number;
  transactions: WalletTransaction[];
  referrals: WalletReferral[];
};

type WalletSession = { phone?: string };

function sessionConfig() {
  const password = process.env["WALLET_SESSION_SECRET"];
  if (!password) throw new Error("Wallet sessions are not configured.");
  return {
    password,
    name: "ll-wallet",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function normalizeWalletPhone(value: unknown): string {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  return digits.slice(-10);
}

function hashCode(phone: string, code: string): string {
  return createHash("sha256").update(`${phone}:${code}`, "utf8").digest("hex");
}

async function currentPhone(): Promise<string | null> {
  const session = await useSession<WalletSession>(sessionConfig());
  return session.data.phone ?? null;
}

function toTransaction(row: Record<string, unknown>): WalletTransaction {
  const type = String(row["type"]) === "deduction" ? "deduction" : "topup";
  const rawStatus = String(row["status"]);
  const status =
    rawStatus === "pending" || rawStatus === "cancelled"
      ? (rawStatus as "pending" | "cancelled")
      : "confirmed";
  return {
    id: String(row["id"]),
    created_at: String(row["created_at"]),
    type,
    status,
    amount: Number(row["amount"] ?? 0),
    bonus: Number(row["bonus"] ?? 0),
    resulting_balance:
      row["resulting_balance"] === null || row["resulting_balance"] === undefined
        ? null
        : Number(row["resulting_balance"]),
    note: (row["note"] as string | null) ?? null,
  };
}

async function loadState(phone: string): Promise<WalletState> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: balanceRow }, { data: rows }, { data: referralRows }] = await Promise.all([
    supabaseAdmin.from("wallet_balances").select("balance").eq("phone", phone).maybeSingle(),
    supabaseAdmin
      .from("wallet_transactions")
      .select("id, created_at, type, status, amount, bonus, resulting_balance, note")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin
      .from("referrals")
      .select("id, status, referring_phone, referred_phone, created_at, completed_at")
      .or(`referring_phone.eq.${phone},referred_phone.eq.${phone}`)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const referrals: WalletReferral[] = (referralRows ?? []).map((r) => {
    const isReferrer = r.referring_phone === phone;
    return {
      id: r.id,
      status: r.status === "completed" ? "completed" : "pending",
      role: isReferrer ? "referrer" : "referred",
      other_phone: isReferrer ? r.referred_phone : r.referring_phone,
      created_at: r.created_at,
      completed_at: r.completed_at,
    };
  });

  return {
    phone,
    referrals,
    balance: Number(balanceRow?.balance ?? 0),
    transactions: (rows ?? []).map((r) => toTransaction(r as Record<string, unknown>)),
  };
}

// ---------- Login ----------

export const walletRequestCode = createServerFn({ method: "POST" })
  .inputValidator((input: { phone?: unknown }) => {
    const phone = normalizeWalletPhone(input?.phone);
    if (phone.length !== 10) throw new Error("Enter a valid 10-digit WhatsApp number.");
    return { phone };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("wallet_login_codes")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error("Too many code requests. Please wait a couple of minutes.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("wallet_login_codes").insert({
      phone: data.phone,
      code,
      code_hash: hashCode(data.phone, code),
      expires_at: expires,
    });
    if (error) {
      console.error("Wallet code request failed", error);
      throw new Error("Could not start sign-in. Please try again.");
    }

    return { ok: true as const, phone: data.phone };
  });

export const walletVerifyCode = createServerFn({ method: "POST" })
  .inputValidator((input: { phone?: unknown; code?: unknown }) => {
    const phone = normalizeWalletPhone(input?.phone);
    const code = typeof input?.code === "string" ? input.code.replace(/\D/g, "").slice(0, 6) : "";
    if (phone.length !== 10 || code.length !== 6) {
      throw new Error("Enter the 6-digit code we sent you.");
    }
    return { phone, code };
  })
  .handler(async ({ data }): Promise<{ ok: boolean; state?: WalletState }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("wallet_login_codes")
      .select("id, code_hash, expires_at, consumed_at, attempts")
      .eq("phone", data.phone)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row || new Date(row.expires_at) < new Date() || (row.attempts ?? 0) >= 5) {
      return { ok: false };
    }

    if (row.code_hash !== hashCode(data.phone, data.code)) {
      await supabaseAdmin
        .from("wallet_login_codes")
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq("id", row.id);
      return { ok: false };
    }

    await supabaseAdmin
      .from("wallet_login_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    const session = await useSession<WalletSession>(sessionConfig());
    await session.update({ phone: data.phone });

    return { ok: true, state: await loadState(data.phone) };
  });

export const walletLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<WalletSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

// ---------- Customer wallet ----------

export const walletState = createServerFn({ method: "GET" }).handler(
  async (): Promise<WalletState> => {
    const phone = await currentPhone();
    if (!phone) return { phone: null, balance: 0, transactions: [], referrals: [] };
    return loadState(phone);
  },
);

export const walletRequestTopUp = createServerFn({ method: "POST" })
  .inputValidator((input: { amount?: unknown }) => {
    const amount = Math.round(Number(input?.amount ?? 0));
    if (!Number.isFinite(amount) || amount < 100 || amount > 100000) {
      throw new Error("Top-up must be between ₹100 and ₹1,00,000.");
    }
    return { amount };
  })
  .handler(async ({ data }): Promise<WalletState> => {
    const phone = await currentPhone();
    if (!phone) throw new Error("Please sign in to your wallet first.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("wallet_transactions").insert({
      phone,
      type: "topup",
      status: "pending",
      amount: data.amount,
      bonus: Math.round(data.amount * 0.1),
      note: "Top-up requested via WhatsApp",
    });
    if (error) {
      console.error("Top-up request failed", error);
      throw new Error("Could not record your top-up request.");
    }

    return loadState(phone);
  });

export const walletPayForOrder = createServerFn({ method: "POST" })
  .inputValidator((input: { amount?: unknown; note?: unknown }) => {
    const amount = Math.round(Number(input?.amount ?? 0));
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a valid amount.");
    const note = typeof input?.note === "string" ? input.note.trim().slice(0, 200) : "";
    return { amount, note };
  })
  .handler(
    async ({ data }): Promise<{ ok: boolean; reason?: "insufficient"; state?: WalletState }> => {
      const phone = await currentPhone();
      if (!phone) throw new Error("Please sign in to your wallet first.");

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.rpc("wallet_deduct", {
        _phone: phone,
        _amount: data.amount,
        _note: data.note || "Paid from wallet",
      });

      if (error) {
        if (String(error.message).includes("INSUFFICIENT_BALANCE")) {
          return { ok: false, reason: "insufficient", state: await loadState(phone) };
        }
        console.error("Wallet deduction failed", error);
        throw new Error("Could not take the payment from your wallet.");
      }

      return { ok: true, state: await loadState(phone) };
    },
  );
