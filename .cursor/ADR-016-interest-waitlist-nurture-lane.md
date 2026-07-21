# ADR-016 — Interest / Waitlist / Long-term OA–Mini App Nurture Lane

| Field | Value |
|-------|-------|
| **Status** | Accepted (architecture recorded; product phased) |
| **Date** | 2026-07-21 |
| **Amended** | 2026-07-21 — Information trust ladder (press-first / Sở-after); SponsorGroup watchlist |
| **Depends on** | ADR-013 (Postgres SoR), ADR-014 (Zalo Mini App + in-app notify), ADR-015 (Sales Conversion Operating Layer), SC-0 consent, SC-6 nurture |
| **Deciders** | House X / Magnix |
| **Allowlist ops** | `Proptech-HouseX/docs/INFO_TRUST_LADDER_ALLOWLIST.md` |
| **Sponsor watchlist** | `Proptech-HouseX/docs/NOXH_SPONSOR_WATCHLIST.md` |
| **Early signal review** | `Proptech-HouseX/docs/EARLY_SIGNAL_REVIEW.md` · `/admin/early-signals` |

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

5. **Cạnh tranh tin sớm (press-first)**
   - Thị trường thật: **báo chí / tín hiệu sớm → đăng ký–công bố Sở → hoàn thiện hồ sơ
     dự án → SoR mở bán**. Đợi URL Sở mới đưa tin = **chậm thị trường**.
   - Không mirror tin đồn môi giới không nguồn.
   - Thắng bằng **nhãn tầng tin + citation + không cold-call**, không bằng “có tin Sở trước”.
   - T1 (báo) được nurture waitlist sau editorial QA; **không** auto-notify từ scrape thô.
   - URL Sở = **upgrade trust (T2)**, không phải discovery gate — thiếu Sở không chặn T1.
   - Khi `SAP_MO_BAN` → `DANG_BAN` (T4 SoR): **notify in-app trước**; gọi chỉ theo opt-in /
     CTA tư vấn.

6. **Tách Ops / KPI**
   - Waitlist **không** dùng SLA gọi HOT (≤ 2 giờ).
   - Funnel / báo cáo phải tách: Interest/Waitlist vs Warm/Hot telesales vs
     Conversion (SC-7 khi làm slice).

## Information trust ladder (canonical)

Lifecycle thông tin dự án trên thị trường (không đảo thứ tự vận hành):

```
T1 PressSignal → T2 SxdRegistered → T3 DossierReady → T4 SoR sell (DANG_BAN)
     ↓ nurture waitlist          ↓ upgrade copy              ↓ LaunchTrigger
```

### Hai lớp bề mặt — bắt buộc tách trước khi triển khai product

| Lớp | Ai dùng | Chứa gì | Không được lộ |
|-----|---------|---------|---------------|
| **Vận hành (ops / editorial)** | Magnix biên tập, House X Ops, admin, allowlist docs | Mã tầng `T1`…`T4`, `InfoTrustTier`, `pressUrl`/`sxdUrl`, status `VERIFIED\|DOWN\|MISSING`, QA L0–L3, LaunchTrigger, KPI waitlist | Thuật ngữ nội bộ, bảng URL Sở đầy đủ, health-check, “amplify”, pipeline map |
| **Người đọc (reader)** | Khách web / Mini App / OA / nurture in-app | Câu tiếng Việt dễ hiểu + disclaimer đúng tầng + CTA theo tầng + link nguồn **đã chọn** (bài báo hoặc văn bản) | Mã `T1`/`PressSignal`, chữ “allowlist”, “SoR”, “LaunchTrigger”, danh sách 8 Sở dạng vận hành |

**Nguyên tắc render:** ops quyết định tầng → **map sang copy reader**; không render raw tier code hay bảng allowlist lên UI.

| Tier (ops only) | Nhãn / cảm nhận người đọc (gợi ý) | Surface reader được phép |
|-----------------|----------------------------------|--------------------------|
| T1 | “Theo báo chí / tin đang được đề cập” + disclaimer chưa công bố Sở | Bài tin sớm, landing `SAP_MO_BAN`, notify nurture thưa, CTA đăng ký nhận tin |
| T2 | “Đã có dấu hiệu công bố / đăng ký tại Sở” (kèm link văn bản nếu có) | Cập nhật tiến độ; vẫn **không** nút “đang mở bán” |
| T3 | “Hồ sơ / thủ tục” (FAQ, checklist) | Cẩm nang, panel pháp lý dự án — tách khỏi bán |
| T4 | “Đang mở bán / đợt mới” chỉ khi SoR `DANG_BAN` | CTA tư vấn / opt-in gọi; LaunchNotify |

