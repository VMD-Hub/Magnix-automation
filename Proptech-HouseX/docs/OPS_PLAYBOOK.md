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

### 4b. Telesales CRM (mobile-first) — SOP Phase 1

**Ba lane (RBAC tách — không lẫn queue)**

| Persona | Ai | Queue | Entry |
|---------|-----|-------|-------|
| **Ops** | `OpsToolGrant TELESALES_CRM` hoặc Super | Platform pool (`assignedBrokerId = null`, exclude referral/ctv_claim) | `/ops/telesales`, Mini App `#/ops` |
| **Nội sàn** | `Broker.brokerType = INTERNAL` | Lead Super gán (`assignedBrokerId = self`) | `/moi-gioi/telesales`, Mini App `#/agent/telesales` |
| **CTV** | `BrokerType CTV` | Lead/hồ sơ thuộc CTV only | Cùng agent telesales — **không** `#/ops` |

**Dual grant:** tài khoản vừa CTV vừa `TELESALES_CRM` được phép nhưng lane tách — `#/ops` chỉ pool Ops; `#/agent/telesales` chỉ own/INTERNAL. CTV **không** đọc pool `assignedBrokerId = null`. R4 / claim window không đổi.

**Quyền truy cập Ops**

| Ai | Cách vào |
|----|----------|
| Super (`ADMIN_SECRET`) | `/admin/ops-leads` + cấp quyền tại `/admin/ops-grants` |
| Nhân sự telesales | UserAccount được Super duyệt + email nhận thông báo → đặt MK trong **Tài khoản** (OTP 6 số) nếu chưa có → `/ops/telesales` hoặc Mini App `#/ops` |
| Chỉ `ADMIN_OPS_SECRET` | **Không** đủ quyền telesales |
| Nội sàn | Super đánh dấu INTERNAL tại `/admin/ops-grants` → gán lead trên board Ops → gọi trên lane agent |
| CTV | Onboard + entitlement như hiện tại — SOP gọi chỉ trên lead/case own; unmask SĐT chỉ own |

Quy trình Ops: mở Mini App / đăng ký → Super cấp `TELESALES_CRM` + email thông báo → user **đặt mật khẩu tài khoản** (OTP, không magic-link) trong Tài khoản → đăng nhập web mọi thiết bị. **MK thuộc tài khoản**, không phải mật khẩu riêng của tool.

**Ranh giới:** gọi / SMS / Zalo / nhật ký = CRM telesales (không full console). Phase 2 server OA/SMS **chỉ Ops**.  
**Conversion** chỉ khi đã đàm thoại có nhu cầu rõ + hướng căn/dự án.

```
Nhập SĐT hot → (tuỳ chọn) xem Zalo thủ công → Gọi điện trước
  → chip kết quả → SMS/Zalo nếu miss → Task gọi lại / ấm lead
  → Conversion khi nóng + có căn
```

| Bước | Việc Ops | Ghi hệ thống |
|------|----------|--------------|
| 0. Nhập | Form **Thêm lead hot** (SĐT, tên, nguồn `hot:manual` / `ads:offline` / `partner`) | Customer dedupe theo `normalizedPhone` + Task «Gọi lần 1» |
| 1. Chuẩn bị | Nút **Mở Zalo** / copy SĐT — nhìn avatar/tên (không scrape) | Activity `ZALO_OPENED` (tuỳ chọn) |
| 2. Gọi | Nút **Gọi** (`tel:`) — **không** gọi Zalo voice làm bước 1 | Sau gọi bắt buộc chọn chip kết quả |
| 3a. Đàm thoại OK | Chip CONNECTED + note | `CONNECTED`; status → QUALIFIED nếu xác nhận nhu cầu |
| 3b. Xin gửi tin | Chip SEND_INFO → mở Zalo kết bạn / OA | `CONNECTED` + Task gọi lại |
| 3c. Không nghe | Chip NO_ANSWER → **SMS** + **Zalo** chào | `CONTACT_ATTEMPT`; **khoá gọi 4 giờ**; Task gọi lại `dueAt` +4h |
| 3d. Sai số / từ chối | WRONG_NUMBER / HARD_REJECT | Có thể đóng LOST |
| 3e. Không quan tâm dự án A | NOT_THIS_PROJECT | Gắn script **Ấm lead — dự án khác**; không gọi lại dự án A trong cooldown |
| 4. Sang Conversion | Chỉ khi CONNECTED + có hướng căn | Proposal / cọc / WON-LOST trên `/admin/conversion` |

**Chống gọi trùng:** sau `NO_ANSWER`, nút Gọi bị chặn đến hết cửa sổ 4 giờ (vẫn cho SMS/Zalo).  
Không tạo Task «Gọi lại» trùng khi đã có task mở cùng lead.

**Consent:** nurture tự động (SC-6) vẫn cần marketing consent theo kênh — deep-link SMS/Zalo Phase 1 là thao tác tay Ops + log.

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
