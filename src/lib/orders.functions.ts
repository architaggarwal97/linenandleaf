import { createServerFn } from "@tanstack/react-start";

export type CreateOrderInput = {
  customer_name: string;
  whatsapp_number: string;
  pickup_address: string;
  preferred_window?: "morning" | "afternoon" | "evening" | undefined;
  service_notes?: string | undefined;
};

const WINDOWS = ["morning", "afternoon", "evening"] as const;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: CreateOrderInput): CreateOrderInput => {
    const customer_name = clean(input?.customer_name, 120);
    const whatsapp_number = clean(input?.whatsapp_number, 30);
    const pickup_address = clean(input?.pickup_address, 500);
    if (!customer_name || !whatsapp_number || !pickup_address) {
      throw new Error("Name, WhatsApp number and pickup address are required.");
    }
    const rawWindow = clean(input?.preferred_window, 20).toLowerCase();
    const preferred_window = (WINDOWS as readonly string[]).includes(rawWindow)
      ? (rawWindow as (typeof WINDOWS)[number])
      : undefined;
    const notes = clean(input?.service_notes, 1000);
    return {
      customer_name,
      whatsapp_number,
      pickup_address,
      preferred_window,
      service_notes: notes || undefined,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        whatsapp_number: data.whatsapp_number,
        pickup_address: data.pickup_address,
        preferred_window: data.preferred_window ?? null,
        service_notes: data.service_notes ?? null,
      })
      .select("order_reference")
      .single();

    if (error) {
      console.error("Failed to create order", error);
      throw new Error("Could not save your booking. Please try again.");
    }

    return { orderReference: row.order_reference as string };
  });

const ORDER_STATUSES = ["requested", "picked_up", "in_process", "ready", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type TrackOrderResult = {
  found: boolean;
  status?: OrderStatus;
  orderReference?: string;
  createdAt?: string;
};

function normalizePhone(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(-10);
}

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input: { whatsapp_number?: unknown; order_reference?: unknown }) => {
    const whatsapp_number = clean(input?.whatsapp_number, 30);
    const order_reference = clean(input?.order_reference, 20).toUpperCase();
    if (!whatsapp_number || !order_reference) {
      throw new Error("Please enter your WhatsApp number and order reference.");
    }
    return { whatsapp_number, order_reference };
  })
  .handler(async ({ data }): Promise<TrackOrderResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select("order_reference, status, created_at, whatsapp_number")
      .eq("order_reference", data.order_reference)
      .limit(5);

    if (error) {
      console.error("Failed to look up order", error);
      throw new Error("We couldn't check your order just now. Please try again.");
    }

    const needle = normalizePhone(data.whatsapp_number);
    const match = (rows ?? []).find((r) => normalizePhone(r.whatsapp_number) === needle);
    if (!match) return { found: false };

    const status = (ORDER_STATUSES as readonly string[]).includes(match.status)
      ? (match.status as OrderStatus)
      : "requested";
    return {
      found: true,
      status,
      orderReference: match.order_reference,
      createdAt: match.created_at,
    };
  });
