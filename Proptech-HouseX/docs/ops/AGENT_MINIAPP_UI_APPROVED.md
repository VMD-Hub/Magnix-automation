# House X Agent Mini App — UI đã duyệt (SoT triển khai)

> **Trạng thái:** ĐÃ DUYỆT (chủ dự án) — 31/07/2026  
> **Surface:** Zalo Mini App · **chỉ mobile**  
> **Ref UX:** Citics Agent (layout) · brand House X  
> **Mock xem thử:** `housex-zalo-miniapp/mock-agent.html` (dev) · code `src/mock/MockAgentPreview.tsx`  
> **Nghiệp vụ đi kèm:** [`AFFILIATE_NOXH_PROGRAM_OPS.md`](./AFFILIATE_NOXH_PROGRAM_OPS.md) · [`AGENT_AFFILIATE_IMPLEMENTATION_PLAN.md`](./AGENT_AFFILIATE_IMPLEMENTATION_PLAN.md) · ADR-014  
> **Nội dung chi tiết** (copy tool/doc file, số liệu HH…): kiểm tra khi deploy — **không** đổi cấu trúc vùng dưới đây khi ship mà không duyệt lại.

---

## 0. Nguyên tắc khóa

| Khóa | Ý nghĩa |
|------|---------|
| Mobile-first | Không thiết kế desktop-first rồi “co”; Zalo Mini chỉ mobile |
| Một màn = một việc | Không nhồi Ops admin vào Mini |
| Citics layout, House X brand | Primary blue House X; không tím AI-default |
| Tên dịch vụ theo bản chất KD | Dùng đúng nhãn §2 — không đổi “cho gọn” khi code |
| Giỏ hàng = kho sản phẩm hợp tác | NOXH / CCTM để CTV chọn bán — **không** phải marketplace C2C |
| Nội dung chi tiết sau | Label/placeholder mock có thể tinh chỉnh; **thứ tự vùng + tabbar** giữ nguyên |

**Khi implement:** đối chiếu checklist §7 trước merge. Lệch cấu trúc → hỏi lại chủ dự án, không “tối ưu” một mình.

---

## 1. Tabbar (cố định — 5 mục)

Thứ tự **trái → phải** (Giỏ hàng ở giữa, kiểu Citics):

| # | Tab | Vai trò |
|---|-----|---------|
| 1 | **Agent** | Hub chính CTV |
| 2 | **Khai báo** | Form deal A+B+C |
| 3 | **Giỏ hàng** | Kho dự án / sản phẩm hợp tác (nút nổi giữa) |
| 4 | **Thông báo** | Inbox (+ badge unread) |
| 5 | **Tài khoản** | Hồ sơ · entitlement · verified |

FAB **Cần trợ giúp** (headset) góc phải trên tabbar — mọi màn chính trừ khi che form đầy (tùy UX). Modal P0: SĐT · Email · Zalo OA (AI sau, cùng shell).

---

## 2. Màn Agent home — thứ tự khối (trên → dưới)

Không đảo thứ tự khi ship P0:

1. **Header hồ sơ** — avatar · tên · chip “CTV · đã xác thực” · settings  
2. **Dịch vụ** — lưới 2×2 + pill trạng thái  
3. **Sự kiện đang diễn ra** — **slider ≥3 banner** chiến dịch + CTA từng slide  
4. **Quản lý cá nhân** — list 3 dòng rút gọn + “Xem tất cả”  
5. **Công cụ / Tài liệu** — 2 tab + lưới ô nhỏ ngang  
6. Tabbar + Help FAB  

### 2.1 Lưới dịch vụ — nhãn đã chốt

| ID logic | Nhãn UI (bắt buộc) | Pill ví dụ |
|----------|-------------------|------------|
| `noxh` | **Bán NOXH** | Hoạt động |
| `vay` | **Vay thế chấp** | Hoạt động |
| `tham-dinh` | **Kinh doanh thẩm định** | Chờ duyệt |
| `telesales` | **Telesales** | Khóa (entitlement) |

Pill: xanh = hoạt động · cam = chờ duyệt · xám = khóa.

### 2.2 Banner sự kiện (slider — khóa)

| Quy tắc | Chi tiết |
|---------|----------|
| Số lượng | **Tối thiểu 3** banner chiến dịch (có thể nhiều hơn khi CMS/admin cấu hình) |
| UI | Carousel / slide ngang · indicator dots · vuốt hoặc auto-play nhẹ |
| Mỗi slide | Kicker + tiêu đề ngắn + **1 CTA** (ví dụ: Khai báo deal · Xem Giỏ hàng · Mở tài liệu) |
| Nội dung | Chiến dịch / chương trình đối tác — **không** gộp mọi CTA vào 1 banner |

Ví dụ P0 (mock / seed):

