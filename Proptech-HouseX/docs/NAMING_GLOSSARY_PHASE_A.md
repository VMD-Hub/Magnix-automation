# Phase A — Glossary đặt tên (House X / timnhaxahoi.com)

**Mục tiêu:** Chốt Nav · H1 · Title SEO · URL chính · 308 từ URL cũ · FAQ H2 trước khi sửa code (Phase B+).

**Nguyên tắc đã thống nhất**

- Không dùng trụ messaging “không phải sàn”; không né mô hình sàn sĩ / tổng kho / dự án.
- Ưu tiên **tên ngành rõ** (kiểu wiki / tính trả góp / thiết kế–thi công) hơn jargon nội bộ.
- FAQ nội thất chuẩn: **“FAQ kết nối studio đối tác chiến lược của House X”**.
- **Unify (Phase C):** URL mới = canonical; URL cũ chỉ còn 308. Filesystem `app/` giữ tên cũ qua rewrite nội bộ.
- Subdomain (`wiki.…`) để phase sau nếu cần.

**Cách duyệt:** Cột *Đề xuất Phase A* = mặc định khi vào Phase B. Ghi `OK` / `Sửa: …` bên cạnh từng hub.

---

## 1. Bảng glossary (hub công khai)

| # | Hub | Hiện tại (tóm tắt) | Nav đề xuất | H1 đề xuất | Title SEO đề xuất | URL chính (canonical) | 308 từ (cũ) | FAQ H2 bắt buộc |
|---|-----|-------------------|-------------|------------|-------------------|------------------------|-------------|-----------------|
| 1 | Kiến thức NOXH | Nav: Wiki nhà ở xã hội · Path: `/wiki-nha-o-xa-hoi` | **Wiki nhà ở xã hội** | Wiki nhà ở xã hội — điều kiện, hồ sơ & vay | Wiki nhà ở xã hội trên House X — điều kiện, hồ sơ, vay | `/wiki-nha-o-xa-hoi` | `/tin-tuc/cam-nang-noxh` · `/cam-nang-noxh` | House X có wiki / hub kiến thức nhà ở xã hội không? URL? |
| 2 | Catalog NOXH | Nav: Nhà ở xã hội miền Nam · `/du-an/nha-o-xa-hoi` | **Dự án nhà ở xã hội** (trong Thêm hoặc dưới Dự án) | Giữ hướng “Nhà ở xã hội miền Nam” + phụ “Danh mục dự án” | Nhà ở xã hội miền Nam — danh mục dự án trên House X | Giữ `/du-an/nha-o-xa-hoi` | (không bắt buộc) | House X có danh mục dự án nhà ở xã hội không? |
| 3 | Vay / tài chính | Nav: Vay mua nhà · Path: `/vay-mua-nha` | **Vay mua nhà** | Vay mua nhà & hỗ trợ hồ sơ ngân hàng | Vay mua nhà trên House X — hồ sơ, ngân hàng hỗ trợ, tính trả góp | `/vay-mua-nha` | `/tai-chinh` (+ `/:slug`) | House X hỗ trợ hồ sơ vay với những ngân hàng nào? *(+ list tên)* |
| 4 | Tool trả góp | Path: `/tinh-tra-gop` · Nav chỉ “Công cụ” | Footer/Home: **Tính trả góp hàng tháng** | (giữ tool H1 hiện có nếu rõ) | Tính trả góp / khoản vay mua nhà — House X | `/tinh-tra-gop` | `/cong-cu/tinh-khoan-vay` | Có công cụ ước tính trả góp hàng tháng trên House X không? |
| 5 | Định giá hub | Nav: Định giá · `/dinh-gia` | **Định giá** (giữ) | Định giá & thẩm định bất động sản | Định giá & thẩm định BĐS trên House X | Giữ `/dinh-gia` | — | — |
| 6 | Thẩm định bank | `/dinh-gia/tham-dinh-ngan-hang` | Subnav/footer: **Thẩm định cho ngân hàng** | (giữ hướng dịch vụ) | Thẩm định giá phục vụ ngân hàng — House X | Giữ path hiện tại | — | House X có thẩm định giá phục vụ ngân hàng không? URL? |
| 7 | Nội thất | Path: `/thiet-ke-thi-cong-noi-that` | **Thiết kế & thi công** | Thiết kế & thi công nội thất — studio đối tác chiến lược | Thiết kế & thi công nội thất House X — kết nối studio đối tác chiến lược | `/thiet-ke-thi-cong-noi-that` | `/noi-that` (+ `/:path*`) | **FAQ kết nối studio đối tác chiến lược của House X** *(H2 đúng cụm này)* |
| 8 | Công cụ hub | Nav: Công cụ · `/cong-cu` | **Công cụ** (giữ) hoặc **Công cụ mua nhà** | Công cụ mua nhà trên House X | Công cụ mua nhà — vay, NOXH, phong thủy, chi phí xây | Giữ `/cong-cu` | — | Liệt kê công cụ miễn phí nổi bật (+ link) |
| 9 | Điều kiện NOXH (tool) | `/cong-cu/dieu-kien-noxh` | Trong hub công cụ: **Kiểm tra điều kiện nhà ở xã hội** | (giữ nếu đã rõ) | Kiểm tra điều kiện mua nhà ở xã hội — House X | Giữ path | — | Có công cụ kiểm tra điều kiện nhà ở xã hội không? |
| 10 | Đội ngũ | `/doi-ngu` · footer “Đội ngũ & biên tập” | Giữ label footer | Đội ngũ & ban biên tập House X | Đội ngũ & biên tập House X (timnhaxahoi.com) | Giữ `/doi-ngu` | `/chuyen-gia` đã 308 (giữ) | Trang giới thiệu đội ngũ / biên tập House X ở đâu? |
| 11 | Liên hệ | `/lien-he` | Giữ | Liên hệ & hỗ trợ House X | Liên hệ House X (timnhaxahoi.com) | Giữ `/lien-he` | — | Cách liên hệ / hỗ trợ House X? |
| 12 | Đăng tin MG | Canonical `/moi-gioi/dang-tin` · entry `/dang-tin` 308 | CTA: **Đăng tin** | Đăng tin bất động sản House X | Đăng tin môi giới — House X | Canonical `/moi-gioi/dang-tin` | Giữ `/dang-tin` → canonical | Môi giới đăng tin trên House X ở URL nào? |
| 13 | Bảo mật SĐT | Copy trust / FAQ rải | — | — | — | Trên tin đăng + FAQ hub tin cậy | — | Bảo mật số điện thoại trên tin đăng House X xử lý thế nào? *(che số; mở sau ĐK khách + xác nhận email)* |
| 14 | Giới thiệu | `/gioi-thieu` | Giữ | Giới thiệu House X | House X (timnhaxahoi.com) — cổng Proptech BĐS | Giữ | — | Disambiguation nhẹ vs XHouse / House Map *(không phủ định sàn)* |

