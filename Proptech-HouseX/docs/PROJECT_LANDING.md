# Landing dự án — Admin builder

Mỗi dự án trên HouseX có trang công khai `/du-an/[slug]` render theo **một template SEO thống nhất**. Nội dung landing được lưu trong `Project.overviewData.landing` (schema version 1).

## Luồng admin

1. Đăng nhập `/admin/login` (cookie `hx_admin`, env `ADMIN_SECRET`).
2. **Danh sách:** `/admin/projects` — xem tất cả dự án, link Sửa / Xem / **Nhân bản**.
3. **Tạo mới:** `/admin/projects/new` — form điền thông tin + các block landing (highlights, tiện ích, FAQ, gallery, CTA).
4. **Sửa:** `/admin/projects/[id]` — cập nhật landing; trang công khai ISR 5 phút.

## Nhân bản dự án

Từ danh sách, chọn **Nhân bản** → nhập slug mới (bắt buộc unique) và tên tuỳ chọn.

API: `POST /api/admin/projects/[id]/clone` body `{ newSlug, newName? }`.

Sao chép: landing, loại hình sản phẩm (`unitTypes`), hồ sơ pháp lý (`legalDocs`). Trạng thái đặt `SAP_MO_BAN`.

## Schema `overviewData.landing`

| Field | Mục đích SEO |
|-------|----------------|
| `heroSubtitle` | Mô tả phụ dưới H1 |
| `highlights[]` | H3 — điểm nổi bật |
| `amenities[]` | Tiện ích nội khu |
| `locationMapImage` | Ảnh bản đồ minh hoạ khoảng cách (1 ảnh, 4:3) |
| `locationNotes` | Text chi tiết cạnh ảnh — SEO local |
| `faqs[]` | FAQ + JSON-LD `FAQPage` |
| `gallery[]` | Ảnh dự án |
| `ctaLabel` / `ctaHref` | CTA cuối trang |

Code: `lib/content/project-landing.ts` · Validation admin: `lib/validation/project-admin.ts`.

## API admin

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/api/admin/projects` | Danh sách |
| POST | `/api/admin/projects` | Tạo mới |
| GET | `/api/admin/projects/[id]` | Chi tiết |
| PATCH | `/api/admin/projects/[id]` | Cập nhật |
| POST | `/api/admin/projects/[id]/clone` | Nhân bản |
| GET | `/api/admin/developers` | Dropdown CĐT |

Tất cả yêu cầu phiên admin hoặc header `x-admin-secret`.

## Trang công khai

Component: `components/projects/project-landing-view.tsx` · Block vị trí: `project-location-section.tsx`  
Route: `app/du-an/[slug]/page.tsx` — JSON-LD `ApartmentComplex` + `FAQPage` khi có FAQ.

## Seed mẫu

Sau `npm run db:seed`, xem landing đầy đủ tại `/du-an/housex-riverside`.

## Tiêu chuẩn nội dung & ảnh (admin)

Hướng dẫn hiển thị trực tiếp trong form admin (khung vàng từng mục). Source of truth: `lib/content/project-landing-guidelines.ts`.

| Mục | Giới hạn chữ | Ảnh |
|-----|--------------|-----|
| Slug | kebab-case, unique, ≤ 160 ký tự | — |
| SEO title | 50–60 ký tự | — |
| SEO description | 140–160 ký tự | — |
| Hero subtitle | ≤ 160 ký tự | — |
| Mô tả tổng quan | 300–1.200 ký tự | — |
| Điểm nổi bật | 3–6 mục; tiêu đề ≤ 60; nội dung ≤ 250 | Không ảnh riêng |
| Tiện ích | 5–12 tag, ≤ 30 ký tự/tag | — |
| **Vị trí & kết nối** | Text 200–800 ký tự; alt ≤ 120 | **1 ảnh 4:3**, khuyến nghị **1200×900**, JPG/WebP — bản đồ / infographic khoảng cách |
| FAQ | 3–8 câu; Hỏi ≤ 120; Trả lời ≤ 400 | — |
| **Gallery** | Chú thích ≤ 80 ký tự | **16:9**, khuyến nghị **1920×1080**, tối thiểu 1600×900, cạnh ngắn ≥ 1024 px, JPG/WebP, ≤ 800 KB, **3–12 ảnh** |
| Logo CĐT (Developer) | — | 1:1, khuyến nghị 400×400, tối thiểu 200×200 |
| CTA | Nhãn ≤ 40 ký tự; link nội bộ `/…` | — |

Ngưỡng cạnh ngắn ảnh đồng bộ với tin đăng (`MEDIA_MIN_IMAGE_PX`, mặc định 1024).

## Vị trí — cách vận hành (admin)

**Không nhúng Google Maps** trên trang. Admin điền mục **“Vị trí & kết nối (ảnh + text)”**:

| Thành phần | Trường | Layout công khai |
|------------|--------|------------------|
| Ảnh bản đồ thiết kế | `landing.locationMapImage` (url, alt, caption) | **Trái** (desktop) / **Trên** (mobile) |
| Nội dung chi tiết SEO | `landing.locationNotes` | **Phải** (desktop) / **Dưới ảnh** (mobile) |
| Địa chỉ ngắn | Tỉnh, quận, phường, đường | Dòng text dưới H1 |
| Lat/lng (tuỳ chọn) | `Project.lat`, `Project.lng` | **Không hiển thị** — chỉ JSON-LD nội bộ |

Ảnh: infographic / bản đồ thiết kế — khoảng cách từ dự án tới tiện ích công cộng trong bán kính X km. Text: mở rộng từng hướng, tên đường, phút di chuyển.
