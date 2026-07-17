# Sales Conversion local G1/G2 evidence

Evidence scope: repository/local verification only. Runtime registry status remains
**STAGING**. Nothing in this file proves a VPS, n8n, Telegram, backup, staging
database, or production deployment.

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

## External gates — NOT passed

- **NOT PASSED — production migration:** neither G1 nor G2 migration was applied
  to production by this work.
- **NOT PASSED — n8n import/activation:** no workflow was imported, changed, or
  activated.
- **NOT PASSED — real backup restore:** no off-VPS backup or clean-room restore was
  executed.
- **NOT PASSED — Telegram delivery:** no real notification delivery was attempted
  or observed.
- **NOT PASSED — production/staging E2E:** the test is synthetic and deterministic;
  it is not runtime evidence.

Local G1/G2 contract acceptance does not promote the deployment registry beyond
**STAGING** and does not satisfy the ADR-015 production gate.
