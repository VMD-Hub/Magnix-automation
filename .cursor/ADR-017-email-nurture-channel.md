# ADR-017 — Email Nurture Channel

| Field | Value |
|-------|-------|
| **Status** | Accepted (architecture recorded; product phased) |
| **Date** | 2026-07-21 |
| **Depends on** | ADR-013 (Postgres SoR), ADR-014 (Zalo Mini App), ADR-015 (Sales Conversion / SC-0 consent / SC-6 nurture), ADR-016 (Interest / Waitlist) |
| **Deciders** | House X / Magnix |
| **Backlog slice** | Mở rộng SC-6 — channel `email` (không tạo SC mới) |
| **Related ops** | `Proptech-HouseX/docs/SALES_CONVERSION_BACKLOG.md` § SC-6 · `Proptech-HouseX/docs/OPS_PLAYBOOK.md` · `Proptech-HouseX/docs/GO_LIVE.md` (email deliverability) |

## Context

House X đã có:

- **Transactional email** (`lib/email/send.ts`: `EMAIL_WEBHOOK_URL` → Resend → `dev_log`) cho OTP, listing ops, invite — **không** phải marketing.
- **SC-6 nurture spine:** `NurtureEnrollment` / `NurtureDispatch` + catalog script; channel hiện tại = `oa | telegram | zalo | manual | sms` — **thiếu `email`**.
- **Consent authoritative:** `ConsentRecord` (ADR-015) đã cho phép `channel` gồm `email` ở validation/events, nhưng chưa có end-to-end capture → enroll → send → withdraw cho marketing email.
- **ADR-016:** waitlist mặc định **in-app**; Zalo OA / SMS là kênh tương tác tức thì khi consent.

Vận hành inbound (NOXH / CCTM / công cụ BĐS) cần **phễu nuôi dưỡng bằng email** (lead magnet → welcome drip → digest thưa → CTA sang OA / tư vấn), vì:

- Nhiều lead magnet (checklist, bảng dòng tiền, kết quả tool) giao qua email tự nhiên.
- Email phù hợp cadence dài và value-first; Zalo phù hợp thông báo gấp / 1:1.
- Chưa có danh sách mua — chỉ **opt-in** từ form / tool / waitlist preference.

Nếu dựng ESP riêng (Brevo/Mailchimp làm SoR audience) sẽ lệch ADR-013, trùng PII, và dễ bỏ qua `ConsentRecord` / withdrawal.

Cần ADR chốt: email marketing = **một channel của SC-6**, không phải sản phẩm ESP song song.

## Decision

Thiết lập **Email Nurture Channel** dưới ADR-015 SC-6 và phối hợp ADR-016:

1. Email marketing **là channel nurture** (`channel = email`), không thay in-app / OA / SMS.
2. **House X** = SoR audience eligibility, consent, enroll/dispatch audit, suppression.
3. **Magnix** = sequence copy, schedule (n8n), provider send, ghi kết quả về House X.
4. **Transactional email** và **marketing email** tách purpose — không suy opt-in marketing từ OTP / listing mail / `UserAccount.marketingOptIn` đơn lẻ.
5. ESP bên ngoài (Brevo, …) chỉ là **delivery adapter** tùy chọn sau khi list đủ lớn; audience vẫn sync từ Postgres, không ngược lại.

### Nguyên tắc cứng

1. **Opt-in rõ purpose + channel**
   - Gửi marketing chỉ khi hiệu lực: `ConsentRecord` với `purpose` marketing (hoặc purpose cụ thể đã policy) **và** `channel = email`, action `GRANTED`, chưa `WITHDRAWN` / `DENIED` / `EXPIRED` / `SUPERSEDED`.
   - Form lead magnet / tool / waitlist phải có checkbox (hoặc CTA) riêng: nhận bản tin / chuỗi email — không gộp ngầm với «đồng ý điều khoản».
   - `consent_basis` trên UID Magnix / acquisition metadata = provenance only (ADR-015) — **không** cấp quyền email marketing.

