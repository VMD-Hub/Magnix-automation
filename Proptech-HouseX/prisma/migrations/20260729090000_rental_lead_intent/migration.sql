-- ADR-018 Wave 0 — rental lead intent (landlord / tenant / tax_help / need_pm)

CREATE TYPE "RentalLeadIntent" AS ENUM ('LANDLORD', 'TENANT', 'TAX_HELP', 'NEED_PM');

ALTER TABLE "leads" ADD COLUMN "rental_intent" "RentalLeadIntent";

CREATE INDEX "leads_rental_intent_idx" ON "leads"("rental_intent");
