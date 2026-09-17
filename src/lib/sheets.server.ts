// Shared helper for appending rows to the Linen & Leaf Google Sheet.
// Server-only: never import from client components directly.

export async function appendSheetRow(
  tab: string,
  row: (string | number)[],
): Promise<void> {
  const spreadsheetId = process.env["REFERRALS_SPREADSHEET_ID"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!spreadsheetId || !lovableKey || !connectionKey) {
    console.error(`Sheet append skipped (${tab}): missing configuration`);
    return;
  }

  const url =
    `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${spreadsheetId}` +
    `/values/${tab}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Sheet append failed (${tab}) [${response.status}]: ${body}`);
    }
  } catch (err) {
    console.error(`Sheet append failed (${tab})`, err);
  }
}

export type SheetTabValues = { tab: string; rows: string[][] };

/** Reads the last rows of several tabs in one batched request. */
export async function readSheetTabs(tabs: string[]): Promise<SheetTabValues[]> {
  const spreadsheetId = process.env["REFERRALS_SPREADSHEET_ID"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!spreadsheetId || !lovableKey || !connectionKey) {
    console.error("Sheet read skipped: missing configuration");
    return tabs.map((tab) => ({ tab, rows: [] }));
  }

  const query = tabs.map((t) => `ranges=${t}!A1:Z500`).join("&");
  const url =
    `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${spreadsheetId}` +
    `/values:batchGet?${query}&majorDimension=ROWS`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
      },
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Sheet read failed [${response.status}]: ${body}`);
      return tabs.map((tab) => ({ tab, rows: [] }));
    }
    const json = (await response.json()) as {
      valueRanges?: { values?: string[][] }[];
    };
    return tabs.map((tab, i) => ({
      tab,
      rows: json.valueRanges?.[i]?.values ?? [],
    }));
  } catch (err) {
    console.error("Sheet read failed", err);
    return tabs.map((tab) => ({ tab, rows: [] }));
  }
}
