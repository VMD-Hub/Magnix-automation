# Hook Completion Gate — Magnix Agent 3 (text_post / Facebook Page)

> Chạy **sau Content Type Router** (CTA + disclaimer + hashtags), **trước L0**.
> Validation GATE — **không auto-fix**. Placeholder hook → **BLOCK**; social mechanics → **FLAG** → `status=review`.

---

## Vị trí pipeline

```
Parse → Content Type Router → Hook Completion Gate → IF pass → L0 → L2 → Sheet
```

Config: `n8n-workflows/cta_templates.json` (`social_mechanics`, `hashtags`) · Logic: `code/shared/hook-qa-gate.mjs` · Node: `03c-hook-completion-gate.js`

Đầu run: `Index Published Titles` cũng index `comment_unlock_index` từ `content_drafts` (tần suất CTA).

---

## Hard block (`hook_rejected`)

| Pattern | Lý do |
|---------|-------|
| `hook_line` rỗng | EMPTY |
| `chờ biên tập`, `chờ Layer B`, `{{`, `[TODO]` | Placeholder hook |

Fail → không qua L0, không ghi `content_drafts`.

---

## Soft flags (route `hook_review` — không block đăng)

### 1. Anti comment-baiting (`risk_comment_bait_pure`)

Theo định nghĩa Meta: yêu cầu comment từ/ký tự cụ thể để đổi lấy giá trị.

**Rule:** Câu cuối bài **chỉ** là `Comment "KEYWORD" để nhận…` **và** trước đó **không** có:
- (a) câu hỏi mở (`?`, từ hỏi: bạn/ai/gì/sao/…), **hoặc**
- (b) ngữ cảnh giá trị (checklist, hồ sơ, điều kiện, tên tài liệu offer…)

→ `risk_comment_bait_pure: true` · `status=review`

### 2. Facebook truncation (`hook_truncation_risk`)

Mobile feed cắt ~**125 ký tự** (`social_mechanics.facebook_truncation_chars`).

Nếu `hook_line > 125` **và** 125 ký tự đầu **không** chứa `?`, số, hoặc tín hiệu hook (có/đủ/lương/triệu/noxh/…).

→ flag rewrite — đưa ý chính lên đầu.

### 3. Comment-unlock frequency (`risk_comment_unlock_frequency`)

Đếm bài có CTA `Comment "KEYWORD"` trong `content_drafts` (status: draft/review/approved/published):

| Ngưỡng đề xuất (config) | Mặc định code |
|-------------------------|---------------|
| `max_comment_unlock_per_week` | **3** — đã xác nhận 2026-06-28 |
| `max_comment_unlock_per_day` | **1** — đã xác nhận 2026-06-28 |

Vượt ngưỡng → flag cảnh báo tần suất (không block cứng).

---

## Hashtags (Content Type Router)

Field **`hashtags`** riêng — **không** nhồi vào `hook_line`.

| Rule | Chi tiết |
|------|----------|
| Số lượng | 2–3 (`hashtags.count_min/max`) |
| Nguồn | Map theo `content_type` trong `cta_templates.json` |
| Cấm | `#xuhuong`, `#viral`, `#fyp`, … (`hashtags.forbidden`) |

Lưu trong `draft.hashtags` + `meta.hashtags`.

---

## Logging

`meta.hook_qa`: `flags`, `reasons`, `risk_comment_bait_pure`, `comment_unlock_week_count`, `hashtags`.

Stats run: `hook_rejected`, `hook_comment_bait_review`, `hook_truncation_review`, `hook_frequency_review`.

---

## Test

```bash
node tests/hook-qa-gate.test.mjs
node tests/content-type-router.test.mjs
```
