# ADR-018 — Rental Platform: Quảng cáo · Tìm khách thuê · Hoa hồng (+ QL sau)

| Field | Value |
|-------|-------|
| **Status** | Accepted (amended) |
| **Date** | 2026-07-29 |
| **Amended** | 2026-07-29 — làm rõ thang dịch vụ: nền tảng QC + tìm khách/bán phòng (hoa hồng); QL vận hành sau theo P&L; **cấm thuê lại** |
| **Depends on** | ADR-009/010 (Journey A · MonetizationTrack), ADR-013, ADR-015, research `Proptech-HouseX/docs/research/RENTAL_PM_RESEARCH_EVAL_2026-07.md` |
| **Deciders** | House X / Magnix · Minh An Land |
| **Canvas** | `canvases/rental-pm-research-eval.canvas.tsx` |

## Context

Desk research R0–R4: **không build PMS** cạnh Resident; leasing-only (hoa hồng tìm khách) khả thi cao; full PM chỉ khi có capacity + P&L.

R5 (2026-07-29) + làm rõ dịch vụ cùng ngày:

| Câu hỏi | Quyết định |
|---------|------------|
| Mô hình dịch vụ cốt lõi? | **Nền tảng quảng cáo** + **tìm khách thuê / bán phòng** cho chủ nhà & đối tác → **nhận hoa hồng**. |
| Full PM 12 tháng tự vận hành? | **Chưa.** QL vận hành triển khai **sau**, theo **quy mô + P&L từng dự án** (có thể tự làm và/hoặc partner). |
| Thuê lại để KD? | **Cấm.** Không master lease / thuê rồi cho thuê lại. |
| Pháp nhân | **Minh An Land** (+ đối tác kế toán → pháp lý / thuế). |
| Portfolio | CHDV, chủ căn hộ, co-working, chủ KD / có căn cho thuê. |
| Listing `track` trên House X (12 tháng) | **`ADVERTISING`** (mặt tin / gói QC). Hoa hồng tìm khách = **lớp thương mại Minh An**, chưa bật `MANAGED` inventory pipeline. |

## Decision

### Thang dịch vụ (canonical)

```
┌─────────────────────────────────────────────────────────────┐
│  LỚP 1 — NỀN TẢNG (House X)                                 │
│  Quảng cáo tin thuê · match lead · công cụ/content           │
│  Kiếm tiền phụ: phí gói AdPackage (Journey A)               │
└───────────────────────────┬─────────────────────────────────┘
                            │ lead / tin chất lượng
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  LỚP 2 — MÔI GIỚI THUÊ / BÁN PHÒNG (Minh An + CTV/đối tác) │
│  Tìm khách thuê · dẫn xem · chốt HĐ · bàn giao              │
│  Kiếm tiền chính P0–P1: HOA HỒNG khi giao dịch thành công   │
└───────────────────────────┬─────────────────────────────────┘
                            │ khi quy mô + P&L đủ
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  LỚP 3 — QUẢN LÝ VẬN HÀNH (sau này, theo dự án)             │
│  Thu tiền · điều phối bảo trì · báo cáo chủ · gia hạn…      │
│  Kiếm tiền: phí QL % / gói — KHÔNG thuê lại để kinh doanh   │
│  Tool ops: partner SaaS (Resident…) nếu cần — không build   │
└─────────────────────────────────────────────────────────────┘
```

| Lớp | Tên ngắn | Ai bán / ký | Doanh thu | Horizon |
|-----|----------|-------------|-----------|---------|
| **1** | Nền tảng QC | House X surface | Phí gói quảng cáo (optional) | **P0** |
| **2** | Tìm khách / bán phòng | **Minh An Land** (+ CTV, đối tác) | **Hoa hồng** khi có khách thuê / chốt phòng | **P0–P1** (core) |
| **3** | QL vận hành | Minh An và/hoặc partner QL | Phí quản lý theo HĐ | **Sau** — chỉ khi **quy mô + P&L dự án** đạt ngưỡng nội bộ |
| **—** | Thuê lại / master lease | — | — | **Cấm** |

### Luồng vận hành P0–P1

```
Chủ nhà / đối tác
  → đăng tin thuê trên House X (RENT + track=ADVERTISING)
  → (optional) mua gói QC
  → hệ thống / CTV nhận lead khách thuê
  → Minh An / đối tác: dẫn xem → chốt → hoa hồng
  → (optional) giới thiệu kế toán / pháp lý / “cần QL sau”
```

- **House X** = Proptech: listing, lead, consent, content, tools.  
- **Minh An Land** = pháp nhân hoa hồng tìm khách + HĐ dịch vụ với chủ/đối tác.  
- **Đối tác** = nguồn hàng / đồng môi giới / (sau) đơn vị QL hoặc kế toán.

### Nguyên tắc cứng

1. **Hoa hồng tìm khách là core thương mại — không phải “chỉ bán ads”**
   - Lớp 2 là mô hình chính gần hạn: tìm khách thuê / bán phòng cho chủ nhà & đối tác.
   - Phí gói QC (Lớp 1) là doanh thu phụ / hỗ trợ phân phối tin — không thay hoa hồng.
   - SOP nội bộ: thỏa thuận % hoặc số tháng thuê với chủ/đối tác **trước** khi đẩy lead nóng.

