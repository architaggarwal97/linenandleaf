import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_STATUSES = [
  "requested",
  "picked_up",
  "in_process",
  "ready",
  "delivered",
] as const;
export type AdminStatus = (typeof ADMIN_STATUSES)[number];

export type AdminOrder = {
  id: string;
  order_reference: string;
  customer_name: string;
  whatsapp_number: string;
  status: AdminStatus;
  paid: boolean;
  created_at: string;
  pickup_address: string;
  preferred_window: string | null;
  pickup_photo_url: string | null;
  delivery_photo_url: string | null;
};

const ORDER_COLUMNS =
  "id, order_reference, customer_name, whatsapp_number, status, paid, created_at, pickup_address, preferred_window, pickup_photo_url, delivery_photo_url";

type OrderRow = Omit<AdminOrder, "status"> & { status: string };

async function toAdminOrder(row: OrderRow): Promise<AdminOrder> {
  const { signOrderPhoto } = await import("@/lib/order-photos.server");
  const [pickup, delivery] = await Promise.all([
    signOrderPhoto(row.pickup_photo_url),
    signOrderPhoto(row.delivery_photo_url),
  ]);
  return {
    ...row,
    status: normalizeStatus(row.status),
    pickup_photo_url: pickup,
    delivery_photo_url: delivery,
  };
}

type AdminSession = { admin?: boolean };

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("Admin session is not configured.");
  return {
    password,
    name: "ll-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("UNAUTHORIZED");
}

function normalizeStatus(value: string): AdminStatus {
  return (ADMIN_STATUSES as readonly string[]).includes(value)
    ? (value as AdminStatus)
    : "requested";
}

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { authed: Boolean(session.data.admin), configured: Boolean(process.env["ADMIN_PIN"]) };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { pin?: unknown }) => ({
    pin: typeof input?.pin === "string" ? input.pin.trim().slice(0, 64) : "",
  }))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PIN"];
    if (!expected) return { ok: false as const, reason: "unconfigured" as const };
    if (!data.pin || !matches(data.pin, expected)) {
      return { ok: false as const, reason: "invalid" as const };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const, reason: null };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((input: { search?: unknown }) => ({
    search: typeof input?.search === "string" ? input.search.trim().slice(0, 40) : "",
  }))
  .handler(async ({ data }): Promise<AdminOrder[]> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("orders")
      .select(ORDER_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(60);

    if (data.search) {
      const term = data.search.replace(/[%,()]/g, "");
      query = query.or(
        `order_reference.ilike.%${term}%,whatsapp_number.ilike.%${term}%,customer_name.ilike.%${term}%`,
      );
    }

    const { data: rows, error } = await query;
    if (error) {
      console.error("Admin order list failed", error);
      throw new Error("Could not load orders.");
    }
    return (rows ?? []).map((r) => ({ ...r, status: normalizeStatus(r.status) }));
  });

export const adminAdvanceStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: unknown }) => {
    const id = typeof input?.id === "string" ? input.id : "";
    if (!id) throw new Error("Missing order id.");
    return { id };
  })
  .handler(async ({ data }): Promise<AdminOrder> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: current, error: readError } = await supabaseAdmin
      .from("orders")
      .select("status")
      .eq("id", data.id)
      .single();
    if (readError || !current) throw new Error("Order not found.");

    const index = ADMIN_STATUSES.indexOf(normalizeStatus(current.status));
    const next = ADMIN_STATUSES[Math.min(index + 1, ADMIN_STATUSES.length - 1)]!;

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .update({ status: next })
      .eq("id", data.id)
      .select(
        "id, order_reference, customer_name, whatsapp_number, status, paid, created_at, pickup_address, preferred_window",
      )
      .single();
    if (error || !row) throw new Error("Could not update the order.");
    return { ...row, status: normalizeStatus(row.status) };
  });

export const adminSetPaid = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: unknown; paid?: unknown }) => {
    const id = typeof input?.id === "string" ? input.id : "";
    if (!id) throw new Error("Missing order id.");
    return { id, paid: Boolean(input?.paid) };
  })
  .handler(async ({ data }): Promise<AdminOrder> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .update({ paid: data.paid })
      .eq("id", data.id)
      .select(
        "id, order_reference, customer_name, whatsapp_number, status, paid, created_at, pickup_address, preferred_window",
      )
      .single();
    if (error || !row) throw new Error("Could not update the order.");
    return { ...row, status: normalizeStatus(row.status) };
  });

// ---------- Dashboard stats ----------

export type AdminStats = {
  total: number;
  active: number;
  unpaid: number;
  today: number;
  byStatus: Record<AdminStatus, number>;
  walletCustomers: number;
  walletBalance: number;
};

