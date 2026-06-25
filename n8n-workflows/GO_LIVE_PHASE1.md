# Magnix — Go-live n8n VPS (Google Sheet Primary)

> Google Sheet là store-of-record và ops queue/review. Drive là archive JSONL.

## Checklist

```
[~] 1A — Copy biến env Google lên container n8n (probe OK; redeploy: node scripts/go-live-vps.mjs --deploy-env)
[✓] 1B — Import workflow cần chạy (node scripts/go-live-vps.mjs — push qua n8n API)
[ ] 1C — Gán Google Sheets/Drive credential (Agent 1 Drive Backup Upload — workflow đang inactive)
[ ] 1D — Manual run → Sheet cập nhật đúng status/output
[ ] 1E — Telegram notification (spec có — workflow chưa wire, Phase 2)
```

**Script go-live (local):**

```powershell
node scripts/go-live-vps.mjs              # generate env + rebuild + push + probe
node scripts/go-live-vps.mjs --deploy-env # + scp /root/n8n.env + restart n8n (cần SSH)
node scripts/probe-n8n-vps-env.mjs        # kiểm tra MAGNIX_VIDEO_TTS_URL / token trên VPS
```

**Đã xác nhận trên VPS (2026-06-24):** Agent 7 `env_probe` có `has_tts_url=true`, `has_webhook_token=true`, `block_env_access=false`. `DEEPSEEK_API_KEY` trống — Agent 2 dùng `ANTHROPIC_API_KEY`.

## 1A — Env trên VPS

File mẫu Linux: `n8n-workflows/.env.example`

Biến tối thiểu:

```bash
N8N_BLOCK_ENV_ACCESS_IN_NODE=false

MAGNIX_STORAGE_MODE=google_sheet_primary_drive_archive
GOOGLE_SHEET_DATABASE_ID=
GOOGLE_SHEET_UID_TAB=uid_leads
GOOGLE_SHEET_CONTENT_QUEUE_TAB=content_queue
GOOGLE_SHEET_CONTENT_DRAFTS_TAB=content_drafts
GOOGLE_SHEET_VIDEO_DRAFTS_TAB=video_drafts
GOOGLE_SHEET_OUTREACH_TAB=outreach_queue
GOOGLE_SHEET_CONTENT_METRICS_TAB=content_metrics
GOOGLE_SHEET_CONTENT_SCORECARD_TAB=content_scorecard
GOOGLE_SHEET_NOTIFICATION_EVENTS_TAB=notification_events

GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=
MAGNIX_DRIVE_BACKUP=true
N8N_PUBLIC_URL=https://n8n.vmd.asia
```

Sau khi sửa env, restart container n8n.

## 1B — Import workflow

1. Mở `https://n8n.vmd.asia`
2. Workflows → Import from File
3. Chọn workflow JSON trong `n8n-workflows/`
4. Kiểm tra workflow không có node legacy ngoài Google Sheet/Drive nếu đang deploy mới

## 1C — Credentials

| Node | Credential |
|------|------------|
| Google Sheets read/update/upsert | Google Service Account hoặc OAuth đã share Sheet |
| Google Drive archive | Google Drive credential hoặc Service Account đã share folder |
| Telegram notify | Telegram bot credential/env |
| LLM HTTP | DeepSeek/Anthropic/Gemini key qua env/credential |

## 1D — Manual test

Ví dụ Mạch 5:

1. Thêm row test vào `content_metrics`.
2. Execute workflow.
3. Kỳ vọng `content_metrics.scorecard_status=done`.
4. Kỳ vọng tab `content_scorecard` có row theo `post_id`.

Dry-run local:

```powershell
node scripts/run-scorecard-from-sheet.mjs
node scripts/verify-google-setup.mjs
```

## 1E — Telegram notification

Workflow có human gate phải tạo row `notification_events` và gửi Telegram theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`.

## Lỗi thường gặp

| Lỗi | Cách sửa |
|-----|----------|
| `access to env vars denied` | Thêm `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` + restart container |
| `Node does not have any credentials set` | Chọn lại Google credential trên node → Save workflow |
| Sheet not found | Share Sheet cho credential/service account |
| Tab not found | Kiểm tra tên tab trong env và Sheet |
| Update Sheet fail | Thiếu cột output hoặc credential không có quyền Editor |
| Telegram không gửi | Kiểm tra bot token/chat id và `notification_events` |

