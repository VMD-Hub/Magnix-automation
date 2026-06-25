# Google Sheet — tab `content_queue` (Agent 1)

**Store of record** cho Social Listening — Google Sheet là nguồn vận hành chính.

**Sheet:** [Database_Magnix_Lead](https://docs.google.com/spreadsheets/d/1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4/edit)  
**Tab mới:** `content_queue` (đặt tên **đúng chữ**, lowercase)

---

## 1. Tạo tab (2 phút)

1. Mở Sheet → **+** thêm sheet → đổi tên **`content_queue`**
2. Dòng **1** — dán header (copy dòng dưới):

```
normalized_key	post_id	platform	post_url	author_id	text	segment	score	claude_verdict	interest_key	status	captured_at	source	tags	meta
```

3. **Share** Sheet cho Service Account (`bds-pipeline@gpl-automation.iam.gserviceaccount.com` hoặc SA trên n8n) — **Editor** (đã share nếu `project_config` chạy OK)

Workflow tự **append/update** theo `normalized_key` bằng Google Sheet credentials.

---

## 2. Cột — contract Magnix

| Cột | Ghi chú |
|-----|---------|
| `normalized_key` | **Dedupe** — `apify:{platform}:{post_id}` |
| `post_id` | ID bài từ Apify |
| `platform` | tiktok, fb, … |
| `post_url` | Link bài |
| `author_id` | optional |
| `text` | Caption scrape |
| `segment` | Mặc định `unclassified` |
| `score` | 0–100 từ Claude |
| `claude_verdict` | qualified, maybe, reject |
| `interest_key` | `unknown` cho đến classify |
| `status` | raw, qualified, queued, published, rejected |
| `captured_at` | ISO8601 |
| `source` | `apify_social_listen` |
| `tags` | comma-separated |
| `meta` | JSON string (Claude + Apify preview) |

---

## 3. n8n sau import

1. Node **Fetch project_config** + **Sheet Append content_queue** → **cùng credential googleApi** (HTTP SA)
2. Node **Drive Backup Upload** → Google Service Account

---

## 4. Không thấy dòng mới?

Mở execution → node **Build Summary** → xem `stats` và `hint`:

| `stats` | Ý nghĩa |
|---------|---------|
| `apify_empty > 0` | Apify quota hết hoặc URL không có post — **không có gì để ghi** |
| `qualified = 0` | Claude reject tất cả (bình thường nếu scrape rỗng) |
| `qualified > 0` nhưng `sheet_ok = 0` | Chưa gán credential **Google Sheets SA** trên node Sheet Upsert |

Chỉ bài **`claude_verdict = qualified`** mới ghi Sheet (thiết kế có chủ đích).

---

## 5. View gợi ý trên Sheet

- **Filter:** `claude_verdict = qualified` AND `segment = unclassified`
- **Sort:** cột `score` giảm dần
- Tạo **Filter view** riêng tên `Qualified Inbound`

---

## 6. Quyết định

- ✅ Sheet = single source of truth cho Agent 1
- ✅ Drive backup vẫn chạy song song (`Magnix_Automation/apify_raw/`)
- ❌ Không mirror sang hệ thống khác trong workflow chính

Config ID: `n8n-workflows/magnix-public-config.json` → `content_queue_tab`
