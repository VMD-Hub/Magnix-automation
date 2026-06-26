# Magnix Content Product Outputs

> Decision record: moi workflow content phai tao ra san pham cu the cho Page, website, video, anh / carousel hoac lead magnet. Brief chi la dau vao trung gian, khong phai san pham cuoi.

## 1. Nguyen tac

Magnix dung agent de san xuat asset inbound co the duyet va dang, khong chi tao y tuong.

**Legal Gate:** Moi item phap ly (segment `noxh_income`, `valuation`, `sme_credit`) phai co `legal_retrieval_pack` tu Layer B truoc Agent 3/6. Xem `docs/LEGAL_GATE_PIPELINE.md`.

Moi item sau khi qua Layer B phai co:

- `product_type`
- `target_channel`
- `publishable_asset`
- `supporting_assets`
- `source_refs`
- `qa_status`
- `approval_status`
- `notification_status`
- `next_action`

Neu chua tao ra asset cu the, status phai la `needs_production`, khong duoc tinh la done.

## 2. Product types

| Product type | Kenh | San pham cu the |
|--------------|------|-----------------|
| `fb_page_post` | Facebook Page | Bai viet ngan / dai co hook, body, CTA, hashtag |
| `website_article` | Website | Bai Q&A AIO/SEO co title, meta, H2/H3, FAQ, schema hint |
| `short_video_package` | TikTok / Reels / Shorts | Script voiceover, beats, subtitle, slide/screen plan, caption, thumbnail first frame |
| `slide_podcast` | Page / Reels / Shorts / YouTube | Slide outline, voiceover script, SRT, image prompts, edit recipe |
| `screen_tutorial` | Website / YouTube / Reels | Step list, screen recording checklist, callouts, warnings, voiceover |
| `carousel_image` | Facebook Page | 5-8 slide copy, visual direction, caption, CTA |
| `lead_magnet` | Comment / DM / website form | Checklist, PDF outline, Excel/table, artifact markdown |
| `outreach_reply` | Zalo / DM / comment | Tin nhan ngan theo CTA keyword va ngu canh |

## 3. Product object schema

```json
{
  "product_id": "auto_or_source_key",
  "product_type": "fb_page_post",
  "target_channel": "facebook_page",
  "segment": "noxh_income",
  "title": "string",
  "hook": "string",
  "publishable_asset": {
    "body_markdown": "string",
    "caption": "string",
    "cta": "string",
    "hashtags": ["string"]
  },
  "supporting_assets": [
    {
      "type": "lead_magnet",
      "title": "Checklist tu kiem dieu kien NOXH",
      "cta_keyword": "CHECKLIST"
    }
  ],
  "source_refs": ["legal_claim_id_or_url"],
  "legal_retrieval_pack_id": "optional",
  "qa_status": "draft|l0_pass|l2_required|l2_pass|failed",
  "approval_status": "draft|queued_review|approved|rejected",
  "notification_status": "not_required|pending|sent|failed|resolved",
  "next_action": "review|publish|revise|needs_human_legal_source"
}
```

## 4. Output contracts theo agent

### Agent 1 - Social Listening

Output khong phai san pham dang. Day la raw demand signal.

```json
{
  "normalized_key": "string",
  "pain_text": "string",
  "detected_need": "question|tutorial_need|legal_confusion|myth|case_study|doc_checklist",
  "suggested_product_types": ["short_video_package", "website_article"]
}
```

### Agent 2 - Classify

Phai quyet dinh format nao dang san xuat tiep.

```json
{
  "segment": "noxh_income",
  "score": 82,
  "intent": "noxh_income_check",
  "recommended_product_type": "short_video_package",
  "fallback_product_type": "website_article",
  "requires_legal_kb": true
}
```

### Layer B - Editorial Brief

Brief phai chot san pham muc tieu, khong chi chot goc noi dung.

