# Content Scorecard — Google Sheet Setup

Workflow **Mạch 5:** đọc metrics từ Google Sheet → chấm điểm (`score.mjs` logic) → ghi kết quả vào tab `content_scorecard` → cập nhật tab metrics.

## Luồng

```
Schedule 10h / Manual (giờ VN — `TZ=Asia/Ho_Chi_Minh` trên VPS)
  → Read Google Sheet (content_metrics)
  → Filter pending rows (scorecard_status != done)
  → Normalize columns → metrics JSON
  → Run score.mjs Logic (parity với CLI)
  → Upsert Google Sheet tab content_scorecard
  → Update Sheet row (verdict, ivi_pct, analyzed_at)
  → Summary
```

## 1. Google Sheet

Dùng Sheet chính **Database_Magnix_Lead** hoặc Sheet metrics riêng. Tạo 2 tab:

- `content_metrics`
- `content_scorecard`

## 2. Tab `content_metrics`

Header dòng 1:

| Cột bắt buộc | Cột metrics | Cột output |
|--------------|-------------|------------|
| `post_id` | `reach` hoặc `views` | `scorecard_status` |
| `platform` | `completion_rate` | `analyzed_at` |
| `segment` | `save_rate`, `share_rate` | `verdict` |
| | `keyword_comments`, `dm_opt_in` | `performance_score` |
| | `warm_lead_rate` | `ivi_pct` |
| | platform-specific | `next_action` |

Platform values: `tiktok`, `fb_reels`, `fb_page`, `youtube_shorts`.

Metrics theo platform:

| Platform | Cột thêm |
|----------|----------|
| tiktok | `rewatch_rate`, `early_swipe_away_3s` |
| fb_reels | `retention_3s`, `retention_50pct`, `loop_factor` |
| fb_page | `video_avg_watch_pct`, `comment_rate` |
| youtube_shorts | `viewed_not_swiped`, `apv`, `swipe_away_3s` |

Quy ước nhập:

- Tỷ lệ: `0.72` hoặc `72%`.
- `scorecard_status`: để trống hoặc `pending` → workflow xử lý.
- Mỗi post score một lần; muốn chạy lại thì xóa `analyzed_at` hoặc đổi status.

## 3. Tab `content_scorecard`

Header dòng 1:

```
post_id	platform	segment	performance_score	ivi_pct	verdict	primary_retention_metric	primary_retention_tier	ivi_tier	next_action	recommendations	scorecard_json	analyzed_at	status
```

`post_id` là dedupe key.

## 4. n8n env

```env
GOOGLE_SHEET_CONTENT_METRICS_ID=
GOOGLE_SHEET_CONTENT_METRICS_TAB=content_metrics
GOOGLE_SHEET_CONTENT_SCORECARD_TAB=content_scorecard
```

Credential: Google Sheets OAuth hoặc Google Service Account.

## 5. Import workflow

```bash
node n8n-workflows/build-content-scorecard.mjs
```

1. n8n → Import `content-scorecard.workflow.json`
2. Gán credential Google Sheets cho các node đọc/ghi Sheet
3. Activate workflow
4. Manual run → kiểm tra `content_scorecard` và `content_metrics` được cập nhật

## 6. View gợi ý

- Filter `verdict = hub_candidate` → repurpose Hub tuần này.
- Filter `verdict = kill` → không repurpose.
- Filter `status = analyzed` → đã xử lý.

## 7. Sample row

| post_id | platform | segment | reach | completion_rate | keyword_comments | dm_opt_in | scorecard_status |
|---------|----------|---------|-------|-----------------|------------------|-----------|------------------|
| tt-20260622-01 | tiktok | noxh_income | 18500 | 0.74 | 62 | 18 | pending |

Sau chạy workflow → `scorecard_status=done`, `verdict`, `ivi_pct`, `performance_score`, `next_action` được điền.

