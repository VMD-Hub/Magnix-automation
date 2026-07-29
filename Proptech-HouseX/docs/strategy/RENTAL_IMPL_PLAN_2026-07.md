# Kế hoạch triển khai — Rental Lớp 1–2 + quản trị pain P1–P3

| Field | Value |
|-------|-------|
| **Date** | 2026-07-29 |
| **Status** | Ready to execute |
| **Depends on** | ADR-018 · `MARKET_PAIN_GOVERNANCE.md` · research RENTAL_PM |
| **Canvas** | `canvases/rental-impl-plan.canvas.tsx` |
| **Rule** | Không build PMS · không MANAGED · không thuê lại · không copy Lớp 3 |

---

## Mục tiêu 90 ngày

| Pain | Outcome |
|------|---------|
| **P1** | Tin thuê sạch hơn, lead được phản hồi có đo |
| **P2** | Chủ/đối tác đăng tin → CTV/Minh An tìm khách → **hoa hồng** có SOP |
| **P3** | Chủ hiểu thuế/dòng tiền ròng → CTA referral kế toán (không tự QL) |

**Không làm trong 90 ngày:** PMS, thu tiền, work order, `track=MANAGED` thuê, master lease, AdPackage đầy đủ (để Wave 2 nếu còn bandwidth).

---

## Hiện trạng (nền đã có)

| Đã có | Thiếu (P0 build) |
|-------|------------------|
| `TransactionType.RENT`, CRUD tin, publish gate chung | Checklist QA **riêng thuê** |
| `/cho-thue` browse | Empty-state / CTA chủ nhà; field thuê tối thiểu |
| Lead + ops board | Segment/intent `landlord` / `tenant` / `tax_help` |
| Bài BTR thuế + dòng tiền | **Công cụ** `/cong-cu` tương tác |
| Journey A `ADVERTISING` | SOP hoa hồng + theo dõi deal thuê |

---

## Sơ đồ wave

```
Wave 0 (build ngay, ~1–2 tuần)     → P1 + nền P2/P3 capture
Wave 1 (tuần 3–6)                  → P2 hoa hồng vận hành + P3 tool
Wave 2 (tuần 7–12)                 → Đo KPI · referral KT · (optional) AdPackage mỏng
Gate Lớp 3                         → Chỉ khi P&L dự án đạt (ADR riêng)
```

---

## Wave 0 — Build ngay (ưu tiên tuyệt đối)

Mỗi item: **pain · deliverable · files gợi ý · DoD**.

### W0-1 · QA tin thuê (P1) — **BUILD NGAY**

| | |
|--|--|
| **Deliverable** | Publish gate bổ sung khi `transactionType=RENT`: giá > 0, ghi chú đơn vị `/tháng` rõ, tối thiểu field (loại hình CHDV/phòng/căn hộ, diện tích hoặc số phòng nếu có), ≥5 ảnh, mô tả ≥50; reject reason code riêng thuê |
| **Gợi ý path** | `lib/rules/listing-publish-gate.ts` · `lib/validation/listing.ts` · admin review copy |
| **DoD** | Tin RENT không pass gate nếu thiếu checklist; admin thấy lý do reject thuê |

### W0-2 · Intent lead landlord / tenant / tax_help (P1–P3 Sense) — **BUILD NGAY**

| | |
|--|--|
| **Deliverable** | Mở rộng capture intent (không phá NOXH/CCTM): thêm enum hoặc field `leadIntent` / mở `LeadSegment` — chọn 1 cách, ưu tiên **additive** `rentalIntent: LANDLORD \| TENANT \| TAX_HELP \| NEED_PM` nullable trên Lead + API validation |
| **Gợi ý path** | `prisma/schema.prisma` · `lib/validation/lead.ts` · `app/api/leads/route.ts` · `components/leads/lead-contact-form.tsx` |
| **DoD** | Form trên listing RENT + CTA `/cho-thue` gửi được intent; admin/ops filter hoặc cột hiển thị intent |

