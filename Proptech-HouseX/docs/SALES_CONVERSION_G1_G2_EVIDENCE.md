# Sales Conversion G1/G2 evidence

Repository/local verification is supplemented by the production deployment record
below. Workflow-specific status remains **STAGING** unless that workflow has its own
runtime execution evidence; deployment/activation alone is not a functional smoke.

## Local artifacts

- G1 migration: `20260717190000_sales_core_g1_foundation`
- G2 SC-2 migration: `20260717200000_buyer_match_g2_slice`
- G2 Journey P SC-4/SC-5 migration: `20260718100000_sales_conversion_g2_journey_p`
- G2 SC-6 nurture migration: `20260718120000_sales_conversion_sc6_nurture`
- Protected command surface: `/api/admin/conversion/*`, including `matches`,
  `proposals`, `outcomes`, `funnel`
- Feature flag (default **off**): `HOUSEX_CONVERSION_G2_JOURNEY_P=true` enables
  proposal/outcome/funnel APIs and requires a fresh `proposalId` on Journey P
  ACTIVE→COMMITTED. When off, legacy UnitBooking-only commit path remains.
- Deterministic contract tests:
  `tests/sales-conversion-g2-contract.test.ts`,
  `tests/sales-conversion-g2-journey-p.test.ts`
- BuyerMatch is an explainable recommendation snapshot only. It cannot reserve
  inventory, assert legal eligibility, or mutate an opportunity.
- Missing inventory snapshot is recorded as
  `INVENTORY_FRESHNESS_UNKNOWN`; `inventoryCheckedAt` remains null.

### Journey P E2E contract (SC-4 + SC-5, repo)

1. QUALIFIED lead → assignment/profile → BuyerMatch (optional)
2. `POST /proposals` — immutable inventory snapshot
3. Journey-native UnitBooking confirm / convert-to-deposit
4. ACTIVE→COMMITTED with `commitEvidence` + `proposalId` (flag on); freshness enforced
5. `POST /outcomes` WON/LOST with reason + commercial ref; value reconciles to unit price
6. Outbox: `opportunity.stage_changed` + `conversion.won`/`conversion.lost` (minimized)

A/S COMMITTED remains fail-closed. Runtime/production evidence for this slice:
**PASS** — see **Production Journey P smoke — 2026-07-18** below.

### Production Journey P smoke — checklist (Phase 1)

Run on House X VPS after pull of G2 commit:

```bash
cd /opt/housex && git pull --ff-only
cd /opt/housex/Proptech-HouseX
# Ensure .env has HOUSEX_CONVERSION_G2_JOURNEY_P=true (keep on after pass)
grep '^HOUSEX_CONVERSION_G2_JOURNEY_P=' .env
npm run build && pm2 restart housex
HOUSEX_CONVERSION_G2_JOURNEY_P=true npm run go-live:smoke-journey-p
```

Record in the dated production block below: commit SHA, flag state, report JSON path
under `reports/journey-p-smoke-*.json` (IDs only), confirmer, rollback owner
(`HOUSEX_CONVERSION_G2_JOURNEY_P=false` + PM2 restart).

Script: `scripts/smoke-journey-p-conversion.ts` · npm `go-live:smoke-journey-p`.

### Production Journey P smoke — 2026-07-18

