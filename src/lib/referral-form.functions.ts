import { createServerFn } from "@tanstack/react-start";

export type ReferralFormInput = {
  referrer_name: string;
  referrer_phone: string;
  friend_name: string;
  friend_phone: string;
  notes?: string | undefined;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function phone(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

export const submitReferral = createServerFn({ method: "POST" })
  .inputValidator((input: ReferralFormInput): ReferralFormInput => {
    const referrer_name = clean(input?.referrer_name, 120);
    const friend_name = clean(input?.friend_name, 120);
    const referrer_phone = phone(clean(input?.referrer_phone, 30));
    const friend_phone = phone(clean(input?.friend_phone, 30));
    if (!referrer_name || !friend_name) {
      throw new Error("Please enter both names.");
    }
    if (referrer_phone.length !== 10 || friend_phone.length !== 10) {
      throw new Error("Please enter valid 10-digit phone numbers.");
    }
    if (referrer_phone === friend_phone) {
      throw new Error("The two numbers must be different.");
    }
    const notes = clean(input?.notes, 500);
    return {
      referrer_name,
      referrer_phone,
      friend_name,
      friend_phone,
      notes: notes || undefined,
    };
  })
  .handler(async ({ data }) => {
    const spreadsheetId = process.env["REFERRALS_SPREADSHEET_ID"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!spreadsheetId || !lovableKey || !connectionKey) {
      throw new Error("Referral logging is not configured yet.");
    }

    const url =
      `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${spreadsheetId}` +
      `/values/Referrals!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            new Date().toISOString(),
            data.referrer_name,
            data.referrer_phone,
            data.friend_name,
            data.friend_phone,
            data.notes ?? "",
            "refer-page",
          ],
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Referral sheet append failed [${response.status}]: ${body}`);
      throw new Error("Could not save that referral. Please try again.");
    }

    // Also record it as a pending referral so the wallet credit flow picks it up.
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("referrals").upsert(
        {
          referring_phone: data.referrer_phone,
          referred_phone: data.friend_phone,
          status: "pending",
        },
        { onConflict: "referred_phone", ignoreDuplicates: true },
      );
      if (error) console.error("Referral record failed", error);
    } catch (err) {
      console.error("Referral record failed", err);
    }

    return { ok: true as const };
  });
