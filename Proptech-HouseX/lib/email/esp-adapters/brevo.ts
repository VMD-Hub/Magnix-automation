import type { EspAdapter, EspContactSync, EspUpsertResult } from "@/lib/email/esp-adapter";

/**
 * Brevo (Sendinblue) Contacts API — optional when BREVO_API_KEY set.
 * House X remains SoR; this only mirrors consented contacts outbound.
 * @see https://developers.brevo.com/reference/createcontact
 */
export function createBrevoEspAdapter(): EspAdapter {
  const apiKey = process.env.BREVO_API_KEY?.trim() ?? "";
  const listIdRaw = process.env.BREVO_LIST_ID?.trim();
  const listId = listIdRaw ? Number(listIdRaw) : null;

  return {
    name: "brevo",
    async upsertContact(contact: EspContactSync): Promise<EspUpsertResult> {
      if (!apiKey) {
        return { ok: false, provider: "brevo", error: "BREVO_API_KEY_MISSING" };
      }
      if (!contact.consented) {
        return suppressViaBrevo(apiKey, contact.email);
      }

      const body: Record<string, unknown> = {
        email: contact.email,
        updateEnabled: true,
        attributes: {
          LEAD_ID: contact.leadId,
          SEGMENT: contact.segment ?? "",
          HOUSEX_TAGS: contact.tags.join(","),
        },
      };
      if (listId && Number.isFinite(listId)) {
        body.listIds = [listId];
      }

      try {
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(body),
        });
        if (res.status === 204 || res.ok) {
          let externalId: string | null = null;
          try {
            const json = (await res.json()) as { id?: string | number };
            externalId = json.id != null ? String(json.id) : null;
          } catch {
            externalId = null;
          }
          return { ok: true, provider: "brevo", externalId };
        }
        // 400 duplicate often still means upserted via updateEnabled — treat carefully
        const errText = (await res.text().catch(() => "")).slice(0, 200);
        if (res.status === 400 && /already|duplicate/i.test(errText)) {
          return { ok: true, provider: "brevo", externalId: null };
        }
        return {
          ok: false,
          provider: "brevo",
          error: `brevo_${res.status}:${errText}`,
        };
      } catch {
        return { ok: false, provider: "brevo", error: "brevo_network_failed" };
      }
    },
    async suppressContact(email: string): Promise<EspUpsertResult> {
      if (!apiKey) {
        return { ok: false, provider: "brevo", error: "BREVO_API_KEY_MISSING" };
      }
      return suppressViaBrevo(apiKey, email);
    },
  };
}

async function suppressViaBrevo(
  apiKey: string,
  email: string,
): Promise<EspUpsertResult> {
  try {
    const encoded = encodeURIComponent(email.trim().toLowerCase());
    const res = await fetch(`https://api.brevo.com/v3/contacts/${encoded}`, {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ emailBlacklisted: true }),
    });
    if (res.ok || res.status === 204) {
      return { ok: true, provider: "brevo", externalId: null };
    }
    const errText = (await res.text().catch(() => "")).slice(0, 200);
    return {
      ok: false,
      provider: "brevo",
      error: `brevo_suppress_${res.status}:${errText}`,
    };
  } catch {
    return { ok: false, provider: "brevo", error: "brevo_suppress_network_failed" };
  }
}
