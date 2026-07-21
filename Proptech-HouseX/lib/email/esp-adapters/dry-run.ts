import { createHash } from "crypto";
import type { EspAdapter, EspContactSync, EspUpsertResult } from "@/lib/email/esp-adapter";

function maskEmail(email: string): string {
  return email.replace(/(.{2}).*(@.*)/, "$1***$2");
}

/** Dev / staging — log sync intent, không gọi ESP ngoài. */
export function createDryRunEspAdapter(): EspAdapter {
  return {
    name: "dry_run",
    async upsertContact(contact: EspContactSync): Promise<EspUpsertResult> {
      const externalId = `dry_${createHash("sha256")
        .update(contact.leadId)
        .digest("hex")
        .slice(0, 12)}`;
      console.log("[esp:dry_run:upsert]", {
        email: maskEmail(contact.email),
        tags: contact.tags,
        consented: contact.consented,
        segment: contact.segment ?? null,
        externalId,
      });
      return { ok: true, provider: "dry_run", externalId, dryRun: true };
    },
    async suppressContact(email: string): Promise<EspUpsertResult> {
      console.log("[esp:dry_run:suppress]", { email: maskEmail(email) });
      return { ok: true, provider: "dry_run", externalId: null, dryRun: true };
    },
  };
}
