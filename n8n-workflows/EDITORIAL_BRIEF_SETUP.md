# Layer B — Editorial Brief

Workflow: `content-editorial-brief.workflow.json`  
Prompt: `ai-agents-prompts/n8n__editorial-brief.md`

---

## Vai trò trong pipeline 3 tầng

```
Agent 1 (listen) ──→ meta.intake_v1          [Layer A]
       ↓ Agent 2 (classify)
Layer B (editorial brief) ──→ meta.editorial_brief_v1
       ↓ Agent 6 (production brief) ──→ video_drafts   [Layer C]
       ↓ Agent 3 (lead magnet) ──→ content_drafts
```

Layer B **không viết beats video** — chỉ Q&A backbone, format, deconstruct rules.

---

## Lịch & batch

| | Giá trị |
|---|--------|
| Cron | `30 8 * * *` — **08:30 VN** hàng ngày |
| Batch | 5 brief/lần |
| Min score | 70 |

Chạy sau Agent 2 (08:00), trước Agent 6 (09:15).

---

## Candidate filter

Một dòng `content_queue` được chọn khi:

- `meta.intake_v1` tồn tại (Layer A đã chạy)
- `meta.editorial_brief_v1` **chưa** có
- `status=classified` (hoặc `claude_verdict=qualified`)
- `score ≥ 70`
- `segment` ∈ {noxh_income, valuation, sme_credit, general_inbound}

---

## Output trên Sheet

- `meta.editorial_brief_v1` — JSON brief (qa_backbone, formats, cta_keyword…)
- `meta.editorial_brief_at` — ISO timestamp
- Cột `interest_key` (J) cập nhật nếu brief sinh key mới

---

## Manual test

1. `node n8n-workflows/build-content-editorial-brief.mjs`
2. Import `content-editorial-brief.workflow.json` → gán `googleApi` trên Fetch + GET + PUT nodes
3. Manual run → kiểm tra `Build Summary` → `stats.brief_ok > 0`
4. Mở `content_queue` → cột meta có `editorial_brief_v1`

---

## Backfill rows cũ (thiếu intake_v1)

Dòng scrape trước khi deploy Layer A **không** có `intake_v1` → Layer B bỏ qua.

Cách xử lý:

1. Re-import Agent 1 workflows (pain intake) và chạy lại scrape, **hoặc**
2. Chạy backfill: `node scripts/batch-pain-intake-backfill.mjs --limit 20`

---

## Troubleshooting

| Triệu chứng | Fix |
|-------------|-----|
| Không candidate | Thiếu `intake_v1` — chạy Agent 1 mới hoặc backfill |
| Parse fail | LLM thiếu `qa_backbone` — xem node Parse Editorial Brief JSON |
| Sheet 401 | Gán `googleApi` trên HTTP nodes |
