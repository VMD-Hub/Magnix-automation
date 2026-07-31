# Kế hoạch triển khai Agent / Affiliate P0

> **Ngày rà soát:** 31/07/2026  
> **SoT:** [`AGENT_MINIAPP_UI_APPROVED.md`](./AGENT_MINIAPP_UI_APPROVED.md) · [`AFFILIATE_NOXH_PROGRAM_OPS.md`](./AFFILIATE_NOXH_PROGRAM_OPS.md)  
> **Nguyên tắc kênh:** API/SoR chung → **Mini trước (cảm nhận)** → web đủ sâu / Admin — P0 cả hai; Mini không được nghèo hơn web.

---

## 1. Kết luận rà soát (1 câu)

Stack Agent cũ (cases, LMS, hoa hồng flat, telesales, lock **20 LV**) đang chạy; UI Citics + nghiệp vụ chương trình (A+B+C, 60/30/+15, e-contract, CS+ảnh, Giỏ, Help FAB, HH %×HĐMB) **gần như chỉ có mock** — triển khai phải **SoR trước, Mini shell, rồi luồng nóng**, không “chỉ vẽ UI”.

---

## 2. Gap nhanh

| Nhóm | Hiện trạng | P0 cần |
|------|------------|--------|
| UI Agent home / tabbar 5 / Giỏ / Help FAB | **Mock only** | Prod khớp SoT UI |
| Khai báo A+B+C · `dealTier` | Claim tên/SĐT | Form + schema theo deal |
| Exclusive | **20 ngày LV** | **Thay** 60/30/+15 (không song song) |
| Hành trình CS + ảnh + thưởng 500k | M1–M5 / assist mỏng | Module CS SoT + Admin verify |
| HH | Flat ~15M / WON-M5 | `% × giá HĐMB × dealTier` sau ký (Ops nhập giá) |
| E-contract | Duyệt CTV admin | OTP ± ký tay, gate quyền |
| Web CTV | LP + đăng ký + dash mỏng | Parity luồng Mini |
| Ops | CRM/telesales mạnh | HĐMB price, reject CS, +15, verify thăm DA |

**Không làm P0:** Points/BXH · AI trong Help · map C2C marketplace.

---

## 3. Pha triển khai (thứ tự khóa)

### Phase 0 — Nền SoR / API (bắt buộc trước UI lớn)

**Effort: L · Owner: backend House X · Status: DONE code (01/08/2026)**

| Việc | Ghi chú | Code |
|------|---------|------|
| Schema: `dealTier`, exclusive, CareActivity, e-contract, HĐMB, visit bonus | Migration `20260731150000_affiliate_sot_phase0` | `prisma/schema.prisma` |
| Exclusive: thay 20 LV → 60/30/+15 | Calendar days | `lib/affiliate/exclusivity.ts` |
| HH % × HĐMB × tier (+500k) | Pure calc + accrual | `lib/affiliate/commission-calc.ts` · `commission-accrual.ts` |
| CS API | POST note+ảnh | `app/api/ctv/cases/[id]/care` |
| Claim set exclusive fields | Không tự +15 khi assist | `lib/data/noxh-case.ts` |
| Cron nhả silent/expired | | `case-maintenance.ts` |
| Admin HĐMB / +15 / verify DA | Phase 4 | `noxh-case-affiliate-ops` |

**DoD còn lại (ops):** `prisma migrate deploy` trên staging (Phase 0 + `20260801010000_partner_contract_otp`).

### Phase 1 — Mini UI shell (cảm nhận)

**Effort: M · Repo: housex-zalo-miniapp · Status: DONE shell (31/07/2026)**

| Việc | Map SoT | Code |
|------|---------|------|
| AppShell Agent: 5 tab, Giỏ nổi giữa | UI §1 | `AgentTabbar.tsx` · `AppShell.tsx` |
| Redesign Agent home 5 khối + slider ≥3 | UI §2 | `AgentHomePage.tsx` |
| Nhãn dịch vụ §2.1 + Công cụ/Tài liệu | §2.1–2.4 | home |
| Help FAB + modal SĐT/Email/Zalo | §1 FAB | `AgentHelpFab.tsx` · `config/agent-support.ts` |
| Khai báo / Giỏ shell | §3 | `AgentDeclarePage` · `AgentCartPage` |

**DoD còn:** checklist §7 trên Zalo device; entitlement pill động từ API (Phase 2).

### Phase 2 — Mini luồng nóng (gắn API Phase 0)

**Effort: L · Status: DONE wiring (31/07/2026)**

1. Khai báo A+B+C (+ đổi tier theo SoT) — `AgentDeclarePage` → `POST /api/ctv/cases` (`dealTier`, `projectLabel`)  
2. Giỏ hàng → chọn dự án → khai báo (`?project=`)  
3. Hành trình CS + upload — case detail → `POST .../care/upload` + `POST .../care`  
4. Tài khoản: e-contract + verified — **light / Phase 3–4** (chưa gate UI)  
5. Hoa hồng: copy “sau HĐMB”  
6. Banner slider CTA → deep-link — Phase 1 home  

**DoD staging:** `prisma migrate deploy` Phase 0 · smoke khai báo → CS → list HH.

### Phase 3 — Web CTV parity

**Effort: M–L · Proptech-HouseX `/moi-gioi/*` · Status: DONE wiring (01/08/2026)**

