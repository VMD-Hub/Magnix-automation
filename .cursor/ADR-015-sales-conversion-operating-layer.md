# ADR-015 — Sales Conversion Operating Layer

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-17 |
| **Depends on** | ADR-013 (Postgres primary storage), ADR-014 (Zalo Mini App) |
| **Deciders** | House X / Magnix |

## Context

Magnix đã thu nhận và phân loại tín hiệu inbound; House X đã có `InboundUidLead`,
`Customer`, `Lead`, attribution, các pipeline NOXH/booking và transactional outbox.
Tuy nhiên chưa có một contract chung mô tả cách tín hiệu acquisition trở thành lead,
cơ hội bán hàng và kết quả chuyển đổi xuyên ba Journey A/S/P.

Nếu mỗi journey tự định nghĩa lead, consent và trạng thái riêng, hệ thống sẽ trùng PII,
không đo được funnel end-to-end và dễ dùng metadata nguồn thu nhận như bằng chứng đồng
ý liên hệ. Cần một lớp vận hành ngang, nhưng không tạo thêm store of record hoặc
microservice ở giai đoạn này.

## Decision

Thiết lập **Sales Conversion Operating Layer** dùng chung dưới Journey A
(Advertising), S (Secondary) và P (Primary). Đây là lớp domain logic thuộc **House X
logical boundary**: API, transaction và Postgres House X là authoritative. “House X”
ở đây là ranh giới sở hữu logic/dữ liệu, **không** bắt buộc một service, database hay
deployment riêng; trước mắt lớp này nằm trong `Proptech-HouseX`.

Magnix sở hữu acquisition orchestration: nhận webhook, normalize, classify, enrich và
gửi contract idempotent vào House X; sau khi House X xác nhận ghi thành công, Magnix
ghi Drive JSONL archive best-effort. Magnix không quyết định trạng thái bán hàng,
consent hiệu lực, attribution cuối cùng hoặc hoa hồng. Google Sheet không nằm trên
write path vận hành; chỉ là mirror read-only hoặc editorial workspace theo ADR-013.

Lớp này là horizontal operating layer, **không phải Journey thứ tư**. Mỗi opportunity
phải chỉ rõ `journey = A | S | P` và tham chiếu đối tượng thương mại tương ứng.

## Ownership boundary

| Concern | Owner | Authoritative store |
|---------|-------|---------------------|
| Source capture, normalize, classify, acquisition scoring | Magnix / n8n | House X sau ingest; Drive là archive |
| Identity resolution, customer/lead lifecycle | House X | Postgres House X |
| Consent proof, purpose, channel, withdrawal | House X | `ConsentRecord` trong Postgres |
| Opportunity, sales activity, outcome | House X journey modules | Postgres House X |
| Attribution/conflict, booking/deal, commission | House X | Postgres House X |
| Campaign/content generation | Magnix | Editorial store theo ADR-013 |

## Domain entities

Tên dưới đây là canonical domain vocabulary. Entity đã có được tái dùng; entity mới
chỉ được thêm theo phased gates, không tạo bảng song song nếu có thể mở rộng an toàn.

| Entity | Semantics |
|--------|-----------|
| `AcquisitionTouch` | Tín hiệu nguồn bất biến: source, campaign, captured time, acquisition consent metadata và external dedupe key. `InboundUidLead` là implementation hiện tại cho UID touch. |
| `Customer` | Danh tính đã resolve, PII tối thiểu; dedupe theo khóa chuẩn hóa phù hợp. |
| `Lead` | Nhu cầu cần Ops/sales xử lý; có source, segment, owner và lifecycle dùng chung. |
| `Opportunity` | Cơ hội thương mại gắn một `Lead`, một journey A/S/P và optional listing/project/unit/consignment/package. |
| `SalesActivity` | Nhật ký append-only của contact attempt, note, meeting, task và state transition; không thay đổi state nếu actor không được phép. |
| `ConsentRecord` | Bằng chứng consent authoritative, append-only: subject, purpose, channel, action, proof, policy version, captured/withdrawn time. |
| `ConversionOutcome` | Kết quả won/lost có reason, value/currency optional và journey-specific reference; không thay thế Deal/Booking/Subscription. |

`AttributionLock`, `AttributionEvent`, `NoxhCase`, `UnitBooking`, `Deal`,
`AdSubscription` và commission vẫn thuộc module chuyên biệt. Conversion layer chỉ
tham chiếu và chuẩn hóa funnel/event semantics, không sao chép state của chúng.

