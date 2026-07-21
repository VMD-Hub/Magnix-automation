# House X — Playbook Ops (SOP 1 trang)

> **Phiên bản:** 2026-07-11 · **Đối tượng:** Nhân viên Ops (pipeline lead & NOXH)  
> **In PDF:** Mở `/admin/playbook` → nút **In / PDF** hoặc `Ctrl+P` → Save as PDF  
> **Bản đầy đủ:** `NOXH_CASE_PIPELINE.md` · `LEAD_ATTRIBUTION_CONFLICT_RULES.md` ·
> [ADR-015](../../.cursor/ADR-015-sales-conversion-operating-layer.md)

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
Cuối ngày: Cập nhật đúng shared lifecycle; không nâng state từ score/tier
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
3. Cập nhật shared Lead lifecycle:
   - `NEW` — chưa được Ops tiếp nhận/xử lý.
   - `CONTACTED` — Ops đã tiếp nhận hoặc thực hiện contact attempt theo UI hiện hành;
     không đồng nghĩa đã xác nhận nhu cầu.
   - `QUALIFIED` — đã liên hệ và xác nhận nhu cầu tối thiểu.
   - `WON` / `LOST` — terminal cho lead; không sửa lịch sử ngầm để mở lại.
4. Chọn **Kịch bản nurture** phù hợp segment.
5. Điền **Kênh liên hệ** (Zalo, email) nếu khác SĐT chính.
6. **Ghi chú Ops** — ngắn gọn, không paste CCCD đầy đủ.

**Không:** Đổi SĐT khóa chính trên Customer; hứa «chắc đủ điều kiện NOXH».

### 4b. Telesales — gọi, nhắn tin, giữ khách ấm (SOP)

> Bản rút gọn trên Console: `/admin/playbook` → mục **Telesales**.

#### Ai làm gì, mở đâu

Ba đội **không dùng chung một danh sách lead**. Dùng đúng màn hình của đội mình.

| Đội | Bạn là ai | Lead bạn được thấy | Mở ở đâu |
|-----|-----------|--------------------|----------|
| **Ops** | Nhân sự House X được Chủ quản cấp quyền Telesales | Lead công ty **chưa** gán môi giới | `/ops/telesales` · Mini App → **Ops** |
| **Nội sàn** | Nhân viên sàn House X (Chủ quản đánh dấu Nội sàn) | Lead Chủ quản **đã gán** cho bạn | `/moi-gioi/telesales` · Mini App → **Telesales môi giới** |
| **CTV** | Cộng tác viên | Chỉ khách / hồ sơ NOXH **của mình** | Web/Mini App môi giới — **không** vào Ops |

- Vừa CTV vừa có quyền Ops: hai màn hình riêng — Ops = lead công ty; môi giới = lead của mình.
- Quyền Ops **không** đi kèm mật khẩu riêng của tool: đăng ký → Chủ quản cấp quyền + email → đặt mật khẩu tài khoản (OTP trong **Tài khoản**) → đăng nhập mọi thiết bị.
- Chỉ mật khẩu Ops Admin (`ADMIN_OPS_SECRET`) **không** đủ để vào telesales.

#### Quy trình một lead (làm theo thứ tự)

```
Thêm SĐT nóng → xem Zalo nhanh (tên/avatar) → Gọi điện trước
  → chọn nút kết quả → SMS/Zalo nếu không nghe → việc «Gọi lại» / giữ ấm
  → sang Chuyển đổi khi đã nói chuyện + có hướng căn
```