2. **Tách transactional vs marketing**
   | Loại | Ví dụ | Consent marketing? |
   |------|--------|-------------------|
   | Transactional | OTP, reset MK, báo cáo tin đăng, invite ops | Không cần; không ghi là marketing grant |
   | Marketing nurture | Welcome drip, newsletter, re-engage | Bắt buộc `ConsentRecord` email |
   | Service notice (policy) | Thông báo pháp lý bắt buộc (nếu có) | Theo policy riêng; không dùng template nurture |

3. **Reuse SC-6 — mở rộng channel, không song song lifecycle**
   - Thêm `email` vào `NurtureScriptChannel` / catalog script.
   - Enroll / dispatch / idempotency / withdrawal suppression giống OA/SMS.
   - Kiểm tra consent **lúc schedule và ngay trước send**.

4. **Value-first + quy tắc 1-1-1**
   - Mỗi email: **1 cohort · 1 vấn đề · 1 CTA chính**.
   - CTA ưu tiên: Zalo OA / Mini App tool / «Tôi muốn tư vấn» — khớp phễu Magnix (email nuôi → kênh realtime chốt tương tác).
   - Cấm hard-sell / framing mất mát giả trên cohort waitlist (ADR-016).

5. **Waitlist (ADR-016): email là kênh phụ**
   - Mặc định waitlist vẫn **in-app**.
   - Email digest / progress chỉ khi `channelPreference` hoặc ConsentRecord email được grant cho purpose waitlist/marketing.
   - Launch notify: in-app trước; email optional cùng cohort nếu consent email còn hiệu lực.
   - Không đưa waitlist vào SLA telesales HOT chỉ vì mở email.

6. **List hygiene & deliverability bắt buộc trước blast**
   - Domain gửi: SPF + DKIM + DMARC (ưu tiên subdomain marketing, vd. `m.` / `mail.`).
   - One-click unsubscribe + ghi `WITHDRAWN` trên `ConsentRecord` + suppress enroll.
   - Bounce/complaint webhook → suppression (hard bounce = suppress ngay).
   - Không mua list; không import email từ UID scrape thiếu consent.

7. **Postgres SoR (ADR-013)**
   - Audience / segment / campaign enrollment state sống ở House X Postgres.
   - Google Sheet chỉ editorial draft sequence (như `content_drafts`) — không SoR list.
   - Drive JSONL archive best-effort cho event gửi (không PII đầy đủ trong log thường).

## Ownership

| Concern | Owner | Authoritative store |
|---------|-------|---------------------|
| Identity email (`Customer.email` / `UserAccount.email`) | House X | Postgres |
| Consent grant/withdraw purpose+channel=email | House X | `ConsentRecord` |
| Eligibility API (ai được gửi bước N) | House X | Postgres + consent ledger |
| `NurtureEnrollment` / `NurtureDispatch` audit | House X | Postgres |
| Sequence copy (subject, preheader, body, CTA) | Magnix | Editorial / Agent 8; L0–L3 |
| Schedule + provider API send | Magnix / n8n | Provider; result → House X |
| Lead magnet asset (PDF/MD) gắn E1 | Magnix Agent 3 | Content pipeline |
| KPI (open/CTR/unsub/OA convert) | House X ops + Magnix metrics | Postgres + provider events |
| Transactional mailer | House X | `lib/email/*` (giữ nguyên) |

## Domain vocabulary (canonical)

| Term | Semantics |
|------|-----------|
| `EmailNurtureChannel` | Channel SC-6 `email` — marketing/nurture only. |
| `MarketingEmailConsent` | Hiệu lực suy từ `ConsentRecord` (subject + purpose + `channel=email`). |
| `EmailSequence` | Chuỗi có `sequence_id`, các `EmailSequenceStep` có `step_index`, delay, template. |
| `EmailSequenceStep` | Một bước: subject, preheader, body, `cta_label`, `cta_url_key`, optional `ab_variant`, `legal_disclaimer`. |
| `EmailCohort` | Tập đủ điều kiện: consent + segment/source/tool result + chưa suppress. Ví dụ: `noxh_tool_pass`, `noxh_tool_fail`, `waitlist_digest`, `cctm_utility`, `inactive_90d`. |
| `EmailSuppression` | Cấm gửi: withdraw, hard bounce, complaint, manual ops block. Enforce trước send. |
| `DeliveryAdapter` | Resend / n8n webhook / (phase sau) Brevo — chỉ transport; không SoR audience. |
| `TransactionalEmail` | Ngoài phạm vi nurture; `type=transactional.email` trên webhook hiện tại. |
| `MarketingEmailPayload` | Payload gửi khác transactional: `type=marketing.email`, kèm `enrollment_id`, `dispatch_id`, `sequence_id`, `step_index`, `unsubscribe_url`. |