export const adminStats = createServerFn({ method: "POST" }).handler(
  async (): Promise<AdminStats> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("status, paid, created_at")
      .limit(1000);
    if (error) throw new Error("Could not load stats.");

    const byStatus = ADMIN_STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<AdminStatus, number>,
    );
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let unpaid = 0;
    let today = 0;
    for (const row of orders ?? []) {
      const status = normalizeStatus(row.status);
      byStatus[status] += 1;
      if (!row.paid) unpaid += 1;
      if (new Date(row.created_at) >= startOfDay) today += 1;
    }

    const { data: entries } = await supabaseAdmin
      .from("wallet_entries")
      .select("whatsapp_number, entry_type, amount, bonus")
      .limit(2000);

    const numbers = new Set<string>();
    let walletBalance = 0;
    for (const e of entries ?? []) {
      numbers.add(e.whatsapp_number);
      walletBalance += entryDelta(e.entry_type, Number(e.amount), Number(e.bonus));
    }

    return {
      total: (orders ?? []).length,
      active: byStatus.requested + byStatus.picked_up + byStatus.in_process + byStatus.ready,
      unpaid,
      today,
      byStatus,
      walletCustomers: numbers.size,
      walletBalance,
    };
  },
);

// ---------- Wallet credits ----------

export type WalletEntry = {
  id: string;
  created_at: string;
  customer_name: string;
  whatsapp_number: string;
  entry_type: "topup" | "spend" | "adjustment";
  amount: number;
  bonus: number;
  note: string | null;
};

export type WalletCustomer = {
  whatsapp_number: string;
  customer_name: string;
  balance: number;
  lastActivity: string;
  entries: WalletEntry[];
};

function entryDelta(type: string, amount: number, bonus: number): number {
  if (type === "spend") return -Math.abs(amount);
  if (type === "adjustment") return amount;
  return Math.abs(amount) + Math.abs(bonus);
}

function toEntry(row: Record<string, unknown>): WalletEntry {
  const type = String(row["entry_type"]);
  return {
    id: String(row["id"]),
    created_at: String(row["created_at"]),
    customer_name: String(row["customer_name"] ?? ""),
    whatsapp_number: String(row["whatsapp_number"]),
    entry_type: type === "spend" || type === "adjustment" ? type : "topup",
    amount: Number(row["amount"] ?? 0),
    bonus: Number(row["bonus"] ?? 0),
    note: (row["note"] as string | null) ?? null,
  };
}

export const adminListWallets = createServerFn({ method: "POST" })
  .inputValidator((input: { search?: unknown }) => ({
    search: typeof input?.search === "string" ? input.search.trim().slice(0, 40) : "",
  }))
  .handler(async ({ data }): Promise<WalletCustomer[]> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin
      .from("wallet_entries")
      .select("id, created_at, customer_name, whatsapp_number, entry_type, amount, bonus, note")
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.search) {
      const term = data.search.replace(/[%,()]/g, "");
      query = query.or(`whatsapp_number.ilike.%${term}%,customer_name.ilike.%${term}%`);
    }

    const { data: rows, error } = await query;
    if (error) {
      console.error("Wallet list failed", error);
      throw new Error("Could not load wallet credits.");
    }

    const map = new Map<string, WalletCustomer>();
    for (const raw of rows ?? []) {
      const entry = toEntry(raw as Record<string, unknown>);
      const existing = map.get(entry.whatsapp_number);
      const delta = entryDelta(entry.entry_type, entry.amount, entry.bonus);
      if (existing) {
        existing.balance += delta;
        existing.entries.push(entry);
        if (!existing.customer_name && entry.customer_name) {
          existing.customer_name = entry.customer_name;
        }
      } else {
        map.set(entry.whatsapp_number, {
          whatsapp_number: entry.whatsapp_number,
          customer_name: entry.customer_name,
          balance: delta,
          lastActivity: entry.created_at,
          entries: [entry],
        });
      }
    }
    return [...map.values()].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
  });

export const adminAddWalletEntry = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      whatsapp_number?: unknown;
      customer_name?: unknown;
      entry_type?: unknown;
      amount?: unknown;
      bonus?: unknown;
      note?: unknown;
    }) => {
      const number = String(input?.whatsapp_number ?? "").replace(/[^\d+]/g, "").slice(0, 20);
      if (number.replace(/\D/g, "").length < 10) throw new Error("Enter a valid phone number.");
      const type = String(input?.entry_type ?? "topup");
      const amount = Number(input?.amount ?? 0);
      if (!Number.isFinite(amount) || amount === 0) throw new Error("Enter an amount.");
      const bonus = Number(input?.bonus ?? 0);
      return {
        whatsapp_number: number,
        customer_name: String(input?.customer_name ?? "").trim().slice(0, 80),
        entry_type: ["topup", "spend", "adjustment"].includes(type) ? type : "topup",
        amount: Math.round(amount * 100) / 100,
        bonus: Number.isFinite(bonus) ? Math.round(Math.abs(bonus) * 100) / 100 : 0,
        note: String(input?.note ?? "").trim().slice(0, 200) || null,
      };
    },
  )
  .handler(async ({ data }): Promise<WalletEntry> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("wallet_entries")
      .insert(data)
      .select("id, created_at, customer_name, whatsapp_number, entry_type, amount, bonus, note")
      .single();
    if (error || !row) {
      console.error("Wallet insert failed", error);
      throw new Error("Could not save that wallet entry.");
    }
    return toEntry(row as Record<string, unknown>);
  });

