# Sales Conversion Operating Layer — Delivery Backlog

> Backlog triển khai ADR-015 và
> `.cursor/SALES_CONVERSION_PIPELINE_MAP.md`. House X là nguồn sự thật cho identity,
> consent và sales lifecycle; Magnix chỉ sở hữu acquisition/orchestration và các
> consumer dùng event đã giảm thiểu PII.

## Cách đọc trạng thái và bằng chứng

| Nhãn | Ý nghĩa |
|---|---|
| `PLANNED` | Chưa có implementation được backlog này xác nhận. |
| `REPO-DONE` | Code, migration, tài liệu và automated test đã có trong repository và CI pass. Không đồng nghĩa đã deploy. |
| `STAGING-PROVEN` | Có bằng chứng ngoài repository: URL/môi trường, thời gian, execution/request ID, DB assertion đã mask PII và người xác nhận. |
| `PRODUCTION-PROVEN` | Có bằng chứng production tương tự staging, kèm owner rollback và thời điểm quan sát sau deploy. |
| `BLOCKED` | Gate phụ thuộc chưa đạt hoặc thiếu quyết định bắt buộc. |

Mỗi epic phải theo dõi riêng `repo_status` và `runtime_evidence`. File, fixture,
screenshot cấu hình hoặc workflow JSON trong repository chỉ chứng minh
`REPO-DONE`; chúng không chứng minh VPS/n8n đang chạy đúng phiên bản. Secrets,
consent proof và PII thật không được đưa vào bằng chứng.

## Nguyên tắc chương trình

- Không tạo Journey thứ tư. Mọi `Opportunity` thuộc đúng một journey `A | S | P`.
- Không dùng Google Sheet làm sales write path, dedupe authority hay consent store.
- Không suy consent từ `consent_basis`, source, UTM, acquisition score hoặc lịch sử.
- Domain mutation và canonical outbox event phải nằm trong cùng transaction.
- G2 của bất kỳ journey nào bị chặn đến khi G1 consent, idempotency, RBAC/PII và
  retry/DLQ đạt.
- Thay đổi schema ưu tiên additive; dual-read chỉ có thời hạn và không dual-write
  sang nguồn sự thật thứ hai.

## Dependency matrix

| Epic | Gate chính | Phụ thuộc cứng | Có thể chạy song song | Mở khóa |
|---|---|---|---|---|
| SC-0 Identity + consent | G0 → G1 | ADR-013/014/015; contract/PII review | UID safety, backup/restore, docs drift | SC-1, SC-3, SC-6; mọi outreach |
| SC-1 Assignment + SLA | G1 | SC-0 effective-consent API; owner/attribution mapping | SC-2 schema/read projection | SC-3; SLA notifications |
| SC-2 Buyer profile + matching | G1 → G2 | SC-0 identity; journey/inventory stable IDs | SC-1; matching fixtures | SC-4; scoped matching UI |
| SC-3 Activities + appointments | G1 | SC-0; SC-1 actor/owner; canonical outbox | SC-2 | SC-4, SC-5; reminder consumers |
| SC-4 Inventory snapshot + proposal/deposit | G2 | SC-2; SC-3; journey legal/inventory/payment gates | Journey A/S/P adapters independently | SC-5 commitment/outcome |
| SC-5 Outcome + revenue attribution | G2 | SC-4 commitment evidence; attribution rules | Funnel read model preparation | SC-6 feedback; reconciled KPIs |
| SC-6 Lifecycle nurture/reactivation/referral | G2 | SC-0 withdrawal suppression; SC-5 outcomes | Consent-safe content/notification work | Closed-loop growth |
| SC-7 Reporting/migration/retention | G0 → G2 | Contract inventory; then SC-0…SC-6 by slice | Backup/restore, docs drift, staging harness | Production go-live and audit closure |

## Parallel workstream sequencing

1. **G0 — freeze contracts:** approve lifecycle, identity/consent ownership,
   idempotency keys, event envelope, PII minimization and legacy-event mapping.