| Bước | Việc làm | Ghi trên hệ thống |
|------|----------|-------------------|
| 0. Nhập | Form **Thêm lead hot** (SĐT, tên, nguồn: tay / ads offline / đối tác) | Trùng SĐT được gộp; tạo việc «Gọi lần 1» |
| 1. Chuẩn bị | Nút **Mở Zalo** / copy SĐT — nhìn avatar/tên (không cào dữ liệu) | Có thể ghi «đã mở Zalo» |
| 2. Gọi | Nút **Gọi** — **không** dùng voice Zalo làm bước 1 | Sau gọi **bắt buộc** chọn nút kết quả |
| 3a. Đàm thoại OK | Nút tương ứng + ghi chú ngắn | Có thể đánh đủ điều kiện nếu nhu cầu rõ |
| 3b. Xin gửi tin | Mở Zalo kết bạn / OA, gửi checklist | Hẹn gọi lại |
| 3c. Không nghe | **SMS** + **Zalo** chào | **Khoá gọi 4 giờ**; việc «Gọi lại» sau 4 giờ |
| 3d. Sai số / từ chối | Nút tương ứng | Có thể đóng lead mất |
| 3e. Không quan tâm dự án A | Nút tương ứng | Script **Ấm lead — dự án khác**; không gọi lại A trong thời gian chờ |
| 4. Sang Chuyển đổi | Chỉ khi đã đàm thoại + có hướng căn | Proposal / cọc / thắng-thua trên `/admin/conversion` |

**Chống gọi trùng:** sau «Không nghe», nút Gọi bị khoá 4 giờ (vẫn gửi được SMS/Zalo). Không tạo hai việc «Gọi lại» trùng cho cùng lead.

**Gửi OA/SMS từ hệ thống** (nút riêng, Phase 2): chỉ Ops khi Chủ quản đã bật. Nội sàn/CTV dùng nút mở SMS/Zalo trên điện thoại. Nurture tự động vẫn cần khách đồng ý marketing theo kênh.

<details>
<summary>Chi tiết kỹ thuật (Chủ quản / triển khai)</summary>

| Persona | Điều kiện hệ thống | Queue |
|---------|-------------------|-------|
| Ops | `OpsToolGrant TELESALES_CRM` hoặc Super | `assignedBrokerId = null` (loại referral / ctv_claim) |
| Nội sàn | `Broker.brokerType = INTERNAL` | `assignedBrokerId = self` |
| CTV | `BrokerType CTV` | Own lead / `NoxhCase.brokerId` — không đọc pool null |

Chip → activity: `CONNECTED` · `SEND_INFO` · `NO_ANSWER` (`CONTACT_ATTEMPT` + cooldown) · `WRONG_NUMBER` / `HARD_REJECT` · `NOT_THIS_PROJECT`. R4 / claim window không đổi.

</details>

### 4b-2. Telesales Phase 2 — OA / SMS từ server

**Trigger:** nút **Gửi OA / SMS server** trên panel telesales (không auto sau `NO_ANSWER`). Deep-link Phase 1 giữ nguyên.

| Env | Ý nghĩa |
|-----|---------|
| `TELESALES_SERVER_SEND_ENABLED` | Kill switch — mặc định `false`; API trả 403 khi tắt |
| `ZALO_OA_NOTIFY_ENABLED` + token OA | Bật gửi OA CS (`sendOaCsText`) |
| `SMS_WEBHOOK_URL` (+ `SMS_WEBHOOK_SECRET`) | n8n nhận payload SMS; thiếu URL → `SKIPPED` |

**Luồng:** consent `marketing` + kênh `oa`/`sms` → enroll SC-6 (`telesales-miss-callback`) → gửi provider → `NurtureDispatch` (`SENT`/`FAILED`/`SKIPPED`) + SalesActivity.

| Skip reason | Ý nghĩa |
|-------------|---------|
| `CONSENT_DENIED` | Chưa grant marketing theo kênh (không enroll) |
| `NO_ZALO_USER_ID` | Lead chưa có `UserAccount.zaloUserId` |
| `SMS_WEBHOOK_UNCONFIGURED` | Chưa cấu hình webhook |
| `OA_DISABLED` | OA notify/token chưa sẵn |
| `ALREADY_SENT_TODAY` | Đã `SENT` trên enrollment trong ngày |

API: `POST /api/admin/ops-leads/:id/server-send` (cùng grant telesales + `Idempotency-Key`).

### 4b-3. Sales Gap Round 2 — Ops daily cohort (Wave 2)

**Cohort start:** 2026-07-18 · **Window:** 5 ngày làm việc · **Mục tiêu:** prove đường
assign → chip kết quả → QUALIFIED → appointment trên conversion surface.