| Việc | Code |
|------|------|
| Khai báo A+B+C + `?project=` | `/moi-gioi/khai-bao` · `ctv-case-drop-form` (`dealTier`, `projectLabel`) |
| Giỏ hàng → khai báo | `/moi-gioi/gio-hang` · `ctv-cart-grid` · `lib/ctv/agent-cart-projects` |
| CS + upload nhiều ảnh | board + `/moi-gioi/ho-so/[id]` · `ctv-care-form` |
| HH copy sau HĐMB | `/moi-gioi/hoa-hong` · `ctv-commissions-panel` · summary widget |
| Help FAB | `ctv-help-fab` · `lib/content/agent-support` |
| LP affiliate | `/affiliate-bat-dong-san` giữ |
| E-contract light | Phase 4+ (schema Broker only; Mini cũng chưa gate) |

**DoD:** Cùng API Mini Phase 2; không tính năng CTV-facing chỉ có web mà Mini thiếu ở P0.

### Phase 4 — Ops Admin (web only)

**Effort: M · Status: DONE wiring (01/08/2026)**

| Việc | Code |
|------|------|
| Nhập giá HĐMB → tính HH | `POST .../noxh-cases/[id]/hdmb` · `recordHdmbBaseAmount` · board panel |
| Reject CS giả | `POST .../care/[activityId]/reject` · `rejectCareActivity` |
| Duyệt +15 | `POST .../exclusive/extend` · CTV `POST .../ctv/.../exclusive/extend` |
| Verify thăm DA → +500k | `POST .../site-visit/verify` |
| Xem e-contract · dealTier | List/detail board + broker `partnerContract*` |
| Playbook 20→60/30/+15 | `ops-playbook-sections` · `OPS_PLAYBOOK` · `NOXH_CASE_PIPELINE` |
| M5 accrual pass affiliate fields | `updateNoxhCaseAdmin` → `accrueNoxhCommissionOnSigned` |
| Không tự +15 khi assist | `maybeExtendCtvLockOnProgress` → chỉ `EXTEND_REQUESTED` |

**DoD:** Super/Ops đối soát deal mẫu: nhập HĐMB → (tuỳ) verify thăm DA → M5 → HH %×tier · reject CS · duyệt +15 trên `/admin/noxh-cases`.

### Phase 5 — E-contract light (đóng P0)

**Effort: M · Status: DONE wiring (01/08/2026)**

| Việc | Code |
|------|------|
| OTP purpose `PARTNER_CONTRACT` | Migration `20260801010000_partner_contract_otp` |
| Terms versioned + lib sign/hash | `lib/content/partner-contract.ts` · `lib/data/partner-contract.ts` |
| API CTV GET / request-otp / sign | `app/api/ctv/partner-contract/*` |
| Gate claim | `assertPartnerContractSigned` · env `AFFILIATE_CONTRACT_GATE_ENABLED` |
| Web UI | `/moi-gioi/e-contract` · tai-khoan · declare CTA |
| Mini UI | `/agent/e-contract` · Account + home docs |
| Admin snapshot | `GET /api/admin/brokers/[id]/partner-contract` |

**DoD:** CTV ký OTP (+ canvas tuỳ chọn) → `SIGNED` → khai báo deal; Admin xem status/snapshot; soft-launch tắt gate bằng env.

---

## 4. Lịch gợi ý (2–3 sprint tùy đội)

| Tuần | Focus |
|------|--------|
| **W1** | Phase 0 schema + rewrite lock 60/30/+15 + HH calc stub |
| **W2** | Phase 0 API CTV + Phase 1 shell Mini song song |
| **W3** | Phase 2 khai báo + giỏ + Help FAB gắn API |
| **W4** | Phase 2 CS + e-contract; Phase 4 Ops tối thiểu (giá HĐMB, +15) |
| **W5** | Phase 3 web parity + QA L2 nội dung tools/docs + soft launch |

*Điều chỉnh nếu 1 người full-stack: W1–2 gộp Phase 0; W3 shell+khai báo; W4 CS+Ops mỏng; W5 web.*

---

## 5. Rủi ro & quyết định sớm

| Rủi ro | Xử lý |
|--------|--------|
| Đập 20 LV khi còn lead đang lock | Migration + thông báo CTV; cron một lần |
| HH flat 15M vs % mới | Flag `commissionModel=PERCENT_HDMB` cho deal mới; deal cũ giữ flat đến L3 |
| Mini & buyer tabbar conflict | Mode Agent (5 tab) vs Khách (tabbar cũ) — lane switch rõ |
| Nội dung tools/docs chưa sẵn | Ship shell + link placeholder; L3 trước publish file |

---

## 6. Việc **không** bắt đầu bằng

- Redesign Ops drawer / subdomain `ops.` (có thể sau P0 CTV)  
- AI Help  
- Viết lại toàn bộ LMS  
- Desktop-first Agent web rồi “co” xuống Mini  

---

## 7. Bước tiếp theo ngay (chốt để code)

1. **Approve kế hoạch này** (hoặc chỉnh số tuần / ưu tiên Phase 4 sớm hơn).  
2. Mở branch `feat/affiliate-p0-sor` — Phase 0: Prisma + lock 60/30.  
3. Song song (sau schema draft): `feat/agent-mini-shell` — Phase 1 UI.  
4. Mỗi PR đối chiếu checklist UI §7 + SoT affiliate § chốt.

**Bắt đầu code tuần này:** Phase 0 (SoR) — không nhảy thẳng chỉ UI Mini nếu chưa có `dealTier` / 60/30 trên API.
