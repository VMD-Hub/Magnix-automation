# Sales Conversion G1/G2 evidence

Repository/local verification is supplemented by the production deployment record
below. Workflow-specific status remains **STAGING** unless that workflow has its own
runtime execution evidence; deployment/activation alone is not a functional smoke.

## Local artifacts

- G1 migration: `20260717190000_sales_core_g1_foundation`
- G2 SC-2 migration: `20260717200000_buyer_match_g2_slice`
- Protected command surface: `/api/admin/conversion/*`, including `matches`
- Deterministic contract test:
  `tests/sales-conversion-g2-contract.test.ts`
- BuyerMatch is an explainable recommendation snapshot only. It cannot reserve
  inventory, assert legal eligibility, or mutate an opportunity.
- Missing inventory snapshot is recorded as
  `INVENTORY_FRESHNESS_UNKNOWN`; `inventoryCheckedAt` remains null.

## Local verification commands

Run from `Proptech-HouseX` unless noted:

```text
npx prisma format
npx prisma validate
node --import tsx --test tests/sales-core.test.ts tests/sales-conversion-g2-contract.test.ts
npx eslint "app/api/admin/conversion/**/*.ts" "lib/sales-core/**/*.ts" "lib/validation/sales-core.ts" "lib/events/outbox.ts" "lib/events/types.ts" "tests/sales-core.test.ts" "tests/sales-conversion-g2-contract.test.ts"
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
  above remained on the production VPS.
- **NOT PASSED — workflow-by-workflow smoke:** n8n deployment and active state are
  proven, but each content/Telegram workflow still needs a masked execution ID and
  sink assertion before its registry row moves from staging.
- **NOT PASSED — Telegram delivery:** no real `legal_source_needed` delivery and
  resolver cycle was observed in this deployment session.
- **NOT PASSED — full sales journey E2E:** production UID ingest is proven, but the
  complete assignment → qualification → appointment path still needs a controlled
  production/staging fixture and DB assertions.

This record proves the deployed foundation and UID ingest path. It does not promote
unexecuted content, Telegram, or full sales-journey workflows beyond **STAGING**.
