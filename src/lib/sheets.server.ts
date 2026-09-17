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
