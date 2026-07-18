# Sales Conversion G1/G2 evidence

Repository/local verification is supplemented by the production deployment record
below. Workflow-specific status remains **STAGING** unless that workflow has its own
runtime execution evidence; deployment/activation alone is not a functional smoke.

## Local artifacts

- G1 migration: `20260717190000_sales_core_g1_foundation`
- G2 SC-2 migration: `20260717200000_buyer_match_g2_slice`
- G2 Journey P SC-4/SC-5 migration: `20260718100000_sales_conversion_g2_journey_p`
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
see **Production Journey P smoke — checklist** below (fill after VPS run).

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
- **NOT PASSED — full sales journey E2E:** production UID ingest is proven, but the
  complete assignment → qualification → appointment path still needs a controlled
  production/staging fixture and DB assertions.
- **AWAITING — Journey P SC-4/SC-5 smoke:** run
  `HOUSEX_CONVERSION_G2_JOURNEY_P=true npm run go-live:smoke-journey-p` on VPS,
  attach `reports/journey-p-smoke-*.json` (IDs only), then flip SC-4/SC-5
  `runtime_evidence` to `PRODUCTION-PROVEN`.
- **SC-6 REPO-DONE:** `NurtureEnrollment` / dispatch APIs + consent gate on
  `tryEnqueueLeadNurture`; UI panel on `/admin/conversion`. Runtime dry-run pending.

This record proves the deployed foundation and UID ingest path. It does not promote
unexecuted content, Telegram, or full sales-journey workflows beyond **STAGING**.
