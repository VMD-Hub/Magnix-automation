# Đánh giá nghiên cứu — Quản lý cho thuê (SaaS · mô hình · quy trình)

| Field | Value |
|-------|-------|
| **Date** | 2026-07-29 |
| **Status** | Desk research R0–R4 complete · **R5 CLOSED 2026-07-29** → ADR-018 |
| **Audience** | House X / Magnix ops — trước khi build tool & listing ops |
| **Canvas** | `canvases/rental-pm-research-eval.canvas.tsx` (mở cạnh chat) |
| **Depends on** | ADR-013, ADR-015, Listing `RENT`, content BTR |
| **ADR** | `.cursor/ADR-018-rental-advertising-partner-lane.md` |

---

## 0. Verdict (đọc trước)

**Không build Property Management System (PMS) full-stack cạnh Resident.**

### R5 CLOSED (2026-07-29)

| Gate | Quyết định |
|------|------------|
| Full PM 12 tháng | **Không tự vận hành** — hướng **partner** |
| Pháp nhân | **Minh An Land** (+ đối tác kế toán → pháp lý / thuế) |
| Portfolio P0 | CHDV, chủ căn hộ, co-working, chủ KD / có căn cho thuê; nhu cầu thuế siết + chủ lớn tuổi — **chưa khóa số căn / nhân lực QL** |
| Track listing thuê | **`ADVERTISING` only** — **không `MANAGED`** trong 12 tháng |
| KPI P0 (suy ra) | Listing `RENT` chất lượng · lead · AdSubscription · referral partner (khi có HĐ) — **không** % QL recurring |

**Được phép (ADR-018 P0–P1):** nền tảng QC tin thuê + **tìm khách / bán phòng nhận hoa hồng** (Minh An + CTV/đối tác) + taxonomy landlord/tenant + content/tool thuế–dòng tiền.

**Lớp 3 (sau):** dịch vụ **quản lý vận hành** theo quy mô + P&L từng dự án — **không thuê lại**. Tool ops = partner SaaS nếu cần.

**Cấm:** build PMS nội bộ; master lease / thuê lại KD; copy “đang quản lý căn” khi mới Lớp 1–2.

---

## 1. Thang nghiên cứu đề xuất (và đã làm gì)

Nghiên cứu trước build phải tách **3 lớp**. Lẫn lớp → build sai sản phẩm.

| Lớp | Câu hỏi | Không phải |
|-----|---------|------------|
| **Service model** | House X bán dịch vụ gì cho chủ nhà? | Feature list phần mềm |
| **Operating process** | Ai làm bước nào, SLA, rủi ro? | UI mock |
| **Software** | Tool nào hỗ trợ process đã chọn? | Thay thế đội ops |

### Thang R0 → R5

| Bậc | Mục tiêu | Output | Trạng thái |
|-----|----------|--------|------------|
| **R0** | Phân tách 3 lớp Service / Ops / Software | Taxonomy | **Done** |
| **R1** | Mô hình kinh doanh & phí | 5 mô hình + phí VN/global | **Done** |
| **R2** | Quy trình vận hành chuẩn | 7 bước + điểm đau VN | **Done** |
| **R3** | Ma trận SaaS | VN + global + bài học | **Done** |
| **R4** | Chấm khả thi House X | 5 phương án GO/HOLD/NO-GO | **Done** |
| **R5** | Gate trước build | ADR-018 khóa Advertising + partner | **Closed** |

R5 đã đóng; chi tiết vận hành = ADR-018.

---

## 2. R1 — Năm mô hình vận hành

| Mô hình | Phí tham chiếu | Ai chịu ops hằng ngày | Fit House X |
|---------|----------------|----------------------|-------------|
| **Self-manage + SaaS** | Subscription phần mềm | Chủ nhà | Gián tiếp (giới thiệu) — không core |
| **Leasing-only** | VN: **0.5–1 tháng thuê** / HĐ mới | Chủ sau khi ký HĐ | **Cao** — gần môi giới + Listing `RENT` |
| **Full-service PM** | VN: **6–10% thuê/tháng** + phí tìm khách | Công ty QL | Thấp gần hạn — cần đội + thợ + SLA |
| **Master lease / thuê lại** | Trả cố định chủ + biên operator | Operator (rủi ro trống căn) | **Không** — vốn & rủi ro |
| **Software vendor (PMS)** | SaaS theo phòng/căn | Khách = operator | **NO-GO build** — thị trường đã đông |

### Cơ cấu phí VN (desk, cần field verify khi pricing)

Nguồn tham chiếu công khai (Hausive / Bamboo Routes 2026; các bài hướng dẫn phí QL):

