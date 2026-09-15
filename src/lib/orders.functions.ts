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
