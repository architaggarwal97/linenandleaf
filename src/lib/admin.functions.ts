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
};

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
      .select(
        "id, order_reference, customer_name, whatsapp_number, status, paid, created_at, pickup_address, preferred_window",
      )
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
