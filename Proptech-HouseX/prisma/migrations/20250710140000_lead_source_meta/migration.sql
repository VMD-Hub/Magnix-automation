-- CRM-R1: lưu UTM / meta nguồn lead (Zalo Ads, fanpage, …)

ALTER TABLE "leads" ADD COLUMN "source_meta" JSONB;
