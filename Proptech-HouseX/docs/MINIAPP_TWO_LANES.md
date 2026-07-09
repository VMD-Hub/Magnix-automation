# House X Mini App — One Brand, Two Lanes

> **Quyết định:** Một Zalo Mini App (`appId` duy nhất), hai luồng trải nghiệm **NOXH** và **CCTM** (căn hộ thương mại). Không tách app Zalo riêng.  
> **Liên quan:** [ZALO_MINIAPP_SPEC.md](ZALO_MINIAPP_SPEC.md) · [ADR-014](../.cursor/ADR-014-zalo-miniapp.md) · `housex-zalo-miniapp/`

---

## 1. Vì sao không tách 2 Mini App

| Rủi ro tách app | Ghi chú |
|-----------------|--------|
| x2 duyệt Zalo, x2 maintain, x2 OA binding | Solo operator không đủ nguồn lực nuôi đều |
| Traffic phân mảnh | Brand House X còn mới — cần một điểm hút |
| Brand loãng | Khách nhớ "House X", không nhớ tên 2 app |

## 2. Rủi ro gộp chung (phải xử lý bằng kiến trúc)

| Rủi ro | Giải pháp trong lane |
|--------|----------------------|
| Khách CCTM ngại "chung mâm" NOXH | Lane riêng ngay sau `/start`; copy/hero/shortcut khác; teaser chéo — không trộn grid |
| Filter logic khác (thu nhập vs ROI) | `/noxh/*` và `/cctm/*` — component & query `projectType` tách |
| CRM / AI lead-scoring nhiễu | Tag `segment` (`noxh` \| `cctm`) từ lead đầu vào (P2 API); session lane trong Mini App (P1) |

## 3. Kiến trúc routing

```
Mở Mini App
    │
    ├─ ?lane=noxh|cctm (deep link campaign) ──► ghi đè remember → /noxh hoặc /cctm
    │
    ├─ Chưa từng chọn lane ──► /start (welcome + 2 card)
    │
    └─ Đã remember lane ──► /noxh hoặc /cctm (skip /start)

Sau khi vào lane:
    Header chip [ NOXH ▾ ] → bottom sheet đổi lane (≤2 tap)
    Tab "Tìm nhà" → home lane đang nhớ
    /agent/* → lane thứ 3 (CTV), entry riêng — không trên /start
```

### Route map (Khách)

| Route | Màn hình | Ghi chú |
|-------|----------|---------|
| `/` | `HomeGate` | Redirect theo `?lane=` / remember / `/start` |
| `/start` | `StartPage` | Không tabbar — first impression |
| `/kham-pha` | `ExploreHubPage` | "Tôi chưa chắc" — hub nhẹ 2 lane |
| `/noxh` | `LaneHomePage` | `projectType=NHA_O_XA_HOI` |
| `/cctm` | `LaneHomePage` | `projectType=THUONG_MAI` |
| `/du-an/:slug` | Chi tiết dự án | Chung |
| `/tu-van`, `/cong-cu`, `/mo` | Chung | Shortcut theo lane trên Home |

## 4. Remember lane — không phải khóa

**Lưu:** `localStorage` key `hx_miniapp_preferred_lane` = `noxh` \| `cctm` (+ timestamp).

| Hành vi | Quy tắc |
|---------|---------|
| Lần 2+ mở app | Vào thẳng lane đã nhớ — **không** hỏi lại `/start` |
| Đổi lane | Chip header → bottom sheet; không modal confirm |
| Deep link `?lane=` | Ghi đè remember; campaign CCTM vào thẳng Solena lane |
| Sau ~30 ngày (tương lai) | Có thể hiện lại `/start` nhẹ — chưa bật P1 |

## 5. First impression (`/start`)

- Brand moment ngắn (ruby + gold, copy trung tính).
- Hai **card lớn** (ảnh + 1 dòng lợi ích), không phải hai nút text.
- Link phụ: **"Tôi chưa chắc"** → `/kham-pha`.
- Không thêm nút thứ 3 Agent trên `/start` — CTV vào qua OA menu / QR.

## 6. Đổi lane thuận tiện

1. **Chip lane** trên `HomeBrandHeader` mọi trang home lane.
2. **CrossLaneTeaser** cuối Home — 1–2 dự án lane kia + CTA "Xem tất cả".
3. **Tài khoản** — dòng "Mục tiêu mua nhà" sync với lane.

## 7. Dự án ưu tiên (seed VPS)

```bash
cd Proptech-HouseX && npm run db:seed:priority
```

| Lane | Slug ưu tiên |
|------|----------------|
| NOXH | `dta-happy-home-nhon-trach`, `thu-thiem-green-house-thu-duc` |
| CCTM | `solena-green-town-binh-tan` |

## 8. Backend / CRM (lộ trình)

| Phase | Việc |
|-------|------|
| **P1 (code)** | Lane Mini App + `segment` trên `POST /api/leads` |
| **P2** | `Lead.segment` DB + event `lead.created.segment` |
| **P3** | n8n branch + Magnix lead-scoring theo segment |
| **P4** | Subdomain marketing `noxh.*` / `cctm.*` — webview chung Mini App |

## 9. Lane thứ 3 — Agent (đã có)

- Route `/agent/*` — không gộp vào picker Khách.
- Tab Agent chỉ khi `canAgent` (BROKER/CTV).

## 10. Checklist triển khai

- [x] Doc kiến trúc (file này)
- [x] `/start`, `/noxh`, `/cctm`, `HomeGate`, remember lane
- [x] `LaneSwitcher` + `CrossLaneTeaser`
- [x] `Lead.segment` + Mini App gửi segment (P2)
- [ ] n8n branch theo `lead.created.segment` (P3)
- [ ] Subdomain campaign links (P4)

---

*Cập nhật: 2026-07-09 — ban đầu theo quyết địch product "one brand, two lanes".*
