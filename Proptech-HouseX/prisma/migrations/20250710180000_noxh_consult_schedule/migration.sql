-- CRM-R3: lịch tư vấn CTV + theo dõi tiến độ giữ lock

ALTER TABLE "noxh_cases" ADD COLUMN "consult_scheduled_at" TIMESTAMP(3);