`Lead` / `Customer` / `InterestCapture` không đổi vai trò ADR-015/016; email chỉ thêm đường nurture.

## Lifecycle

```
CAPTURE (form / tool / waitlist + checkbox email)
  → CONSENT_GRANT (ConsentRecord purpose + channel=email)
  → ENROLL (NurtureEnrollment script/sequence + cohortKey)
  → SCHEDULE (Magnix/n8n: delay theo step)
  → ELIGIBILITY_CHECK (House X: consent + suppress + segment)
  → DISPATCH (send via DeliveryAdapter)
  → DISPATCH_AUDIT (NurtureDispatch SENT|FAILED|SKIPPED)
  → ENGAGE (open/click → optional OA follow / tool / consult_request)
  → (withdraw | hard_bounce | complete) → SUPPRESS / COMPLETED
```

- `CAPTURE` không đồng nghĩa quyền gửi nếu thiếu consent email.
- `SKIPPED` khi withdraw giữa schedule và send (fail-closed).
- Re-engage inactive: tối đa **1** email xác nhận; không confirm → suppress.

## Welcome MVP (NOXH tool cohort) — contract nội dung

Chuỗi mặc định Phase 1 (có thể chỉnh copy; không đổi semantics):

| Step | Delay | Mục đích | CTA duy nhất (gợi ý) |
|------|-------|----------|----------------------|
| E1 | 0 | Gửi lead magnet / kết quả tool + cảm ơn | Quan tâm Zalo OA |
| E2 | +1 ngày | 3 lỗi hồ sơ NOXH phổ biến | Mở lại `/cong-cu` kiểm tra điều kiện |
| E3 | +3 ngày | 3–5 dự án đang/sắp nhận hồ sơ (**chỉ SoR / đã L3**) | Tư vấn 1:1 hoặc OA |

Newsletter tuần / waitlist digest = Phase 2+; cadence thưa hơn Welcome.

## Agents & automation

| Component | Vai trò |
|-----------|---------|
| **Agent 3** (hiện có) | Lead magnet asset cho E1 |
| **Agent 8 — Email Sequence** (mới, Magnix n8n) | Sinh `EmailSequenceStep` JSON; parse layer bắt buộc |
| **magnix-inbound-copywriter** | Format `email_nurture` / `email_newsletter` (Cursor) |
| **magnix-growth-architect** | Contract n8n ↔ House X eligibility / webhook |
| **Hygiene cron** | Bounce/complaint sync, inactive suppress — **không LLM** |
| **QA** | L0 schema · L1 facts · L2 `/devil` NOXH/vay · L3 trước gửi sequence mới / newsletter đầu |

### Agent 8 output contract (tối thiểu)

```text
sequence_id, step_index, segment, cohort_key,
subject, preheader, body_md,
cta_label, cta_url_key,
legal_disclaimer, ab_variant?, qa_tier
```

Không nhúng PII mẫu thật trong draft; không hardcode secret.

## API / integration contracts (semantics)

Route cụ thể có thể evolve; semantics bắt buộc:

