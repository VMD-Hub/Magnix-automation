# Magnix Legal Knowledge Content Studio

> Decision record: chuyen video pipeline tu auto-render stock video sang semi-auto legal knowledge studio.

## 1. Dinh huong

Magnix khong uu tien de agent tu render video stock hoan toan. Huong moi la:

```
Legal KB / Retrieval Pack
  -> Pain / Topic
  -> Legal editorial brief
  -> Production package
  -> Voiceover / slide / screen plan
  -> Human footage hoac screen recording
  -> L3 approve
  -> Publish thu cong
  -> Scorecard
```

Muc tieu la tang san luong video trong khi van giu trust, compliance va tinh nguyen ban cua kenh.

Noi dung NOXH / vay / dinh gia phai dung `docs/LEGAL_KB_ARCHITECTURE.md` lam nen. Agent khong duoc tu suy luan claim phap ly ngoai retrieval pack; neu thieu can cu thi tra `needs_human_legal_source`.

Moi workflow content phai tao san pham cu the theo `docs/CONTENT_PRODUCT_OUTPUTS.md`: bai Page, bai website, video package, slide podcast, carousel, lead magnet hoac assembly package. Brief chi la trung gian, khong phai ket qua cuoi.

## 2. Vai tro 7 agent sau dieu chinh

| Agent | Vai tro moi |
|-------|-------------|
| Agent 1 - Social Listening | Thu thap pain va phan loai dang tin hieu: question, tutorial_need, legal_confusion, myth, case_study, doc_checklist |
| Agent 2 - Classify | Phan loai segment va format phu hop: short_legal_explainer, screen_tutorial, slide_podcast, checklist_carousel, lead_magnet, outreach_reply |
| Layer B - Editorial Brief | Tao brief bien tap co claim can kiem chung, risk, visual angle, CTA keyword, recommended format |
| Agent 3 - Lead Magnet | Tao checklist, file mau, Q&A, carousel, post Page va asset opt-in |
| Agent 4 - Outreach | Tao phan hoi inbound theo CTA keyword va ngu canh content |
| Agent 5 - Scorecard | Cham retention, IVI, warm lead, legal risk, hook diversity, visual diversity va reused footage |
| Agent 6 - Production Package | Tao script, slide outline, screen steps, voiceover, subtitles, footage slots, callouts, edit recipe |
| Agent 7 - Assembly Assistant | Xuat goi dung cho CapCut / Canva / Descript: voice, SRT, slide PNG, asset list, edit instruction. Auto-render chi la phase sau |

## 3. Footage va screen recording library

Agent chi nen dung footage khi footage da co metadata. Moi asset nen co schema toi thieu:

```json
{
  "file": "office_docs_001.mp4",
  "scene_type": "office_documents",
  "actions": ["review_docs", "point_to_paper"],
  "best_for": ["noxh_income", "loan_checklist"],
  "usable_segments": [
    { "start": 4, "end": 9, "note": "lat ho so, khong lo PII" }
  ],
  "risk": "low",
  "reuse_count": 0
}
```

Nguyen tac:

- Khong lap lai mot footage nguyen clip qua nhieu lan.
- Cat thanh doan 2-5 giay va thay doi crop, zoom, slide, callout.
- Footage nguoi that la lop trust; screen recording va slide la lop giai thich.
- Moi asset moi can human confirm PII va ngu canh phap ly.

## 4. Nang luc viet kich ban cham insight

Mot kich ban Magnix tot phai bat dau tu pain that, khong bat dau tu kien thuc chung.

### 4.1 Hook 0-3 giay

Cong thuc:

```
Pain cu the + hau qua nhe + loi hua giai thich ngan
```

Vi du:

- "Thu nhap 15 trieu co du mua NOXH khong?"
- "Dang ky online sai muc nay, ho so de bi tra ve."
- "Bank khong chi nhin luong, ho nhin dong tien."

Tranh:

- "Xin chao moi nguoi..."
- "Hom nay toi se chia se ve quy dinh..."
- Hook doa dam bao, giat gan, hoac ban hang som.

### 4.2 Pain deconstruction

Truoc khi viet, agent phai tach insight thanh 3 lop:

1. Khach dang lo gi?
2. Vi sao ho hieu sai?
3. Ho can cong cu nao de tu kiem tra?

Moi video chi giai quyet mot pain. Neu topic lon, tach thanh series.

### 4.3 Cau truc video ngan

Dung khung:

```
Hook -> Tension -> Value -> Proof / Example -> CTA opt-in
```

Rang buoc:

- 1 insight / 1 clip.
- Co pattern interrupt moi 3-5 giay.
- On-screen text ngan, doc duoc tren mobile.
- Spoken word co keyword pain trong 5 giay dau.
- Ket thuc bang asset huu ich, khong hard sell.

### 4.4 CTA inbound

CTA phai gan voi asset:

- Comment `CHECKLIST` de nhan bang tu kiem ho so.
- Comment `DTI` de nhan file tinh dong tien vay.
- Comment `DINHGIA` de nhan checklist doc chung thu.

Tranh CTA mo ho:

- "Inbox ngay."
- "Lien he de duoc tu van."
- "Dang ky dich vu ngay."

## 5. Loi can tranh de video khong fail

- Mo dau bang dinh nghia luat kho cung.
- Nhoi dieu/khoan nhung khong dich sang tinh huong doi thuong.
- Dua claim chua kiem chung ve lai suat, gia, room tin dung, kha nang duyet vay.
- Hua "chac chan duoc", "cam ket duyet", "tot nhat", "duy nhat".
- Dung lai footage qua nhieu ma khong co bien the visual.
- Video co view nhung khong co keyword comment, DM opt-in hoac lead magnet.
- Thieu disclaimer voi noi dung NOXH, vay, tham dinh, phap ly.

## 6. Compliance gate

Ap dung QA tiers hien co:

- L0: regex forbidden, schema, khong PII.
- L1: format gate, hook length, beats/subtitle/schema.
- L2: `/devil` cho NOXH, vay, dinh gia, SME credit, claim phap ly.
- L3: human approve truoc publish.

Agent khong tu publish noi dung nhay cam.

## 7. Reuse mot insight thanh nhieu asset

Mot insight tot nen duoc atomize:

- Short video: hook -> 3 diem kiem tra -> CTA.
- Slide podcast: 5 slide + voiceover.
- Screen tutorial: thao tac online + callout loi sai.
- Carousel: checklist / red flags.
- Q&A Page post: H2/H3 la cau hoi that.
- Lead magnet: file mau, checklist, bang doi chieu.
- Outreach: tin nhan 3 dong gui dung asset.

## 8. Uu tien trien khai

1. Nang Agent 6 thanh Production Package.
2. Tao schema Footage / Screen Recording Library.
3. Doi Agent 7 thanh Assembly Assistant, tam dung tham vong auto-render full video.
4. Mo rong Agent 5 Scorecard voi visual diversity va reused footage.
5. Giu L3 human gate cho moi noi dung co claim phap ly.

