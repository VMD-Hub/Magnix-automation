# Magnix — Deploy VPS (6 Agent chuẩn + Layer B)

Checklist go-live **một lần** cho pipeline trên `https://n8n.vmd.asia`.

> **Registry:** `MAGNIX_AGENTS_REGISTRY.md` · **Agent 7 audit:** `AGENT7_AUDIT.md` (non-compliant — không bắt buộc activate).

> **Không phụ thuộc máy local:** Cron chạy trên n8n VPS. Rebuild/push workflow qua GitHub Actions hoặc `scripts/vps/on-server-sync.sh` trên VPS.

---

## 0. Chuẩn bị Sheet

```powershell
node scripts/init-magnix-sheet.mjs
```

Phải có các tab: `project_config`, `content_queue`, `scrape_index`, `channel_state`, `content_drafts`, `outreach_queue`, `video_drafts`, `content_metrics`.

Share Sheet cho Service Account — **Editor**.

---

## 1. Rebuild workflow JSON

**Một lệnh (local hoặc VPS):**

```powershell
node scripts/rebuild-all-workflows.mjs
```

Hoặc từng file trong `n8n-workflows/build-*.mjs`.

---

## 2. Env VPS (`/root/n8n.env`)

```env
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
TZ=Asia/Ho_Chi_Minh
GENERIC_TIMEZONE=Asia/Ho_Chi_Minh

MAGNIX_STORAGE_MODE=postgres_primary_drive_archive
HOUSEX_PUBLIC_URL=https://timnhaxahoi.com
MAGNIX_INGEST_SECRET=
GOOGLE_SHEET_CONTENT_METRICS_ID=1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4
GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=1iBjsrXLYmHfOHMQaAfLmZGug2kN0314D

APIFY_TOKEN=
APIFY_RUN_URL=https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items
APIFY_FB_RUN_URL=https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items

ANTHROPIC_API_KEY=
ANTHROPIC_CLASSIFY_MODEL=claude-haiku-4-5-20251001
ANTHROPIC_DRAFT_MODEL=claude-sonnet-4-6

DEEPSEEK_API_KEY=
DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions
DEEPSEEK_MODEL=deepseek-chat

CREATOMATE_API_KEY=
CREATOMATE_TEMPLATE_ID=
PEXELS_API_KEY=
```

Restart container sau khi sửa env:

```powershell
# In version + image ID đang chạy (không lộ env/secrets)
ssh -p 24700 root@103.57.221.93 "docker exec n8n n8n --version; docker inspect n8n --format='{{.Config.Image}} {{.Image}}'"

# Generate env rồi redeploy đúng image ID hiện đang chạy (không tự major upgrade)
node scripts/generate-n8n-vps-env.mjs
node scripts/deploy-vps-n8n.mjs
```

`deploy-vps-n8n.mjs` mặc định lấy immutable image ID của container hiện tại trước khi
recreate. Chỉ đặt `N8N_IMAGE=n8nio/n8n:<exact-version>` khi chủ động nâng cấp đã test;
không dùng tag trôi `n8nio/n8n` hoặc `latest`. Trước khi recreate, script tạo bản
`n8n_data` + `/root/n8n.env` (chứa encryption key) trong `/root/backup/n8n`,
kiểm tra checksum, giữ container cũ dưới tên `n8n-before-deploy`, rồi chỉ xóa
container cũ sau khi `/healthz` của bản mới trả thành công. Nếu health check lỗi,
script tự khôi phục container cũ.

Thiết lập và kiểm tra retention trên VPS:

```bash
# Mặc định read-only, in version/image ID, disk, Docker, log và n8n retention.
bash scripts/vps/measure-runtime-retention.sh

# Xem trước rồi mới cài PM2/logrotate.
bash scripts/vps/setup-runtime-log-retention.sh
sudo bash scripts/vps/setup-runtime-log-retention.sh --apply

# Apply housekeeping chỉ xoá dangling image >7 ngày + chạy logrotate.
sudo bash scripts/vps/measure-runtime-retention.sh --apply
```

