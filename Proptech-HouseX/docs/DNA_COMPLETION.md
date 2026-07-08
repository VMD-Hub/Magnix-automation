# House X DNA — hoàn thiện (batch code) · OA Mai

Mục tiêu: đóng DNA product/ops trong repo. **OA / Mini App ID / App Secret thật** chờ xác nhận ngày mai.

## Đã làm trong code (batch này)

| Phần | Nội dung |
|------|----------|
| **P1 CTV ↔ LMS** | `approveCtvApplication` gọi `ensureBrokerEntitlements`; PRODUCT không quiz/prereq (`LISTING_POST`) ACTIVE mặc định |
| **P2 Gate đăng tin** | `POST /api/listings` kiểm `LISTING_POST` (graceful nếu chưa seed catalog) |
| **P3 Anti-bypass** | `ZALO_AUTH_DEV_BYPASS` trên `NODE_ENV=production` → lỗi `ZALO_BYPASS_FORBIDDEN`; go-live-env check Zalo |
| **P4 Bootstrap** | `npm run db:bootstrap:agent-entitlements` cho CTV hiện có |
| **Docs** | `GO_LIVE.md` LMS ✅; checklist deploy VPS LMS; Phase 3 trong Mini App README |

## Việc VPS (bạn / Ops — không cần OA)

```bash
cd /opt/housex/Proptech-HouseX   # hoặc path repo
git pull
npm ci
npx prisma generate
npm run db:deploy
npm run db:seed:agent-services
npm run db:bootstrap:agent-entitlements
pm2 restart housex --update-env
```

## Chờ mai — chỉ phần Zalo OA / Mini App thật

- [ ] Xác nhận / lấy **Mini App ID** → `housex-zalo-miniapp/app-config.json` `app.appId`
- [ ] Điền **`ZALO_APP_ID` / `ZALO_APP_SECRET` / `ZALO_OA_ID`** trên VPS `.env`
- [ ] Build Mini App prod: `VITE_HOUSEX_API_BASE=https://timnhaxahoi.com`, **không** `VITE_AUTH_DEV_BYPASS`
- [ ] Xác thực OA + submit duyệt Zalo (nếu chưa)
- [ ] Smoke Simulator thật: login Graph → Bearer → `/api/auth/me` → thi `CTV_ONBOARDING` → thả lead

## Smoke local (đã có bypass)

1. API: `ZALO_AUTH_DEV_BYPASS=true`, `NODE_ENV` không phải production  
2. Mini App: login Agent → `/agent/dich-vu` → đậu hội nhập → thả lead  
3. Web: đăng tin broker (cần entitlement `LISTING_POST` — auto sau approve/bootstrap)
