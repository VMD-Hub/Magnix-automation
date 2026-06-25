# Content Scorecard — Magnix

Tool chấm điểm **kỹ thuật** clip MXH trước và sau publish — không dựa cảm tính.

## Tài liệu nghiên cứu

[`docs/PLATFORM_VIRAL_RESEARCH.md`](../../docs/PLATFORM_VIRAL_RESEARCH.md) — tín hiệu thuật toán, benchmark, nguồn tham chiếu TikTok / FB Reels / Page / YouTube Shorts.

## Cài đặt

Không cần dependency — Node.js 18+:

```bash
node tools/content-scorecard/score.mjs --help
```

## Pre-publish (trước khi đăng)

Chấm 12 hạng mục rubric (H1–H12), mỗi mục 0–10. Ngưỡng:

| Điểm | Hành động |
|------|-----------|
| ≥75 | `publish` |
| 60–74 | `fix_before_publish` |
| <60 | `kill` |

```bash
node tools/content-scorecard/score.mjs pre \
  --platform tiktok \
  --input tests/fixtures/content-scorecard/pre_publish_tiktok_pass.json
```

## Post-publish (24–72h sau đăng)

So sánh metrics analytics với benchmark trong `platform-signals.json`. Tính **IVI** và verdict: `scale` | `fix` | `kill` | `hub_candidate`.

```bash
node tools/content-scorecard/score.mjs post \
  --platform tiktok \
  --input tests/fixtures/content-scorecard/post_publish_tiktok_scale.json
```

## Platforms

| Key | Vai trò Magnix |
|-----|----------------|
| `tiktok` | Spoke — test hook |
| `fb_reels` | Hub — conversion |
| `fb_page` | Hub — trust / Q&A |
| `youtube_shorts` | Spoke — SEO video |

## Tích hợp n8n (Mạch 5)

Workflow: `n8n-workflows/content-scorecard.workflow.json`

```
Google Sheet → score.mjs logic (Code node, parity CLI) → Sheet content_scorecard
```

Setup: [`n8n-workflows/CONTENT_SCORECARD_SETUP.md`](../../n8n-workflows/CONTENT_SCORECARD_SETUP.md)

Rebuild sau khi sửa benchmark:

```bash
node n8n-workflows/build-content-scorecard.mjs
```

LLM phân tích sâu (optional): `ai-agents-prompts/n8n__content-performance-analyze.md`.

## Cập nhật benchmark

Sửa `platform-signals.json` + changelog trong research doc. Review định kỳ 90 ngày.