Các script trên không prune Docker volume, `pg_wal`, uploads hoặc backup.

---

## 3. Import workflow

### Cách A — Push API (khuyến nghị, không cần máy local sau setup)

1. n8n → **Settings → API** → tạo key → lưu `N8N_API_KEY` trên VPS hoặc GitHub Secrets
2. Push:

```powershell
node scripts/push-n8n-workflows.mjs
# hoặc full deploy:
node scripts/magnix-vps-deploy.mjs --with-workflows
```

GitHub Actions (`.github/workflows/magnix-deploy-workflows.yml`) tự rebuild + push khi push `main`.

**Trên VPS** (cron 03:00): `scripts/vps/on-server-sync.sh` — git pull + rebuild + push.

### Cách B — Import thủ công (n8n UI)

| # | File | Agent |
|---|------|-------|
| 0 | `uid-ingest.workflow.json` | Mạch 1 UID ingest → House X Postgres |
| 1 | `social-listening.workflow.json` | Agent 1 TikTok |
| 2 | `social-listening-facebook.workflow.json` | Agent 1 Facebook |
| 3 | `content-classify.workflow.json` | Agent 2 |
| 4 | `content-editorial-brief.workflow.json` | Layer B |
| 5 | `content-draft.workflow.json` | Agent 3 |
| 6 | `content-video-draft.workflow.json` | Agent 6 (Mạch 6 script) |
| 7 | `content-video-render.workflow.json` | Agent 7 (Creatomate) — activate only after manual pass |
| 8 | `outreach-queue.workflow.json` | Agent 4 |
| 9 | `content-scorecard.workflow.json` | Agent 5 (Mạch 5) |
| 10 | `telegram-notify.workflow.json` | Telegram webhook — **activate trước** Agent 3/4/6/7 |
| 11 | `telegram-reminder.workflow.json` | SLA reminder (30m) |
| 12 | `telegram-resolver.workflow.json` | Auto-resolve events (30m) |

**Credential `googleApi`:** gán trên mọi node Fetch + Sheet Update/Append (Code node).

**Drive SA:** Agent 1 Drive Backup (nếu dùng).

**Creatomate:** Header Auth trên Agent 7 HTTP nodes (xem `AGENT7_VIDEO_RENDER_SETUP.md`).

---

## 4. Lịch chạy (giờ VN)

| Giờ | Workflow | Batch |
|-----|----------|-------|
| T2 07:00 | Agent 1 TikTok | weekly |
| T4 07:00 | Agent 1 Facebook | weekly |
| 08:00 daily | Agent 2 Classify | 200 |
| 08:30 daily | Layer B Editorial Brief | 5 |
| 09:00 daily | Agent 3 Draft | 5 |
| 09:15 daily | Agent 6 Video Script | 3 |
| 09:45 daily | Agent 7 Creatomate Render | 1 |
| 09:30 daily | Agent 4 Outreach | 10 |
| 10:00 daily | Agent 5 Scorecard | metrics row |

---

## 5. Manual test trước Activate

| Agent | Pass criteria |
|-------|----------------|
| UID ingest | curl webhook trả `storage=postgres_housex`, row trong `inbound_uid_leads`, Drive có `.jsonl` |
| 1 TikTok | `Build Summary` → `stats.sheet_ok > 0` hoặc hint rõ |
| 1 Facebook | idem |
| 2 | `stats.sheet_ok > 0` trên pending classify |
| 3 | Dòng mới tab `content_drafts`, `meta.draft_created` trên queue |
| 6 | Dòng mới tab `video_drafts`, `meta.video_draft_created` trên queue, `l3_approved=false` |
| 7 | `video_drafts.meta.render_url` + `status=ready_for_review` (cần L3 approve trước) |
| 4 | Dòng mới tab `outreach_queue`, `l3_approved=false` |
| 5 | 1 dòng `content_metrics` có `verdict` |

