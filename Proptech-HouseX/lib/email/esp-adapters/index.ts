import {
  resolveEspAdapterMode,
  type EspAdapter,
} from "@/lib/email/esp-adapter";
import { createDryRunEspAdapter } from "@/lib/email/esp-adapters/dry-run";
import { createBrevoEspAdapter } from "@/lib/email/esp-adapters/brevo";

export function getEspAdapter(): EspAdapter | null {
  const mode = resolveEspAdapterMode();
  if (mode === "none") return null;
  if (mode === "brevo") return createBrevoEspAdapter();
  return createDryRunEspAdapter();
}
