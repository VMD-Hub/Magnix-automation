# House X DNA — hoàn thiện

Mục tiêu: đóng DNA product/ops trong repo — CTV pipeline, LMS, Zalo Mini App.

**Runbook NOXH Case (Ops):** [NOXH_CASE_PIPELINE.md](NOXH_CASE_PIPELINE.md)

---

## Đã làm trong code

| Phần | Nội dung |
|------|----------|
| **Phase 0 NOXH Case** | Schema M1–M5, checklist, CTV claim fairplay, Contact Firewall, Admin + Mini App Agent |
| **DNA-A** | Doc ops `NOXH_CASE_PIPELINE.md` |
| **DNA-B** | Wizard tier **HOT** → auto `NoxhCase` platform (`NOXH_WIZARD_HOT_AUTO_CASE`, mặc định `true`) |
| **DNA-C** | n8n Telegram `noxh_case.*` — `housex-noxh-lead-route` |
| **DNA-D** | Zalo OA CS notify CTV khi `noxh_case.milestone_changed` (outbox handler) |
| **P1 CTV ↔ LMS** | `approveCtvApplication` → `ensureBrokerEntitlements`; `LISTING_POST` ACTIVE mặc định |
| **P2 Gate đăng tin** | `POST /api/listings` kiểm `LISTING_POST` |
| **P3 Anti-bypass** | `ZALO_AUTH_DEV_BYPASS` forbidden trên production |
| **P4 Bootstrap** | `npm run db:bootstrap:agent-entitlements` |
| **Two lanes Mini App** | P1–P3 — xem [MINIAPP_TWO_LANES.md](MINIAPP_TWO_LANES.md) |

---

## Việc VPS (Ops)

```bash
cd /opt/housex/Proptech-HouseX
git pull
npm ci
npx prisma generate
npm run db:deploy
npm run db:seed:agent-services
npm run db:bootstrap:agent-entitlements
npm run go-live:print-cron   # bật noxh-case-maintenance + commission-payouts
pm2 restart housex --update-env
```

**Env DNA-B (tùy chọn):**

```env
NOXH_WIZARD_HOT_AUTO_CASE=true
CTV_CLAIM_LOCK_BUSINESS_DAYS=20
```

---

## Zalo OA / Mini App

- [x] Mini App ID trong `housex-zalo-miniapp/app-config.json`
- [ ] `ZALO_APP_ID` / `ZALO_APP_SECRET` / `ZALO_OA_ID` trên VPS — **tắt** `ZALO_AUTH_DEV_BYPASS` production
- [ ] `ZALO_OA_REFRESH_TOKEN` (DNA-D push milestone CTV) — lấy sau khi OA authorize
- [ ] Build Mini App prod + smoke Simulator
- [ ] OA menu public (chờ duyệt Zalo)

**DNA-D env:**

```env
ZALO_OA_NOTIFY_ENABLED=true
ZALO_OA_REFRESH_TOKEN=<từ Zalo OA authorize>
# Hoặc dev ngắn hạn: ZALO_OA_ACCESS_TOKEN=
```

CTV cần **đã follow OA** và login Mini App ít nhất một lần (`UserAccount.zaloUserId`).

---

## Smoke DNA (local / staging)

1. **Wizard HOT:** `/cong-cu/dieu-kien-noxh` → response có `noxhCaseCode` → Admin thấy case M1  
2. **CTV:** Mini App Agent → đậu hội nhập → thả lead → fairplay / mask SĐT  
3. **Inbound:** Admin inbound → tạo hồ sơ NOXH  
4. **Cron:** `noxh-case-maintenance` release lock (test sau 20 ngày LV hoặc mock)

Chi tiết: [NOXH_CASE_PIPELINE.md](NOXH_CASE_PIPELINE.md) §9.

---

## DNA tiếp theo

| Batch | Việc |
|-------|------|
| **P4 Mini App** | Subdomain campaign `noxh.*` / `cctm.*` — [MINIAPP_TWO_LANES.md](MINIAPP_TWO_LANES.md) |
