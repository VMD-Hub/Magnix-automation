# Facebook Page Publish — Magnix

> Workflow `content-page-publish`: đăng bài lên **Facebook Page** từ tab `content_drafts` sau L3 approve.

## Luồng

```
Cron 10h / 14h / 18h VN (hoặc Manual)
  → Đọc content_drafts
  → Lọc: approved + target_channel=facebook_page + scheduled_at <= now
  → L0 forbidden check
  → Graph API POST /{page-id}/feed
  → Cập nhật status=published + meta.fb_post_id
  → Append content_metrics (post_id, platform=fb_page)
```

## 1. Meta Developer (một lần)

1. [developers.facebook.com](https://developers.facebook.com) → tạo App (Business).
2. Thêm sản phẩm **Facebook Login for Business** hoặc trực tiếp lấy **Page token**.
3. Quyền Page token cần có:
   - `pages_manage_posts`
   - `pages_read_engagement` (đọc metrics sau)
4. Lấy **Page ID** (Cài đặt Page → About → Page ID).
5. Tạo **Page Access Token** dài hạn (System User trong Business Manager — khuyến nghị).

## 2. Env trên VPS / n8n

Thêm vào `n8n-workflows/.env` (không commit):

```bash
CONTENT_PAGE_PUBLISH_ENABLED=true
META_PAGE_ID=123456789012345
META_PAGE_ACCESS_TOKEN=EAAxxxxx
META_GRAPH_API_VERSION=v21.0
```

Sau đó:

```powershell
node scripts/generate-n8n-vps-env.mjs
node scripts/go-live-vps.mjs --deploy-env   # nếu cần restart n8n
```

## 3. Chuẩn bị bài trên Google Sheet

Tab **`content_drafts`** — sau khi Agent 3 tạo draft:

| Cột | Giá trị |
|-----|---------|
| `status` | `draft` → sửa → **`approved`** (L3) |
| `artifact_markdown` | Nội dung bài (hoặc dùng `meta.publish_body`) |
| `hook_line` | Mở đầu ngắn |
| `disclaimer` | Bắt buộc với segment pháp lý |
| `meta` (JSON) | Xem mẫu bên dưới |

### Mẫu `meta` (cột N)

```json
{
  "target_channel": "facebook_page",
  "scheduled_at": "2026-06-27T10:00:00+07:00",
  "hashtags": ["#NOXH", "#nhàởxãhội"],
  "publish_link": "https://website-cua-ban.vn/bai-chi-tiet",
  "source_refs": ["noxh_income_condition_001"]
}
```

| Field | Bắt buộc | Ghi chú |
|-------|----------|---------|
| `target_channel` | **Có** | Phải là `facebook_page` (hoặc `fb_page`) |
| `scheduled_at` | Khuyến nghị | ISO 8607 +07:00 — workflow chỉ đăng khi **≤ giờ hiện tại** |
| `publish_body` | Tùy | Ghi đè `artifact_markdown` nếu cần bản rút gọn cho FB |
| `publish_link` | Tùy | Thêm link bài website (Graph API `link`) |
| `hashtags` | Tùy | Mảng hoặc chuỗi |

**Đăng ngay sau approve:** bỏ `scheduled_at` hoặc đặt thời điểm trong quá khứ.

### Hàng test mẫu (copy-paste)

Sheet: [Database_Magnix_Lead](https://docs.google.com/spreadsheets/d/1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4/edit) → tab **`content_drafts`** → thêm **1 dòng trống** dưới header.

| Cột | Tên header | Giá trị test (dán vào ô) |
|-----|------------|---------------------------|
| A | `source_normalized_key` | `test:page_publish:001` |
| B | `post_id` | `test_page_001` |
| C | `segment` | `noxh_income` |
| D | `title` | `[TEST] Điều kiện thu nhập mua NOXH — cần xét đủ tiêu chí` |
| E | `hook_line` | Thu nhập là một trong nhiều tiêu chí khi đăng ký mua nhà ở xã hội — không nên tự kết luận chỉ vì một con số. |
| F | `artifact_markdown` | Xem khối nội dung bên dưới (cột F). |
| G | `cta_opt_in` | Comment **CHECKLIST** nếu bạn muốn nhận bảng tự kiểm điều kiện (tham khảo). |
| H | `disclaimer` | Thông tin mang tính tham khảo; quyết định phụ thuộc quy định hiện hành và hồ sơ thực tế tại thời điểm nộp. |
| I | `export_hint` | `pdf` |
| J | `status` | **`approved`** |
| K | `qa_tier` | `L0` |
| L | `created_at` | `2026-06-26T10:00:00+07:00` |
| M | `source` | `test_page_publish` |
| N | `meta` | JSON một dòng — xem bên dưới |

**Cột F — `artifact_markdown`** (dán nguyên khối):

```markdown
## Ai đang hỏi về thu nhập NOXH?

Nhiều người chỉ hỏi "lương X triệu có đủ không" — thực tế cần đối chiếu **đồng thời**:

- Nhóm đối tượng (theo quy định hiện hành)
- Tình trạng nhà ở tại tỉnh/TP nơi có dự án
- Cư trú, việc làm và chứng minh thu nhập

## Gợi ý bước tiếp theo

1. Xác định **tỉnh/TP của dự án NOXH** (không chỉ nơi đang ở).
2. Chuẩn bị giấy tờ thu nhập theo hướng dẫn CĐT/Sở Xây dựng.
3. Không tự cam kết "chắc được duyệt" trước khi có thông báo tiếp nhận hồ sơ.

*Bài test Magnix — Page Publish workflow.*
```

**Cột N — `meta`** (dán **một dòng**, không xuống dòng):

```json
{"target_channel":"facebook_page","hashtags":["#NOXH","#nhàởxãhội"],"source_refs":["noxh_income_condition_001"],"test_row":true}
```

Không cần `scheduled_at` → workflow đăng **ngay** khi Manual run (miễn là `scheduled_at` không nằm trong tương lai).

**Sau khi điền xong:**

1. Kiểm tra `status` = `approved` (chữ thường, đúng dropdown).
2. n8n → workflow **Facebook Page Publish** → **Execute workflow**.
3. Kỳ vọng: cột J → `published`; cột N có `fb_post_id`, `fb_permalink`; Page **Sociallink-DTA** có bài mới.

**Xóa / đổi `test_row` sau test** để cron 10h/14h/18h không đăng lại (một khi `page_published: true` workflow sẽ bỏ qua dòng đó).

> **Lưu ý chất lượng:** Hàng seed chỉ để **smoke test** Graph API + Sheet — không phải output chuẩn pipeline Listen → Editorial → Page. Ghi nhận backlog: `docs/CONTENT_PIPELINE_BACKLOG.md`.

## 4. Import & chạy workflow

```powershell
node n8n-workflows/build-content-page-publish.mjs
node scripts/push-n8n-workflows.mjs --only content-page-publish.workflow.json
```

n8n UI:

1. Gán credential **googleApi** trên node Fetch / Update.
2. **Activate** workflow.
3. Manual run để test một bài đã `approved`.

## 5. Sau khi đăng

- `content_drafts.status` → `published`
- `meta.fb_post_id`, `meta.fb_permalink`
- Dòng mới trên **`content_metrics`** (`scorecard_status=pending`) → Agent 5 scorecard khi có reach/comment.

## 6. Legal Gate

Segment `noxh_income` / `valuation` / `sme_credit` phải qua Layer B + Legal Pack **trước** Agent 3. Không approve L3 nếu thiếu disclaimer hoặc claim ngoài pack.

## 8. Ảnh minh họa & ghim bài

### Ảnh (`meta.publish_image_url`)

- URL **HTTPS công khai** (Canva export → Drive — xem **`docs/CANVA_MAGNIX_PAGE_COVER.md`**).
- **Tự động (tuỳ chọn):** workflow `content-page-cover` (Gemini) — thường **tắt** khi dùng Canva.
- `content_format`: `fb_page_post_image`
- Workflow POST `/photos` thay vì `/feed` text-only.

### Link Drive / website

- `meta.publish_link` hoặc `meta.drive_pack_url` — hiển thị trong message; nếu không có ảnh, Graph dùng link preview.

### Ghim bài (`meta.pin_after_publish: true`)

- Meta API **không** ghim đầy đủ → workflow gửi **Telegram** `pin_page_post_requested`.
- Manual: `node scripts/pin-facebook-page-post.mjs --post-id PAGE_POST_ID`

### Editorial calendar

- `docs/EDITORIAL_CALENDAR_PAGE_2W.md`
- `node scripts/seed-editorial-calendar-page.mjs`

## 7. Khắc phục lỗi thường gặp

| Lỗi | Cách xử lý |
|-----|------------|
| `CONTENT_PAGE_PUBLISH_ENABLED` | Set `true` trên VPS |
| `(#200) Requires pages_manage_posts` | Cấp lại token Page đủ quyền |
| Token hết hạn | Refresh Page token trong Business Manager |
| Không có candidate | Kiểm tra `approved` + `target_channel` + `scheduled_at` |
| L0 forbidden | Sửa cam kết lãi suất / duyệt chắc trong bài |

## Tài liệu liên quan

- `docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md` — Kênh 1 AIO/Page
- `legal-sources/channels/aio-seo.md`
- `docs/LEGAL_GATE_PIPELINE.md`
