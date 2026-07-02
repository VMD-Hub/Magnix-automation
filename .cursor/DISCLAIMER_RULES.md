# Content Type Router — CTA + Disclaimer

> Mở rộng từ Disclaimer Selector. Chạy **sau Parse**, **trước L0** (Agent 3).
> Config: `n8n-workflows/disclaimers.json` + `n8n-workflows/cta_templates.json`

---

## Pipeline

```
LLM → Parse → Content Type Router → L0 → L2 → Merge → Sheet
```

Node: `Content Type Router` (`code/content-draft/03b-content-type-router.js`).

**Thứ tự nội dung:** `artifact_markdown` (body) → `cta_opt_in` → `disclaimer`  
Page publish: hook → body → **CTA → disclaimer** → hashtags

---

## `content_type` (enum)

| Giá trị | Keyword CTA | Lead magnet |
|---------|-------------|-------------|
| `NOXH_LEGAL` | `NOXH` | Checklist hồ sơ NOXH |
| `LOAN_FINANCE` | `DONGTIEN` | Excel dòng tiền vay bank |
| `VALUATION` | `DINHGIA` | Giải pháp thẩm định giá độc lập |
| `GENERAL_POLICY` | (ngữ cảnh) | CTA nhẹ → offer gần nhất hoặc bỏ qua |

Chỉ 3 keyword đo lường: **NOXH**, **DONGTIEN**, **DINHGIA**.

---

## `channel` (enum)

| Giá trị | Dùng khi |
|---------|----------|
| `facebook` | Page post, Reels caption, comment opt-in |
| `blog_seo` | Website article, link tải trực tiếp |

**Không sửa UID §3.1.** Lưu `meta.channel` + map từ `meta.target_channel` hiện có (`facebook_page` → `facebook`, `website_article` → `blog_seo`).

Ưu tiên: `meta.channel` → `target_channel_map` → default `facebook`.

---

## Anti-duplication CTA

Gỡ trước inject: `CHECKLIST`, `MAU01`, `SAVE`, `DTI` (+ dòng Comment/Inbox cũ).  
Không lặp cụm pháp lý trong CTA (`forbidden_cta_phrases` trong config).

---

## Logging (`meta.content_type_router`)

```json
{
  "normalized_key": "...",
  "content_type": "NOXH_LEGAL",
  "channel": "facebook",
  "cta_keyword": "NOXH",
  "cta_skipped": false,
  "cta_mode": "primary",
  "requires_legal_review": true
}
```

Dùng `cta_keyword` trên Sheet để đo keyword → lead.

---

## Env

| Biến | Mục đích |
|------|----------|
| `MAGNIX_BRAND_NAME` | Disclaimer `{{brand}}` |
| `MAGNIX_OFFER_LINK_NOXH` | Link blog CTA NOXH |
| `MAGNIX_OFFER_LINK_DONGTIEN` | Link blog CTA dòng tiền |
| `MAGNIX_OFFER_LINK_DINHGIA` | Link blog CTA định giá |

---

## Test & deploy

```bash
node tests/content-type-router.test.mjs
node n8n-workflows/build-content-draft.mjs
node scripts/push-n8n-workflows.mjs
```

Chi tiết disclaimer: phần trên + `disclaimers.json`. QA L2: `.cursor/QA_TIERS.md`.

---

## Disclaimer v2 — Khẳng định chuyên gia + CTA (đã triển khai 2026-06-28)

**Quyết định đã chốt:**

- Chấp nhận trade-off trách nhiệm (bỏ tông phủ định *"không phải tư vấn pháp lý"*).
- **Tách** copy Reel vs post dài.
- Tên hiển thị Page: **`Tim Nha O Xa Hoi`** (`{{page}}` trong template).

### Variant

| Variant | Format | Copy |
|---------|--------|------|
| `reel_short` | `fb_reels`, `video_script`, tiktok… | Inbox tư vấn 1:1 — ngắn |
| `post_long` | `fb_page_post_image`, `carousel_image`… | Team {{page}} + inbox / **để lại SĐT** |

Config: `n8n-workflows/disclaimers.json` → `templates.reel_short` · `templates.post_long`

### Env

| Biến | Mục đích |
|------|----------|
| `MAGNIX_PAGE_DISPLAY_NAME` | Tên Page Facebook trong disclaimer (**ưu tiên**) — mặc định file: `Tim Nha O Xa Hoi` |
| `MAGNIX_BRAND_NAME` | Fallback nếu không set `MAGNIX_PAGE_DISPLAY_NAME` |

### Logging

`meta.content_type_router` / `disclaimer_injection`:

```json
{
  "disclaimer_variant": "post_long",
  "disclaimer_template_key": "post_long/NOXH_LEGAL",
  "page_display_name": "Tim Nha O Xa Hoi"
}
```

Agent 6 video: inject `reel_short` tại `05-merge-video-row.js`.

### Strip boilerplate cũ

`boilerplate_patterns` gỡ disclaimer phủ định cũ khỏi `artifact_markdown` trước inject.

### Lưu ý trách nhiệm (đã chấp nhận)

Bỏ disclaimer phủ định = Page nhận vai trò tư vấn rõ hơn khi quy định/số liệu thay đổi. L2 `/devil` vẫn chạy cho segment pháp lý.
