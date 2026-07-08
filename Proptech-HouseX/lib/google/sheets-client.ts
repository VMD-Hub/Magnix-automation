import crypto from "node:crypto";
import fs from "node:fs";

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is required for Sheet mirror");
  }

  const json = raw.startsWith("{")
    ? raw
    : fs.readFileSync(raw, "utf8");
  const sa = JSON.parse(json) as ServiceAccount;
  if (!sa.client_email || !sa.private_key || !sa.token_uri) {
    throw new Error("Invalid Google service account JSON");
  }
  return sa;
}

export async function getGoogleSheetsAccessToken(): Promise<string> {
  const sa = loadServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = base64url(sign.sign(sa.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(`Google token failed: ${data.error ?? res.status}`);
  }
  return data.access_token;
}

export async function sheetsValuesClear(
  spreadsheetId: string,
  range: string,
  accessToken: string,
): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    },
  );
  if (!res.ok) {
    throw new Error(`Sheets clear failed (${res.status}): ${await res.text()}`);
  }
}

export async function sheetsValuesUpdate(
  spreadsheetId: string,
  range: string,
  values: string[][],
  accessToken: string,
): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    },
  );
  if (!res.ok) {
    throw new Error(`Sheets update failed (${res.status}): ${await res.text()}`);
  }
}