// ---------- Referrals ----------

export const REFERRAL_CREDIT = 100;

export type AdminReferral = {
  id: string;
  order_reference: string;
  created_at: string;
  status: AdminStatus;
  friend_name: string;
  friend_phone: string;
  referrer_phone: string;
  credited_at: string | null;
  eligible: boolean;
  first_order: boolean;
};

const REFERRAL_COLUMNS =
  "id, order_reference, created_at, status, customer_name, whatsapp_number, referred_by_phone, referral_credited_at";

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

export const adminListReferrals = createServerFn({ method: "POST" }).handler(
  async (): Promise<AdminReferral[]> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select(REFERRAL_COLUMNS)
      .not("referred_by_phone", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error("Referral list failed", error);
      throw new Error("Could not load referrals.");
    }

    const { data: allOrders } = await supabaseAdmin
      .from("orders")
      .select("whatsapp_number, created_at")
      .limit(2000);

    const earliest = new Map<string, string>();
    for (const o of allOrders ?? []) {
      const key = normalizeDigits(o.whatsapp_number);
      const current = earliest.get(key);
      if (!current || o.created_at < current) earliest.set(key, o.created_at);
    }

    return (rows ?? []).map((r) => {
      const status = normalizeStatus(r.status);
      const firstOrder = earliest.get(normalizeDigits(r.whatsapp_number)) === r.created_at;
      return {
        id: r.id,
        order_reference: r.order_reference,
        created_at: r.created_at,
        status,
        friend_name: r.customer_name,
        friend_phone: r.whatsapp_number,
        referrer_phone: r.referred_by_phone ?? "",
        credited_at: r.referral_credited_at,
        first_order: firstOrder,
        eligible: status === "delivered" && !r.referral_credited_at && firstOrder,
      };
    });
  },
);

export const adminCreditReferral = createServerFn({ method: "POST" })
  .inputValidator((input: { id?: unknown }) => {
    const id = typeof input?.id === "string" ? input.id : "";
    if (!id) throw new Error("Missing order id.");
    return { id };
  })
  .handler(async ({ data }): Promise<AdminReferral> => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: readError } = await supabaseAdmin
      .from("orders")
      .select(REFERRAL_COLUMNS)
      .eq("id", data.id)
      .single();
    if (readError || !order) throw new Error("Order not found.");
    if (!order.referred_by_phone) throw new Error("This order has no referrer.");
    if (order.referral_credited_at) throw new Error("This referral is already credited.");
    if (normalizeStatus(order.status) !== "delivered") {
      throw new Error("Credit the reward only after the first order is delivered.");
    }

    const note = `Referral reward — order ${order.order_reference}`;
    const { error: walletError } = await supabaseAdmin.from("wallet_entries").insert([
      {
        whatsapp_number: order.whatsapp_number,
        customer_name: order.customer_name,
        entry_type: "adjustment",
        amount: REFERRAL_CREDIT,
        bonus: 0,
        note: `${note} (referred friend)`,
      },
      {
        whatsapp_number: order.referred_by_phone,
        customer_name: "",
        entry_type: "adjustment",
        amount: REFERRAL_CREDIT,
        bonus: 0,
        note: `${note} (referrer)`,
      },
    ]);
    if (walletError) {
      console.error("Referral credit failed", walletError);
      throw new Error("Could not credit the wallets.");
    }

    const creditedAt = new Date().toISOString();
    const { error: stampError } = await supabaseAdmin
      .from("orders")
      .update({ referral_credited_at: creditedAt })
      .eq("id", data.id)
      .is("referral_credited_at", null);
    if (stampError) console.error("Referral stamp failed", stampError);

    return {
      id: order.id,
      order_reference: order.order_reference,
      created_at: order.created_at,
      status: normalizeStatus(order.status),
      friend_name: order.customer_name,
      friend_phone: order.whatsapp_number,
      referrer_phone: order.referred_by_phone,
      credited_at: creditedAt,
      first_order: true,
      eligible: false,
    };
  });