- Phí quản lý recurring: **~6–10%** tiền thuê thu được / tháng (full-service).
- Phí tìm khách: **~0.5–1 tháng** tiền thuê / HĐ mới (cạnh tranh môi giới có thể ~30–50% một tháng trên một số kênh).
- Thuế cho thuê cá nhân (tham chiếu phổ biến): **~10%** trên doanh thu thuê (5% GTGT + 5% TNCN) — làm mỏng lợi suất ròng chủ nhà; nhiều phân khúc HCMC được mô tả còn **~2–5% ròng** sau thuế + phí QL.
- Tách rõ: **phí BQL tòa nhà / quỹ bảo trì 2%** (khu vực chung) ≠ **sửa chữa trong căn** (chủ nhà / HĐ thuê).

Global (US benchmarking, chỉ để hiểu cấu trúc — không copy giá):

- Leasing-only: ~50–100% một tháng thuê.
- Full PM: ~8–12% thuê/tháng + leasing fee + renewal + maintenance markup 5–15%.

---

## 3. R2 — Quy trình vận hành chuẩn (7 bước)

Áp dụng cho full-service; leasing-only **dừng sau bước 4** (hoặc bàn giao keys rồi trả về chủ).

```
1. Onboard owner     → HĐ QL / ủy quyền · inventory · kỳ vọng giá · ảnh · pháp lý
2. Make-ready        → Sửa tối thiểu · staging · checklist phòng trống
3. Marketing & show  → Listing đa kênh · lead · lịch xem · SLA phản hồi
4. Screen & lease    → CCCD · việc làm · cọc · HĐ thuê · biên bản hiện trạng
5. Collect & books   → Thuê + điện/nước/DV · nhắc nợ · gạch nợ · owner statement
6. Maintenance       → Ticket · vendor · duyệt chi · markup · đóng ticket
7. Renew / turnover  → Gia hạn / tăng giá · thanh lý · hoàn cọc · vacant → (2)
```

### Điểm đau đặc thù Việt Nam (lý do PMS “copy AppFolio” thất bại)

1. Điện **bậc thang EVN** + tách dòng trên hóa đơn (thuê / điện / nước / DV / internet).
2. Thanh toán **Zalo / QR / VNPay / MoMo** + đối soát gạch nợ.
3. Thuế cho thuê + (B2B) HĐĐT / TT200 — Vi-Office nhấn mạnh đây là moat local.
4. Phân tách trách nhiệm **BQL tòa** vs **trong căn**.
5. CCCD, tạm trú, tranh chấp cọc — quy trình pháp lý, không chỉ UI.

### Global PMS nhấn mạnh (bài học lấy / bỏ)

| Lấy ý tưởng | Không port nguyên |
|-------------|-------------------|
| Owner statement minh bạch | Credit bureau screening US |
| Work order + vendor | Trust accounting phức tạp sớm |
| Lease lifecycle + e-sign | AI leasing assistant trước khi có volume |
| Listing → application → lease funnel | Per-unit enterprise pricing |

---

## 4. R3 — SaaS landscape (rút gọn)

### Việt Nam

| Sản phẩm | Đối tượng | Điểm mạnh | Ghi chú House X |
|----------|-----------|-----------|-----------------|
| **Resident** | Chuỗi CHDV / trọ / VP (claim 30k+ căn, 1k+ đối tác) | Gạch nợ QR, Zalo OA, IoT điện, HĐ online | Benchmark #1; **partner** nếu làm full PM |
| **NhaTroSo** | Chủ nhỏ–TB | Hóa đơn Zalo/SMS, AI đọc công tơ, gói rẻ | Self-manage landlords |
| **Smartos** | CHDV + coworking | PMS + booking + consulting | Gần BTR / mixed-use |
| **Vi-Office** | Operator ~30–300 căn | EVN bậc thang, TT200/TT78, khóa Tuya | Depth kế toán VN — đắt replicate |
| **Landsoft Agency** | Sàn môi giới | CRM bán + cho thuê, giỏ hàng | Gần CRM House X hơn PMS |

### Global (tham chiếu kiến trúc)

| Sản phẩm | Best for | Bài học |
|----------|----------|---------|
| TenantCloud / RentRedi | Landlord nhỏ | Lease + collect + ticket tối giản |
| Buildium | PM ~10–150 units | Owner portal + accounting |
| AppFolio | PM chuyên nghiệp lớn | Automation — chỉ sau scale |

**Kết luận R3:** Thị trường PMS VN đã có sản phẩm trưởng thành theo vertical (trọ, CHDV, coworking, kế toán VN). House X **không có lợi thế** để vào như vendor PMS; có lợi thế ở **inbound + listing + cố vấn + NOXH/CCTM funnel**.

