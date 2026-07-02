# Title QA Gate — Magnix Agent 3

> Chạy **sau LLM generate**, **trước Parse Layer** (`.cursor/JSON_PARSE_LAYER.md`).
> Validation GATE — **không auto-fix**. Fail → `title_rejected` / `title_capitalization_error`, không qua QA tier tiếp.

---

## Capitalization Rules

**Chuẩn:** Sentence case (tiếng Việt) — chỉ hoa chữ đầu câu; không Title Case kiểu tiếng Anh; không ALL CAPS toàn từ/câu (trừ whitelist).

**Whitelist:** `.cursor/title_whitelist.json` — viết tắt giữ nguyên HOA (NOXH, DTI, CĐT, TP.HCM, MAU01, …). Thêm từ mới **chỉ sửa file JSON**.

| Tình huống | Kết quả |
|------------|---------|
| Từ khớp whitelist | OK |
| Từ đầu câu, tối đa 1 chữ hoa đầu từ | OK |
| Từ giữa câu có chữ hoa (không whitelist) | ❌ `title_capitalization_error` |
| Từ đầu câu 2+ chữ hoa / ALL CAPS | ❌ `title_capitalization_error` |

**PASS:** `Lương 8 triệu/tháng có đủ điều kiện mua NOXH không?` · `Kho mẫu NOXH cập nhật mới nhất`  
**FAIL:** `ĐIỀU KIỆN THU NHẬP MUA NOXH...` · `Kho Mẫu NOXH Cập Nhật Mới Nhất`

**MAU01:** Whitelist cho giải thích mẫu trong title; rule CTA vẫn chặn dùng MAU01 như keyword comment.

---

## Vị trí pipeline

```
LLM Lead Magnet → Title QA Gate → IF pass → Parse JSON → Content Type Router → L0 → …
                              └→ Track Title Reject → content_queue meta
```

Đầu run: `Fetch content_drafts` → `Index Published Titles` (Jaccard similarity).

Config: `n8n-workflows/title_rules.json` · Whitelist: `.cursor/title_whitelist.json` · Logic: `code/shared/title-qa-gate.mjs`

---

## Rule chặn khác (hard block)

| Pattern | Lý do log |
|---------|-----------|
| `[TEST]`, `[DRAFT]`, `[WIP]` | Draft tag in production title |
| `{{...}}` | Unrendered template variable |
| `X triệu`, `[số]`, `___` | Placeholder chưa điền |
| `comment`, `tải ngay`, `link drive`, `MAU01`, `CHECKLIST` | CTA content found in title field — move to cta_templates.json |
| `📂` / `📥` đầu title | CTA content found in title field — move to cta_templates.json |

Fail → `qa_status: "title_rejected"` hoặc `"title_capitalization_error"` + `title_qa_reason` trên `content_queue.meta`. **Không** set `draft_created`.

---

## Công thức title (LLM prompt — không sửa sau)

| `content_type` | Hướng dẫn |
|----------------|-----------|
| `NOXH_LEGAL` | Câu hỏi trực diện; số liệu cụ thể khi phù hợp |
| `LOAN_FINANCE` | Khẳng định + thuật ngữ DTI/room vay/dòng tiền |
| `VALUATION` | So sánh hoặc giải thích trực diện |
| `GENERAL_POLICY` | Tin tức/chính sách + mốc tháng/năm |

Inject vào system prompt Agent 3 lúc build (`title_rules.json`).

---

## Trùng chủ đề (soft gate)

- So sánh title mới với title `status ∈ {approved, published}` cùng `content_type`
- Metric: **Jaccard** token (không LLM)
- Ngưỡng mặc định: **0.7** (`title_rules.json.similarity_threshold`)
- Vượt ngưỡng → `title_duplicate_review: true`, `status=review` khi merge draft — **không** auto-publish

Log: `matched_title`, `similarity`, `duplicate_message`.

---

## Logging

```json
{
  "normalized_key": "...",
  "title_preview": "...",
  "content_type": "NOXH_LEGAL",
  "pass": false,
  "reasons": ["Draft tag [TEST]/[DRAFT]/[WIP] found in title"]
}
```

Stats run: `a3_stats.title_rejected`, `a3_stats.title_capitalization_error`, `a3_stats.title_dup_review`.

---

## Test

```bash
node tests/title-qa-gate.test.mjs
node n8n-workflows/build-content-draft.mjs
```

Case thật phải chặn:
- `[TEST] Điều kiện thu nhập...`
- `Lương X triệu có đủ NOXH không?`
- `📂 Kho mẫu NOXH cập nhật: Comment MAU01 nhận link Drive...`

---

## QA tiers

Title QA = **pre-L0 gate** (regex/rule, không LLM). Xem `.cursor/QA_TIERS.md`.