Trust panel / `NOXH_MEDIA_SOURCES` / `NOXH_LEGAL_SOURCES` trên public = **citation đã biên tập cho người đọc**, không phải dump allowlist ops.

| Tier | Tín hiệu thị trường | Vai trò House X / Magnix | Claim được phép (ops gate → copy reader) |
|------|---------------------|--------------------------|------------------------------------------|
| **T1 `PressSignal`** | Báo chí / CĐT leak / tin địa phương (allowlist media) | Discovery + waitlist “theo dõi sớm” | Có dự án/địa điểm đang được đề cập; **cấm** giá chốt / suất / “đang mở bán chắc” |
| **T2 `SxdRegistered`** | Công bố / đăng ký tại Sở Xây dựng | Nâng độ tin + citation chính thức | “Đã có dấu hiệu đăng ký/công bố Sở”; vẫn **chưa** = đang bán |
| **T3 `DossierReady`** | Hồ sơ pháp lý đủ hơn | Editorial sâu / FAQ / pháp lý landing | Chi tiết thủ tục; vẫn tách với bán |
| **T4 `SoRSell`** | Status SoR `SAP_MO_BAN`→`DANG_BAN` | LaunchTrigger + CTA tư vấn | Mở bán / đợt / gọi chỉ theo SoR + opt-in |

### Claim framing

**Ops (nội bộ):** ghi `tier` + citation; cấm claim vượt tầng; không publish T1 thiếu disclaimer mapped.

**Reader (bắt buộc trên surface public / nurture):**

- **T1:** *«Theo báo chí / chưa thấy công bố Sở — đăng ký nhận cập nhật khi có xác nhận.»* + cam kết không gọi chỉ vì đăng ký.
- **T2:** được bỏ “chưa công bố Sở”; vẫn không CTA mở bán cứng.
- **T3:** sâu pháp lý / hồ sơ; không đồng nghĩa quyền gọi hoặc inventory.
- **T4:** mới được CTA mở bán / consult / voice theo ADR-016 cứng.

### Nguồn & QA (lớp vận hành)

- Discovery radar = **media T1 trước** + **keyword thương hiệu / CĐT** (SponsorGroup alias) —
  xem `Proptech-HouseX/docs/NOXH_SPONSOR_WATCHLIST.md`. Sở allowlist = **verify/upgrade T2**
  (health-check thưa) — chỉ trong docs/ops, không trang khách.
- Tag lọc khách = `brand:{groupSlug}` (ổn định); pháp nhân JV = LegalEntity dưới group hoặc
  `UNLINKED` — **không** tạo tag mới theo MST.
- CONTRACTOR (vd. Viettel Construction) = radar tiến độ, không chip CĐT.
- Mọi T1 public / nurture: editorial Magnix — L2 `/devil` khi claim mạnh; **L3 Early Signal Review**
  (`/admin/early-signals`, `EARLY_SIGNAL_REVIEW.md`) trước publish / cho phép nurture.
- Thiếu URL Sở = `MISSING` trên allowlist T2; **thu hẹp claim** hoặc giữ T1 + disclaimer reader — không suy đoán domain `.gov.vn`.

Chi tiết bảng allowlist (**ops only**): `Proptech-HouseX/docs/INFO_TRUST_LADDER_ALLOWLIST.md`.
Watchlist CĐT/tập đoàn (**ops only**): `Proptech-HouseX/docs/NOXH_SPONSOR_WATCHLIST.md`.
Hàng đợi duyệt tin sớm: `Proptech-HouseX/docs/EARLY_SIGNAL_REVIEW.md`.
Ops copy ngắn: `Proptech-HouseX/docs/OPS_PLAYBOOK.md` §4b-5.

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
| `InfoTrustTier` | **Ops only:** `PressSignal` \| `SxdRegistered` \| `DossierReady` \| `SoRSell`. Không render mã này cho người đọc. |
| `PressCitation` | **Ops:** URL báo (T1). **Reader:** chỉ hiện link/nguồn đã chọn + disclaimer T1. |
| `SxdCitation` | **Ops:** URL Sở (T2). **Reader:** link văn bản nếu biên tập chọn; thiếu không chặn T1. |
| `SponsorGroup` | **Ops:** thương hiệu/CĐT theo dõi (alias keyword T1). **Reader:** chip `brand:{groupSlug}` — xem `NOXH_SPONSOR_WATCHLIST.md`. |
| `LegalEntity` | **Ops:** pháp nhân MST / JV dưới SponsorGroup hoặc `UNLINKED`. Map gần `Developer`; không = tag khách chính. |
| `ChannelOperator` | **Ops:** đơn vị triển khai bán hàng/truyền thông (`CHANNEL` — vd. Kim Oanh Realty, Ann Home). Radar T1; không chip CĐT. Xem `NOXH_SPONSOR_WATCHLIST.md`. |

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
- Không coi URL Sở là điều kiện bắt đầu tin sớm / waitlist.
- Không auto-notify waitlist từ scrape báo thô (chưa editorial).
- Không build scraper báo / crawler Sở trong amendment này.
- Không expose mã tầng / allowlist / health-check Sở lên UI người đọc.

