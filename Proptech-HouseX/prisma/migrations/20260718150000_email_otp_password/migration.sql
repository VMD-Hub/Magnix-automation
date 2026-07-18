-- Account password OTP + password_set_at marker.

CREATE TYPE "EmailOtpPurpose" AS ENUM ('SET_PASSWORD', 'RESET_PASSWORD');

ALTER TABLE "user_accounts" ADD COLUMN "password_set_at" TIMESTAMP(3);

CREATE TABLE "email_otp_challenges" (
    "id" TEXT NOT NULL,
    "purpose" "EmailOtpPurpose" NOT NULL,
    "email" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "user_account_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_otp_challenges_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "email_otp_challenges_email_purpose_created_at_idx"
  ON "email_otp_challenges"("email", "purpose", "created_at");
CREATE INDEX "email_otp_challenges_user_account_id_purpose_idx"
  ON "email_otp_challenges"("user_account_id", "purpose");

ALTER TABLE "email_otp_challenges"
  ADD CONSTRAINT "email_otp_challenges_user_account_id_fkey"
  FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
