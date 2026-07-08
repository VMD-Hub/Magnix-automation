# n8n Workflows — Magnix

## Mạch 1: UID Ingest

| | |
|---|---|
| **File** | `uid-ingest.workflow.json` |
| **Storage** | House X Postgres (`POST /api/ingest/magnix-lead`) + Google Drive JSONL archive |
| **Webhook** | `POST /webhook/magnix/uid-ingest` |

### Luồng

```
Webhook → classify → merge
    ├─ HouseX Postgres Ingest (dedupe normalized_key) ← store of record (ADR-013)
    └─ Drive Backup Upload (.jsonl file)              ← archive, không block webhook
→ Respond
```

### Setup (3 bước)

1. **House X** — deploy API + `MAGNIX_INGEST_SECRET` trong `.env` (cùng giá trị n8n)
2. **Google Drive** — [`DRIVE_BACKUP_SETUP.md`](./DRIVE_BACKUP_SETUP.md)  
3. **n8n env** — copy [`.env.example`](./.env.example) (`HOUSEX_PUBLIC_URL`, `MAGNIX_INGEST_SECRET`)

Import workflow → gán Drive OAuth (archive) → Activate → curl test.

> Sheet `uid_leads` không còn là SoR — chỉ dùng mirror/ops nếu bật sau (Phase 2).

### Rebuild sau khi sửa code

```bash
node n8n-workflows/build-uid-ingest.mjs
```

### Test curl (n8n webhook)

```bash
curl -X POST "https://n8n.vmd.asia/webhook/magnix/uid-ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_MAGNIX_WEBHOOK_TOKEN" \
  -d @tests/fixtures/uid-classify/input_001.json
```

Kỳ vọng: `ok: true`, `storage: "postgres_housex"`, row trong `inbound_uid_leads` (House X), file `{normalized_key}.jsonl` trên Drive.

### Test trực tiếp House X API (bypass n8n)

```bash
curl -X POST "https://timnhaxahoi.com/api/ingest/magnix-lead" \
  -H "Content-Type: application/json" \
  -H "x-magnix-ingest-secret: YOUR_MAGNIX_INGEST_SECRET" \
  -d '{"uid":"123","uid_source":"fb_ads","normalized_key":"fb_ads:123","captured_at":"2026-07-08T00:00:00.000Z","segment":"noxh_income","score":72,"status":"classified"}'
```

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