- Result: **PASS**
- Observed at: `2026-07-18T04:09:21Z` (VPS)
- Deployed commits (lineage): `811e581` (ops UI + SC-6) + `0a6020c` (build/smoke unblock)
- Flag: `HOUSEX_CONVERSION_G2_JOURNEY_P=true` (leave **on**)
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/journey-p-smoke-2026-07-18T04-09-21-180Z.json`
- Fixture note: seeded disposable unit `SMK-JP-MRPUL48S` on project
  `dta-happy-home-nhon-trach` (soft-deleted after smoke)
- Masked IDs only (no phone/email):

| Field | Value |
| --- | --- |
| `correlationId` | `smoke-jp-1784347761181` |
| `leadId` | `004e7d7f-548a-4a59-a285-584409e9f1b4` |
| `opportunityId` | `4997c52f-7bc4-48de-bda2-434d2fdf3391` |
| `proposalId` | `fc1767c1-9b72-4382-83cc-8d278b89c1fe` |
| `bookingId` | `60f55881-970e-4a8b-b3c0-68ff51667054` |
| `outcomeId` | `6e64ba54-6c95-4bb8-b513-cca7a4ab76ea` |
| `projectId` | `5916cc24-bbbd-4217-9721-1cbfeb1e8c47` |
| `unitId` | `66821699-7773-4ae0-be5f-63467f79b289` |
| `opportunityStage` | `COMMITTED` |
| `outcomeResult` | `LOST` |

- Outbox types observed: `opportunity.stage_changed`, `conversion.lost`
- Rollback owner: set `HOUSEX_CONVERSION_G2_JOURNEY_P=false` then `pm2 restart housex`
- SC-4 / SC-5 `runtime_evidence`: **PRODUCTION-PROVEN** (Journey P only; A/S still fail-closed)

## Local verification commands

Run from `Proptech-HouseX` unless noted:

```text
npx prisma format
npx prisma validate
node --import tsx --test tests/sales-core.test.ts tests/sales-conversion-g2-contract.test.ts tests/sales-conversion-g2-journey-p.test.ts
npx eslint "app/api/admin/conversion/**/*.ts" "lib/sales-core/**/*.ts" "lib/validation/sales-core.ts" "lib/events/outbox.ts" "lib/events/types.ts" "tests/sales-core.test.ts" "tests/sales-conversion-g2-contract.test.ts" "tests/sales-conversion-g2-journey-p.test.ts"
git diff --check
```

The local acceptance record is truthful only when these commands pass in the
current working tree. Full-project TypeScript output may still contain unrelated,
pre-existing test errors; sales-conversion paths must be inspected separately and
must contain zero errors.

Local result on 2026-07-17:

- Prisma format: **PASS**
- Prisma validate: **PASS**
- Prisma client type generation (`--no-engine`): **PASS**
- Focused G1/G2 tests: **PASS — 11/11**
- Changed-file ESLint: **PASS**
- Full TypeScript output filtered for G1/G2 sales-conversion paths: **PASS — 0 errors**
- Git diff check: **PASS** (line-ending warnings only)

## Production deployment — 2026-07-17

- Git commit deployed: `065325c` (`966315b` architecture implementation plus ingest
  smoke correction).
- House X production DB connection check: **PASS**.
- Production migrations applied: `20260717180000`,
  `20260717190000`, `20260717200000`, `20260717210000`.
- House X build + PM2 restart: **PASS**.
- Site smoke: **PASS** on `http://127.0.0.1:3000` and
  `https://timnhaxahoi.com`.
- Production UID ingest smoke: **PASS** —
  `smoke_test:1784300292816`.
- n8n API deployment: **PASS** — 17 existing workflows updated, zero create/fail;
  deployed workflows remained active.
- Production VPS backup: **PASS** —
  `/root/backup/housex/housex-2026-07-17_215605.sql.gz`, gzip/header/checksum valid.
- Disposable restore drill: **PASS** — target
  `housex_restore_verify_20260717`, required tables/keys present, cleanup verified
  with `database_dropped=true`.
- Evidence file on VPS:
  `Proptech-HouseX/reports/restore-verify-20260717.json`.

## External gates — remaining

- **NOT PASSED — off-VPS recovery:** backup upload/download/checksum from an
  independent destination has not been demonstrated; the verified restore source
  above remained on the production VPS. Repository automation now includes
  fail-closed rclone crypt upload, independent download verification, sanitized
  deduplicated failure alerting and hermetic tests. Hardening additionally requires
  a Drive-backed crypt target, root-owned installed executables, exact trusted
  checksum matching and per-object remote verification before every local prune.
  This is implementation
  evidence only: OAuth setup, production cron installation, one real crypt-remote
  round trip and a quarterly DR restore remain manual/external gates. Exact
  runbook: `docs/OPS_BACKUP_MIRROR.md`.
- **NOT PASSED — workflow-by-workflow smoke:** n8n deployment and active state are
  proven, but each content/Telegram workflow still needs a masked execution ID and
  sink assertion before its registry row moves from staging.
- **NOT PASSED — Telegram delivery:** no real `legal_source_needed` delivery and
  resolver cycle was observed in this deployment session.
- **PASSED — full sales journey E2E (Round 2 Wave 1, 2026-07-18):** see production
  block below; SC-0…3 `runtime_evidence` = `PRODUCTION-PROVEN` for
  assign→qualify→appointment path. Journey P proposal/deposit remains separate
  SC-4/5 proof.
- **PASSED — Journey P SC-4/SC-5 smoke (2026-07-18):** see production block above;
  SC-4/SC-5 `runtime_evidence` = `PRODUCTION-PROVEN` (Journey P). A/S COMMITTED
  remains fail-closed.
- **PASSED — SC-6 nurture dry-run (2026-07-18):** see production block below;
  SC-6 `runtime_evidence` = `PRODUCTION-PROVEN` (consent gate + enroll/dispatch/cancel;
  no real channel send).
- **PASSED — SC-6 real channel (Round 2 Wave 3, 2026-07-18):** see production
  block below — consent → SMS smoke-sink SENT → withdraw blocks enroll;
  kill switch + sink disabled after PASS.

