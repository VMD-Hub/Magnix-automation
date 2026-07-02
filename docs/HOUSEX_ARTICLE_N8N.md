# HouseX — Viết bài tin tức qua n8n

Pipeline PR cho `/tin-tuc/[slug]` — đồng bộ phong cách với `Proptech-HouseX/lib/content/articles/article-editorial-voice.ts`.

## Luồng

```
Lệnh /write-article (Cursor) hoặc curl
        ↓
POST /webhook/magnix/housex-article
        ↓
LLM (housex__website-article-pr.md)
        ↓
Parse JSON → L0 voice gate → Sheet housex_articles
        ↓
L3 human approve → copy vào HouseX (demo-articles / admin / seed DB)
```

## Deploy n8n (VPS Magnix)

```bash
cd /opt/magnix   # repo magnix-automation
node n8n-workflows/build-content-housex-article.mjs
node scripts/init-magnix-sheet.mjs   # tạo tab housex_articles nếu thiếu
# Import content-housex-article.workflow.json → Activate
```

Env n8n: `ANTHROPIC_API_KEY`, `MAGNIX_WEBHOOK_TOKEN`, Google Sheets credential.

## Gọi webhook

```bash
export MAGNIX_WEBHOOK_BASE=https://YOUR_N8N/webhook
export MAGNIX_WEBHOOK_TOKEN=your-token

node scripts/trigger-housex-article.mjs \
  --topic "Metro Thu Thiem Long Thanh va vi tri DTA Happy Home" \
  --angle metro \
  --project dta-happy-home-nhon-trach \
  --closing gaQuyHoach \
  --ref "https://dantri.com.vn/..."
```

Payload JSON đầy đủ:

```json
{
  "topic": "Chủ đề bài",
  "angle": "tod|metro|quy_hoach|ha_tang|noxh_compare|loan_policy",
  "project_slug": "dta-happy-home-nhon-trach",
  "closing_variant": "gaQuyHoach",
  "segment": "noxh_income",
  "source_refs": ["https://..."],
  "factsheet": {
    "ga_quy_hoach_km": 5,
    "long_thanh_minutes_cdt": 20,
    "price_from_vnd": 448000000
  }
}
```

## Tab `housex_articles`

| Cột | Mô tả |
|-----|--------|
| `request_id` | ID trace |
| `slug`, `title`, `excerpt`, `body` | Bài draft |
| `status` | `draft` / `review` (L0 fail) → human `approved` |
| `meta` | editorial_hits, llm_provider |

## QA

- L0: cấm `**`, heading prompt AI, cam kết duyệt
- L2 (tuỳ chọn): segment NOXH → `/devil` qua workflow content-draft riêng
- L3: bắt buộc trước publish HouseX

## Cursor

Khi user yêu cầu **viết bài tin tức HouseX**, agent chạy `scripts/trigger-housex-article.mjs` (không tự viết body dài trong chat). Xem `.cursor/rules/housex-write-article-n8n.mdc`.