| Operation | Contract |
|-----------|----------|
| Capture + consent | Form/tool ghi Lead/Customer + append `ConsentRecord` email khi opt-in |
| Eligibility | House X: input `lead_id` / `customer_id` + `purpose` + `sequence_id`/`step_index` → allow/deny + reason |
| Enroll | Idempotent `NurtureEnrollment` (`channel=email`, `scriptId` hoặc sequence ref) |
| Dispatch result | Magnix/n8n → House X: `SENT` / `FAILED` / `SKIPPED` + provider message id |
| Unsubscribe | Public token → `WITHDRAWN` + cancel pending enroll steps |
| Provider events | Bounce/complaint → suppression writeback (idempotent) |

Payload marketing qua webhook phải khác transactional (`type=marketing.email`) để không lẫn template OTP.

## Ranh giới với hệ hiện có

| Hiện có | Vai trò với ADR-017 |
|---------|---------------------|
| `lib/email/send.ts` | Mở rộng hoặc wrapper marketing path; giữ transactional nguyên |
| SC-6 catalog (`nurture-scripts.ts`) | Thêm scripts `channel: "email"` |
| ADR-016 waitlist | Email phụ; in-app vẫn mặc định |
| Agent 4 outreach | Zalo/DM — **không** auto-map sang blast email UID |
| `InboundUidLead` | Chỉ email nurture sau promote + identity + ConsentRecord |
| `UserAccount.marketingOptIn` | Cờ thô — **không** đủ thay `ConsentRecord`; có thể mirror UI sau |
| Early Signal / L3 | Không auto-email tin sớm chưa duyệt |
| Sheet `outreach_queue` | Không SoR list email |

## Non-goals (phase kiến trúc / P0–P1)

- Không mua danh sách email / scrape UID thành marketing list.
- Không biến Brevo/Mailchimp thành SoR audience.
- Không auto-blast toàn bộ `Customer.email` có trong DB.
- Không dùng transactional open/click làm bằng chứng marketing consent.
- Không thay Zalo OA / Mini App bằng email cho thông báo mở bán gấp (ZNS/in-app ưu tiên khi consent).
- Không build ESP UI đầy đủ trong House X ở P0 (ưu tiên enroll + template + smoke).
- Không LLM-QA mọi lần gửi — chỉ khi tạo/sửa sequence (QA phân tầng).

## Phased delivery

| Phase | Deliverable | Gate |
|-------|-------------|------|
| **P0** | Domain auth (SPF/DKIM/DMARC) · form/tool checkbox → `ConsentRecord` email · one-click unsubscribe + suppress · thêm `email` vào channel type + 1–2 script catalog | Deliverability + consent path — **REPO scaffold 2026-07-21** (ops còn verify DMARC trên domain) |
| **P1** | Dispatcher marketing (webhook/Resend) · Welcome E1–E3 cohort NOXH tool · eligibility check trước send · smoke enroll→SENT→withdraw · Agent 8 draft + L3 | **REPO scaffold 2026-07-21** — `EMAIL_NURTURE_SEND_ENABLED` + `go-live:smoke-email-nurture`; n8n Wait E2/E3 + Agent 8 workflow JSON = tiếp |
| **P2** | Newsletter tuần (opt-in) · waitlist email phụ (ADR-016) · A/B subject 10–20% · bounce/complaint webhook · KPI trên ops (open/CTR/unsub/OA) | **REPO scaffold 2026-07-21** — migrate engagement · cron weekly · `go-live:smoke-email-nurture-p2` · `go-live:kpi-email-nurture` |
| **P3** | Optional external ESP adapter (Brevo…) sync **từ** House X · inactive re-engage 1-shot · segment CCTM utility | **REPO scaffold 2026-07-21** — `EMAIL_ESP_ADAPTER` · hygiene cron · `go-live:smoke-email-nurture-p3` |

## KPI (vận hành)

| Chỉ số | Mục tiêu Phase 1 (NOXH nhu cầu thực) | Ghi chú |
|--------|--------------------------------------|---------|
| Open rate Welcome | > 30% | Subject / từ danh |
| CTR (CTA chính) | > 4% | 1 CTA dễ đo |
| Email → OA / consult | 25–40% | Thấp hơn claim “50%” nếu Ads lạnh |
| Unsubscribe / gửi | < 0.8% | Cadence quá dày → tăng |
| Hard bounce | < 2% list mới | Hygiene ngay |
| CPL (email+SĐT) | Theo ngân sách Ads | Lead magnet chất → CPL↓ |

