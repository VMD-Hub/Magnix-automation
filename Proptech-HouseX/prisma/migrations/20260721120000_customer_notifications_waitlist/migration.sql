-- ADR-016 P2 — customer in-app notifications (waitlist / launch).
CREATE TABLE "customer_notifications" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "project_id" TEXT,
    "lead_id" TEXT,
    "href" TEXT,
    "dedupe_key" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customer_notifications_dedupe_key_key" ON "customer_notifications"("dedupe_key");
CREATE INDEX "customer_notifications_customer_id_read_at_idx" ON "customer_notifications"("customer_id", "read_at");
CREATE INDEX "customer_notifications_customer_id_created_at_idx" ON "customer_notifications"("customer_id", "created_at");
CREATE INDEX "customer_notifications_project_id_type_idx" ON "customer_notifications"("project_id", "type");

ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