2. **After G0, run in parallel:**
   - **Data safety:** fix UID conversion safety, fail-closed auth, ingest duplicate
     handling, consumer dedupe, bounded retry and observable DLQ/replay.
   - **Sales core:** SC-0 first; then SC-1/SC-2 in parallel; SC-3 after actor,
     consent and owner semantics are stable.
   - **Resilience:** daily off-VPS `pg_dump`, checksum, retention, restore drill and
     alerting. A backup file without a successful restore is not evidence.
   - **Legal/notifications:** preserve journey legal/verification/payment gates;
     separate service notifications from marketing and add consent-safe alert paths.
   - **Docs drift:** reconcile ADR-013 storage language, LIVE/G1/G2 labels, route and
     event versions. Documentation cannot promote a target to LIVE.
3. **G1 exit:** migration rollback test, duplicate/retry and DLQ replay pass,
   withdrawal blocks marketing immediately, RBAC/PII tests pass, restore drill pass.
4. **G2 adoption:** implement SC-4/SC-5 per journey, then SC-6. Each journey needs
   one reconciled end-to-end path with no specialized gate bypass.
5. **Staging then production:** SC-7 collects deployed commit/image, n8n workflow
   version, execution IDs, masked DB assertions, alert evidence and rollback owner.

---

## SC-0 — Identity + consent

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G1 authoritative foundation.

**Owner boundary**

- House X owns identity resolution, `Customer`/`Lead`, effective consent and the
  append-only consent ledger in Postgres.
- Magnix may submit acquisition provenance and stable idempotency keys. It may not
  resolve a raw UID as a phone number, grant consent or keep a parallel consent state.

**Dependency/gate**

- G0 vocabulary, subject key, purpose/channel taxonomy, retention rule and PII/event
  review approved.
- Existing `InboundUidLead`, `Customer`, `Lead` and ingest mapping inventoried.

**Impacts**

- Schema: additive `ConsentRecord` with subject, purpose, channel, action, proof
  reference, policy version, captured/withdrawn time; identity links remain
  canonical House X records.
- API: `POST /api/conversion/leads`,
  `POST /api/conversion/consents`, and scoped effective-consent read/check.
- UI: Ops identity-review queue, consent timeline and explicit suppression state;
  proof attachment is referenced, not rendered to unauthorized roles.
- Events: `acquisition.touch_promoted`, `lead.created`, `consent.recorded`,
  `consent.withdrawn` using the canonical envelope.

**Security/PII**

- Normalize and protect PII; never log full UID, phone, email or proof.
- Consent is append-only; deny/withdraw wins immediately by subject + purpose +
  channel. Service and marketing purposes remain separate.
- RBAC, retention/deletion and sensitive-access audit are required.

**Acceptance criteria and KPIs**

- Same idempotency/domain key creates at most one lead/link and one consent action.
- `consent_basis=organic|partner|ads` never yields an effective grant.
- A withdrawal suppresses new marketing dispatch before the next send attempt;
  target suppression propagation p95 ≤ 60 seconds in staging.
- 100% consent mutations contain actor/source, policy version, timestamp and
  correlation ID; 0 full-PII values in sampled logs/events.

**Tests**

- Migration up/down or forward/compensating rollback on production-shaped fixture.
- Duplicate and concurrent identity/consent requests; conflicting identity review.
- Grant → withdraw → stale campaign preference; purpose/channel isolation.
- RBAC matrix, retention job, log/event PII scan and unauthorized proof access.

**Rollout/rollback**

- Deploy additive schema dark; enable writes behind a flag; dual-read legacy consent
  only for an approved, time-boxed comparison.
- Backfill stable links only from reliable data; ambiguous records enter review and
  never receive inferred grants.
- Rollback disables new commands/reads and returns consumers to legacy behavior while
  retaining append-only evidence; never delete consent history.

---

## SC-1 — Assignment + SLA

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G1 after SC-0 controls.

**Owner boundary**

- House X owns authoritative broker/queue assignment, attribution locks/conflicts,
  acceptance and SLA facts.
- Magnix may notify and escalate from events; it cannot reassign owner or persist a
  competing SLA/sales status.

**Dependency/gate**