### Production SC-6 nurture smoke — checklist

```bash
cd /opt/housex && git pull --ff-only
cd /opt/housex/Proptech-HouseX
npx prisma migrate deploy
npm run build && pm2 restart housex
npm run go-live:smoke-sc6
```

Script: `scripts/smoke-sc6-nurture.ts` · npm `go-live:smoke-sc6`.
Dry-run only (no real Zalo/OA/Telegram send).
Rollback: Stop nurture on `/admin/conversion` (cancel enrollment) — audit retained.

### Production SC-6 nurture smoke — 2026-07-18

- Result: **PASS**
- Observed at: `2026-07-18T04:22:24Z` (VPS)
- Deployed commit: `24c305c`
- Migration: `20260718120000_sales_conversion_sc6_nurture`
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/sc6-nurture-smoke-2026-07-18T04-22-24-597Z.json`
- Checks observed: blocked without consent → eligible after grant → enroll
  idempotent → dispatch SENT → cancel suppress → withdraw blocks enroll
- Masked IDs only (no phone/email):

| Field | Value |
| --- | --- |
| `correlationId` | `smoke-sc6-1784348544598` |
| `leadId` | `9427fcf9-8399-4711-ad21-dc1c5df7b66f` |
| `leadIdWithdraw` | `f4b5f00f-f7bf-4cf3-afaf-5b54ef9322ec` |
| `enrollmentId` | `30b12202-7242-4578-aae2-98596b92ed67` |
| `dispatchId` | `5a02cf8f-a9c1-4798-901a-3f135635c521` |
| `cancelledEnrollmentId` | `a0f7dbd6-f05c-4a7d-922e-1e26aca5ff33` |

- SC-6 `runtime_evidence`: **PRODUCTION-PROVEN** (dry-run; channel delivery still
  Magnix/n8n responsibility)

### Production Sales Ops E2E smoke — checklist (Round 2 Wave 1)

```bash
cd /opt/housex && git pull --ff-only
cd /opt/housex/Proptech-HouseX
npm run build && pm2 restart housex   # if pull changed app code
npm run go-live:smoke-sales-ops
```

Script: `scripts/smoke-sales-ops-e2e.ts` · npm `go-live:smoke-sales-ops`.
Path covered: consent → assign → accept → first_attempt/connected → qualify →
BuyerProfile → appointment SCHEDULED→COMPLETED. Soft-marks lead LOST after.
Rollback: none required (additive audit retained; disposable broker cleaned if seeded).

### Production Sales Ops E2E smoke — 2026-07-18

- Result: **PASS**
- Observed at: `2026-07-18T17:11:03Z` (VPS)
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/sales-ops-e2e-2026-07-18T17-11-03-711Z.json`
- Path proven: consent → assign/accept → activity → QUALIFIED → BuyerProfile →
  appointment SCHEDULED→COMPLETED → lead LOST
- Masked IDs (from stdout; full set in report JSON):

| Field | Value |
| --- | --- |
| `correlationId` | `smoke-ops-1784394663714` |
| `appointmentStatus` | `COMPLETED` |
| `leadStatusFinal` | `LOST` |

- Note: first run logged a disposable-broker cleanup FK warning (`brokers_user_account_id_fkey`);
  smoke still **PASS**. Cleanup order fixed in follow-up commit.
- SC-0 / SC-1 / SC-2 / SC-3 `runtime_evidence`: **PRODUCTION-PROVEN** (this path)
- Gate **full sales journey E2E**: **PASSED**

### Production Ops cohort KPI — Round 2 Wave 2 baseline (2026-07-18)

- Result: **OK** (aggregate window; not a substitute for 5-day human Ops adoption)
- Observed at: `2026-07-18T17:11:15Z` (VPS)
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/sales-ops-cohort-kpi-2026-07-18T17-11-15-735Z.json`
- Window: 5 days

| Metric | Value |
| --- | --- |
| `leadsCreated` | 11 |
| `assignmentsCreated` | 1 |
| `assignmentsAccepted` | 1 |
| `acceptRatePct` | 100 |
| `leadsWithActivity` | 3 |
| `activityCoverageVsLeadsPct` | 27.3 |
| `leadsWithAppointment` | 1 |
| `appointmentCoverageVsLeadsPct` | 9.1 |
| `qualifiedOrTerminal` | 2 |
| `qualifiedWithAppointment` | 1 |
| `appointmentAfterQualifyPct` | 50 |

- Cohort playbook: `OPS_PLAYBOOK.md` §4b-3 (start 2026-07-18). Re-run KPI daily during cohort.

### Production Ops cohort KPI — mid-window (2026-07-21)

- Result: **OK**
- Observed at: `2026-07-21T01:43:29Z` (VPS) / local wall `2026-07-21 08:43 +07`
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/sales-ops-cohort-kpi-2026-07-21T01-43-29-051Z.json`
- Window: 5 days (rolling)

