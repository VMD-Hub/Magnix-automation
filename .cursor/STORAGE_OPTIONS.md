# Magnix — Storage Options

> Decision record: Magnix dung **Google Sheet lam store of record**.

## 1. Nguyen tac

- VPS chi la compute cho n8n, khong luu lead/content lau dai tren disk VPS.
- Google Sheet la noi van hanh chinh: UID lead dedupe, queue, status, approve, review, metrics.
- Google Drive JSONL la archive ben vung va backup khoi phuc.
- Moi workflow phai dedupe bang `normalized_key` hoac `product_id`.
- Khong hardcode secret; dung n8n Credentials hoac env.

## 2. Vai tro luu tru

| Vai tro | Cong nghe | Muc dich |
|---------|-----------|----------|
| Store of record | Google Sheet | UID lead dedupe, status, content queue, approve, product queue, metrics |
| Archive | Google Drive JSONL | Backup raw record / product / execution artifact |
| Compute | VPS n8n | Classify, parse, merge, notify |

## 3. Sheet tabs chuan

| Tab | Muc dich |
|-----|----------|
| `uid_leads` | UID/lead ingest sau normalize/classify |
| `content_queue` | Pain/social listening queue |
| `content_drafts` | Page post, website article, carousel, lead magnet |
| `video_drafts` | Video/slide/screen production package |
| `outreach_queue` | Outreach reply theo CTA keyword |
| `content_metrics` | Metrics sau publish |
| `content_scorecard` | Ket qua scorecard va next action |
| `notification_events` | Telegram approval/reminder log |
| `legal_sources` | Metadata nguon phap ly |
| `legal_atomic_notes` | Atomic legal claims |
| `legal_qa` | Q&A AIO/SEO |

## 4. UID ingest storage

```
n8n webhook
  -> normalize / classify / parse
  -> Google Sheet upsert uid_leads by normalized_key
  -> Google Drive JSONL archive
  -> respond
```

Google Sheet `uid_leads` dung contract trong `ARCHITECTURE_MAGNIX.md` §3.1.

## 5. Content storage

```
content_queue
  -> editorial_brief
  -> content_drafts / video_drafts / outreach_queue
  -> notification_events
  -> human approve
  -> publish / assemble / send
  -> content_metrics
  -> content_scorecard
```

Moi content product phai tuan thu `docs/CONTENT_PRODUCT_OUTPUTS.md`.

## 6. Drive archive

Khuyen nghi path:

```
Magnix_Automation/
  leads/YYYY-MM.jsonl
  content-products/YYYY-MM.jsonl
  social-raw/YYYY-MM/{source_key}.json
  render-packages/YYYY-MM/{product_id}/
```

Archive khong thay Sheet cho dedupe hang ngay.

## 7. Env chuan

```env
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
```

## 8. Legacy cleanup

- Khong tao workflow moi phu thuoc he database khac khi Google Sheet du dap ung.
- Neu can doi storage, cap nhat decision record truoc khi sua workflow.

