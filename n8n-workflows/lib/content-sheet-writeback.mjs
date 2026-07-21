/**
 * P4.4 — pure flags for content Sheet write-back (testable).
 * n8n Code nodes inline tương đương — xem code/_shared/content-sheet-writeback-flags.js
 */

export function envFlagOn(env, name, defaultOn) {
  const raw = env?.[name];
  if (raw == null || String(raw).trim() === "") return defaultOn;
  const v = String(raw).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return defaultOn;
}

export function contentSheetWritebackEnabled(env) {
  return envFlagOn(env, "CONTENT_SHEET_WRITEBACK_ENABLED", true);
}

export function contentMetricsSheetWriteEnabled(env) {
  const raw = env?.CONTENT_METRICS_SHEET_WRITE_ENABLED;
  if (raw != null && String(raw).trim() !== "") {
    return envFlagOn(env, "CONTENT_METRICS_SHEET_WRITE_ENABLED", true);
  }
  return contentSheetWritebackEnabled(env);
}

export function contentScorecardSheetWriteEnabled(env) {
  const raw = env?.CONTENT_SCORECARD_SHEET_WRITE_ENABLED;
  if (raw != null && String(raw).trim() !== "") {
    return envFlagOn(env, "CONTENT_SCORECARD_SHEET_WRITE_ENABLED", true);
  }
  return contentSheetWritebackEnabled(env);
}
