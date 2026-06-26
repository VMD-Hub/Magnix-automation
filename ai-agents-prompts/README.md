# AI Agents Prompts

Kho prompt cho pipeline **Inbound** và **n8n LLM node**.

## Quy ước

- `{channel}__{purpose}.md`
- Frontmatter: `version`, `channel`, `purpose`, `commands`, `circuit`, `parse_layer`, `qa_tiers`
- Mọi prompt n8n: **Code parse layer bắt buộc sau LLM** (`.cursor/JSON_PARSE_LAYER.md`)

## Mạch prompt (3 tầng content)

| Layer | File | Parse | QA | Legal |
|-------|------|-------|-----|-------|
| A Pain intake | `n8n__pain-intake.md` | ✅ | L0 | — |
| B Editorial brief | `n8n__editorial-brief.md` | ✅ | L0–L1 | **Inject** pack |
| C Production brief | `n8n__production-brief.md` | ✅ | L0–L2 + L3 | **Consume** pack |

Pipeline đầy đủ: `docs/LEGAL_GATE_PIPELINE.md`.

## Mạch prompt (legacy / khác)

| Mạch | File | Parse | QA |
|------|------|-------|-----|
| 1 UID | `n8n__uid-classify.md` | ✅ → merge §3.1 | L0 |
| 2 Lead magnet | `n8n__lead-magnet-draft.md` | ✅ | L0–L2 + L3 |
| 6 Short video | ~~`n8n__short-video-script.md`~~ → `n8n__production-brief.md` | ✅ | L0–L2 + L3 |
| 3 Outreach | `zalo__outreach-script.md` | ✅ | L0–L1 + L3 |
| 4 QA L2 | `n8n__content-qa.md` | ✅ | `/devil` only |
| 5 Performance | `n8n__content-performance-analyze.md` | ✅ | L0 |

**Tool đi kèm mạch 5:** `tools/content-scorecard/` · Research: `docs/PLATFORM_VIRAL_RESEARCH.md`

## Schema UID

LLM classify: 3 field (`segment`, `score`, `interest_key`).  
Sheet record đầy đủ: `ARCHITECTURE_MAGNIX.md` §3.1.

## Tài liệu

- `.cursor/SLASH_COMMANDS.md`
- `.cursor/QA_TIERS.md`
- `.cursor/JSON_PARSE_LAYER.md`
