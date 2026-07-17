# Magnix Automation

Trung tâm **Growth Hacking** độc lập — tự động hóa n8n, xử lý UID ngoại vi, sản xuất nội dung Inbound.

> Repo tách riêng khỏi `Lifestyle_SuperApp`. Không import monorepo BDS; tích hợp
> vận hành với House X qua documented HTTP API/events, không qua shared Sheet.

## Cấu trúc

```
Magnix-automation/
├── .cursor/                 # Cursor rules & subagents
├── ai-agents-prompts/       # Prompt thô cho pipeline Inbound
├── docs/                    # Nghiên cứu nền tảng (PLATFORM_VIRAL_RESEARCH.md)
├── tools/content-scorecard/ # Chấm điểm clip pre/post publish
├── n8n-workflows/           # Export JSON workflow n8n
├── webhooks/                # Mini HTTP server (TypeScript)
├── .cursorrules             # Quy tắc cốt lõi
└── ARCHITECTURE_MAGNIX.md   # Luồng dữ liệu & kiến trúc
```

## Bắt đầu

1. Đọc [`ARCHITECTURE_MAGNIX.md`](./ARCHITECTURE_MAGNIX.md) trước khi thêm workflow hoặc code.
2. Mở workspace này trong Cursor (`c:\Users\nguye\Magnix-automation`).
3. Subagent: `magnix-growth-architect` (hạ tầng) · `magnix-inbound-copywriter` (copy inbound).
4. Tư duy: [MCF](./.cursor/AGENT_COGNITION.md) · [Storage options](./.cursor/STORAGE_OPTIONS.md) · [Parse layer](./.cursor/JSON_PARSE_LAYER.md)
5. Schema UID: [ARCHITECTURE §3.1](./ARCHITECTURE_MAGNIX.md) — LLM 3 field → Code merge
6. Legal KB: [Legal Knowledge Base Architecture](./docs/LEGAL_KB_ARCHITECTURE.md) — nguồn luật → atomic claims → Q&A AIO → retrieval pack; agent không tự suy luận claim pháp lý.
7. Product outputs: [Content Product Outputs](./docs/CONTENT_PRODUCT_OUTPUTS.md) — bài Page, bài website, video package, carousel, lead magnet; brief không phải sản phẩm cuối.
8. Approval notifications: [Telegram Approval Notifications](./docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md) — mọi agent cần approve/block phải gửi Telegram và reminder.
9. Video/content direction: [Legal Knowledge Content Studio](./docs/LEGAL_KNOWLEDGE_STUDIO.md) — semi-auto script, slide, footage, voiceover; không ưu tiên auto-render stock video.

## Trạng thái hiện tại

- **Storage (ADR-013):** Postgres House X là store of record cho lead/ops; Drive
  JSONL + `pg_dump` off-VPS là lớp backup/archive. Google Sheet chỉ dùng cho
  editorial workspace hoặc mirror read-only tùy chọn.
- **Experience (ADR-014):** Zalo Mini App là frontend gọi House X API; không tạo
  database hay auth store riêng.
- **Sales conversion (ADR-015):** G0 contract/boundary đã chốt. `ConsentRecord`,
  `Opportunity`, shared `SalesActivity` và `ConversionOutcome` vẫn triển khai theo
  G1/G2 trong [delivery backlog](./Proptech-HouseX/docs/SALES_CONVERSION_BACKLOG.md);
  không nên hiểu repo hiện đã có sales system xuyên Journey A/S/P hoàn chỉnh.
- **Boundary:** Magnix sở hữu capture/normalize/classify và content automation;
  House X sở hữu identity, consent, lifecycle, attribution và conversion state.

Tham chiếu: [ADR-013](./.cursor/ADR-013-postgres-primary-storage.md) ·
[ADR-014](./.cursor/ADR-014-zalo-miniapp.md) ·
[ADR-015](./.cursor/ADR-015-sales-conversion-operating-layer.md) ·
[pipeline map](./.cursor/SALES_CONVERSION_PIPELINE_MAP.md).

## Liên kết ngoài

- n8n: `https://n8n.vmd.asia` — webhook `/webhook/magnix/{slug}`
- **Lưu trữ:** [STORAGE_OPTIONS.md](./.cursor/STORAGE_OPTIONS.md) — Postgres SoR;
  Sheet editorial/mirror tùy chọn; Drive JSONL + off-VPS `pg_dump` archive/backup
