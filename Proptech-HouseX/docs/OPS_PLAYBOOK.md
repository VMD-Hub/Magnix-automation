# House X — Playbook Ops (SOP 1 trang)

> **Phiên bản:** 2026-07-11 · **Đối tượng:** Nhân viên Ops (pipeline lead & NOXH)  
> **In PDF:** Mở `/admin/playbook` → nút **In / PDF** hoặc `Ctrl+P` → Save as PDF  
> **Bản đầy đủ:** `NOXH_CASE_PIPELINE.md` · `LEAD_ATTRIBUTION_CONFLICT_RULES.md`

---

## 1. Vai trò & quyền truy cập

| Vai trò | Đăng nhập | Được làm | Không được |
|---------|-----------|----------|------------|
| **Ops** | `ADMIN_OPS_SECRET` | Lead marketing, Hồ sơ NOXH, Xung đột, Magnix Inbound, Playbook | Duyệt CTV, tin đăng, landing, khuyến mãi, sửa code/VPS |
| **Chủ quản (L3)** | `ADMIN_SECRET` | Toàn bộ Admin + publish nội dung | — |

**Nguyên tắc:** Mọi thao tác trên khách phải qua Admin — **không** sửa trực tiếp Postgres, Sheet, hoặc n8n trừ khi có chỉ đạo kỹ thuật.

---

## 2. Bản đồ màn hình Admin

| Màn hình | Đường dẫn | Khi nào mở |
|----------|-----------|------------|
| **Lead marketing** | `/admin/ops-leads` | Lead từ Ads, form web, công cụ NOXH — nurture & trạng thái pipeline |
| **Hồ sơ NOXH** | `/admin/noxh-cases` | Checklist pháp lý M1→M5, giấy tờ, milestone |
| **Xung đột** | `/admin/conflicts` | SĐT trùng Ops vs CTV — quyết định theo rule |
| **Magnix Inbound** | `/admin/inbound-leads` | UID Magnix thô → nhập SĐT → tạo lead/hồ sơ |
| **Playbook** | `/admin/playbook` | SOP & đào tạo (trang này) |

---

## 3. Luồng hàng ngày (ưu tiên)

```
Sáng: Mở Lead marketing → lọc "Mới" → xử lý HOT/WARM trước
     → Mở Hồ sơ NOXH → milestone & giấy thiếu
     → Mở Xung đột (badge đỏ nếu có)
Chiều: Magnix Inbound → triage UID mới
Cuối ngày: Cập nhật trạng thái lead đã gọi → CONTACTED / QUALIFIED
```

### SLA gợi ý (tier wizard NOXH)

| Tier | Hành động Ops | SLA |
|------|---------------|-----|
| **HOT** | Gọi trong giờ hành chính; wizard tự tạo hồ sơ M1 | **≤ 2 giờ** |
| **WARM** | Gọi trong ngày; nurture theo script | **≤ 24 giờ** |
| **COLD / OUT** | Nurture tự động / không gọi ép | Theo kịch bản |

---

## 4. Lead marketing — checklist

1. Chọn lead ở cột trái → đọc **Tóm tắt wizard NOXH** (thu nhập, DTI — chỉ Admin thấy).
2. Lead cũ không có số VND: xem nhãn legacy hoặc nhờ khách submit lại wizard.
3. Cập nhật **Trạng thái:** `Mới` → `Đã tiếp nhận` (vào pipeline) → `Đã liên hệ` (đã gọi).
4. Chọn **Kịch bản nurture** phù hợp segment.
5. Điền **Kênh liên hệ** (Zalo, email) nếu khác SĐT chính.
6. **Ghi chú Ops** — ngắn gọn, không paste CCCD đầy đủ.

**Không:** Đổi SĐT khóa chính trên Customer; hứa «chắc đủ điều kiện NOXH».

---

## 5. Hồ sơ NOXH — milestone M1→M5

| Mốc | Ý nghĩa | Việc Ops |
|-----|---------|----------|
| **M1** | Nhận hồ sơ | Hẹn gọi, xác nhận đối tượng |
| **M2** | Thu giấy tờ | Rà checklist, báo thiếu |
| **M3** | Đã nộp CĐT/NH | Cập nhật khi có biên nhận |
| **M4** | Phê duyệt sơ bộ | Theo dõi phản hồi CĐT |
| **M5** | Ký HĐMB | Kiểm tra hoa hồng (L3) |

Wizard **tier HOT** tự tạo hồ sơ platform (`brokerId = null`). CTV chỉ thấy tiến độ qua Mini App — **không** gửi SĐT đầy đủ cho CTV.

---

## 6. Xung đột attribution — tóm tắt

| Tình huống | Hành động Ops |
|------------|---------------|
| Ads/form trùng SĐT CTV đang lock | **Không ghi đè** — mở queue Xung đột |
| CTV claim trong khi Ops đã `CONTACTED+` | Từ chối claim (hệ thống) — Ops giữ khách |
| Lock CTV hết 20 ngày LV, không tiến độ | Ops có thể tiếp quản (theo rule) |
| Đã cọc F1 (`UnitBooking`) | CTV giữ attribution — Ops hỗ trợ hậu kỳ |

Chi tiết: `LEAD_ATTRIBUTION_CONFLICT_RULES.md`.

---

## 7. Magnix Inbound

1. UID thô từ Magnix → tab **Magnix Inbound**.
2. Ops nhập SĐT chuẩn VN → tạo Lead hoặc NoxhCase platform.
3. **Không** auto-gán CTV cho inbound Magnix.

---

## 8. An toàn dữ liệu (bắt buộc)

- **Không** chụp màn hình wizard có thu nhập/nợ gửi group chat công khai.
- **Không** copy PII vào ticket ngoài hệ thống không mã hóa.
- Log hệ thống không cần SĐT đầy đủ — dùng mã lead / mã hồ sơ.
- Sheet `noxh_leads_detail` là archive tài chính — chỉ share trong nhóm Ops được phép.

---

## 9. Leo thang & hỗ trợ

| Vấn đề | Liên hệ |
|--------|---------|
| Lỗi trang Admin / 502 | Chủ quản L3 — không tự restart VPS |
| Rule xung đột không rõ | Chủ quản L3 + ghi chú trên conflict |
| Khách khiếu nại pháp lý | Chuyển tư vấn viên có chứng chỉ — Ops không cam kết kết quả CĐT |
| Cần tài liệu hồ sơ Mẫu 01 | Kênh nhân viên `legal-sources/channels/staff-ops.md` (L3 cung cấp) |

---

## 10. Kiểm tra nhanh cuối tuần

- [ ] Lead «Mới» > 24h đã được xử lý hoặc chuyển trạng thái
- [ ] Hồ sơ HOT/WARM không kẹt ở M1 quá SLA
- [ ] Queue Xung đột = 0 hoặc có quyết định ghi chú
- [ ] Inbound Magnix không tồn đọng > 3 ngày

---

*House X Console · Playbook Ops — cập nhật cùng mã nguồn `docs/OPS_PLAYBOOK.md`*
