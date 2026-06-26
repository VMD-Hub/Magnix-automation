// Inlined vào n8n Code nodes — build deep link tới cột duyệt L3
// Placeholder __SHEET_TAB_GIDS__ được thay lúc build workflow.

const SHEET_TAB_GIDS = __SHEET_TAB_GIDS__;

const APPROVAL_COL = {
  video_drafts: { status: 'Q', l3: 'S' },
  content_drafts: { status: 'K' },
  outreach_queue: { status: 'I', l3: 'J' },
};

function buildReviewUrl(sheetId, tab, row, approvalFields) {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
  const gid = SHEET_TAB_GIDS[tab];
  const cols = APPROVAL_COL[tab] || { status: 'A' };
  const fields = Array.isArray(approvalFields) ? approvalFields : [];
  const wantsL3 = fields.some((f) => String(f).toLowerCase().includes('l3_approved'));
  const col = wantsL3 && cols.l3 ? cols.l3 : cols.status || 'A';
  const r = Number(row) || 0;

  if (!gid) {
    return r > 1 ? `${base}#range=${col}${r}` : base;
  }
  if (r <= 1) {
    return `${base}#gid=${gid}`;
  }
  return `${base}#gid=${gid}&range=${col}${r}`;
}