```json
{
  "editorial_title": "string",
  "one_line_insight": "string",
  "target_products": [
    {
      "product_type": "short_video_package",
      "target_channel": "fb_reels",
      "priority": 1,
      "deliverable_required": ["voiceover_script", "subtitle", "caption", "cta_keyword"]
    },
    {
      "product_type": "website_article",
      "target_channel": "website",
      "priority": 2,
      "deliverable_required": ["article_markdown", "faq", "meta_title", "meta_description"]
    }
  ],
  "legal_retrieval_pack": {}
}
```

### Agent 3 - Written Content / Lead Magnet

Agent 3 phai tao it nhat mot asset dang duoc.

Allowed outputs:

- `lead_magnet`
- `fb_page_post`
- `website_article`
- `carousel_image`

Bat buoc:

- `publishable_asset.body_markdown` neu la post/article.
- `artifact_markdown` neu la lead magnet.
- `slide_copy[]` neu la carousel.
- `source_refs[]` voi content phap ly.

### Agent 4 - Outreach Reply

Output la tin nhan gui theo CTA keyword, khong phai bai public.

Bat buoc:

- `reply_text`
- `asset_link_or_placeholder`
- `context_note`
- `human_review_required`

### Agent 5 - Scorecard

Output la quyet dinh van hanh cho san pham da dang.

```json
{
  "product_id": "string",
  "verdict": "scale|fix|kill|hub_candidate|repurpose",
  "ivi_pct": 1.2,
  "next_product_action": "turn_into_website_article|make_carousel|rewrite_hook|stop_topic"
}
```

### Agent 6 - Production Package

Agent 6 khong chi tao script. Output phai la goi san xuat video / slide.

```json
{
  "product_type": "short_video_package",
  "title": "string",
  "hook_3s": "string",
  "voiceover_script": "string",
  "beats": [],
  "subtitle_srt": "string",
  "slide_outline": [],
  "screen_recording_steps": [],
  "footage_slots": [],
  "caption": "string",
  "thumbnail_first_frame": "string",
  "cta_keyword": "CHECKLIST",
  "disclaimer": "string",
  "source_refs": []
}
```

### Agent 7 - Assembly Assistant

Agent 7 tao goi lap rap, khong bat buoc render MP4.

```json
{
  "assembly_package": {
    "folder_name": "string",
    "asset_manifest": [],
    "edit_recipe": [],
    "voice_file": "optional",
    "subtitle_file": "optional",
    "slide_exports": [],
    "capcut_or_canva_notes": "string"
  },
  "ready_for_human_edit": true
}
```

## 5. Website article contract

Website article can co:

```json
{
  "product_type": "website_article",
  "meta_title": "string <= 60 chars",
  "meta_description": "string <= 160 chars",
  "slug": "string",
  "h1": "string",
  "intro_answer": "short direct answer",
  "article_markdown": "string",
  "faq": [
    {
      "question": "string",
      "answer": "string",
      "source_refs": ["string"]
    }
  ],
  "schema_hint": "FAQPage",
  "internal_links": [],
  "lead_magnet_cta": "string"
}
```

## 6. Facebook Page post contract

Facebook Page post can co:

```json
{
  "product_type": "fb_page_post",
  "hook_line": "string",
  "body": "string",
  "bullet_points": ["string"],
  "cta_keyword": "CHECKLIST",
  "comment_prompt": "string",
  "hashtags": ["string"],
  "image_or_carousel_prompt": "string",
  "disclaimer": "string"
}
```

## 7. Done definition

Mot workflow content chi duoc xem la done khi:

- Co `product_type` ro rang.
- Co asset co the review / publish.
- Co source_refs neu la noi dung phap ly.
- Co QA status.
- Co approval status.
- Neu can human action, co Telegram notification event theo `docs/TELEGRAM_APPROVAL_NOTIFICATIONS.md`.
- Co next action cu the.

Brief, outline, insight, score rieng le khong phai san pham cuoi.

