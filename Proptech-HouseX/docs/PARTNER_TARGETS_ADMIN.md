# Partner targets Admin (P3)

> Super-only · `/admin/partner-targets` · danh sách target B2B tay — **không CRM**.

## Mục tiêu

Giữ pipeline Công đoàn / HR / KCN khi **chưa có partner thật**: ghi target + việc tiếp theo, giới hạn thời gian Super ≤1h/tuần.

Public form vẫn ở `/hop-tac` (inbound). Board này = outbound target list nội bộ.

## Trạng thái

`TARGET` → `CONTACTED` → `MEETING` → `PARTNER` (hoặc `PAUSED` / `DROP`)

## Loại

`UNION` · `HR` · `KCN` · `ENTERPRISE` · `OTHER`

## Soft cap

Active (`TARGET`+`CONTACTED`+`MEETING`) > **40** → cảnh báo trên UI. Pause/drop trước khi phình list.

## API

| | |
|---|---|
| List/Create | `GET/POST /api/admin/partner-targets` |
| Update/Delete | `PATCH/DELETE /api/admin/partner-targets/[id]` |

## Migration

`prisma/migrations/20260721190000_partner_targets`

```bash
cd Proptech-HouseX
npx prisma migrate deploy
```

## Không làm ở P3

- Auto email/SMS tới partner
- Pipeline hội thảo / commission B2B
- Đồng bộ Sheet bắt buộc
