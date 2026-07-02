-- ============================================================================
-- PostGIS upgrade path (P1 Search & Geo)
-- ----------------------------------------------------------------------------
-- Mặc định geo chạy bằng bounding-box + haversine trong app (lib/geo), đủ cho
-- quy mô vừa và KHÔNG cần extension. Khi dữ liệu lớn (hàng trăm nghìn tin) thì
-- bật PostGIS để dùng index không gian GiST + ST_DWithin cho nhanh & chính xác.
--
-- Chạy thủ công trên Postgres (cần quyền superuser cho CREATE EXTENSION):
--   psql "$DATABASE_URL" -f prisma/sql/enable-postgis.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- Cột geography sinh tự động từ lat/lng (SRID 4326). STORED để index được.
-- Lưu ý: tên cột lat/lng theo @map trong schema.prisma (camelCase mặc định).
ALTER TABLE "Listing"
  ADD COLUMN IF NOT EXISTS geog geography(Point, 4326)
  GENERATED ALWAYS AS (
    CASE
      WHEN lat IS NOT NULL AND lng IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ELSE NULL
    END
  ) STORED;

CREATE INDEX IF NOT EXISTS listing_geog_gist ON "Listing" USING GIST (geog);

-- Sau khi bật, có thể thay lib/geo/nearby.ts bằng truy vấn:
--
--   SELECT id, ST_Distance(geog, ST_MakePoint($lng,$lat)::geography) AS dist_m
--   FROM "Listing"
--   WHERE status = 'ACTIVE'
--     AND ST_DWithin(geog, ST_MakePoint($lng,$lat)::geography, $radius_m)
--   ORDER BY dist_m ASC
--   LIMIT $limit;
--
-- Gọi qua prisma.$queryRaw (PostGIS không có Prisma typed binding cho geography).
