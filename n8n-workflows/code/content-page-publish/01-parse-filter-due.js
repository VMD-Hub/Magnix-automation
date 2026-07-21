// n8n Code: unwrap House X due drafts (P4.3) → candidates Page Publish

const BATCH = __PAGE_PUBLISH_BATCH_SIZE__;

const enabled = String($env.CONTENT_PAGE_PUBLISH_ENABLED || '').toLowerCase() === 'true';
if (!enabled) {
  return [{
    json: {
      empty: true,
      message: 'CONTENT_PAGE_PUBLISH_ENABLED không bật — set true trên VPS',
    },
  }];
}

const pageId = String($env.META_PAGE_ID || '').trim();
const token = String($env.META_PAGE_ACCESS_TOKEN || '').trim();
if (!pageId || !token) {
  return [{
    json: {
      empty: true,
      message: 'Thiếu META_PAGE_ID hoặc META_PAGE_ACCESS_TOKEN',
    },
  }];
}

const res = $input.first().json || {};
const payload = res.data && typeof res.data === 'object' ? res.data : res;
const items = Array.isArray(payload.items) ? payload.items : [];
const blockers = payload.blockers || null;

if (!items.length) {
  return [{
    json: {
      empty: true,
      message:
        'Không có bài Page due trên Postgres — cần APPROVED + FB_PAGE/meta + scheduled_at<=now (Admin /admin/content-drafts)',
      blockers,
      scanned: payload.scanned ?? 0,
    },
  }];
}

const out = [];
for (const item of items) {
  if (!item?.id) continue;
  out.push({
    json: {
      id: item.id,
      draft_id: item.id,
      normalized_key: item.normalized_key,
      title: item.title,
      hook_line: item.hook_line,
      artifact_markdown: item.artifact_markdown,
      cta_opt_in: item.cta_opt_in,
      disclaimer: item.disclaimer,
      segment: item.segment,
      export_hint: item.export_hint,
      status: item.status,
      publish_channel: item.publish_channel,
      scheduled_at: item.scheduled_at,
      sheet_key: item.sheet_key,
      product_type: item.product_type || 'fb_page_post',
      meta_parsed: item.meta_parsed || {},
      page_id: pageId,
    },
  });
  if (out.length >= BATCH) break;
}

if (!out.length) {
  return [{
    json: {
      empty: true,
      message: 'Due list rỗng hoặc thiếu id',
      blockers,
    },
  }];
}

return out;
