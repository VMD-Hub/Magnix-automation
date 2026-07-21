# ADR-016 — Interest / Waitlist / Long-term OA–Mini App Nurture Lane

| Field | Value |
|-------|-------|
| **Status** | Accepted (architecture recorded; product phased) |
| **Date** | 2026-07-21 |
| **Depends on** | ADR-013 (Postgres SoR), ADR-014 (Zalo Mini App + in-app notify), ADR-015 (Sales Conversion Operating Layer), SC-0 consent, SC-6 nurture |
| **Deciders** | House X / Magnix |

## Context

Sales Gap và telesales Ops đã chứng minh đường **hot**: lead gắn dự án đang bán →
gọi → chip kết quả → QUALIFIED → conversion. Song song còn một nhóm nhu cầu **thật**
nhưng **chưa sẵn sàng chốt**:

- Quan tâm NOXH / dự án nhưng **chưa chọn** dự án cụ thể.
- Chưa đủ tài chính / đang chờ điều kiện.
- Mong dự án gần hơn / đợt mở sau — chỉ mới có tin báo chí, phê duyệt, hoặc
  `SAP_MO_BAN` chưa đủ chi tiết chuyển đổi.

Nhóm này **sợ bị làm phiền bởi cuộc gọi telesales**. Nếu form “đăng ký nhận tin”
đưa họ vào cùng SLA gọi nóng như lead hot, họ bỏ đăng ký hoặc để số ảo.

Đối thủ / môi giới có thể đưa **tin sớm hơn** (đôi khi tin ảo) để kéo khách vì FOMO.
House X không đua “sớm bằng mọi giá”; đua **tin đúng + kênh chính thức + người chịu
trách nhiệm**, và giữ khách bằng nuôi dưỡng (chính sách, tin tức, tiến độ) trên
OA / Mini App.

Cần một **lane kiến trúc riêng** trước khi làm chi tiết product — tách capture,
cam kết kênh, nurture và kích hoạt mở bán khỏi lane telesales nóng.

## Decision

Thiết lập **Interest / Waitlist Lane** (tên domain: Interest Capture) nằm dưới
ADR-015, **không** phải Journey thứ tư và **không** thay telesales hot.

### Nguyên tắc cứng

1. **Hai lớp bề mặt dự án**
   - **Đang bán (`DANG_BAN`):** chi tiết + chuyển đổi mạnh (giữ như hiện tại).
   - **Tin sớm / sắp mở (`SAP_MO_BAN` hoặc cờ editorial “press / approved-not-concrete”):**
     nội dung tiến độ + FAQ + **một CTA chính** «Đăng ký nhận thông tin dự án»
     — không ép booking / giá chốt cứng nếu chưa có dữ liệu thật.

2. **Cam kết kênh (giải nỗi sợ gọi)** — bắt buộc trên CTA, form, và màn sau submit:
   - **Mặc định waitlist:** cập nhật qua **thông báo nội bộ Mini App** (và/hoặc OA
     khi đã bật + consent), **không** gọi điện chỉ vì đăng ký nhận tin.
   - **Gọi telesales chỉ khi:** khách bấm «Tôi muốn được tư vấn», **hoặc** sự kiện
     mở bán thật + khách còn trong cohort quan tâm **và** đã opt-in kênh gọi.
   - Copy chuẩn (ý): *«Không gọi điện chỉ vì bạn đăng ký nhận cập nhật.»*

3. **Đổi giá trị lấy thông tin đầy đủ (không phải “gom SĐT”)**
   - Khuyến khích **đăng ký / đăng nhập Mini App** → để lại hồ sơ đủ → **bài lọc
     đối tượng NOXH** (biết sớm có thuộc diện không).
   - Mục tiêu vận hành: SĐT resolve được + **nhu cầu rõ** (ở / đầu tư / khu vực /
     dự án quan tâm hoặc “chưa chọn”) + preference kênh — không phải số cuộc gọi
     waitlist.

