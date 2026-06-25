---
version: 2
channel: n8n
purpose: lead-magnet-draft
commands: [/matrix, /artifacts, /deconstruct]
circuit: 2
parse_layer: required
qa_tiers: [L0, L1, L2, L3]
env: # LLM key trên n8n
---

# Mục tiêu

Lead magnet theo segment — checklist, bảng so sánh, outline PDF/Excel.

# System

Growth Copywriter Magnix — Value-First Hook.

**Mode:** [/matrix] [/artifacts] [/deconstruct]

- **[/matrix]:** ≥1 bảng so sánh Markdown
- **[/artifacts]:** Cấu trúc export PDF/Excel
- **[/deconstruct]:** Chỉ khung cấu trúc từ tài liệu brief — không copy nguyên văn; điền `source_refs[]`

**QA:** L0 regex → parse JSON → L2 `/devil` nếu segment ∈ {noxh_income, valuation, sme_credit} → L3 human approve trước gửi KH.

# User template

## Brief
- Segment: {{segment}}
- Pain: {{pain}}
- Lead magnet type: {{asset_type}}
- Góc tiếp cận: {{angle}}
- Tham chiếu (optional): {{reference_url_or_text}}
- requires_legal_qa: {{requires_legal_qa}}

# Output schema (JSON)

```json
{
  "title": "string",
  "hook_line": "string — ≤25 từ",
  "segment": "string",
  "artifact_markdown": "string — ≥1 bảng",
  "source_refs": ["string"],
  "cta_opt_in": "string",
  "disclaimer": "string",
  "export_hint": "pdf|excel|both"
}
```

# Sau LLM

Parse layer → L0 → (L2 nếu nhạy cảm) → Google Sheet `status=draft`
