# Vận hành offline song song — Vũ Nguyễn

> Chạy **cùng lúc** với House X Admin và Magnix — không chờ hệ thống "xong hết" mới gặp khách.

---

## 1. Nguyên tắc

1. **Offline tạo deal** — online giữ và scale pipeline.
2. Mọi buổi gặp phải **đổ vào hệ thống trong 24h** (SĐT, nguồn, ghi chú).
3. Khách từ network cũ **vẫn qua House X** (wizard/checklist) để có data — không "chốt ngoài luồng" trừ khi khách từ chối.

---

## 2. Lịch tuần mẫu (solo — Vũ Nguyễn)

| Khung giờ | Thứ 2–6 | Thứ 7 (tuỳ chọn) |
|-----------|---------|------------------|
| **8:00–9:00** | Admin: lead HOT + conflict + hồ sơ thiếu giấy | — |
| **9:00–12:00** | Gặp khách / gọi network / site visit | 1 buổi gặp network |
| **14:00–16:00** | Gặp khách / đàm phán / ký cọc | — |
| **16:00–17:00** | Nhập CRM + cập nhật milestone + duyệt draft n8n | — |
| **17:00–18:00** | Content 1 lần/tuần HOẶC chuẩn bị sale kit | — |

**Tối thiểu/tuần:** 5 buổi gặp hoặc gọi sâu · 2 buổi pipeline admin · 1 touch content.

---

## 3. Trước mỗi buổi gặp (15 phút)

- [ ] Đọc hồ sơ trong Admin (nếu đã qua wizard)
- [ ] Chọn 3–4 món sale kit theo phân khúc [05](./05-sale-kit-hardcopy.md)
- [ ] In checklist / bảng tính điền tay
- [ ] Xác định 2 rủi ro pháp lý dự án + 1 cấp bách thật (lãi suất, tiến độ)
- [ ] Chuẩn bị phương án B/C [04](./04-negotiation-playbook.md)

---

## 4. Trong buổi gặp — flow 45–60 phút

| Phút | Việc |
|------|------|
| 0–5 | Chào + name card + đặt khung: *"Buổi này em/anh rà rủi ro trước, chưa bàn mua căn cụ thể"* |
| 5–15 | Hỏi điểm đau: *"Điều gì lo nhất khi xuống tiền?"* |
| 15–30 | Checklist tick tay — tặng bản cho khách |
| 30–45 | Bảng tính vay / wizard House X trên điện thoại — giải thích từng bước |
| 45–55 | Nếu fit: đề xuất bước tiếp (xem dự án, hồ sơ NOXH M1) |
| 55–60 | QR Zalo OA / Mini App + hẹn follow-up cụ thể |

**Không:** ép cọc buổi đầu trừ khi khách đã QUALIFIED và chủ động.

---

## 5. Sau buổi gặp — trong 24h

1. **Admin** `/admin/ops-leads`: tạo/cập nhật lead — trạng thái `Đã liên hệ` → `QUALIFIED` hoặc `Nurture`
2. Ghi `referral_source`: `network_vu` / `referral_ten_nguoi` / `offline_event`
3. Ghi `assigned_broker`: Vũ Nguyễn
4. Nếu đủ điều kiện NOXH: mở hồ sơ `/admin/noxh-cases` M1
5. Gửi Zalo cá nhân (tay): tóm tắt buổi gặp + link checklist PDF House X
6. Hẹn nhắc: để n8n draft ngày 3 / 7 / 14 — **Vũ duyệt trước khi gửi**

---

## 6. Song song online — ai làm gì

| Sự kiện online | Phản ứng offline Vũ |
|----------------|---------------------|
| Wizard HOT (≤2h SLA) | Gọi trong giờ hành chính — ưu tiên tuyệt đối |
| Wizard WARM | Gọi trong ngày |
| Mini App inbound lạ | Rà soát 15 phút miễn phí — chuyển gặp nếu fit |
| CTV claim conflict | Bạn (L3) quyết theo `LEAD_ATTRIBUTION_CONFLICT_RULES` |
| Milestone M2/M3 thiếu giấy | Chủ động nhắc khách — đây là lúc "cố vấn" chứng minh giá trị |

---

## 7. Sale kit mang theo hàng ngày (túi gọn)

**Luôn có:**
1. Name card Vũ Nguyễn (QR House X)
2. Checklist pháp lý NOXH
3. Bút + sổ tay nhỏ
4. Bản sao chứng chỉ MG + thẻ hành nghề (nếu có)

**Theo lịch hẹn thêm:**
- Bảng tính lãi in
- Sổ case
- Bản đồ quy hoạch (CCTM)

---

## 8. Chốt deal — checklist offline

- [ ] Đã nói trước mọi rủi ro pháp lý chính (có biên bản/Zalo tóm tắt)
- [ ] Phương án vay đã chạy qua House X hoặc bảng tính in
- [ ] HĐ đặt cọc — chú thích điều khoản rủi ro ở lề [05](./05-sale-kit-hardcopy.md)
- [ ] Mở NOXH case M1+ trong Admin
- [ ] Hẹn milestone tiếp theo với khách (không biến mất sau cọc)
- [ ] Sau M3: xin referral — *"Anh/chị có ai đang tìm mua tương tự không?"*

---

## 9. Đồng bộ với Ops Playbook House X

Tham chiếu đầy đủ: [OPS_PLAYBOOK.md](../../OPS_PLAYBOOK.md) · [NOXH_CASE_PIPELINE.md](../../NOXH_CASE_PIPELINE.md)

**Vũ Nguyễn khi vừa là broker vừa là operator:**
- Sáng: HOT trước → hồ sơ thiếu giấy → conflict
- Chiều: nhập lead offline chưa lên hệ thống
- Cuối tuần: review pipeline — lead nào >14 ngày im lặng
