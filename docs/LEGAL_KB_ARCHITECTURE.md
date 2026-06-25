# Magnix Legal Knowledge Base Architecture

> Decision record: them Layer K de agent viet content NOXH / phap ly dua tren nguon co can cu, giam hallucination va giam token khi chay LLM.

## 1. Muc tieu

Legal Knowledge Base la nen tang cho cac noi dung:

- Nha o xa hoi (NOXH)
- Vay mua nha, DTI, dong tien
- Tham dinh gia tai san
- Ho so, quy trinh, dieu kien, loi thuong gap
- Q&A AIO / SEO / content tu van

Agent khong duoc tu suy luan quy dinh phap ly neu khong co facts trong Legal KB hoac brief da duoc human verify.

## 2. Vi tri trong Magnix

Layer K nam truoc cac agent content:

```
Legal source
  -> Atomic legal notes
  -> Q&A knowledge base
  -> Retrieval pack
  -> Editorial Brief
  -> Agent 3 / Agent 6 / Agent 4
  -> L2 devil QA
  -> L3 approve
```

Voi noi dung NOXH / vay / dinh gia, Editorial Brief va Production Package phai kem `legal_retrieval_pack`.

## 3. Bon lop du lieu

### 3.1 Legal Source Library

Luu van ban goc va metadata kiem chung.

```json
{
  "source_id": "noxh_luat_nha_o_2023",
  "title": "Luat Nha o 2023",
  "source_type": "law",
  "jurisdiction": "vietnam",
  "effective_date": "2025-01-01",
  "status": "active",
  "url": "",
  "stored_path": "legal-sources/noxh/luat-nha-o-2023.md",
  "verified_by": "human",
  "last_checked": "2026-06-24",
  "notes": ""
}
```

Quy tac:

- Khong dua text luat dai vao prompt mac dinh.
- Moi source phai co `status`, `effective_date`, `last_checked`.
- Van ban thay doi theo dia phuong hoac thoi diem phai tach source rieng.

### 3.2 Atomic Legal Notes

Chia quy dinh thanh cac menh de nho, de retrieve dung ngu canh.

```json
{
  "claim_id": "noxh_income_condition_001",
  "topic": "noxh_income",
  "claim": "Nguoi mua NOXH can dap ung dieu kien ve doi tuong, nha o, cu tru va thu nhap theo quy dinh hien hanh.",
  "source_refs": ["noxh_luat_nha_o_2023:article_x"],
  "confidence": "verified",
  "risk_level": "high",
  "disclaimer_required": true,
  "usage_rules": [
    "Khong dien giai thanh cam ket du dieu kien",
    "Khong gan mot muc thu nhap co dinh cho moi truong hop"
  ],
  "forbidden_claims": [
    "Chac chan duoc mua NOXH",
    "Chi can thu nhap X trieu la du dieu kien"
  ],
  "last_checked": "2026-06-24"
}
```

Day la lop chong hallucination chinh.

### 3.3 Q&A Knowledge Base

Tao cau hoi dap truc dien tu atomic notes de toi uu AIO / SEO va tu van.

```json
{
  "qa_id": "noxh_income_qa_001",
  "topic": "noxh_income",
  "question": "Thu nhap bao nhieu thi duoc mua nha o xa hoi?",
  "short_answer": "Can xet theo nhom doi tuong, dieu kien thu nhap va quy dinh tai thoi diem nop ho so.",
  "expanded_answer": "Khong nen ket luan chi dua vao mot con so thu nhap. Can doi chieu dong thoi doi tuong, tinh trang nha o, cu tru, thu nhap va ho so chung minh.",
  "source_refs": ["noxh_income_condition_001"],
  "related_questions": [
    "Vo chong tinh thu nhap nhu the nao?",
    "Co nha roi co mua NOXH duoc khong?"
  ],
  "safe_cta": "Comment CHECKLIST de nhan bang tu kiem dieu kien.",
  "disclaimer": "Thong tin tham khao; ket luan tuy quy dinh hien hanh va ho so thuc te."
}
```

Q&A nen duoc viet bang ngon ngu nguoi hoi that, khong viet nhu muc luc luat.

### 3.4 Retrieval Pack

Khi agent viet content, chi dua vao prompt cac facts can thiet.

```json
{
  "topic": "noxh_income",
  "intent": "short_legal_explainer",
  "facts": [
    {
      "claim_id": "noxh_income_condition_001",
      "claim": "Nguoi mua NOXH can doi chieu nhieu dieu kien, khong chi mot muc thu nhap.",
      "source_refs": ["noxh_luat_nha_o_2023:article_x"],
      "usage_rule": "Khong noi chac chan du dieu kien."
    }
  ],
  "forbidden_claims": [
    "Cam ket duyet",
    "Chac chan mua duoc",
    "Lai suat co dinh ap dung cho tat ca"
  ],
  "disclaimer_required": true,
  "needs_human_legal_source": false
}
```

Neu retrieve khong du facts, agent phai tra `needs_human_legal_source: true` thay vi tu viet.

## 4. Topic taxonomy ban dau

| Topic | Muc dich |
|-------|----------|
| `noxh_eligibility` | Dieu kien doi tuong, nha o, cu tru, thu nhap |
| `noxh_income` | Cach hieu dieu kien thu nhap va chung minh thu nhap |
| `noxh_documents` | Ho so can chuan bi, loi thieu giay to |
| `noxh_online_submission` | Huong dan nop / theo doi ho so online |
| `noxh_transfer_restrictions` | Chuyen nhuong, cho thue, ban lai |
| `loan_dti` | DTI, dong tien tra no, kha nang vay |
| `valuation_certificate` | Chung thu dinh gia, gia tri tai san, sai lech ky vong |
| `local_policy` | Quy dinh / huong dan dia phuong |

## 5. Nguyen tac viet Q&A AIO

- Tieu de va H2/H3 nen la cau hoi that.
- Cau tra loi ngan nam o dau, sau do moi mo rong.
- Moi cau tra loi co source_refs noi bo.
- Mot Q&A chi tra loi mot y.
- Co related questions de tao topic cluster.
- Co safe CTA gan voi asset inbound.
- Khong bien Q&A thanh bai sales.

## 6. Giam token LLM

Khong dua toan bo KB vao prompt. Pipeline dung:

1. Classify topic va intent.
2. Retrieve 3-7 atomic notes lien quan.
3. Tao retrieval pack ngan.
4. Agent viet dua tren pack.
5. Parse layer kiem schema.
6. L2 / L3 neu noi dung nhay cam.

## 7. Quality gates

| Gate | Dieu kien |
|------|-----------|
| Source gate | Source co status active, last_checked, verified_by |
| Claim gate | Claim co source_refs va risk_level |
| Q&A gate | Short answer khong qua da, co source_refs |
| Retrieval gate | Pack co forbidden_claims va disclaimer rule |
| Generation gate | Agent khong them claim ngoai pack |
| L2 gate | `/devil` voi NOXH, vay, dinh gia |
| L3 gate | Human approve truoc publish |

## 8. Uu tien trien khai

1. Tao schema file / sheet cho Legal Source Library.
2. Nhap cum NOXH dau tien: eligibility, income, documents.
3. Chia atomic legal notes co source_refs.
4. Sinh Q&A AIO tu atomic notes.
5. Cap nhat Agent 2 / Layer B de tao `legal_retrieval_pack`.
6. Cap nhat Agent 3 va Agent 6: neu thieu pack thi tra `needs_human_legal_source`.
7. Them L2 QA kiem tra "claim ngoai pack".