### W0-3 · Mặt `/cho-thue` + CTA chủ nhà (P2) — **BUILD NGAY**

| | |
|--|--|
| **Deliverable** | Bỏ/đổi empty “Coming Soon” thành hub: danh sách tin (nếu có) + CTA «Đăng tin cho thuê» + «Tôi là chủ nhà cần tìm khách» + link bài thuế/dòng tiền; copy **không** hứa quản lý căn |
| **Gợi ý path** | `app/cho-thue/page.tsx` · `lib/content/listings-browse-copy.ts` |
| **DoD** | Chủ nhà có đường đăng tin / để lại lead `LANDLORD` trong 2 click |

### W0-4 · Badge + copy Advertising rõ (P1 / Govern) — **BUILD NGAY**

| | |
|--|--|
| **Deliverable** | Trên detail tin RENT `track=ADVERTISING`: badge «Tin quảng cáo» / câu ngắn: House X kết nối — không đồng nghĩa đang quản lý căn |
| **Gợi ý path** | `app/tin-dang/[code]/page.tsx` · listing card components |
| **DoD** | Không thể hiểu nhầm Lớp 3 từ UI public |

### W0-5 · SOP hoa hồng + pain tag (P2 / Govern) — **DOCS NGAY** (không chặn code)

| | |
|--|--|
| **Deliverable** | 1 trang SOP: thỏa thuận %/tháng với chủ trước khi đẩy lead; pain tag P1–P4 trên note gọi; LOST reason mã hóa; cấm hứa QL |
| **Path** | `docs/ops/RENTAL_LEASING_COMMISSION_SOP.md` (tạo mới) · link từ `OPS_PLAYBOOK.md` |
| **DoD** | CTV/Minh An đọc được trước khi nhận lead landlord |

### W0-6 · Deep-link content P3 (P3 tạm) — **BUILD NHANH**

| | |
|--|--|
| **Deliverable** | Block trên `/cho-thue` + sau tool (khi có): link bài `thue-cho-thue-nha-2026-ma-nganh-68103` + `tinh-dong-tien-don-bay-can-ho-cho-thue-2026` |
| **DoD** | Chủ nhà từ hub thuê → đọc được thuế/dòng tiền không cần search |

**Thứ tự code Wave 0 đề xuất:** W0-5 (docs song song) → W0-2 → W0-1 → W0-3 → W0-4 → W0-6.

---

## Wave 1 — Tuần 3–6 — **DONE 2026-07-29**

### W1-1 · Công cụ dòng tiền thuê + thuế ước tính (P3) — **DONE**

| | |
|--|--|
| **Deliverable** | `/cong-cu/dong-tien-cho-thue` + registry category `cho-thue` + CTA lead TAX_HELP / LANDLORD |
| **DoD** | Tool không login; disclaimer thuế; lead intent |

### W1-2 · Ops board theo rental intent (P1–P2) — **DONE**

| | |
|--|--|
| **Deliverable** | Filter `rentalIntent` · SLA landlord ≤ 4h (due/overdue) |
| **DoD** | Queue chủ nhà tách được khỏi NOXH |

### W1-3 · Theo dõi deal hoa hồng thuê (P2) — **DONE** (Cách A)

| | |
|--|--|
| **Deliverable** | `recordRentalPlacementDeal` → SalesActivity NOTE `RENTAL_COMMISSION` · nút Ops WON/LOST |
| **DoD** | Đếm được bằng `countRentalCommissionWon` |

### W1-4 · Đào tạo CTV 1 module thuê — **DONE**

| | |
|--|--|
| **Deliverable** | AgentService `RENTAL_LEASING_CTV` + quiz · `docs/agent/thue-tim-khach-hoa-hong.md` |
| **DoD** | `npm run db:seed:agent-services` |

---

## Wave 2 — Tuần 7–12 — **DONE 2026-07-29** (W2-3 deferred)