2. **Listing track `ADVERTISING` ≠ “không có hoa hồng”**
   - Trên Postgres: tin thuê P0 giữ `track = ADVERTISING` (Journey A — chất lượng tin, chống spam, AdPackage).
   - Hoa hồng ghi nhận phía Minh An / referral / activity (ADR-015 phased) — **chưa** mở Consignment / commission-split MANAGED như Journey S bán nhà.
   - Badge UI: tin quảng cáo cho thuê; copy không ghi “House X đang quản lý căn” trừ khi đã có HĐ Lớp 3.

3. **Lớp 3 QL vận hành = có điều kiện P&L**
   - Chỉ mở khi dự án/cụm căn đạt ngưỡng quy mô + biên lợi nhuận nội bộ (chưa khóa số trong ADR — quyết định từng case).
   - Hình thức: **dịch vụ quản lý** (phí % hoặc gói) — **không** thuê lại để tự KD.
   - Có thể tự vận hành và/hoặc partner; phần mềm thu tiền/IoT = SaaS đối tác, **không build PMS** House X.

4. **Cấm master lease / thuê lại kinh doanh**
   - Không ký thuê nguyên căn rồi cho thuê lại lấy biên như sản phẩm House X / Minh An.
   - Tránh rủi ro vốn, trống căn, và lệch định vị cố vấn / môi giới.

5. **Pháp nhân & dịch vụ phụ**
   - HĐ hoa hồng / giới thiệu: **Minh An Land**.
   - Kế toán / thuế / pháp lý HĐ thuê: đối tác kế toán (mở rộng sau) — referral, không nhét vào MANAGED listing.

6. **Demand content**
   - Value-first: thuế cho thuê, dòng tiền ròng, checklist cho thuê — CTA về đăng tin + nhờ tìm khách (Lớp 2), không cold-sell Lớp 3 khi chưa có P&L.

7. **Conversion (ADR-015)**
   - Journey **A**: Opportunity gói QC / listing thuê.
   - Chốt hoa hồng tìm khách: ghi nhận qua SalesActivity / ConversionOutcome / referral (phased) — không giả `COMMITTED` kiểu cọc bán nhà Journey S/P.
   - Lớp 3 sau này: ADR bổ sung khi P&L mở — có thể xét `MANAGED` hoặc ServiceCase riêng.

8. **Portfolio**
   - CHDV, căn hộ cho thuê, co-working / mặt bằng KD nhỏ, chủ 1–n căn, đối tác có giỏ phòng.
   - KPI P0–P1: listing `RENT` chất lượng · lead tenant · **số deal hoa hồng** · (phụ) AdSubscription · referral kế toán.
   - KPI Lớp 3: chỉ khi đã mở dự án QL — occupancy, phí QL thu được, margin sau chi phí ops.

### Phased delivery

Chi tiết ticket build: `Proptech-HouseX/docs/strategy/RENTAL_IMPL_PLAN_2026-07.md`.

| Phase | Scope dịch vụ | Software / ops | Outside |
|-------|---------------|----------------|---------|
| **Wave 0** | Lớp 1 + capture Lớp 2/P3 | QA RENT · rentalIntent · hub `/cho-thue` · badge · SOP hoa hồng · deep-link thuế | Lớp 3, PMS |
| **Wave 1** | Lớp 2 vận hành + P3 tool | Công cụ dòng tiền/thuế · ops filter · deal hoa hồng · CTV module | Full PM OS |
| **Wave 2** | Referral KT · Sense P4 · KPI | Waitlist NEED_PM · optional AdPackage · dashboard | Build PMS |
| **Lớp 3** | QL vận hành theo P&L dự án | ADR mới + partner SaaS | Master lease |

## Consequences

### Positive

- Định vị rõ: **sàn QC + máy tìm khách thuê (hoa hồng)** — đúng chu kỳ khó và capacity.
- Đường mở Lớp 3 có kỷ luật P&L — tránh ôm ops sớm.
- Cấm thuê lại giảm rủi ro vốn / lệch brand.

### Negative / Trade-offs

- Hoa hồng phụ thuộc chốt deal thật — cần SOP CTV + theo dõi lead, không chỉ đăng tin.
- `track=ADVERTISING` trên listing có thể gây nhầm với “chỉ bán ads”; phải đào tạo nội bộ: **Lớp 2 = hoa hồng**.
- Lớp 3 muộn → chủ hỏi “có quản lý hộ không?” phải trả lời trung thực: đăng tin + tìm khách ngay; QL khi đủ quy mô / partner.

## Non-goals

- Build PMS cạnh Resident.
- Master lease / thuê lại kinh doanh.
- Bật `MANAGED` inventory rental trên House X trước ADR Lớp 3.
- Cam kết public “quản lý tài sản toàn phần” khi mới Lớp 1–2.

## References

- `Proptech-HouseX/docs/research/RENTAL_PM_RESEARCH_EVAL_2026-07.md`
- `Proptech-HouseX/docs/strategy/MARKET_PAIN_GOVERNANCE.md` — quản trị nỗi đau thị trường
- `Proptech-HouseX/docs/ARCHITECTURE_PLATFORM_MODEL.md` § ADR-009/010
- `.cursor/ADR-015-sales-conversion-operating-layer.md`
|