1. Chương trình đối tác NOXH — CTA **Khai báo deal**  
2. Kho dự án đang mở bán — CTA **Xem Giỏ hàng**  
3. Đào tạo / chính sách cộng tác — CTA **Xem Tài liệu**  

### 2.3 Quản lý cá nhân (list + chevron)

P0 trên home (có thể đủ hơn ở “Xem tất cả”):

| Mục | Mô tả 1 dòng (ý) |
|-----|------------------|
| Quản lý hoa hồng | Đối soát sau HĐMB |
| Hành trình chăm sóc | Gặp · thăm DA · cọc · HĐMB |
| Khai báo giao dịch | Khách + dự án + mức hợp tác |
| Giới thiệu đối tác | Mã / link CTV (có thể chỉ ở “Xem tất cả”) |

### 2.4 Công cụ / Tài liệu (pattern Citics)

Hai tab cùng một khối; dưới là **lưới ô nhỏ** (icon + label ngắn).

**Tab Công cụ** (bán hàng / tiện ích — nội dung file kiểm tra lúc deploy):

- Excel dòng tiền vay  
- Checklist hồ sơ NOXH  
- Ước điều kiện vay  
- Script tư vấn  

**Tab Tài liệu** (chính sách + đào tạo):

- Chính sách cộng tác  
- Tài liệu đào tạo  
- Mẫu e-contract  
- SOP chăm sóc deal  

---

## 3. Màn con đã có trên mock (IA)

| Màn | Nội dung khung |
|-----|----------------|
| **Khai báo** | A khách · B dự án · C mức hợp tác (Connector / Consultant / Developer Partner / Master Broker) · gửi |
| **Giỏ hàng** | Filter Tất cả / NOXH / CCTM · thẻ dự án · CTA “Chọn để khai báo” |
| **Hành trình CS** | Timeline bước + note/ảnh · thưởng thăm DA (Admin xác minh) |
| **Hoa hồng** | Hero số · ghi chú tính sau HĐMB (SoT affiliate) |
| **Thông báo** | Pill tab + list card |
| **Tài khoản** | Verified · list dịch vụ + pill |

Chi tiết field/API: theo SoT affiliate + schema hiện có — không khóa trong doc UI này.

---

## 4. Visual (hướng dẫn ship)

- Nền sáng · header xanh brand · sheet trắng bo trên  
- Icon placeholder → thay icon line thống nhất khi design system sẵn  
- Ít shadow · khoảng trắng rộng  
- Không purple gradient / dark-mode mặc định  

---

## 5. Ngoài phạm vi Mini (không nhét vào tabbar Agent)

- Full Ops / Super console → **web** (`ops.` / `/admin`)  
- Inventory map C2C kiểu Citics Homes (nếu sau có) → quyết định riêng  
- Points loyalty / BXH — phase sau  

---

## 6. Map code hiện có → target

| UI đã duyệt | Code / route hôm nay | Việc khi triển khai |
|-------------|----------------------|---------------------|
| Mock tham chiếu | `housex-zalo-miniapp/src/mock/*` · `mock-agent.html` | Giữ mock đến khi Agent home parity; có thể xóa entry mock sau GA |
| Agent home | `AgentHomePage` | Redesign theo §2 |
| Tabbar 5 mục | `AppShell` (đang khác) | Thêm Khai báo + Giỏ hàng giữa |
| Dịch vụ | `/agent/dich-vu` | Đổi nhãn §2.1 + pill |
| Hoa hồng | `/agent/hoa-hong` | Hero số + SoT sau HĐMB |
| Thông báo | `/agent/thong-bao` | Tab + badge |
| Help FAB | Chưa có | P0 modal kênh người |
| Công cụ / Tài liệu | Tools hub / LMS docs rời | Gắn vào home theo §2.4 |

---

## 7. Checklist trước merge (DoD UI)

- [ ] Tabbar đúng 5 mục, **Giỏ hàng ở giữa**, nút nổi  
- [ ] Agent home đủ 5 khối đúng thứ tự §2  
- [ ] Khối Sự kiện = **slider ≥3 banner** chiến dịch (+ dots)  
- [ ] Nhãn dịch vụ đúng §2.1 (Bán NOXH · Vay thế chấp · Kinh doanh thẩm định · Telesales)  
- [ ] Có tab **Công cụ** và **Tài liệu** + ô nhỏ  
- [ ] Help FAB + modal SĐT/Email/Zalo  
- [ ] Mobile viewport; không phụ thuộc layout desktop  
- [ ] Không đưa full admin Ops vào Mini  

---

## 8. Lịch sử duyệt

| Ngày | Quyết định |
|------|------------|
| 31/07/2026 | Duyệt layout mock Citics-lite (tabbar 5 · home 5 khối · nhãn dịch vụ · Công cụ/Tài liệu). Nội dung chi tiết kiểm tra khi deploy. |
| 31/07/2026 | Chốt khối Sự kiện: **slider tối thiểu 3 banner** chiến dịch (không phải 1 banner đơn). |
