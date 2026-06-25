# Lịch Social Listening — Agent 1

Magnix lắng nghe **1 lần/tuần** mỗi nền tảng. BĐS không có lượng video mới đủ lớn để scrape hàng ngày; 1 tuần cũng đủ để kiểm chứng chất lượng trước khi đưa vào pipeline content.

**Timezone VPS:** `TZ=Asia/Ho_Chi_Minh` (xem `.env.vps.example`).

---

## Lịch tách nền tảng (tránh trùng tài nguyên VPS)

| Workflow | File | Cron | Giờ VN | Platform trong `project_config` |
|----------|------|------|--------|----------------------------------|
| **TikTok** | `social-listening.workflow.json` | `0 7 * * 1` | **Thứ 2, 07:00** | `tiktok` |
| **Facebook** | `social-listening-facebook.workflow.json` | `0 7 * * 3` | **Thứ 4, 07:00** | `fb_page`, `fb_group` |
| **Agent 2 Classify** | `content-classify.workflow.json` | `0 8 * * *` | **Hàng ngày, 08:00** | `content_queue` pending |
| **Mạch 5 Scorecard** | `content-scorecard.workflow.json` | 10:00 hàng ngày | **10:00** | — (buffer sau listening) |

Hai workflow listening **không chạy cùng ngày** → Apify + Claude không spike cùng lúc.

---

## Dedupe & tiết kiệm token

| Tab Sheet | Mục đích |
|-----------|----------|
| `scrape_index` | Post đã xử lý → bỏ qua trước Claude |
| `channel_state` | Kênh đã quét trong **7 ngày** → bỏ qua (schedule); **Manual run** luôn quét |

Cấu hình: `channel_scrape_interval_days: 7` trong `magnix-public-config.json`.

---

## Tab Sheet cần tạo (ngoài `project_config`, `content_queue`)

### `scrape_index`

Header dòng 1:

```
normalized_key	post_id	platform	source	first_seen_at	meta
```

### `channel_state`

Header dòng 1:

```
handle	last_scraped_at	last_post_id	platform
```

Share Sheet cho Service Account (Editor) — cùng credential `googleApi` trên n8n.

---

## Env VPS (Apify)

```env
# TikTok — clockworks/tiktok-scraper
APIFY_RUN_URL=https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items

# Facebook — apify/facebook-posts-scraper (workflow riêng)
APIFY_FB_RUN_URL=https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items

APIFY_TOKEN=...
ANTHROPIC_API_KEY=...
TZ=Asia/Ho_Chi_Minh
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
```

---

## Rebuild workflow

```powershell
node n8n-workflows/build-social-listening.mjs
node n8n-workflows/build-social-listening-facebook.mjs
```

Import cả hai JSON lên n8n → gán `googleApi` trên Fetch, **Sheet Upsert content_queue**, Append nodes → Activate.

---

## `project_config` — ví dụ đa nền tảng

```
project_id	url	platform	active	segment	notes
listen-tt-01	https://www.tiktok.com/@kenh_noxh	tiktok	true	noxh_income	Kênh NOXH
listen-fb-01	https://www.facebook.com/tenpage	fb_page	true	noxh_income	Page tư vấn
listen-fb-02	https://www.facebook.com/groups/123456789	fb_group	true	general_inbound	Nhóm BĐS
```

- Workflow TikTok chỉ lấy dòng `platform=tiktok`.
- Workflow Facebook lấy `fb_page` và `fb_group`.
- `active=false` → bỏ qua, không xóa dòng.

---

## Go-live checklist

1. Tạo tab `scrape_index`, `channel_state` trên Sheet Magnix
2. Rebuild + import 2 workflow listening
3. Credential `googleApi` + Drive SA trên từng workflow
4. Set env `APIFY_RUN_URL`, `APIFY_FB_RUN_URL`, `TZ`
5. Manual run từng workflow → `Build Summary` có `stats.sheet_ok > 0` hoặc `hint` rõ ràng
6. Activate schedule sau khi manual OK
