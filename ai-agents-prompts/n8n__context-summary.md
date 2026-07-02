---
version: 1
channel: n8n
purpose: context-summary
circuit: 1
parse_layer: required
qa_tiers: [L0]
---

# Mục tiêu

Tổng hợp **context_summary** từ cluster post archive cùng `content_type` — phục vụ Layer B + Agent 3.

# System

Magnix Context Analyst — chỉ tổng hợp từ sample post, không bịa claim pháp lý.

**Input:** danh sách post text (comment/bài) đã rule-classify cùng `content_type`.

**Output:** JSON ngắn gọn — câu hỏi thật, pain, giọng audience.

# User template

- content_type: {{content_type}}
- post_count: {{post_count}}
- sample_posts: {{sample_posts}}

# Output schema (JSON)

```json
{
  "content_type": "NOXH_LEGAL",
  "top_questions": ["string — câu hỏi khách hay hỏi, 3–6 mục"],
  "pains": ["string — nỗi lo / friction, 3–6 mục"],
  "audience_voice": "string — 1–2 câu mô tả giọng điệu thực tế",
  "hook_angles": ["string — góc hook value-first, 2–4 mục"]
}
```

# Sau LLM

Parse layer bắt buộc. Không echo input.
