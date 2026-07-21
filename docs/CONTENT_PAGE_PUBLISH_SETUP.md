# Facebook Page Publish — Magnix (P4.3)

> Workflow `content-page-publish`: đăng bài **Facebook Page** từ Postgres `content_drafts` (Admin SoR) sau L3 approve. Honor `scheduled_at`.

## Luồng

```
Cron 10h / 14h / 18h VN (hoặc Manual)
  → GET House X /api/cron/content-page-publish-due (CRON_SECRET)
    → status=APPROVED + FB_PAGE/meta + scheduled_at ≤ now
  → L0 forbidden check
  → Graph API POST /{page-id}/feed
  → POST House X mark (status=PUBLISHED + meta.fb_post_id)
  → Append content_metrics Sheet (optional audit)
```

**SoR:** Postgres Admin (`/admin/content-drafts`). Sheet chỉ còn nguồn sync n8n → Admin (P4.2), không phải input publish.

## 1. Meta Developer (một lần)

1. [developers.facebook.com](https://developers.facebook.com) → tạo App (Business).
2. Quyền Page token: `pages_manage_posts`, `pages_read_engagement`.
3. Lấy **Page ID** + **Page Access Token** dài hạn (System User).

## 2. Env n8n / VPS

```bash
CONTENT_PAGE_PUBLISH_ENABLED=true
META_PAGE_ID=123456789012345
META_PAGE_ACCESS_TOKEN=EAAxxxxx
META_GRAPH_API_VERSION=v21.0
HOUSEX_PUBLIC_URL=https://timnhaxahoi.com
CRON_SECRET=<cùng giá trị House X .env>
```

## 3. Chuẩn bị bài trên Admin

1. Sync Sheet → `/admin/content-drafts` (hoặc tạo tay).
2. CTA tool NƠXH + checklist L3 → **Duyệt L3** (`APPROVED`).
3. Kênh = **Facebook Page** (`FB_PAGE`) hoặc meta `target_channel=facebook_page`.
4. **Lịch đăng**: trống = due ngay khi cron; ISO tương lai = chờ.

### Due rules

| Điều kiện | Chi tiết |
|---|---|
| status | `APPROVED` |
| channel | `publishChannel=FB_PAGE` hoặc `meta.target_channel` ∈ {facebook_page, fb_page} |
| schedule | cột `scheduled_at` ưu tiên; fallback `meta.scheduled_at`; null = due ngay |
| body | `meta.publish_body` \|\| artifact \|\| hook ≥ 40 ký tự |
| chưa đăng | không có `meta.fb_post_id` / `page_published` |

## 4. API machine

| Method | Path |
|---|---|
| GET | `/api/cron/content-page-publish-due?limit=3` |
| POST | `/api/cron/content-page-publish-due` body `{ id, publish_ok, fb_post_id?, ... }` |

Auth: `Authorization: Bearer CRON_SECRET`.

## 5. Rebuild n8n

```bash
node n8n-workflows/build-content-page-publish.mjs
# import/push content-page-publish.workflow.json
```

## 6. Legacy Sheet

Agent 3 vẫn có thể ghi Sheet `content_drafts`; sync P4.2 → Admin. Page Publish **không** đọc Sheet trực tiếp nữa.