| Metric | 2026-07-18 | 2026-07-21 | Δ |
| --- | --- | --- | --- |
| `leadsCreated` | 11 | 12 | +1 |
| `assignmentsCreated` | 1 | 1 | 0 |
| `assignmentsAccepted` | 1 | 1 | 0 |
| `acceptRatePct` | 100 | 100 | 0 |
| `leadsWithActivity` | 3 | 4 | +1 |
| `activityCoverageVsLeadsPct` | 27.3 | 33.3 | +6.0 |
| `leadsWithAppointment` | 1 | 1 | 0 |
| `appointmentCoverageVsLeadsPct` | 9.1 | 8.3 | −0.8 |
| `qualifiedOrTerminal` | 2 | 3 | +1 |
| `qualifiedWithAppointment` | 1 | 1 | 0 |
| `appointmentAfterQualifyPct` | 50 | 33.3 | −16.7 |

- Đọc nhanh: activity coverage tăng; assignment vẫn = 1 (chưa thấy Ops claim/assign thêm
  trên cửa sổ 5 ngày). `appointmentAfterQualifyPct` giảm vì có thêm qualified/terminal
  chưa gắn appointment — ưu tiên checklist bước 4 trên lead QUALIFIED mới.

### Production SC-6 real-channel smoke — checklist (Round 2 Wave 3)

```bash
cd /opt/housex/Proptech-HouseX
# Option A — n8n SMS webhook (carrier path):
#   SMS_WEBHOOK_URL=https://<n8n>/webhook/telesales-sms

# Option B — local smoke sink (HTTP provider path, no carrier):
#   In .env (then build + pm2 restart housex):
#     SMOKE_SMS_SINK_ENABLED=true
#     SMS_WEBHOOK_URL=http://127.0.0.1:3000/api/admin/smoke/sms-webhook-sink
#   TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 \
#     SMOKE_NURTURE_CHANNEL=sms npm run go-live:smoke-nurture-real
#   Then set SMOKE_SMS_SINK_ENABLED=false, SMS_WEBHOOK_URL="", 
#   TELESALES_SERVER_SEND_ENABLED=false and pm2 restart

TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 \
  SMOKE_NURTURE_CHANNEL=sms npm run go-live:smoke-nurture-real
# Or OA path (requires OA notify + follower):
# TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 \
#   SMOKE_NURTURE_CHANNEL=oa SMOKE_ZALO_USER_ID=<id> npm run go-live:smoke-nurture-real
```

### Production SC-6 real-channel smoke — 2026-07-18

- Result: **PASS**
- Observed at: `2026-07-18T17:21:14Z` (VPS)
- Channel: `sms` via local smoke sink
  (`/api/admin/smoke/sms-webhook-sink`) — HTTP provider path; not carrier SMS
- Evidence file (VPS):
  `/opt/housex/Proptech-HouseX/reports/nurture-real-channel-smoke-2026-07-18T17-21-14-313Z.json`
- Checks: consent GRANTED → dispatch SENT → withdraw blocks enroll
- Post-run: `disable-smoke-sms-sink.sh` + `pm2 restart housex` (sink +
  `TELESALES_SERVER_SEND_ENABLED` off)
- Masked IDs only:

| Field | Value |
| --- | --- |
| `correlationId` | `smoke-nurture-real-1784395274313` |
| `leadId` | `55effa6e-ac06-4937-a6aa-d2cb62181da7` |
| `enrollmentId` | `2ff6807c-7725-4a1a-985d-6a1331ffbeeb` |
| `dispatchId` | `f757f9a8-8f72-491a-bf33-eee091d507f5` |
| `dispatchStatus` | `SENT` |

- SC-6 real-channel `runtime_evidence`: **PRODUCTION-PROVEN** (smoke sink;
  carrier/n8n SMS still optional when Ops configures real `SMS_WEBHOOK_URL`)

### Production SC-6 real-channel smoke — earlier attempt (superseded)

- Result: **FAIL / BLOCKED** (pre-sink) — `SMS_WEBHOOK_URL` unset; superseded by PASS above.

### Ops cohort KPI (Round 2 Wave 2)

```bash
COHORT_DAYS=5 npm run go-live:kpi-sales-ops-cohort
```

Writes `reports/sales-ops-cohort-kpi-*.json` (aggregate counts/rates only).

This record proves the deployed foundation and UID ingest path. It does not promote
unexecuted content, Telegram, or A/S COMMITTED beyond fail-closed.
