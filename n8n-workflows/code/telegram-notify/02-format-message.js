// n8n Code: format Telegram message + prepare Sheet row

const item = $input.first().json;
const approval = (item.approval_fields || []).join(' + ') || 'approve / reject trên Sheet';
const now = new Date().toISOString();

let header = '[Magnix]';
if (item.event_type === 'approval_needed') header = '[Magnix] Cần duyệt L3';
else if (item.event_type === 'render_review_needed') header = '[Magnix] Cần xem bản dựng video';
else if (item.event_type === 'legal_source_needed') header = '[Magnix] Cần bổ sung căn cứ pháp lý';
else if (item.event_type === 'workflow_blocked') header = '[Magnix] Workflow bị block';
else if (item.event_type === 'qa_failed') header = '[Magnix] QA fail — cần sửa';
else if (item.event_type === 'metrics_needed') header = '[Magnix] Thiếu metrics';
else if (item.event_type === 'publish_ready') header = '[Magnix] Sẵn sàng đăng';

const lines = [
  header,
  `Agent: ${item.agent}`,
  `Loại: ${item.product_type || item.event_type}${item.target_channel ? ` → ${item.target_channel}` : ''}`,
  `Tiêu đề: ${item.title}`,
];

if (item.segment) lines.push(`Segment: ${item.segment}`);
if (item.sheet_tab) {
  lines.push(
    item.sheet_row
      ? `Dòng: ${item.sheet_tab} row ${item.sheet_row}`
      : `Tab: ${item.sheet_tab}`
  );
}
if (item.event_type === 'approval_needed' || item.event_type === 'legal_source_needed') {
  lines.push(`Cần làm: ${approval}`);
  lines.push('Trên Sheet: dùng dropdown cột status (draft/approved/rejected). Video & outreach: tick ☑ l3_approved.');
}
if (item.preview_url) lines.push(`Preview: ${item.preview_url}`);
if (item.review_url) {
  lines.push(`👉 Mở duyệt (nhảy đúng tab + cột): ${item.review_url}`);
}
if (item.due_at) lines.push(`Hạn xử lý: ${item.due_at}`);

const message = lines.join('\n').slice(0, 3900);

const meta = JSON.stringify({
  severity: item.severity,
  title: item.title,
  segment: item.segment,
  product_type: item.product_type,
  target_channel: item.target_channel,
  sheet_row: item.sheet_row,
  review_url: item.review_url,
  preview_url: item.preview_url,
  approval_fields: item.approval_fields || [],
  due_at: item.due_at,
  reminder_count: 0,
  last_reminded_at: null,
  agent: item.agent,
}).slice(0, 45000);

return [{
  json: {
    ...item,
    message,
    created_at: now,
    append_row: [
      item.event_id,
      item.event_type,
      item.agent,
      item.source_row_key || `row_${item.sheet_row || 0}`,
      item.sheet_tab,
      'pending',
      message,
      '',
      '',
      now,
      '',
      meta,
    ],
  },
}];