## Lifecycle and state semantics

### Acquisition

`CAPTURED → CLASSIFIED → REVIEW | PROMOTED | REJECTED`

- Retry cùng external key cập nhật snapshot ingest an toàn nhưng không tạo touch mới.
- `PROMOTED` chỉ có nghĩa đã tạo/ghép lead; không đồng nghĩa consent hay qualified.
- Raw UID không có contactable identity không tự động thành `Customer`.

### Lead

Tái dùng enum hiện tại:

`NEW → CONTACTED → QUALIFIED → WON | LOST`

- `CONTACTED` nghĩa Ops đã tiếp nhận/thực hiện contact attempt theo UI hiện hành.
- `QUALIFIED` nghĩa đã liên hệ và xác nhận nhu cầu tối thiểu.
- `WON`/`LOST` là terminal cho lead đó; mở lại phải tạo transition/audit rõ ràng,
  không sửa lịch sử ngầm.
- Lead status không được suy trực tiếp từ acquisition score.

### Opportunity

`OPEN → DISCOVERY → ACTIVE → COMMITTED → WON | LOST | CANCELLED`

- `COMMITTED` phải được chứng minh bởi state chuyên biệt: ad subscription hợp lệ
  (A), thỏa thuận/giao dịch managed (S), hoặc booking/deposit/deal hợp lệ (P).
- Journey-specific legal, verification, inventory và payment gates vẫn là điều kiện
  cứng; conversion layer không được bypass.
- Mọi transition ghi actor, timestamp, from/to, reason và correlation id.

### Consent

`ConsentRecord` là ledger append-only; trạng thái hiệu lực được suy từ chuỗi
`GRANTED | DENIED | WITHDRAWN | EXPIRED | SUPERSEDED` theo subject + purpose +
channel. Withdrawal không xóa bằng chứng cũ và chặn outreach tương ứng ngay.

`consent_basis`, campaign opt-in flag hoặc source metadata trên acquisition payload
chỉ mô tả **bối cảnh thu nhận**. Chúng không phải bằng chứng consent authoritative,
không tự cấp quyền marketing và không được ghi đè `ConsentRecord`.

## API contracts

API nằm trong House X boundary; version/route cụ thể có thể evolve nhưng semantics
phải giữ:

| Operation | Contract |
|-----------|----------|
| `POST /api/ingest/magnix-lead` | Upsert acquisition touch bằng `normalized_key`; trả House X id + ingest result. |
| `POST /api/conversion/leads` | Resolve identity có kiểm soát, tạo/ghép Lead; yêu cầu idempotency key. |
| `POST /api/conversion/opportunities` | Tạo Opportunity với `lead_id`, journey và subject reference. |
| `POST /api/conversion/activities` | Append activity/transition có actor và correlation id. |
| `POST /api/conversion/consents` | Append grant/deny/withdraw proof; không update-in-place. |
| `GET /api/conversion/funnel` | Read model theo journey/stage; không trả PII nếu caller không có scope. |

Success dùng `{ "ok": true, "data": { ... } }`; validation/conflict dùng
`{ "ok": false, "error": "CODE", "message": "...", "retryable": false }`.
HTTP 5xx chỉ dành cho lỗi retryable.

## Transactional outbox events

Mutation domain và outbox event phải cùng transaction. Event envelope tối thiểu:
`event_id`, `type`, `occurred_at`, `aggregate_type`, `aggregate_id`,
`correlation_id`, `schema_version`, `payload`; `dedupe_key` unique ở producer.

Canonical events:

- `acquisition.touch_recorded`, `acquisition.touch_promoted`
- `lead.created`, `lead.status_changed`
- `opportunity.created`, `opportunity.stage_changed`
- `consent.recorded`, `consent.withdrawn`
- `conversion.won`, `conversion.lost`

Payload cross-boundary dùng stable IDs, journey, stage/reason và dữ liệu đã
minimize/mask. Không phát full phone, email, UID, tài liệu hay dữ liệu tài chính nếu
consumer không có purpose/scope. Consumer dedupe theo `event_id`; retry outbox không
tạo side effect lặp.

## Idempotency, PII and consent rules

1. Acquisition ingest dedupe bằng `normalized_key`; API mutation khác nhận
   `Idempotency-Key` hoặc deterministic domain key.