- SC-0 effective-consent decision and identity link available.
- Owner, acceptance and SLA-clock semantics approved against existing attribution
  tables; G0 event mapping frozen.

**Impacts**

- Schema: additive assignment acceptance and SLA timestamps/targets, or reviewed
  fields on existing records; no duplicate owner authority.
- API: scoped assignment/acceptance commands and SLA read projection with
  idempotency/correlation IDs.
- UI: Ops queue for unassigned/unaccepted/overdue items, conflict badge and audited
  owner history.
- Events: `lead.status_changed` plus assignment/SLA operational events only after
  schema/version review; `attribution.conflict` remains specialized.

**Security/PII**

- Queue/event payload contains stable lead/owner IDs and timing facts, not contact
  details. Assignment commands require role and tenant/scope checks.
- Notification content is minimized; an overdue projection never proves contact
  permission.

**Acceptance criteria and KPIs**

- One authoritative owner at a time; all reassignment has actor, reason and audit.
- Duplicate acceptance/escalation requests produce one state change/side effect.
- ≥ 99% eligible staging leads receive assignment within configured SLA; p95
  assignment-to-acceptance and first-response metrics are queryable.
- 100% overdue notifications trace to a stable event/correlation ID; 0 local owner
  mutations by Magnix.

**Tests**

- Concurrent assignment, stale version, reassignment conflict and idempotent accept.
- SLA boundary/time-zone/clock tests; event retry and notification consumer dedupe.
- RBAC tests for broker, Ops and unauthorized caller.

**Rollout/rollback**

- Begin with read-only SLA projection and shadow metrics; then enable acceptance and
  escalation by cohort.
- Rollback disables commands/notifications and preserves owner/audit records; return
  UI to existing attribution workflow without rewriting history.

---

## SC-2 — Buyer profile + matching

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G1 model, G2 journey adoption.

**Owner boundary**

- House X owns the minimum buyer-needs projection and inventory stable references.
- Magnix can consume aggregate match signals for content learning; it cannot copy a
  PII-rich profile to Sheet or treat a recommendation as reservation/eligibility.

**Dependency/gate**

- SC-0 canonical subject; stable IDs for projects, listings and project units.
- Journey-specific legal/eligibility rules documented; matching contract reviewed
  before G2 integration.

**Impacts**

- Schema: reviewed needs/preferences projection linked to Lead/Opportunity; avoid a
  second Customer source of truth.
- API: scoped profile update/read and deterministic matching read endpoint.
- UI: consent-aware needs form, candidate list with reason/freshness and explicit
  “recommendation only” state.
- Events: `opportunity.created` and minimized match/profile-change events only when a
  downstream use case is approved.

**Security/PII**

- Collect only fields necessary for declared purpose; financial/legal details stay
  under stronger scope and do not enter event payloads.
- Matching output exposes stable inventory IDs and reason codes, not identity data.

**Acceptance criteria and KPIs**

- 100% match results include source record IDs, snapshot/freshness time and reason.
- 0 match operations reserve inventory, change stage or mark legal eligibility.
- Duplicate profile updates are idempotent; stale-write conflict is explicit.
- On curated staging fixtures, precision@5 meets the approved baseline (initial gate
  ≥ 80%) and no unavailable inventory is recommended.

**Tests**

- Schema validation, missing/contradictory preferences and stale inventory.
- Journey A/S/P fixtures, authorization, PII minimization and deterministic ranking.
- Negative test proving recommendation cannot invoke reservation or stage mutation.

**Rollout/rollback**

- Release read projection and offline evaluation first; shadow matching before UI.
- Enable by journey/cohort. Rollback hides recommendations and reverts to manual
  inventory search without deleting canonical needs/activity history.

---

## SC-3 — Activities + appointments

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G1 authoritative foundation.

**Owner boundary**

- House X owns append-only `SalesActivity`, appointment/task facts and authorized
  lifecycle transitions.
- Magnix owns reminder delivery/automation and must write outcomes back through
  House X APIs; retries cannot create duplicate activity.

**Dependency/gate**

