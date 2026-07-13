# Sub-project: Vũ Nguyễn Digital Profile (NFC)

> **Lớp 3** — Personal Brand · thuộc chiến lược `docs/strategy/personal-brand/`  
> **URL:** `https://timnhaxahoi.com/vu-nguyen`  
> **Mục đích:** Name card điện tử · đích NFC · cầu nối Vũ Nguyễn → House X

---

## Trạng thái

| Hạng mục | Trạng thái |
|----------|------------|
| Route `/vu-nguyen` | ✅ MVP |
| Panel QR + nút Web / Mini App / Profile | ✅ |
| Layout full-screen NFC (`?src=nfc`) | ✅ |
| QR in thẻ vật lý (`npm run brand:vu-nguyen-qr`) | ✅ |
| Checklist web `/vu-nguyen/checklist-noxh` | ✅ In/PDF |
| Nội dung vận hành (script, deck, calendar…) | ✅ Xem mục lục dưới |
| Ảnh profile | ⬜ Bạn cung cấp sau |
| Video hero | ⬜ Sau khi quay |
| In NFC | ⬜ Sau ảnh + video |

---

## Mục lục nội dung (ưu tiên trước ảnh)

### Assets & copy
- [assets/IDENTITY-KIT.md](./assets/IDENTITY-KIT.md)
- [assets/SIGNATURES.md](./assets/SIGNATURES.md)
- [assets/DISCLAIMERS.md](./assets/DISCLAIMERS.md)

### Sale kit & gặp khách
- [sale-kit/meeting-prep-checklist.md](./sale-kit/meeting-prep-checklist.md)
- [sale-kit/case-book-template.md](./sale-kit/case-book-template.md)
- Checklist in: **web** `/vu-nguyen/checklist-noxh` · source `lib/personal-brand/vu-nguyen/checklist-noxh-content.ts`

### Scripts
- [scripts/network-call.md](./scripts/network-call.md)
- [scripts/zalo-follow-up-1-3-7-14.md](./scripts/zalo-follow-up-1-3-7-14.md)

### Content
- [content/calendar-90d.md](./content/calendar-90d.md)
- [content/case-post-template.md](./content/case-post-template.md)
- [content/video-postcard-script.md](./content/video-postcard-script.md)

### Deck & đào tạo CTV
- [deck/VU-NGUYEN-MEETING-DECK-outline.md](./deck/VU-NGUYEN-MEETING-DECK-outline.md)
- [training/CTV-MODULE-01-LEGAL-INTRO.md](./training/CTV-MODULE-01-LEGAL-INTRO.md)

---

## Code map

| Path | Vai trò |
|------|---------|
| `app/vu-nguyen/page.tsx` | Digital profile |
| `app/vu-nguyen/checklist-noxh/page.tsx` | Checklist in |
| `app/api/vu-nguyen/vcard/route.ts` | vCard |
| `app/api/vu-nguyen/qr/route.ts` | QR động (PNG) |
| `app/vu-nguyen/case/[slug]/page.tsx` | Bài case Q&A |
| `lib/personal-brand/vu-nguyen/case-studies.ts` | Nội dung case |
| `components/personal-brand/vu-nguyen/profile-connect-panel.tsx` | 3 QR + 3 nút link |
| `scripts/generate-vu-nguyen-qr.ts` | QR in thẻ (`brand:vu-nguyen-qr`) |
| `public/brand/vu-nguyen/qr/` | PNG in NFC |

---

## NFC & kết nối Web · Mini App

### Thẻ vật lý (in NFC)

| Vị trí | URL / file |
|--------|------------|
| **Chip NFC** | `https://timnhaxahoi.com/vu-nguyen?src=nfc` |
| **QR mặt sau (chính)** | Cùng URL → `public/brand/vu-nguyen/qr/qr-profile-nfc.png` |
| **QR phụ (tuỳ chọn)** | `qr-housex-web.png` · `qr-housex-miniapp-zalo.png` |

Tạo lại file in: `npm run brand:vu-nguyen-qr`

### Bảng điện tử (`/vu-nguyen`)

Trang profile có block **«Kết nối Web & Mini App»**: 3 QR + 3 nút (Profile · Web House X · Mini App Zalo) + link text.

**Thẻ NFC / QR in** (`?src=nfc`): ẩn header & footer site — chỉ name card + panel kết nối + link «Xem hồ sơ đầy đủ».

### Cấu hình Mini App (Zalo OA)

Set một trong các env (ưu tiên từ trên xuống):

1. `NEXT_PUBLIC_ZALO_OA_PUBLIC_URL` — link OA đầy đủ
2. `NEXT_PUBLIC_SOCIAL_ZALO_URL` — fanpage/OA trong site config
3. `NEXT_PUBLIC_ZALO_OA_ID` → tự build `https://zalo.me/{id}`

Khách: quét QR Zalo → mở OA → bấm **«Mở House X»** (Mini App ghim trên OA).

---

## Env (khi có ảnh/video)

```env
NEXT_PUBLIC_VU_NGUYEN_PORTRAIT_URL="/brand/vu-nguyen/portrait.jpg"
NEXT_PUBLIC_VU_NGUYEN_VIDEO_URL=""
NEXT_PUBLIC_VU_NGUYEN_ZALO_URL="https://zalo.me/0826600800"
NEXT_PUBLIC_ZALO_OA_PUBLIC_URL=""
NEXT_PUBLIC_ZALO_OA_ID=""
```

---

## Theo dõi chi tiết

[STATUS.md](./STATUS.md)