2. Identity resolution không dùng raw UID như số điện thoại. PII được normalize,
   mã hóa/giới hạn quyền theo khả năng nền tảng và không xuất log; log stable id hoặc
   hash ngắn.
3. PII chỉ lưu tối thiểu cho declared purpose, có retention/deletion policy và audit
   cho access nhạy cảm. Drive archive không trở thành operational lookup.
4. Trước outreach, caller kiểm tra authoritative `ConsentRecord` theo purpose/channel
   và các lawful restriction áp dụng. “Organic”, “partner”, “ads” chỉ là provenance.
5. Withdrawal/deny phải thắng campaign preference cũ; operational/service message
   phải tách purpose khỏi marketing.
6. Secret, access token và consent proof attachment không nằm trong event payload,
   Sheet mirror hoặc source control.

## Non-goals

- Không thay thế Journey A/S/P, CRM UI, attribution, legal gate, booking/deal,
  subscription, payment hoặc commission engine.
- Không xây CDP, marketing automation đa kênh hay lead scoring bằng LLM mới.
- Không tách microservice/database và không dual-write Sheet/Postgres.
- Không backfill consent từ `consent_basis` hoặc suy consent từ lịch sử tương tác.
- Không chuẩn hóa toàn bộ schema journey trong ADR này.

## Migration

1. Giữ `InboundUidLead`, `Customer`, `Lead`, outbox và endpoint ingest hiện có; lập
   mapping sang vocabulary của ADR này.
2. Sửa mọi UID write path thành Magnix → House X API/Postgres → Drive archive; retire
   Sheet lead ops/dedupe và chỉ giữ mirror một chiều nếu cần.
3. Tách acquisition provenance (`consent_basis`, source/UTM) khỏi consent proof. Chưa
   có `ConsentRecord` thì marketing outreach mặc định không được phép; không backfill
   grant giả định.
4. Thêm entity/migration/API theo gate, ưu tiên additive schema và dual-read có thời
   hạn; không dual-write sang một store of record thứ hai.
5. Backfill stable references và lifecycle audit từ dữ liệu đủ tin cậy; record không
   rõ nguồn vào review queue, không tự nâng stage/consent.

## Phased gates

| Gate | Scope | Exit criteria |
|------|-------|---------------|
| **G0 — Contract and boundary** | Chốt vocabulary, ownership, API/event envelope; sửa tài liệu UID/consent/House X boundary. | Ba tài liệu kiến trúc thống nhất; không flow mới ghi Sheet ops; event/PII review pass. |
| **G1 — Authoritative foundation** | Additive schema cho `ConsentRecord`, Opportunity/activity tối thiểu; idempotent APIs; transactional outbox. | Migration rollback-tested; duplicate/retry tests pass; withdrawal blocks marketing; RBAC/PII tests pass. |
| **G2 — Journey adoption** | Journey A/S/P map subject, stages và outcomes; funnel read model; migrate legacy automation. | Mỗi journey có one end-to-end conversion path, no bypass legal/verification gates, reconciled metrics and rollback/runbook approved. |

**G2 Journey P slice (SC-4/SC-5, repo):** `ProposalSnapshot` + `ConversionOutcome` dưới
`/api/admin/conversion/{proposals,outcomes,funnel}`; bật bằng
`HOUSEX_CONVERSION_G2_JOURNEY_P=true`. UnitBooking vẫn là authority deposit. A/S
COMMITTED vẫn fail-closed. Runtime evidence production: chờ
`go-live:smoke-journey-p` trên VPS.

**SC-6 (repo):** `NurtureEnrollment` + eligibility/enroll/dispatch APIs; `lead.nurture`
v1 vẫn enqueue nhưng fail-closed nếu thiếu marketing consent hoặc enrollment CANCELLED.
Admin board: `/admin/conversion`.

Mỗi gate cần review schema/API riêng trước implementation. G2 không được bắt đầu cho
journey nào khi G1 consent/idempotency controls chưa đạt.

## Consequences

- Một funnel vocabulary và consent authority xuyên A/S/P, đo được conversion mà
  không trộn acquisition score với sales state.
- House X chịu thêm trách nhiệm schema/RBAC/retention; Magnix giữ vai trò acquisition
  engine và archive producer.
- Triển khai additive theo gate giảm big-bang, nhưng tạm thời cần mapping giữa entity
  hiện có và vocabulary mới.