| Vai trò | Số lượng | Entry |
|---------|----------|-------|
| Ops (`TELESALES_CRM`) | 1–2 | `/ops/telesales` hoặc Mini App `#/ops` |
| INTERNAL (tuỳ chọn) | 0–1 | Super gán lead → `/moi-gioi/telesales` |

**Checklist mỗi lead (ghi hệ thống, không Sheet):**

1. Claim/assign (Ops pool hoặc Super gán INTERNAL) — đợi accept nếu có assignment SLA.
2. Gọi + chip kết quả (`CONNECTED` / `NO_ANSWER` / …).
3. Khi có nhu cầu rõ → `QUALIFIED`.
4. Tạo appointment (site visit / call-back) trên `/admin/conversion` hoặc API conversion.
5. Next action + note; không bypass proposal/deposit nếu chưa đủ bằng chứng Journey P.

**KPI aggregate (không PII)** — chạy trên VPS:

```bash
cd /opt/housex/Proptech-HouseX
COHORT_DAYS=5 npm run go-live:kpi-sales-ops-cohort
```

Theo dõi: accept rate, % lead có activity, % QUALIFIED có appointment.
File: `reports/sales-ops-cohort-kpi-*.json`.

**Nhật ký cohort (điền sau mỗi lần KPI):**

| Ngày | KPI chạy? | Ops dùng telesales? | Ghi chú (không PII) |
|------|-----------|---------------------|---------------------|
| 2026-07-18 | ✅ baseline | — | accept 100%; appt@qualify 50% |
| 2026-07-21 | ✅ mid | ☐ cần Ops | activity 33.3%↑; assign vẫn 1; appt@qualify 33.3%↓ |
| 2026-07-22 | ☐ | ☐ | |
| 2026-07-23 | ☐ | ☐ | đóng cửa sổ 5 ngày làm việc |

**E2E harness (Wave 1)** trước khi đo cohort: `npm run go-live:smoke-sales-ops`.

**Nurture kênh thật (Wave 3)** — chỉ sau Wave 1 PASS + consent:

```bash
TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 \
  SMOKE_NURTURE_CHANNEL=sms npm run go-live:smoke-nurture-real
```

Tắt `TELESALES_SERVER_SEND_ENABLED` ngay sau smoke.

### 4b-4. Call cue NOXH (panel telesales)

Panel **Gợi ý cuộc gọi — NOXH** hiện trên web Ops + Mini App khi `lead.segment = NOXH`.

- Cue + must-cover + 4 kỹ thuật + tình huống **«Khách đòi cắt hoa hồng / cắt máu»** (không teleprompter; không đua cắt máu).
- Số liệu `[giá]`, `[hạn đợt]`, `[số căn ưu đãi]` lấy từ master dự án:
  - `ProjectUnitType.priceFrom` / unit AVAILABLE (giá từ)
  - `overviewData.telesalesFacts` (JSON trên Project):

```json
{
  "telesalesFacts": {
    "pricePerSqmLabel": "24–25 triệu/m²",
    "applicationDeadline": "2026-08-31",
    "promoUnitsRemaining": 20,
    "promoDiscountLabel": "chiết khấu đợt 1",
    "valueAnchors": ["Pháp lý đủ mở bán", "Gói vay ưu đãi NH"],
    "legalProofHint": "Kiểm tra GPXD trên cổng CĐT",
    "bankLoanHint": "Vay tối đa 70%, vốn tự có từ 30%"
  }
}
```

Thiếu hạn đợt / số căn → **soft mode** (không framing mất mát mạnh). CCTM cue = phase sau.

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
| CTV claim trong khi Ops đã `CONTACTED`/`QUALIFIED` | Từ chối claim (hệ thống) — Ops giữ khách |
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
- Sheet `noxh_leads_detail` là sink legacy nhạy cảm, không phải SoR; chỉ dùng khi
  mirror còn bật và giới hạn cho Ops được phép. Kế hoạch đích cần RBAC,
  retention/deletion và audit theo ADR-015.

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