4. **Nurture value-first (Magnix content + House X consent/dispatch)**
   - Cadence thưa, consent-gated (SC-0 / SC-6):
     - Chính sách / điều kiện NOXH–vay.
     - Tiến độ dự án đã quan tâm.
     - Tín hiệu mở bán (một cú đẩy rõ) → CTA in-app «Xem đợt» / «Tôi muốn được gọi».
   - **Cấm** framing mất mát giả («sắp hết») trên cohort waitlist khi chưa mở bán.

5. **Cạnh tranh tin sớm**
   - Không mirror tin đồn môi giới.
   - Nguồn cập nhật: editorial đã QA (L0–L3 theo loại) + trạng thái dự án SoR.
   - Khi `SAP_MO_BAN` → `DANG_BAN` (hoặc cờ launch): **notify in-app trước** tới
     cohort waitlist của dự án đó; gọi chỉ theo opt-in / CTA tư vấn.

6. **Tách Ops / KPI**
   - Waitlist **không** dùng SLA gọi HOT (≤ 2 giờ).
   - Funnel / báo cáo phải tách: Interest/Waitlist vs Warm/Hot telesales vs
     Conversion (SC-7 khi làm slice).

## Ownership

| Concern | Owner | Authoritative store |
|---------|-------|---------------------|
| Editorial tin sớm, chính sách, tiến độ, CTA copy (value-first) | Magnix | Editorial / content pipeline; không SoR lead |
| Capture interest/waitlist, identity, preference kênh, consent | House X | Postgres House X |
| Mini App account, hồ sơ, bài lọc đối tượng, in-app inbox | House X + Mini App (ADR-014) | Postgres + Mini App UI |
| Nurture enrollment / dispatch audit / withdrawal | House X (SC-6) | Postgres |
| Lịch nội dung + kênh gửi sau khi House X cho phép | Magnix | n8n / providers; kết quả ghi lại House X |
| Telesales hot / chip / conversion | House X Ops | Không auto-claim từ waitlist |

## Domain vocabulary (canonical)

Tên dưới đây là contract; schema cụ thể làm ở phase product (mở rộng bảng hiện có
ưu tiên hơn bảng song song).

| Term | Semantics |
|------|-----------|
| `InterestCapture` | Đăng ký quan tâm: SĐT (normalized), segment (vd. NOXH), optional `projectId` hoặc «chưa chọn», khu vực/nhu cầu tối thiểu, `captureType`, channel preferences. |
| `captureType` | Ít nhất: `waitlist` \| `consult_request` \| `hot_manual` (và các type hot hiện có). `waitlist` ≠ hot. |
| `channelPreference` | Mặc định waitlist: `in_app` (+ optional `oa`); `voice_call` chỉ sau opt-in rõ. |
| `NeedClarity` | Trường cấu trúc tối thiểu: mục đích, khu vực, đã chọn dự án?, sẵn sàng gọi?. |
| `LaunchTrigger` | Sự kiện SoR: dự án đủ điều kiện mở bán / đổi status → enqueue notify cohort waitlist (idempotent). |
| `EligibilityPass` | Kết quả bài lọc đối tượng (NOXH tool / wizard) gắn Customer — giá trị giữ chân, không phải chứng minh đủ điều kiện pháp lý cuối cùng. |

`Lead` (ADR-015) vẫn dùng chung identity; **routing & SLA** phụ thuộc `captureType` /
preference — waitlist không vào queue gọi nóng.

## Lifecycle (Interest lane)

```
DISCOVER (editorial / OA / landing tin sớm)
  → CAPTURE (form waitlist + cam kết kênh)
  → ACCOUNT (Mini App login/register — khuyến khích, không block cứng phase 1 nếu chưa kịp)
  → PROFILE + ELIGIBILITY (hồ sơ + bài lọc đối tượng)
  → NURTURE (in-app / OA thưa — SC-6)
  → LAUNCH_NOTIFY (status flip / cờ mở bán)
  → OPT_IN_CONSULT hoặc DECLINE
       → (opt-in) TELESALES HOT lane (playbook hiện tại)
       → (decline) tiếp tục nurture hoặc silence theo consent
```

