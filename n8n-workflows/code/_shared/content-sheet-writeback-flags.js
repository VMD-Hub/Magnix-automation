/**
 * P4.4 — shared helpers for n8n content Sheet write-back gates.
 * Copy-paste into Code nodes (n8n không import module chung).
 */

function envFlagOn(name, defaultOn) {
  const raw = $env[name];
  if (raw == null || String(raw).trim() === '') return defaultOn;
  const v = String(raw).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(v)) return true;
  if (['0', 'false', 'no', 'off'].includes(v)) return false;
  return defaultOn;
}

/** Umbrella: tắt dần dual-write audit sau khi Postgres là SoR publish. Default true (giữ hành vi cũ). */
function contentSheetWritebackEnabled() {
  return envFlagOn('CONTENT_SHEET_WRITEBACK_ENABLED', true);
}

/** Append content_metrics sau Page Publish. Override riêng hoặc inherit umbrella. */
function contentMetricsSheetWriteEnabled() {
  const raw = $env.CONTENT_METRICS_SHEET_WRITE_ENABLED;
  if (raw != null && String(raw).trim() !== '') {
    return envFlagOn('CONTENT_METRICS_SHEET_WRITE_ENABLED', true);
  }
  return contentSheetWritebackEnabled();
}

/** Upsert content_scorecard. Override riêng hoặc inherit umbrella. */
function contentScorecardSheetWriteEnabled() {
  const raw = $env.CONTENT_SCORECARD_SHEET_WRITE_ENABLED;
  if (raw != null && String(raw).trim() !== '') {
    return envFlagOn('CONTENT_SCORECARD_SHEET_WRITE_ENABLED', true);
  }
  return contentSheetWritebackEnabled();
}