---

## 5. R4 — Chấm khả thi House X

| ID | Phương án | Điểm | Verdict | Lý do ngắn |
|----|-----------|------|---------|------------|
| **A** | Leasing-only + listing/match | 9/10 | **GO — P0** | Khớp `Listing` `RENT`, CRM, Magnix; doanh thu tìm khách; không cần thu tiền/IoT |
| **B** | Yield / cashflow advisory tools | 8/10 | **GO — P0/P1** | Đã có BTR content + tool vay; mở rộng dòng tiền thuê + thuế 10% |
| **C** | Partner PMS (Resident…) | 7/10 | **CONDITIONAL** | Chỉ khi House X/Minh An thật sự vận hành full PM |
| **D** | Full-service PM (người + quy trình) | 4/10 | **HOLD** | Cần mạng thợ, SLA, HĐ QL, xử lý tranh chấp — không phải sprint software |
| **E** | Build PMS cạnh Resident | 2/10 | **NO-GO** | Moat local (Zalo, EVN, IoT, tax) đã bị chiếm |

### Fit stack hiện tại

**Đã có:** `TransactionType.RENT`, `/cho-thue`, series BTR, Journey S, Lead/Opportunity (ADR-015), inbound Magnix, MonetizationTrack `ADVERTISING | MANAGED`.

**Chưa có (và P0 không cần):** `LeaseCase`, tenant portal, billing cycle, work order, owner statement, IoT meter, gạch nợ ngân hàng.

---

## 6. R5 — Đã đóng → ADR-018

Chi tiết quyết định & phased P0–P2: `.cursor/ADR-018-rental-advertising-partner-lane.md`.

### Được phép ngay (P0)

- Chuẩn hóa **listing thuê Advertising** (fields, ảnh, QA, SLA lead trên `/cho-thue`).
- Lead taxonomy: `landlord` | `tenant` (+ giữ NOXH/CCTM).
- Content/tool: thuế cho thuê, dòng tiền ròng, “khi nào cần QL / kế toán”.
- Chuẩn bị (chưa bắt buộc code): danh sách partner PM + kế toán cho Minh An.

### Cấm / hoãn 12 tháng

- `MonetizationTrack.MANAGED` cho thuê.
- Build PMS; tự full PM; master lease.
- Public copy “House X quản lý tài sản” nếu chưa có HĐ partner + SLA thật.

---

## 7. Đề xuất nghiên cứu bổ sung (field — không chặn P0 leasing)

Desk research đủ để **NO-GO PMS** và **GO leasing-only**. Trước khi bán full PM hoặc chốt % phí, nên:

| Việc | Mục tiêu | Effort |
|------|----------|--------|
| Phỏng vấn 3–5 operator CHDV/trọ (dùng Resident/Smartos) | Xác thực pain + phí thật | 1–2 tuần |
| Mystery shop 2 đơn vị QL thuê HCMC/HN | Scope HĐ + SLA thực tế | 1 tuần |
| Trial Resident / NhaTroSo (tenant view) | Hiểu UX đối thủ nếu partner | 3–5 ngày |
| Map pháp lý: môi giới thuê vs QL tài sản vs cho thuê lại | Rủi ro giấy phép / HĐ | Legal review |

---

## 8. Nguồn (desk)

- https://resident.vn/ — PMS VN; case TingTong, NineHousing, Living Joy; bài “Có nên thuê đơn vị vận hành”
- https://nhatroso.com/ — PMS chủ nhỏ, AI meter, Zalo invoice
- https://smartos.space/ — PMS + booking + coworking
- https://vi-office.com/industries/property-cho-thue.html — EVN, TT200/TT78, IoT
- https://landsoft.com.vn/ — CRM sàn (bán + thuê)
- Buildium / AppFolio / TenantCloud / RentRedi — reviews & comparison 2025–2026
- Hausive: phí QL VN 2026; vận hành QL BĐS VN; cẩm nang PM HCMC 2026

**Confidence:** trung bình–cao cho taxonomy & NO-GO build PMS; **thấp hơn** cho số liệu occupancy/yield/phí đàm phán thực tế từng quận — cần field trước khi pricing full PM.

---

## 9. Next step đề xuất

1. ~~R5 + ADR-018~~ **Done.**  
2. Backlog P0: listing thuê Advertising QA + lead taxonomy + tool/content thuế–dòng tiền.  
3. Song song ops: shortlist partner PM + công ty kế toán (Minh An) — không block P0 listing.  
4. **Không** mở MANAGED / PMS cho đến ADR mới sau tháng 12.
|
