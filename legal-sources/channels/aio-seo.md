# Kênh 1 — Website & Page: SEO + AIO

> **Đối tượng:** Công dân tìm kiếm / AI overview đọc snippet.  
> **Không:** Tư vấn case cá nhân, không hỏi CCCD trong bài publish.

---

## Nguồn dùng (theo thứ tự)

1. **`qa-knowledge.*.json`** — câu hỏi người thật, `short_answer` + `expanded_answer`
2. **`atomic-claims.*.json`** — fact pack, `forbidden_claims`
3. **`buildChannelPack('aio_seo')`** hoặc `buildLegalRetrievalPack({ topic })`
4. **Local policy** — chỉ khi bài nhắc tỉnh cụ thể (`local-policy/`)

**Không** đưa nguyên `*-counseling.md` dài vào bài — rút ý, link “đọc thêm” nếu có trang chi tiết.

---

## Cấu trúc bài chuẩn (Q&A AIO)

```markdown
# [Câu hỏi chính — đúng cách người hỏi]

[2-3 câu trả lời thẳng — từ short_answer Q&A]

## [Câu hỏi phụ 1 dạng H2?]
...

## [Câu hỏi phụ 2?]
...

**Lưu ý:** [disclaimer từ Q&A / claim]
```

- Meta title ≤ 60 ký tự; meta description có câu trả lời tóm tắt.
- FAQ schema: lấy từ `related_questions` trong Q&A cùng cluster.
- CTA: `safe_cta` trong Q&A (Comment CHECKLIST…) — value-first, không spam.

---

## Topic cluster gợi ý (NOXH)

| Cluster SEO | Q&A / claim chính |
|-------------|-----------------|
| Điều kiện mua NOXH | `qa-knowledge.nd100`, eligibility claims |
| Thu nhập 25/35/50 | batch2, batch3, local HCM QĐ 14 |
| Hồ sơ / Mẫu 01 | `qa-knowledge.application-form` |
| Vay NHCSXH 5,4% | `qa-knowledge.loan` |
| CT07 / cư trú | `mau01_qa_ct07_*` |
| CIC / nợ xấu | loan claims `bank_*`, `cic_*` |

---

## QA trước publish

| Bước | Việc |
|------|------|
| L0 | Parse JSON brief / không thiếu disclaimer |
| L2 `/devil` | Mọi bài NOXH, vay, định giá |
| L3 | Human duyệt trước đăng |

**Cấm publish:** số thu nhập cố định cho mọi người; “chắc được duyệt”; lãi suất ngoài pack.

---

## Agent / workflow

- **Subagent:** magnix-inbound-copywriter  
- **n8n:** `content-draft`, `content-classify` → segment `noxh_income`  
- **Pack:** `scripts/lib/legal-channel-pack.mjs` → `channel_id: aio_seo`
