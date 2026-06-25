# Magnix Telegram Approval Notifications

> Decision record: bat ky agent nao can human approve, human source, hoac bi block thi phai chu dong thong bao Telegram. Khong mac dinh nguoi van hanh phai vao Sheet tu kiem tra.

## 1. Muc tieu

Workflow Magnix phai van hanh theo co che push notification:

- Agent tao san pham can duyet -> gui Telegram ngay.
- Agent thieu nguon phap ly -> gui Telegram ngay.
- Agent fail parse / fail QA / khong co candidate bat thuong -> gui Telegram neu can human action.
- Neu qua SLA chua duyet -> gui nhac lai.
- Neu qua nhieu lan nhac -> escalation.

Khong agent nao duoc coi "waiting for approval" la hoan thanh neu chua co notification record.

## 2. Kenh Telegram

Dung mot bot Telegram rieng cho Magnix.

Env / n8n credentials:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID_OWNER=
TELEGRAM_CHAT_ID_OPS=
TELEGRAM_APPROVAL_ENABLED=true
TELEGRAM_REMINDER_ENABLED=true
```

Quy tac:

- Khong hardcode token trong workflow JSON.
- Token luu trong n8n Credential hoac env.
- Chat ID co the la private chat cua owner hoac group ops.
- Noi dung Telegram khong chua PII day du; chi gui title, segment, product_type, row link, source key rut gon.

## 3. Notification event schema

Moi workflow neu can thong bao nen tao event object:

```json
{
  "event_id": "agent6:video_drafts:row_12:approval_needed",
  "agent": "agent6",
  "event_type": "approval_needed",
  "severity": "action_required",
  "product_type": "short_video_package",
  "target_channel": "fb_reels",
  "title": "Thu nhap 15 trieu co mua NOXH khong?",
  "segment": "noxh_income",
  "source_key": "apify:tiktok:abc123",
  "sheet_tab": "video_drafts",
  "sheet_row": 12,
  "approval_fields": ["status=approved", "l3_approved=true"],
  "review_url": "https://docs.google.com/spreadsheets/d/...#gid=...",
  "preview_url": "optional_drive_or_render_url",
  "due_at": "2026-06-24T15:00:00+07:00",
  "reminder_count": 0,
  "status": "sent"
}
```

## 4. Event types

| Event type | Khi nao gui | Ai can lam |
|------------|-------------|------------|
| `approval_needed` | Co asset draft can L3 duyet | Owner / editor |
| `render_review_needed` | Co MP4 / assembly package can xem truoc khi dang | Owner / editor |
| `legal_source_needed` | Agent can source phap ly vi `needs_human_legal_source=true` | Owner / legal reviewer |
| `qa_failed` | L0 / L1 / L2 fail va can sua noi dung | Owner / editor |
| `publish_ready` | Asset da approved, san sang dang thu cong | Owner / ops |
| `metrics_needed` | Bai da dang nhung chua co metrics 24-72h | Owner / ops |
| `workflow_blocked` | Cron chay nhung khong co candidate bat thuong, thieu credential, parse fail hang loat | Owner / technical ops |

## 5. Map theo agent

| Agent | Notification bat buoc |
|-------|------------------------|
| Agent 1 - Social Listening | `workflow_blocked` neu fetch fail, khong co data nhieu ky, hoac parse fail hang loat |
| Agent 2 - Classify | `legal_source_needed` neu topic nhay cam ma khong map duoc Legal KB; `workflow_blocked` neu parse fail |
| Layer B - Editorial Brief | `legal_source_needed` neu thieu retrieval pack; `approval_needed` neu brief co claim high-risk can xem |
| Agent 3 - Written Product | `approval_needed` cho Page post / website article / carousel / lead magnet draft |
| Agent 4 - Outreach | `approval_needed` cho outreach queue; `publish_ready` khi approved de gui thu cong |
| Agent 5 - Scorecard | `metrics_needed` khi thieu metrics; `publish_ready`/`repurpose` khi verdict scale/hub_candidate |
| Agent 6 - Production Package | `approval_needed` cho video/slide/screen package |
| Agent 7 - Assembly Assistant | `render_review_needed` khi co MP4/package; `workflow_blocked` neu thieu footage, voice, SRT, render URL |

## 6. Message templates

### 6.1 Approval needed

```text
[Magnix] Can duyet L3
Agent: Agent 6 - Production Package
Loai: short_video_package -> fb_reels
Tieu de: Thu nhap 15 trieu co mua NOXH khong?
Segment: noxh_income
Can lam: status=approved + l3_approved=true hoac rejected
Mo review: {review_url}
Han xu ly: {due_at}
```

### 6.2 Legal source needed

```text
[Magnix] Can bo sung can cu phap ly
Agent: Layer B / Legal KB
Topic: noxh_income
Ly do: retrieval pack thieu source_refs cho claim high-risk
Can lam: bo sung Legal KB hoac reject topic
Mo dong: {review_url}
```

### 6.3 Render review needed

```text
[Magnix] Can xem ban dung video
Agent: Agent 7 - Assembly
Loai: MP4 / assembly package
Tieu de: {title}
Preview: {preview_url}
Can lam: xem, dang thu cong, cap nhat status=published hoac rejected
```

### 6.4 Reminder

```text
[Magnix Reminder] Chua xu ly approval
Da cho: {age_hours}h
Agent: {agent}
Dong: {sheet_tab} row {sheet_row}
Can lam: approve / reject / request_revision
Mo review: {review_url}
```

## 7. SLA va reminder

| Event | Nhac lan 1 | Nhac lan 2 | Escalation |
|-------|------------|------------|------------|
| `approval_needed` | sau 2h | sau 8h | sau 24h |
| `render_review_needed` | sau 2h | sau 8h | sau 24h |
| `legal_source_needed` | sau 1h | sau 4h | sau 12h |
| `qa_failed` | sau 4h | sau 24h | weekly digest |
| `metrics_needed` | sau 24h publish | sau 72h publish | weekly digest |
| `workflow_blocked` | ngay lap tuc | sau 2h neu van fail | sau 8h |

Reminder phai dedupe theo `event_id`, khong spam moi lan cron chay.

## 8. Notification log

Can co mot noi luu log notification, uu tien Google Sheet tab `notification_events`.

Header goi y:

```
event_id	agent	event_type	severity	product_type	title	sheet_tab	sheet_row	review_url	preview_url	status	sent_at	last_reminded_at	reminder_count	resolved_at
```

Trang thai:

- `sent`
- `reminded`
- `resolved`
- `muted`
- `failed`

Khi nguoi dung approve/reject tren Sheet, workflow reminder phai danh dau event `resolved`.

## 9. n8n implementation pattern

Moi workflow co human action nen them block cuoi:

```
Create product / draft
  -> Build notification event
  -> Upsert notification_events
  -> IF TELEGRAM_APPROVAL_ENABLED
  -> Telegram Send Message
```

Reminder workflow rieng:

```
Schedule every 30m
  -> Read notification_events unresolved
  -> Check SLA
  -> Send reminder Telegram
  -> Update reminder_count / last_reminded_at
```

Resolver workflow:

```
Schedule every 30m
  -> Read approval tabs
  -> If status approved/rejected/published
  -> Mark matching notification_events resolved
```

## 10. Done definition bo sung

Voi bat ky workflow co human gate:

- Tao asset cu the.
- Ghi status `draft` / `queued_review`.
- Tao notification event.
- Gui Telegram hoac ghi `notification_status=failed`.
- Chi khi event duoc resolved moi chuyen sang publish/render/send step.

