# QA Tiers — Kiểm định phân tầng

> **Không** chạy LLM QA (`/roast` + `/devil`) trên mọi output — tốn kém và dễ ảo giác an toàn.
> Chi tiết lệnh: `.cursor/SLASH_COMMANDS.md`.

---

## Bảng tầng

| Tầng | Cơ chế | Áp dụng | Bắt buộc |
|------|--------|---------|----------|
| **L0** | Regex / rule cấm từ + schema JSON | Mọi output tự động | ✅ Luôn |
| **Title QA** | Regex title gate (pre-parse) | Agent 3 lead magnet | ✅ Trước Parse |
| **L1** | Validate format (`/brief` ≤3 dòng cold, field schema) | Outreach, lead magnet parse | ✅ Trước lưu draft |
| **L2** | LLM **`/devil` only** — pháp lý, số liệu, disclaimer | NOXH, vay, định giá, SME credit | ✅ Content nhạy cảm |
| **L3** | Human approve trên Google Sheet (`draft` → `approved`) | Trước publish ra ngoài | ✅ Publish |

---

## L0 — Rule engine (Code node, không LLM)

```javascript
const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /chắc chắn.*(?:vay|mua|được)/i,
  /tốt nhất|duy nhất|không thể bỏ lỡ/i,
];

function l0Check(text) {
  const hits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);
  return { pass: hits.length === 0, forbidden_hits: hits };
}
```

+ JSON schema validate (parse layer)  
+ Không PII pattern (SĐT 10 số) trong output mẫu production

---

## L1 — Format gate

| Loại | Rule |
|------|------|
| Outreach cold | ≤3 dòng hoặc ≤280 ký tự (`/brief`) |
| Outreach warm | ≤4 câu + tham chiếu ngữ cảnh |
| Lead magnet | JSON có `artifact_markdown` + ≥1 bảng Markdown |
| Classify | `segment` enum + `score` 0–100 |

Fail L1 → `status=review`, không publish.

---

## L2 — LLM `/devil` (prompt `n8n__content-qa.md`)

**Chỉ khi** `content_type ∈ { NOXH_LEGAL, LOAN_FINANCE, VALUATION }`  
HOẶC `segment ∈ { noxh_income, valuation, sme_credit }`  
HOẶC brief/meta flag `requires_legal_qa: true` / `requires_legal_review: true`.

Chi tiết disclaimer: `.cursor/DISCLAIMER_RULES.md`

- **`/devil`:** luật sư nghiêm — claim, disclaimer, số liệu
- **`/roast`:** *không* dùng trên n8n mặc định — chỉ Cursor khi A/B test copy

Verdict: `pass` | `fail` | `human_review`  
`human_review` → bắt buộc L3, không auto-publish.

---

## L3 — Human gate

Luồng Google Sheet:

```
draft → [L0–L2 pass] → queued_review → approved → publish branch
```

Không node publish n8n chạy khi `status != approved`.

---

## Map mạch → QA

| Mạch | L0 | L1 | L2 | L3 |
|------|----|----|----|-----|
| 1 UID classify | ✅ parse JSON | ✅ schema | — | — |
| 2 Lead magnet | Title QA | ✅ | ✅ nếu legal | ✅ trước publish |
| 3 Outreach | ✅ | ✅ | tùy chọn | ✅ trước gửi |
| 4 QA node | — | — | ✅ (chính nó) | — |

---

## Anti-pattern

| Tránh | Làm |
|-------|-----|
| LLM QA mọi tin nhắn ngắn | L0 + L1 đủ cho outreach draft |
| LLM tự chấm rồi tự pass | L2 độc lập node; L3 human publish |
| `/roast` + `/devil` cùng node mặc định | n8n: `/devil` only; Cursor: cả hai khi cần |