- `CAPTURE` không đồng nghĩa `QUALIFIED` hay quyền gọi.
- `LAUNCH_NOTIFY` không đồng nghĩa tạo Task «Gọi lần 1» trừ khi có opt-in gọi.

## Ranh giới với hệ hiện có

| Hiện có | Vai trò với ADR-016 |
|---------|---------------------|
| `Lead` + `/api/leads` + form dự án | Mở rộng: status-aware CTA; `captureType=waitlist`; không Telegram/HOT SLA |
| `SAP_MO_BAN` | Bề mặt tin sớm; chưa đủ = waitlist product |
| SC-6 nurture | Tái dùng enrollment/dispatch; script riêng waitlist / progress / launch |
| ADR-014 in-app notify | **Kênh mặc định** cho cohort waitlist (mở rộng từ CTV sang khách quan tâm) |
| Telesales call cue / Ops board | Chỉ sau `consult_request` hoặc launch + voice opt-in |
| `InboundUidLead` | Có thể promote → InterestCapture **không** ép `projectId` |
| Mini App `interest-area` (localStorage) | Phase sau: sync Postgres — không còn chỉ local |

## Non-goals (phase này)

- Không tạo microservice / DB riêng.
- Không bật OA marketing hàng loạt khi kill switch tắt (giữ fail-closed như hiện tại).
- Không thay attribution / commission rules.
- Không biến mọi `SAP_MO_BAN` thành inventory booking.
- Không đo thành công waitlist bằng số cuộc gọi.

## Phased delivery (sau ADR — làm chi tiết theo thứ tự)

| Phase | Deliverable | Gate |
|-------|-------------|------|
| **P0** | Copy cam kết kênh trên CTA/form waitlist + playbook Ops («không gọi waitlist») | **DONE** 2026-07-21 (L3: Chủ quản duyệt wording khi publish) |
| **P1** | `captureType=waitlist` + preference kênh trên capture path; tách khỏi HOT notify/SLA | Contract test + Ops smoke nhẹ |
| **P2** | Mini App: đăng ký nhận tin → khuyến khích account + hồ sơ + eligibility; inbox in-app | ADR-014 patterns |
| **P3** | SC-6 scripts: policy / progress / launch; LaunchTrigger idempotent | Consent smoke |
| **P4** | SC-7 slice KPI: waitlist vs hot vs conversion | Reporting only |

## Acceptance (architecture)

- [x] Lane Interest/Waitlist được mô tả tách khỏi telesales hot.
- [x] Cam kết kênh mặc định = in-app (không gọi vì chỉ đăng ký nhận tin).
- [x] Mini App account + eligibility là giá trị đổi lấy hồ sơ đầy đủ.
- [x] Nurture = tin tức / chính sách / tiến độ; launch notify trước gọi.
- [x] Ownership Magnix content vs House X SoR/consent rõ.
- [x] **P0** copy + playbook Ops — `lib/content/messaging/interest-waitlist-copy.ts`; form `intent=waitlist` khi `SAP_MO_BAN`; `/admin/playbook` mục Waitlist.
- [ ] P1–P4 product — theo backlog SC-8.

## Consequences

**Positive:** OA/Mini App trở thành neo uy tín dài hạn; giảm sợ gọi; lead sạch hơn khi
mở bán; Ops không lẫn SLA; cạnh tranh bằng tin đúng thay vì tin ảo.

**Trade-off:** Cần kỷ luật copy + routing; tạm thời form `SAP_MO_BAN` vẫn có thể lẫn
hot cho đến P1; in-app notify khách cần mở rộng model thông báo (hiện mạnh ở CTV).

**Rollback product:** tắt CTA waitlist / không enroll SC-6 waitlist; hot lane không đổi.