Tách funnel: Email nurture vs Waitlist in-app vs Hot telesales (không gộp KPI).

## Acceptance (architecture)

- [x] Email marketing định nghĩa là channel SC-6, không ESP SoR riêng.
- [x] Ownership House X (consent/eligibility/audit) vs Magnix (copy/schedule/send) rõ.
- [x] Tách transactional vs marketing; cấm suy consent từ OTP/listing/`consent_basis`.
- [x] ADR-016: email phụ; in-app mặc định waitlist.
- [x] Vocabulary: Sequence / Cohort / Suppression / DeliveryAdapter.
- [x] Lifecycle enroll → eligibility → dispatch → withdraw fail-closed.
- [x] Agent 8 + reuse Agent 3; QA L0–L3.
- [x] Phased P0–P3 và non-goals ghi nhận.
- [x] **P0 product scaffold (2026-07-21):** `NurtureScriptChannel` + catalog email ·
  `grantMarketingEmailConsent` trên tool NOXH · `/huy-dang-ky-email` +
  `/api/consent/email-unsubscribe` · GO_LIVE Bước 9 DMARC · tests
  `tests/email-nurture-p0.test.ts`. Ops còn xác nhận SPF/DKIM/DMARC trên DNS.
- [x] **P1 product scaffold (2026-07-21):** `sendMarketingEmail` · Welcome E1–E3 stub ·
  `dispatchNoxhWelcomeEmailStep` · auto enroll/E1 sau tool ·
  `go-live:smoke-email-nurture` · Agent 8 prompt + registry stub ·
  `tests/email-nurture-p1.test.ts`. PRODUCTION-PROVEN = chạy smoke trên VPS với
  kill switch + provider thật.
- [x] **P2 product scaffold (2026-07-21):** weekly newsletter + waitlist digest ·
  A/B subject · `EmailEngagementEvent` · `/api/webhooks/email-provider` bounce
  suppress · cron `email-nurture-weekly` · KPI script · waitlist form email
  opt-in · `tests/email-nurture-p2.test.ts`. Open/CTR thật cần Resend webhook.
- [x] **P3 product scaffold (2026-07-21):** ESP adapter (`dry_run`/`brevo`) sync
  outbound · inactive re-engage 1-shot + suppress sau grace · CCTM utility
  cohort · cron `email-nurture-hygiene` · `go-live:smoke-email-nurture-p3` ·
  `tests/email-nurture-p3.test.ts`.

## Consequences

**Positive:** Bổ sung kênh nuôi dưỡng đo được cho lead magnet / tool mà không phá SoR Postgres hay lane waitlist; tái dụng SC-6 đã proven (SMS); Zalo vẫn là kênh realtime; có đường rõ cho Agent copy email.

**Trade-off:** Cần discipline deliverability (domain auth, hygiene) trước khi scale; thêm surface unsubscribe/bounce; Ops phải tách KPI email khỏi hot call; Agent 8 + L3 tăng tải biên tập lúc dựng sequence đầu.

**Rollback product:** tắt enroll `channel=email` / kill switch n8n marketing send; transactional email và SC-6 OA/SMS không đổi; ConsentRecord lịch sử giữ nguyên (append-only).

## References

- `.cursor/ADR-013-postgres-primary-storage.md`
- `.cursor/ADR-014-zalo-miniapp.md`
- `.cursor/ADR-015-sales-conversion-operating-layer.md`
- `.cursor/ADR-016-interest-waitlist-nurture-lane.md`
- `ARCHITECTURE_MAGNIX.md` §2–3 (destinations + conversion layer)
- `Proptech-HouseX/docs/SALES_CONVERSION_BACKLOG.md` § SC-6
- `Proptech-HouseX/lib/email/send.ts`
- `Proptech-HouseX/lib/leads/nurture-scripts.ts`
- `n8n-workflows/MAGNIX_AGENTS_REGISTRY.md`