## Phased delivery (sau ADR — làm chi tiết theo thứ tự)

| Phase | Deliverable | Gate |
|-------|-------------|------|
| **P0** | Copy cam kết kênh trên CTA/form waitlist + playbook Ops («không gọi waitlist») | **DONE** 2026-07-21 (L3: Chủ quản duyệt wording khi publish) |
| **P1** | `captureType=waitlist` + preference kênh trên capture path; tách khỏi HOT notify/SLA | **DONE** 2026-07-21 |
| **P2** | Mini App: đăng ký nhận tin → khuyến khích account + hồ sơ + eligibility; inbox in-app | **DONE** 2026-07-21 |
| **P3** | SC-6 scripts: policy / progress / launch; LaunchTrigger idempotent | **DONE** 2026-07-21 |
| **P4** | SC-7 slice KPI: waitlist vs hot vs conversion | **DONE** 2026-07-21 (`go-live:kpi-waitlist`) |

## Acceptance (architecture)

- [x] Lane Interest/Waitlist được mô tả tách khỏi telesales hot.
- [x] Cam kết kênh mặc định = in-app (không gọi vì chỉ đăng ký nhận tin).
- [x] Mini App account + eligibility là giá trị đổi lấy hồ sơ đầy đủ.
- [x] Nurture = tin tức / chính sách / tiến độ; launch notify trước gọi.
- [x] Ownership Magnix content vs House X SoR/consent rõ.
- [x] **P0** copy + playbook Ops — `lib/content/messaging/interest-waitlist-copy.ts`; form `intent=waitlist` khi `SAP_MO_BAN`; `/admin/playbook` mục Waitlist.
- [x] **P1** `captureType` + `channelPreference` trên `/api/leads`; `source=waitlist:project`; `hotNotify=false`; Ops badge + chặn nút Gọi; script `waitlist-progress-updates`.
- [x] **P2** `CustomerNotification` + `/api/customer/notifications` + Mini App `#/thong-bao`; waitlist capture trên ProjectDetail; CTA tài khoản / eligibility.
- [x] **P3** LaunchTrigger trên `PATCH` status `SAP_MO_BAN`→`DANG_BAN`; scripts policy/progress/launch.
- [x] **P4** `npm run go-live:kpi-waitlist` — aggregate waitlist vs hot.
- [x] **Trust ladder** press-first (T1→T4): Sở = upgrade không discovery; claim framing + allowlist ops doc; **tách lớp vận hành vs người đọc** (2026-07-21).
- [x] **Sponsor watchlist** brand/CĐT keyword T1 + tag `brand:*` + quy tắc JV/UNLINKED (2026-07-21) — `Proptech-HouseX/docs/NOXH_SPONSOR_WATCHLIST.md`.
- [x] **Early Signal Review** queue Admin L3 trước publish/nurture tin sớm (2026-07-21) — `EARLY_SIGNAL_REVIEW.md` · `/admin/early-signals`.

## Consequences

**Positive:** OA/Mini App trở thành neo uy tín dài hạn; giảm sợ gọi; lead sạch hơn khi
mở bán; Ops không lẫn SLA; cạnh tranh bằng **nhãn tầng tin + nguồn** thay vì đợi Sở
(chậm thị trường) hoặc amplify tin đồn.

**Trade-off:** Cần `prisma migrate deploy` trên VPS cho `customer_notifications`. Admin
project editor đổi status ngoài route PATCH status cần gọi chung LaunchTrigger (nếu
chưa đi qua API status). Editorial phải giữ disclaimer T1 nghiêm — dễ lệch sang FOMO
nếu bỏ nhãn tầng.

**Rollback product:** tắt CTA waitlist / không enroll SC-6 waitlist; hot lane không đổi.
