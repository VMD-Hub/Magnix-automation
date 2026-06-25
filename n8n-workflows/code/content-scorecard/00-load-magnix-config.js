// n8n Code: load config Mạch 5 — tránh $env trong Google Sheets node

const sheetId = $env.GOOGLE_SHEET_CONTENT_METRICS_ID;
const tab = $env.GOOGLE_SHEET_CONTENT_METRICS_TAB || 'content_metrics';

if (!sheetId) {
  throw new Error('Missing GOOGLE_SHEET_CONTENT_METRICS_ID on n8n env');
}

return [{
  json: {
    content_metrics_sheet_id: sheetId,
    content_metrics_tab: tab,
  },
}];
