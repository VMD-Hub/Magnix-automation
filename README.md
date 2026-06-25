# Magnix Automation

Trung tâm **Growth Hacking** độc lập — tự động hóa n8n, xử lý UID ngoại vi, sản xuất nội dung Inbound.

> Repo tách riêng khỏi `Lifestyle_SuperApp`. Không import monorepo BDS; tích hợp chỉ qua HTTP API hoặc shared Sheet.

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

- **Giai đoạn 0 (Scaffolding):** hoàn tất — docs, rules, subagents, prompts 4 mạch.
- **Giai đoạn 0.5 (Contract):** schema thống nhất, parse layer, QA tiers — xem `.cursor/`.
- **Tiếp theo:** setup Google Sheet database + Drive archive folder → import `uid-ingest.workflow.json` → test curl.

## Liên kết ngoài

- n8n: `https://n8n.vmd.asia` — webhook `/webhook/magnix/{slug}`
- **Lưu trữ lead/content:** [STORAGE_OPTIONS.md](./.cursor/STORAGE_OPTIONS.md) — Google Sheet primary + Drive archive