- SC-0 subject/consent and SC-1 actor/owner semantics stable.
- Canonical outbox transaction, `event_id`, dedupe and DLQ policy implemented.

**Impacts**

- Schema: additive `SalesActivity` with deterministic key, actor, type, occurred/due
  time, from/to, reason and correlation ID; appointment details are minimum necessary.
- API: `POST /api/conversion/activities` and scoped timeline/task/appointment reads.
- UI: unified timeline, next action, appointment outcome and retry-safe action forms.
- Events: `lead.status_changed`, `opportunity.stage_changed` and reviewed
  appointment/task signals in canonical envelope.

**Security/PII**

- Notes are permissioned and sanitized; no full PII or sensitive document content in
  logs, events or notification payloads.
- Marketing reminders require effective consent; operational appointment messages
  use a separately approved service purpose.

**Acceptance criteria and KPIs**

- Duplicate activity key/event retry creates exactly one timeline item and reminder.
- 100% state transitions contain actor, time, from/to, reason and correlation ID.
- Appointment reminder delivery p95 meets approved SLA; failed deliveries become
  observable/replayable without duplicating business activity.
- 0 unauthorized actors can mutate lead/opportunity state.

**Tests**

- Concurrent append, duplicate retry, invalid transition and terminal-state reopen.
- Time-zone/reschedule/cancel/no-show fixtures; consumer dedupe and eight-attempt DLQ.
- RBAC, note sanitization, PII scans and consent/service-purpose tests.

**Rollout/rollback**

- Start timeline read-only, then enable activity writes and reminders by cohort.
- Rollback disables write/reminder flags, drains in-flight jobs idempotently and
  retains append-only audit. Replay uses the same event identity.

---

## SC-4 — Inventory snapshot + proposal/deposit

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G2; blocked until G1 exit.

**Owner boundary**

- House X journey modules own inventory, legal/verification/payment gates, proposal,
  booking/deposit and commercial references.
- Conversion layer references specialized state; Magnix may generate approved
  collateral/reminders but cannot reserve, commit or accept payment.

**Dependency/gate**

- SC-2 matching and SC-3 audited activities.
- Journey A subscription, S agreement/deal and P booking/deposit commitment evidence
  mapped and approved separately.

**Impacts**

- Schema: Opportunity subject reference plus immutable proposal/inventory snapshot
  reference; no copied booking/deal state.
- API: journey-scoped proposal command/read and opportunity transition that validates
  specialized commitment evidence.
- UI: proposal snapshot, freshness warning and gate checklist; commit action delegates
  to the journey authority.
- Events: `opportunity.stage_changed`; existing booking/NOXH/Ops events are mapped,
  not silently relabeled as canonical.

**Security/PII**

- Proposal and payment/legal documents remain protected records, never outbox or
  Sheet payloads. Price/value visibility follows role and journey scope.
- Every commitment checks authorization and current inventory atomically.

**Acceptance criteria and KPIs**

- 100% `COMMITTED` transitions reference valid journey evidence.
- 0 oversell/double reservation under concurrent staging tests.
- Proposal snapshot includes source IDs, terms/version and generated time; stale
  inventory is blocked or explicitly refreshed.
- Each adopted journey proves no bypass of legal, verification, inventory or payment
  gate; booking conflict rate from conversion integration is 0.

**Tests**

- Concurrent reservation/commit, stale proposal and expired inventory.
- A/S/P evidence adapters, unauthorized commit and invalid gate transitions.
- Event transaction/dedupe and rollback/compensation for downstream payment failure.

**Rollout/rollback**

- Shadow/read-only snapshots first; enable one journey at a time behind feature flags.
- Rollback disables conversion-layer proposal/commit entry points and returns to the
  journey-native UI/API; specialized booking/deal records remain authoritative.

---

## SC-5 — Outcome + revenue attribution

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G2 journey adoption.

**Owner boundary**

- House X owns won/lost state, reason, value/currency, attribution, booking/deal,
  commission and reconciliation.
- Magnix receives only minimized outcome events or aggregate campaign/content metrics;
  it cannot write CRM outcome or calculate authoritative revenue.

