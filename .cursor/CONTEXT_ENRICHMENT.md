# Context Enrichment — PHASE 1 (đã OK 2026-06-28)

> Chạy **trước** Layer B / Agent 3 LLM generate. PHASE 2: cùng enum `content_type`; Title QA + Router **sau** LLM như hiện tại.

## Xác nhận owner (2026-06-28)

| Câu hỏi | Trạng thái |
|---------|------------|
| Chẩn đoán PHASE 0 (A+B+C) khớp dữ liệu thật? | **Đã xác nhận** — owner 2026-06-28 |
| Ngưỡng cluster | **≥8** post / `content_type` (nâng từ 5) |
| Ưu tiên ngắn hạn | **(a) Context Enrichment trước** — đã build; editorial placeholder (b) sau |

**Lưu ý:** Cluster theo `content_type` (NOXH_LEGAL, …), không theo `segment` thô. Archive ~3.149 dòng sau lọc editorial; segment Sheet có thể cao hơn (vd. 2480 `noxh_income`, 5293 `general_inbound`) vì gồm editorial + chưa classify.

| Mã | Chẩn đoán | Owner |
|----|-----------|-------|
| **A** | Placeholder hook từ seed editorial, không LLM | **Đúng** — đã thấy trên Sheet |
| **B** | Archive Apify/import bulk rời, chưa cluster | **Đúng** — import từ scrape Apify |
| **C** | Agent 3/Layer B chỉ 1 post/lần, brief hiếm | **Đồng ý** |

→ PHASE 1 đúng hướng; song song: Layer B → Agent 3 cho 30 slot editorial (không seed placeholder).

## Luồng

```
content_queue (archive, không editorial)
  → rule-classify content_type (segment + keyword)
  → LLM content_type chỉ khi segment score 40–59
  → cluster theo content_type
  → ≥8 post/cluster → LLM context_summary
  → <8 → waiting_for_context (không gọi LLM summary)
  → context_summaries.json
  → inject Layer B + Agent 3 userPayload
```

## Enum `content_type`

| Giá trị | Segment mặc định |
|---------|------------------|
| `NOXH_LEGAL` | `noxh_income` |
| `LOAN_FINANCE` | `sme_credit` |
| `VALUATION` | `valuation` |
| `GENERAL_POLICY` | `general_inbound` |

## Ngưỡng

- **`min_cluster_size`:** **8** (đã xác nhận 2026-06-28)
- Trạng thái: `ready` | `waiting_for_context`

## File

| File | Vai trò |
|------|---------|
| `n8n-workflows/content_type_rules.json` | Rule map segment + keyword |
| `n8n-workflows/context_summaries.json` | Store output (baked vào workflow build) |
| `n8n-workflows/code/shared/context-enrichment.mjs` | Logic + tests |
| `scripts/run-context-enrichment.mjs` | Batch từ Sheet |
| `ai-agents-prompts/n8n__context-summary.md` | LLM cluster summary |

## Lệnh

```bash
node scripts/run-context-enrichment.mjs --dry-run
node scripts/run-context-enrichment.mjs
node tests/context-enrichment.test.mjs
node scripts/rebuild-all-workflows.mjs   # bake context_summaries vào Layer B + Agent 3
```

## Inject downstream

`context_summary` gồm: `top_questions[]`, `pains[]`, `audience_voice`, `hook_angles[]`.

- **Layer B:** `02-llm-editorial-brief.js`
- **Agent 3:** `02-llm-lead-magnet.js`

Khi `waiting_for_context`: field `context_summary: null` — LLM vẫn chạy với brief/intake hiện có.

## Editorial 30 slot

```bash
node scripts/run-editorial-full-pipeline.mjs --skip-push
```

Song song enrichment archive + re-seed editorial thay placeholder hook.
