# n8n Workflows — Magnix

## Mạch 1: UID Ingest

| | |
|---|---|
| **File** | `uid-ingest.workflow.json` |
| **Storage** | Google Sheet `uid_leads` upsert + Google Drive JSONL archive |
| **Webhook** | `POST /webhook/magnix/uid-ingest` |

### Luồng

```
Webhook → classify → merge
    ├─ Google Sheet Upsert (dedupe normalized_key) ← store of record
    └─ Drive Backup Upload (.jsonl file)           ← archive, không block webhook
→ Respond
```

### Setup (3 bước)

1. **Google Sheet database** — tạo tab `uid_leads` theo `ARCHITECTURE_MAGNIX.md` §3.1
2. **Google Drive** — [`DRIVE_BACKUP_SETUP.md`](./DRIVE_BACKUP_SETUP.md)  
3. **n8n env** — copy [`.env.example`](./.env.example)

Import workflow → gán Google Sheets/Drive OAuth → Activate → curl test.

### Rebuild sau khi sửa code

```bash
node n8n-workflows/build-uid-ingest.mjs
```

### Test curl

```bash
curl -X POST "https://n8n.vmd.asia/webhook/magnix/uid-ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_MAGNIX_WEBHOOK_TOKEN" \
  -d @tests/fixtures/uid-classify/input_001.json
```

Kỳ vọng: `ok: true`, `storage: "google_sheet_primary"`, row create/update trong Sheet và file `{normalized_key}.jsonl` trên Drive.

---

## Mạch 5: Content Scorecard (Sheet → score → Sheet)

| | |
|---|---|
| **File** | `content-scorecard.workflow.json` |
| **Trigger** | Cron daily 10h + Manual |
| **Storage** | Sheet `content_scorecard` + Sheet status columns |

### Luồng

```
Sheet (content_metrics) → filter pending → score.mjs logic → Sheet content_scorecard upsert → Sheet update → summary
```

### Setup

1. **Google Sheet tabs** — [`CONTENT_SCORECARD_SETUP.md`](./CONTENT_SCORECARD_SETUP.md)
2. **Env** — `GOOGLE_SHEET_CONTENT_METRICS_ID`, `GOOGLE_SHEET_CONTENT_SCORECARD_TAB`
3. Import → Google Sheets OAuth → Activate → Manual run

### Rebuild

```bash
node n8n-workflows/build-content-scorecard.mjs
```

Build chạy **parity check** — logic n8n khớp CLI `tools/content-scorecard/score.mjs`.

---

## Agent 1: Social Listening (Apify → Google Sheet)

| | |
|---|---|
| **File** | `social-listening.workflow.json` |
| **Trigger** | Cron 7h + Manual |
| **Storage** | Sheet `content_queue` + Drive `apify_raw/` |

### Luồng

```
Sheet project_config → Apify → Claude → qualified only → Sheet content_queue + Drive
```

### Setup

1. Sheet tab **`content_queue`** — [`SHEET_CONTENT_QUEUE_SETUP.md`](./SHEET_CONTENT_QUEUE_SETUP.md)
2. Sheet tab **`project_config`** — [`PROJECT_CONFIG_SETUP.md`](./PROJECT_CONFIG_SETUP.md)
3. Env: `APIFY_RUN_URL`, `APIFY_TOKEN`, `ANTHROPIC_API_KEY`. Agent 1 dùng Sheet làm ops queue.
4. Import → gán **googleApi** trên Fetch + Sheet Upsert + Drive SA → Manual test

### Rebuild

```bash
node n8n-workflows/build-social-listening.mjs
```

Storage setup: [`SHEET_CONTENT_QUEUE_SETUP.md`](./SHEET_CONTENT_QUEUE_SETUP.md)
