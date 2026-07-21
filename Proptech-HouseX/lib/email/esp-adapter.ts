/**
 * ADR-017 P3 — ESP adapter: audience sync **từ** House X (SoR), không ngược lại.
 */

export type EspContactSync = {
  leadId: string;
  email: string;
  /** Tags/cohorts for ESP lists — never PII beyond email. */
  tags: string[];
  consented: boolean;
  segment?: string | null;
};

export type EspUpsertResult =
  | { ok: true; provider: string; externalId: string | null; dryRun?: boolean }
  | { ok: false; provider: string; error: string };

export type EspAdapter = {
  name: string;
  upsertContact(contact: EspContactSync): Promise<EspUpsertResult>;
  /** Soft-remove / unsubscribe on ESP side when House X withdraws. */
  suppressContact(email: string): Promise<EspUpsertResult>;
};

export type EspAdapterMode = "none" | "dry_run" | "brevo";

export function resolveEspAdapterMode(): EspAdapterMode {
  const raw = (process.env.EMAIL_ESP_ADAPTER ?? "none").trim().toLowerCase();
  if (raw === "brevo" || raw === "brevo_api") return "brevo";
  if (raw === "dry_run" || raw === "stub" || raw === "1" || raw === "true") {
    return "dry_run";
  }
  return "none";
}

export function isEspSyncEnabled(): boolean {
  return resolveEspAdapterMode() !== "none";
}