| ID | Việc | Trạng thái |
|----|------|------------|
| W2-1 | Form «Cần kế toán / pháp lý HĐ thuê» → consent `partner_referral` + Ops «Đã chuyển partner» | **DONE** — hub `/cho-thue` · SOP `docs/ops/RENTAL_PARTNER_REFERRAL_SOP.md` · `lib/leads/rental-partner-referral.ts` |
| W2-2 | Form «Quan tâm QL sau» (`NEED_PM`) — chỉ waitlist | **DONE** — copy Sense · section hub · filter Ops |
| W2-3 | AdPackage mỏng cho tin thuê | **DEFERRED** — Journey A billing chưa sẵn; không thay hoa hồng |
| W2-4 | Dashboard KPI P1–P3 | **DONE** — `/admin/rental-kpi` + `/api/admin/rental-kpi` |
| W2-5 | Field 5–10 chủ nhà | **OPS** — checklist `docs/ops/RENTAL_FIELD_CALLS_CHECKLIST.md` |

### DoD Wave 2

- [x] TAX_HELP có opt-in partner + ConsentRecord (ADR-015)  
- [x] NEED_PM không overpromise Lớp 3  
- [x] Admin KPI reject % / SLA / commission / tax_help / need_pm  
- [x] Wave 2.5: fail-closed handoff + hiện consent trên Ops + playbook thuê  
- [ ] W2-5 field calls — Minh An chạy checklist (không phải code)  
- [ ] W2-3 AdPackage — mở khi Journey A billing sẵn  

### Wave 2.5 — Harden (sau Wave 2 code)

| ID | Việc | Trạng thái |
|----|------|------------|
| W2.5-1 | API từ chối «Đã chuyển partner» nếu thiếu consent | **DONE** |
| W2.5-2 | Ops detail hiện `partnerReferralConsent` | **DONE** |
| W2.5-3 | Playbook Admin section cho thuê | **DONE** |

### Bước tiếp theo (không phải code PMS)

1. **Ops:** chạy `RENTAL_FIELD_CALLS_CHECKLIST` (5–10 chủ) → cập nhật Sense pain  
2. **Deploy:** `npx prisma migrate deploy` (nếu chưa) · `npm run db:seed:agent-services`  
3. **Gate Lớp 3:** chỉ khi P&L dự án đạt — ADR mới, không mở từ KPI NEED_PM  

---

## Ngoài phạm vi (cấm / gate riêng)

- Build PMS, IoT, gạch nợ, owner statement  
- `MonetizationTrack.MANAGED` cho thuê  
- Master lease / thuê lại  
- Public copy quản lý căn khi chưa HĐ Lớp 3 + P&L  

---

## Owner gợi ý (chốt tên người khi kickoff)

| Wave item | Owner mặc định |
|-----------|----------------|
| W0-1, W0-3, W0-4, W1-1 | Eng House X |
| W0-2, W1-2, W1-3 | Eng + Ops |
| W0-5, W1-4 | Ops Minh An |
| W0-6, content P3 | Magnix editorial |
| W2-5 field calls | Minh An / bạn |

---

## Definition of Done — toàn Wave 0

- [x] Tin RENT có gate QA riêng  
- [x] Lead có intent landlord/tenant/tax_help  
- [x] `/cho-thue` không còn dead-end Coming Soon  
- [x] Badge/copy không overpromise Lớp 3  
- [x] SOP hoa hồng + pain tag published  
- [x] Link thuế/dòng tiền từ hub thuê  

Sau DoD Wave 0 → mở Wave 1 tool thuế.

---

## Kickoff build ngay (sprint đầu)

1. Tạo `docs/ops/RENTAL_LEASING_COMMISSION_SOP.md`  
2. Migration/API `rentalIntent` trên Lead  
3. Extend `listing-publish-gate` cho RENT  
4. Hub `/cho-thue` CTA + badge tin  

Xác nhận “bắt đầu Wave 0” → agent code theo thứ tự trên.
|
