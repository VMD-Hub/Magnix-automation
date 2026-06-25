# Credential — tái dùng Google/n8n từ Lifestyle_SuperApp

Tài liệu này gom đường dẫn và tên biến có thể tái dùng để cấu hình Magnix theo quyết định mới: **Google Sheet primary + Google Drive archive**.

Không commit secret vào Git.

## 1. Google API

### Nguồn trong Lifestyle

| Mục | Đường dẫn |
|-----|-----------|
| Service account JSON | `Lifestyle_SuperApp/tools/workflow-bds-pipeline/service-account.json` |
| Env BDS pipeline | `Lifestyle_SuperApp/tools/workflow-bds-pipeline/.env` |
| Chuẩn folder Drive KODO | `Lifestyle_SuperApp/docs/workflow-bds/DRIVE_KODO_MIRROR_AND_FOLDER_STANDARD.md` |

### Service account

- Project GCP: `gpl-automation`
- Email SA: `bds-pipeline@gpl-automation.iam.gserviceaccount.com`
- File JSON local: `n8n-workflows/credentials/google-service-account.json` (gitignored)

Share Google Sheet database và Drive archive folder cho service account với quyền Editor nếu dùng SA.

## 2. Google Sheet database

Magnix dùng một Sheet database chính. Env:

```env
GOOGLE_SHEET_DATABASE_ID=
GOOGLE_SHEET_UID_TAB=uid_leads
GOOGLE_SHEET_CONTENT_QUEUE_TAB=content_queue
GOOGLE_SHEET_CONTENT_DRAFTS_TAB=content_drafts
GOOGLE_SHEET_VIDEO_DRAFTS_TAB=video_drafts
GOOGLE_SHEET_OUTREACH_TAB=outreach_queue
GOOGLE_SHEET_CONTENT_METRICS_TAB=content_metrics
GOOGLE_SHEET_CONTENT_SCORECARD_TAB=content_scorecard
GOOGLE_SHEET_NOTIFICATION_EVENTS_TAB=notification_events
```

Các tab chuẩn xem `.cursor/STORAGE_OPTIONS.md`.

## 3. Google Drive archive

Tạo folder:

```
Magnix_Automation/
  leads/
  content-products/
  social-raw/
  render-packages/
```

Env:

```env
GOOGLE_DRIVE_ARCHIVE_FOLDER_ID=
GOOGLE_SERVICE_ACCOUNT_JSON=./credentials/google-service-account.json
MAGNIX_DRIVE_BACKUP=true
```

## 4. n8n & webhook

| Mục | Giá trị |
|-----|---------|
| Public URL | `https://n8n.vmd.asia` |
| Magnix webhook path | `/webhook/magnix/{workflow-slug}` |
| UID ingest | `/webhook/magnix/uid-ingest` |

Token webhook Magnix: đặt `MAGNIX_WEBHOOK_TOKEN`.

## 5. LLM keys

Magnix có thể dùng DeepSeek/Anthropic/Gemini tùy workflow:

```env
DEEPSEEK_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

## 6. Checklist sau sync

- [ ] `n8n-workflows/.env` tồn tại và gitignored.
- [ ] Google Sheet database đã share cho credential n8n hoặc service account.
- [ ] Drive archive folder đã share cho credential n8n hoặc service account.
- [ ] `GOOGLE_SHEET_DATABASE_ID` và tab names đúng.
- [ ] `GOOGLE_DRIVE_ARCHIVE_FOLDER_ID` đúng.
- [ ] Import workflow → gán Google Sheets/Drive credential.
- [ ] Trên VPS: thêm env vào container n8n, giữ nguyên `N8N_ENCRYPTION_KEY` hiện có.

