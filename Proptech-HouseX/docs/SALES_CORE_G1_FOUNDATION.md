# ADR-015 local G1 sales-core foundation

This repository slice is additive source code only. The migration
`20260717190000_sales_core_g1_foundation` has not been applied to staging or
production by this work.

House X Postgres remains authoritative. The protected admin command routes are:

- `GET|POST /api/admin/conversion/consents`
- `POST /api/admin/conversion/assignments`
- `PUT /api/admin/conversion/profiles`
- `POST /api/admin/conversion/opportunities`
- `POST /api/admin/conversion/activities`
- `POST /api/admin/conversion/appointments`

Every mutation requires `Idempotency-Key` and admin cookie/header authentication.
Consent is resolved only from the append-only `ConsentRecord` ledger by subject,
purpose, and channel. Acquisition `consent_basis` is never an effective grant.
Buyer profile financial fields are deliberately excluded from outbox events.

## Local SC-2 follow-up: BuyerMatch

The additive local BuyerMatch slice and synthetic G2 contract are recorded in
`docs/SALES_CONVERSION_G1_G2_EVIDENCE.md`. BuyerMatch remains recommendation-only:
it cannot reserve inventory, change opportunity stage, assert legal eligibility, or
emit identity/financial fields. Missing inventory evidence is explicit and never
represented as a fresh inventory check.

G2 still owns journey commitment evidence, outcome/revenue reconciliation, scoped
funnel reads, retention/access-audit controls, and end-to-end A/S/P adoption without
bypassing legal, verification, inventory, payment, attribution, or commission gates.
