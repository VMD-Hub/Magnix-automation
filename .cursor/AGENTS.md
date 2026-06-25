# Magnix — Cursor Subagents

Dự án Growth Hacking độc lập. Đọc `ARCHITECTURE_MAGNIX.md`, `.cursorrules`, `.cursor/AGENT_COGNITION.md` trước.

## Tài liệu kỹ thuật

| Doc | Nội dung |
|-----|----------|
| `AGENT_COGNITION.md` | MCF — vòng lặp tư duy |
| `SLASH_COMMANDS.md` | Lệnh `/focus`, `/devil`, … |
| `JSON_PARSE_LAYER.md` | Parse bắt buộc sau LLM |
| `QA_TIERS.md` | L0–L3 — không LLM-QA mọi thứ |

## Vòng lặp tư duy (MCF)

```
INTAKE → ORIENT → ROUTE → PLAN → EXECUTE → SCORE(≥75) → VERIFY → PACKAGE
```

Rule luôn bật: `.cursor/rules/agent-cognition.mdc`.

## Slash commands + QA

| Mạch | Lệnh | QA |
|------|------|-----|
| 1 UID | `/focus` `/silent` `/ooda` | L0 + parse |
| 2 Lead magnet | `/matrix` `/artifacts` `/deconstruct` | L0–L2 + L3 |
| 3 Outreach | `/ghost` `/brief` | L0–L1 + L3 |
| 4 | `/devil` (L2 only) | Không `/roast` n8n mặc định |

## Subagent đã định nghĩa

| Agent | File | Phạm vi |
|-------|------|---------|
| **magnix-growth-architect** | `.cursor/agents/magnix-growth-architect.md` | Hạ tầng growth end-to-end: n8n Code node, Google Sheet/Drive, webhook, phân loại từ khóa, JSON payload, vận hành 24/7 |
| **magnix-inbound-copywriter** | `.cursor/agents/magnix-inbound-copywriter.md` | Copy chuyển đổi inbound: lead magnet, outreach DM, outline Q&A AIO/SEO, kịch bản video 60s — triết lý "Bán như không bán" |

Gọi bằng Task tool hoặc nhắc agent: *"dùng magnix-growth-architect"* / *"dùng magnix-inbound-copywriter"*.

## Vai trò gợi ý (chưa có file riêng)

| Agent | Phạm vi | Thư mục |
|-------|---------|---------|
| **n8n-builder** | Thiết kế/export workflow, registry | `n8n-workflows/` |
| **webhook-dev** | Mini server TypeScript | `webhooks/` |
| **growth-ops** | UID schema, segment, checklist go-live | root docs + Sheet schema |

## Ranh giới

- Repo **độc lập** — không import code từ monorepo khác; tích hợp BDS/CRM chỉ qua HTTP API hoặc Sheet schema documented.
- Secret chỉ qua env / n8n Credentials.
