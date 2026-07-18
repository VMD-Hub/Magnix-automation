-- Super-Admin grant for Ops telesales tool (Mini App + web /ops/telesales).

CREATE TYPE "OpsToolCode" AS ENUM ('TELESALES_CRM');
CREATE TYPE "OpsToolGrantStatus" AS ENUM ('ACTIVE', 'REVOKED');

CREATE TABLE "ops_tool_grants" (
    "id" TEXT NOT NULL,
    "user_account_id" TEXT NOT NULL,
    "tool" "OpsToolCode" NOT NULL DEFAULT 'TELESALES_CRM',
    "status" "OpsToolGrantStatus" NOT NULL DEFAULT 'ACTIVE',
    "granted_by" TEXT NOT NULL,
    "note" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ops_tool_grants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ops_tool_grants_user_account_id_tool_key" ON "ops_tool_grants"("user_account_id", "tool");
CREATE INDEX "ops_tool_grants_status_tool_idx" ON "ops_tool_grants"("status", "tool");

ALTER TABLE "ops_tool_grants"
  ADD CONSTRAINT "ops_tool_grants_user_account_id_fkey"
  FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
