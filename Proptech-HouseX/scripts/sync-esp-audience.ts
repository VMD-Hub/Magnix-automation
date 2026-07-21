/**
 * ADR-017 P3 — sync consented email audience House X → ESP adapter.
 *
 * Usage:
 *   EMAIL_ESP_ADAPTER=dry_run npm run go-live:sync-esp-audience
 *   EMAIL_ESP_ADAPTER=brevo BREVO_API_KEY=... npm run go-live:sync-esp-audience
 */
import { syncEspAudienceFromHouseX } from "../lib/messaging/email-p3-campaigns";
import { resolveEspAdapterMode } from "../lib/email/esp-adapter";

async function main() {
  const mode = resolveEspAdapterMode();
  console.log(`ESP adapter mode: ${mode}`);
  if (mode === "none") {
    console.error(
      "Set EMAIL_ESP_ADAPTER=dry_run|brevo (House X remains SoR — sync outbound only).",
    );
    process.exit(1);
  }
  const limit = Number(process.env.ESP_SYNC_LIMIT ?? "100");
  const result = await syncEspAudienceFromHouseX({ limit });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