---

## 2. Nav primary đề xuất (sau Phase B)

| Slot | Label mới | Href |
|------|-----------|------|
| 1 | Mua bán | `/mua-ban` |
| 2 | Cho thuê | `/cho-thue` |
| 3 | Dự án | `/du-an` |
| 4 | **Vay mua nhà** | `/vay-mua-nha` |
| 5 | Định giá | `/dinh-gia` |
| 6 | Công cụ | `/cong-cu` |

**Thêm / footer nổi:** Wiki nhà ở xã hội · Dự án nhà ở xã hội · Thiết kế & thi công · Tính trả góp hàng tháng.

---

## 3. Unify Phase C — canonical mới · 308 từ cũ · rewrite FS

| Canonical mới | 308 từ (cũ) | Rewrite nội bộ → |
|---------------|-------------|------------------|
| `/wiki-nha-o-xa-hoi` (+ `/:slug`, `/chu-de/:tag`) | `/tin-tuc/cam-nang-noxh…` · `/cam-nang-noxh` | `app/tin-tuc/cam-nang-noxh` |
| `/vay-mua-nha` (+ `/:slug`) | `/tai-chinh…` | `app/tai-chinh` |
| `/vay-mua-nha/can-ho` | `/tai-chinh/vay-mua-nha` · `/vay-mua-nha/vay-mua-nha` | `app/tai-chinh/[slug]` (`can-ho`) |
| `/thiet-ke-thi-cong-noi-that` (+ `/:path*`) | `/noi-that…` | `app/noi-that` |
| `/tinh-tra-gop` | `/cong-cu/tinh-khoan-vay` | `app/cong-cu/tinh-khoan-vay` |

*Subdomain `wiki.timnhaxahoi.com` / `wiki.nhaoxahoi.com`: chưa làm — chỉ sau khi rewrite ổn định.*

---

## 4. FAQ nội thất — wording khóa

- **H2 / heading FAQ (bắt buộc):** `FAQ kết nối studio đối tác chiến lược của House X`
- **Ý trả lời neo:** House X kết nối **studio đối tác chiến lược** để thiết kế & thi công; không định vị là xưởng / nhà thầu nội thất độc lập kiểu XHouse.
- Tránh H2 ngắn chỉ còn “đối tác” hoặc “thi công trọn gói” gây hiểu nhầm tự thi công.

---

## 5. Ngoài phạm vi Phase A–C

- Đổi folder app hàng loạt (migrate path vật lý) — chỉ khi rewrite chạy ổn 1–2 tháng.
- IndexNow hàng loạt / Semrush.
- Messaging “không phải sàn”.

---

## 6. Checklist duyệt

- [x] **#1 Wiki NOXH** — label + SEO + canonical `/wiki-nha-o-xa-hoi`
- [x] **#3 Vay mua nhà** — nav + H1/FAQ + canonical `/vay-mua-nha`
- [x] **#4 Tính trả góp** — home/footer/tool + canonical `/tinh-tra-gop`
- [x] **#7 Thiết kế & thi công** + FAQ chiến lược + canonical `/thiet-ke-thi-cong-noi-that`
- [x] **#10–14** trust/liên hệ/đăng tin/SĐT
- [x] **Nav primary** — Vay mua nhà
- [x] **Slug dịch vụ** `vay-mua-nha` → `can-ho` (URL `/vay-mua-nha/can-ho`)

### Phase C — trạng thái

Cấu hình trong `next.config.mjs` (`rewrites` mới→FS + `redirects` cũ→mới) và `middleware.ts` (308 cứng cũ→mới).

**Trạng thái:** Phase A chốt · Phase B shipped · **Phase C unify = canonical** · subdomain wiki để sau.