**Dependency/gate**

- SC-4 valid commitment evidence and approved attribution/conflict rules.
- Canonical outbox/DLQ proven and journey terminal-state mapping approved.

**Impacts**

- Schema: additive `ConversionOutcome` referencing, not replacing, specialized
  booking/deal/subscription and attribution records.
- API: audited outcome command/transition and scoped outcome/funnel reads.
- UI: required normalized won/lost reason, commercial reference and conflict state.
- Events: `conversion.won`, `conversion.lost`; map existing `lead.won`,
  `commission.created` and journey events with explicit schema versions.

**Security/PII**

- Cross-boundary revenue feedback is aggregate or masked; row-level value requires
  separate purpose/scope approval.
- Financial/customer details, commission internals and documents never enter Magnix
  Sheet, logs or generic events.

**Acceptance criteria and KPIs**

- 100% terminal outcomes have journey, normalized reason, actor, correlation ID and
  specialized reference; duplicate outcome request is idempotent.
- House X outcome counts/value reconcile to journey authority within approved
  tolerance (count 100%; monetary delta 0 for exact-currency records).
- 0 commission/payment state is inferred from conversion stage alone.
- Aggregate source/campaign/content outcome metrics are reproducible and contain no
  row-level PII.

**Tests**

- Won/lost/cancel conflicts, duplicate terminal mutation and explicit reopen policy.
- A/S/P reconciliation fixtures, attribution conflict and currency/value handling.
- Event minimization, authorization and consumer retry/DLQ replay.

**Rollout/rollback**

- Run shadow reconciliation before making normalized outcomes visible; enable one
  journey at a time.
- Rollback disables new outcome commands/read model and preserves references/events;
  journey records remain authoritative and reconciliation identifies any partial run.

---

## SC-6 — Lifecycle nurture/reactivation/referral

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: G2 after SC-0 and SC-5.

**Owner boundary**

- House X owns effective consent, lifecycle/outcome and dispatch-result audit.
- Magnix owns approved nurture content, scheduling and channel delivery after a
  consent decision; it writes delivery/activity result back through House X.

**Dependency/gate**

- SC-0 immediate withdrawal suppression and SC-5 normalized outcomes/reasons.
- Legal/content L0–L3, purpose/channel policy and notification ownership approved.

**Impacts**

- Schema: nurture enrollment/reference and dispatch metadata may extend authoritative
  records; no parallel lifecycle state in Sheet.
- API: eligibility read/check, idempotent enrollment/dispatch-result commands.
- UI: Ops-visible eligibility, suppression reason, next touch and stop control.
- Events: consent-safe nurture eligibility/dispatch signals with stable IDs; existing
  `lead.nurture` must be version-mapped.

**Security/PII**

- Effective consent is checked at scheduling and immediately before send.
- Withdrawal/deny/expiry suppresses pending marketing; service notices are separate.
- Content avoids sensitive inferred attributes; channel credentials stay in n8n
  credentials/env, never source control.

**Acceptance criteria and KPIs**

- 100% marketing sends have a contemporaneous purpose/channel consent decision and
  stable dispatch key; duplicate events yield one send.
- Withdrawal blocks queued marketing before next attempt; suppression p95 ≤ 60
  seconds in staging.
- 100% delivery outcomes are written back or enter observable DLQ.
- Reactivation/referral conversion is reported only on consent-safe, reconciled
  cohorts; complaint/unauthorized-send count is 0.

**Tests**

- Consent revoked between schedule/send, deny/expire, channel/purpose mismatch.
- Duplicate event/send, provider timeout/5xx, non-retryable 4xx and DLQ replay.
- Legal/notification templates, L3 approval where required and PII/content scans.

**Rollout/rollback**

- Dry-run eligibility, then internal/synthetic cohort, then capped journey cohorts.
- Kill switch stops new sends and cancels queued marketing without deleting audit;
  rollback leaves House X lifecycle/outcome unchanged.

---

## SC-7 — Reporting, migration + retention

**Status**

- `repo_status: PLANNED`
- `runtime_evidence: NOT_PROVIDED`
- Target gate: spans G0 inventory through G2 production proof.

