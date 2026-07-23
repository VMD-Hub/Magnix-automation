# House X — Zalo OA copy-paste (Phương án A)

> Dán trực tiếp vào `oa.zalo.me` → **Quản lý** → **Trang thông tin OA** / **Tương tác** / **Menu**.
> Ảnh: `public/brand/zalo/` · Avatar: `public/brand/housex-oa-avatar.png`

---

## 1. Ảnh (upload trước)

| Vị trí Zalo | File |
|-------------|------|
| **Ảnh đại diện** | `public/brand/housex-oa-avatar.png` |
| **Ảnh bìa OA** | `public/brand/zalo/housex-zalo-oa-cover-1280x720.png` |
| **Ảnh tin chào mừng** | `public/brand/zalo/housex-miniapp-banner-750x420.png` |

*(Tái tạo banner: `npm run brand:zalo-banners`)*

---

## 2. Thông tin giới thiệu (Bio OA)

**Dán vào:** Trang thông tin OA → Chỉnh sửa → **Thông tin giới thiệu**

```
House X — cổng Proptech tìm nhà thông minh.
Smart Tools · Trusted Utility

• Tính khoản vay & kiểm tra điều kiện NOXH
• Xem dự án minh bạch — một nguồn, ít nhiễu
• Mở Mini App để dùng công cụ ngay trên Zalo

🌐 timnhaxahoi.com
📞 Hotline: 0826 600 800

House X thuộc nền tảng do Công ty TNHH Minh An Land vận hành.
```

---

## 3. Thông tin OA (các trường cố định)

| Trường | Giá trị |
|--------|---------|
| **Website** | `https://timnhaxahoi.com` |
| **Hotline** | `0826600800` |
| **Địa chỉ** | `37 Đường số 12, Bình Trưng, TP. Hồ Chí Minh` |
| **Thời gian hoạt động** | `8:00 – 18:00 (T2–T7)` |

---

## 4. Nút ghim (tối đa 3)

**Dán cấu hình:** Trang thông tin OA → **Nút bấm**

| Thứ tự | Loại nút | Nhãn hiển thị | Liên kết |
|--------|----------|---------------|----------|
| 1 | **Mini App** | `Mở House X` | *(chọn Mini App House X đã liên kết)* |
| 2 | **Website** | `Tìm nhà trên web` | `https://timnhaxahoi.com` |
| 3 | **Gọi thoại** | `Gọi tư vấn` | `0826600800` |

---

## 5. Menu OA (mục con — nếu gói hỗ trợ)

**Dán vào:** Quản lý → **Menu** / **Tài nguyên** (tuỳ giao diện gói OA)

| # | Tên menu | Hành động | URL / Ghi chú |
|---|----------|-----------|---------------|
| 1 | Tính khoản vay | Mở link | `https://timnhaxahoi.com/tinh-tra-gop` |
| 2 | Kiểm tra NOXH | Mở link | `https://timnhaxahoi.com/cong-cu/kiem-tra-noxh` |
| 3 | Dự án NOXH | Mở link | `https://timnhaxahoi.com/nha-o-xa-hoi` |
| 4 | Đăng ký CTV | Mở link | `https://timnhaxahoi.com/moi-gioi/dang-ky-ctv` |
| 5 | Giới thiệu House X | Mở link | `https://timnhaxahoi.com/gioi-thieu` |
| 6 | Liên hệ | Mở link | `https://timnhaxahoi.com/lien-he` |

---

## 6. Tin nhắn chào mừng (Welcome message)

**Dán vào:** Quản lý → **Tương tác** → **Tin nhắn chào mừng** (hoặc **Tự động trả lời** khi user quan tâm lần đầu)

> **Giới hạn Zalo: ~250 ký tự** (ô text). Tagline EN + visual để trên **ảnh banner**; phần text chỉ giữ CTA + liên hệ + pháp nhân.

**Bước ảnh:** Upload `housex-miniapp-banner-750x420.png` làm ảnh kèm tin chào (tagline *Smart Tools · Trusted Utility* đã có trên banner).

### Bản dán (≤250 ký tự) — **khuyến nghị**

**198 ký tự** — copy một dòng:

```
Chào bạn! Cảm ơn quan tâm House X. Bấm «Mở House X» để tính vay, kiểm tra NOXH & xem dự án. Nhắn TƯ VẤN — phản hồi T2–T7, 8–18h. timnhaxahoi.com · 0826600800. Vận hành bởi Công ty TNHH Minh An Land.
```

### Bản ngắn hơn (162 ký tự) — nếu cần chừa chỗ emoji / chỉnh sửa

```
Chào bạn 👋 House X — cổng mua nhà thông minh. Bấm «Mở House X»: tính vay, NOXH, dự án. Nhắn TƯ VẤN (T2–T7, 8–18h). timnhaxahoi.com · 0826 600 800 · Minh An Land.
```

### Bản đầy đủ (tham khảo — **không** dán vào ô 250 ký tự)

Dùng cho **bio OA**, tin broadcast, hoặc trả lời tự động theo từ khóa (nếu gói OA cho phép text dài hơn):

```
Chào bạn 👋

Cảm ơn bạn đã quan tâm House X — cổng công cụ mua nhà thông minh trên Zalo.

Bạn có thể:
🏠 Mở Mini App House X (nút «Mở House X» trên trang OA)
📊 Tính thử khoản vay mua nhà
✅ Kiểm tra sơ bộ điều kiện mua NOXH
🏗️ Xem dự án & gửi yêu cầu tư vấn

Nhắn «TƯ VẤN» hoặc bấm Mini App — chúng tôi phản hồi trong giờ làm việc (T2–T7, 8:00–18:00).

—
House X · Smart Tools · Trusted Utility
Vận hành bởi Công ty TNHH Minh An Land
🌐 timnhaxahoi.com · ☎ 0826 600 800
```

### Từ khóa tự động (tuỳ chọn)

| Từ khóa | Trả lời ngắn |
|---------|--------------|
| `TƯ VẤN` | `Cảm ơn bạn! Chuyên viên House X sẽ liên hệ trong giờ làm việc. Bạn có thể mở Mini App để gửi yêu cầu ngay.` |
| `NOXH` | `Xem hướng dẫn & công cụ NOXH: https://timnhaxahoi.com/nha-o-xa-hoi` |
| `VAY` | `Tính khoản vay: https://timnhaxahoi.com/tinh-tra-gop` |

---

## 7. Checklist sau khi dán

- [ ] Avatar + ảnh bìa đã duyệt hiển thị đúng House X
- [ ] Tin chào có ảnh banner (nếu UI hỗ trợ)
- [ ] Nút Mini App mở đúng app House X
- [ ] Bio cuối có dòng pháp nhân Minh An Land
- [ ] Test follow OA → nhận welcome → mở Mini App

---

*Cập nhật cùng `lib/content/legal-entity.ts` · banner `npm run brand:zalo-banners`*