---

## 6. Activate theo đợt (khuyến nghị)

```
Đợt 0: UID ingest                → curl OK → Activate webhook
Đợt 0b: Telegram notify/reminder/resolver → 1 message thật → Activate (TRƯỚC draft/publish)
Đợt B: Agent 2 Classify          → Manual OK → Activate
Đợt B2: Layer B Editorial Brief  → Manual OK → Activate
Đợt D0: Agent 3 Draft (+ 3b optional) → Manual OK → Activate
Đợt P: content-page-publish      → Manual 1 Graph post + Postgres PUBLISHED → Activate cron 10/14/18
```

**P0 Content ops Page (cùng ngày) — dừng ở Đợt P.** Chưa bắt buộc:

```
Đợt A: Agent 1 Listen (TikTok/FB) — ngày sau
Đợt C: Scorecard
Đợt D: Agent 6 video + Agent 4 outreach
Đợt E: Agent 7 render
```

---

## 7. Luồng dữ liệu Sheet

```
project_config
    ↓ Agent 1
content_queue ──→ Agent 2 (classify)
    ├─→ Agent 3 (score≥70) → content_drafts ──→ L3 approve
    └─→ Agent 6 (score≥70) → video_drafts ──→ L3 approve + l3_approved=true
              ↓
         Agent 7 Creatomate → meta.render_url (ready_for_review)
              ↓ L3 xem MP4
         Đăng TikTok/Reels thủ công → content_metrics → Agent 5 Scorecard
              ↓ (lead magnet approved)
content_drafts ──→ Agent 4 → outreach_queue ──→ L3 l3_approved=true → gửi Zalo thủ công
```

---

## 8. Human gates (L3)

| Tab | Cột | Hành động |
|-----|-----|-----------|
| `content_drafts` | `status` | `draft` → sửa → `approved` |
| `video_drafts` | `status` + `l3_approved` | `draft` → sửa script → `approved` + `l3_approved=true` → Agent 7 render → `ready_for_review` → xem MP4 → đăng |
| `outreach_queue` | `l3_approved` | `false` → duyệt → `true` trước gửi |

Agent **không tự gửi** Zalo/Messenger và **không tự đăng** TikTok/Reels — chỉ sản xuất copy/kịch bản.

---

## 9. Troubleshooting

| Lỗi | Fix |
|-----|-----|
| `access to env vars denied` | `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` + restart |
| Sheet 401 | googleApi scope Sheets trên credential |
| Agent 3/4/6 LLM fail | `ANTHROPIC_API_KEY` hoặc `DEEPSEEK_API_KEY` |
| Agent 3 không candidate | `content_queue` cần `status=classified`, `score≥70` |
| Agent 6 không candidate | Idem + platform video + chưa `video_draft_created` |

Chi tiết Agent 2: `AGENT2_CONTENT_CLASSIFY_SETUP.md` · Layer B: `EDITORIAL_BRIEF_SETUP.md` · Agent 3/4: `SHEET_DRAFTS_OUTREACH_SETUP.md` · Agent 6: `AGENT6_VIDEO_DRAFT_SETUP.md` · Agent 7: `AGENT7_VIDEO_RENDER_SETUP.md`

---

## 10. Diagnostic (Sheet read-only)

```powershell
node scripts/diagnose-all-agents.mjs
# hoặc từng agent:
node scripts/diagnose-agent1-listening.mjs
node scripts/diagnose-agent2-candidates.mjs
node scripts/diagnose-agent3-candidates.mjs
node scripts/diagnose-agent4-candidates.mjs
node scripts/diagnose-agent5-candidates.mjs
node scripts/diagnose-agent6-candidates.mjs
node scripts/diagnose-agent7-candidates.mjs
```

Backfill `intake_v1` cho rows cũ: `node scripts/batch-pain-intake-backfill.mjs --limit 20`