**Owner boundary**

- House X owns scoped funnel read models, migration, retention, backup/restore and
  authoritative reconciliation.
- Magnix owns workflow deployment evidence, consumer health/DLQ and aggregate
  acquisition feedback. Repository docs describe state but cannot attest runtime.

**Dependency/gate**

- G0 contract inventory starts immediately; each read-model slice depends on its
  corresponding SC-0…SC-6 authority.
- Production go-live requires G1 controls, successful off-site restore and one G2 E2E
  path per enabled journey.

**Impacts**

- Schema: scoped funnel projection, migration checkpoints, retention/deletion audit
  and consumer event-dedupe records.
- API: `GET /api/conversion/funnel` with journey/stage/date scopes and no PII by
  default; operational health/replay uses privileged surfaces.
- UI: funnel/SLA/outcome dashboards, migration reconciliation and masked DLQ status.
- Events: schema-version inventory, legacy mapping and consumer lag/DLQ telemetry;
  no synthetic business event minted for replay.

**Security/PII**

- Funnel defaults to aggregate; small-cohort suppression and explicit PII scope.
- Backups are encrypted/access-controlled with off-VPS retention; restore workspace
  is restricted and sanitized after drill.
- DLQ stores masked errors; docs/evidence contain no credentials or customer data.

**Acceptance criteria and KPIs**

- Legacy/current counts reconcile by journey/stage with documented exceptions; no
  sales Ops/dedupe write remains in Google Sheet.
- Daily off-VPS backup success is alerted and checksum-verified; quarterly restore
  drill meets approved RPO/RTO (initial targets: RPO ≤ 24h, RTO ≤ 4h).
- Outbox/consumer: ≥ 99.9% non-poison events delivered within SLA, duplicate side
  effects 0, every `DEAD` alerts and is replayable with the same `event_id`.
- Docs route/event/LIVE labels match deployed inventory; staging and production
  evidence records commit/image, workflow version, execution IDs, masked DB
  assertions, timestamp, approver and rollback owner.
- Each enabled A/S/P journey has one reconciled lead → assignment → qualification →
  activity/appointment → commitment → outcome synthetic E2E with no gate bypass.

**Tests**

- Funnel authorization, aggregation/small-cohort suppression and reconciliation.
- Migration dry-run, checkpoint resume, rollback and ambiguous-record review queue.
- Backup checksum, clean-room restore and application smoke against restored DB.
- Outbox atomicity, eight-attempt backoff/DLQ/replay, consumer dedupe and alert test.
- Staging E2E for each enabled journey plus rollback rehearsal; production smoke uses
  synthetic/non-PII records.

**Rollout/rollback**

- Inventory and correct docs drift first; run migration/read model in shadow and
  compare metrics before cutover.
- Promote staging only with external evidence. Production uses canary/cohort flags,
  named rollback owner and observation window.
- Rollback disables new reads/consumers, restores prior workflow/app artifact and
  resumes from migration checkpoint. Database restore is disaster recovery, not the
  normal rollback for additive schema.

## Gate evidence checklist

### G0

- [ ] ADR-015, architecture and pipeline map vocabulary/ownership agree.
- [ ] Current/target schema, API, UI and event inventory reviewed.
- [ ] PII/event minimization, consent taxonomy and legacy mapping approved.
- [ ] Repository check passes; this does not claim VPS/n8n deployment.

### G1

- [ ] Additive migration and rollback/compensation test pass.
- [ ] Idempotency, concurrent duplicate, outbox atomicity and consumer dedupe pass.
- [ ] Withdrawal suppression, RBAC, retention and log/event PII scans pass.
- [ ] UID safety/fail-closed/DLQ and off-VPS restore drill have external evidence.

### G2

- [ ] One reconciled E2E path per enabled journey A/S/P.
- [ ] Legal, verification, inventory, payment and attribution gates are not bypassed.
- [ ] Funnel/outcome metrics reconcile and nurture is consent-safe.
- [ ] Staging evidence approved before production; production proof is recorded
      separately from repository completion.

