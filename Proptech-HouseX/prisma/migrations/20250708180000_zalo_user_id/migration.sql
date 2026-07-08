-- ADR-014: Zalo Mini App auth — link UserAccount ↔ Zalo user id
ALTER TABLE "user_accounts" ADD COLUMN IF NOT EXISTS "zalo_user_id" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "user_accounts_zalo_user_id_key" ON "user_accounts"("zalo_user_id");
