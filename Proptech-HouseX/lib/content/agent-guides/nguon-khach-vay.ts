/**
 * Nguồn khách hàng vay — kịch bản khai thác Agent.
 * Source: docs/agent/nguon-khach-hang-vay.md
 * Catalog: VAY_02_NGUON_KHACH → AgentService `NGUON_KHACH_VAY`
 */
export const NGUON_KHACH_VAY_SERVICE_CODE = "NGUON_KHACH_VAY" as const;

export const NGUON_KHACH_VAY_SERVICE_META = {
  code: NGUON_KHACH_VAY_SERVICE_CODE,
  category: "TRAINING" as const,
  name: "2. Nguồn khách hàng vay",
  description:
    "Ba nhóm nguồn khách vay (đang mua bán, đã mua bán, nguồn khác) và kịch bản khai thác kèm giải pháp House X Mortgages.",
  sortOrder: 18,
};

export const NGUON_KHACH_VAY_CONTENT_MARKDOWN = `# Nguồn khách hàng vay

**House X Mortgages** — Đào tạo Agent

## 1. Ba nhóm nguồn chính

1. **Đang mua bán BĐS** → nhu cầu **vay mới**  
2. **Đã mua bán BĐS** (≤ 2 năm) → nhu cầu **vay bù đắp**  
3. **Nguồn khác** → tái tài trợ / chuyển bank, vay thế chấp tiêu dùng hoặc SXKD  

---

## 2. Đang mua bán BĐS

### Bên mua / bên bán

- **Mua:** Ở, KD, tích lũy — có vốn tự có + vay, hoặc đòn bẩy đầu tư  
- **Bán:** Thanh khoản; chia tài sản; trả nợ; gom tiền mua TS mới  

### Kịch bản bên mua (mở rộng tệp vay)

| Tình huống | Giải pháp House X |
|---|---|
| Tiền mặt 3 tỷ, không ưng căn ≤ 3 tỷ | Nâng tầm 3,5–4,5 tỷ + vay bù 0,5–1,5 tỷ; giữ dự phòng 200–500tr |
| Thích nhà cũ, hết tiền sửa | Vay sửa chữa/hoàn thiện với TSĐB căn mua; dư phòng nội thất 100–200tr |
| Ưng 2 căn ngộp, chỉ đủ 1 | Chia vốn đối ứng 2 căn + vay thế chấp cả 2 (nếu năng lực/CIC đủ) |

Nhập liệu qua **House X Agent** để bank thẩm định minh bạch.

### Kịch bản bên bán

| Tình huống | Giải pháp House X |
|---|---|
| Bán chia con (vd. 6 tỷ → giữ 2 tỷ, mua ~3 tỷ) | Combo: ông + 2 con = 3 khách mua/vay; sơ loại hồ sơ trước cọc |
| Nợ quá hạn, bank ép tất toán | Đào sâu nhóm nợ; cân nhắc chuyển người đứng tên (CIC sạch) vay bank mới |
| Bị ép giá khi cần vốn mua mới | Giữ nhà cũ — vay thế chấp mua mới; so lãi vay vs biên độ tăng giá |

---

## 3. Đã mua bán (vay bù đắp)

Đã sang tên trong **2 năm** bằng vốn tự có / vay ngoài ngắn hạn:

1. Vay bù đắp dòng vốn đã bỏ — tái đầu tư, KD, xây/sửa  
2. Muốn đổi căn — tìm bên mua + tư vấn vay; hỗ trợ chủ dùng đòn bẩy chốt căn mới  

---

## 4. Nguồn khác

### Tái tài trợ / chuyển khoản vay

- Quan hệ / khách cũ vay 3–5 năm: hết ưu đãi, lãi thả nổi cao → chuyển bank đối tác House X lãi thấp hơn  
- Chủ động gọi thăm khách cũ đã giao dịch qua mình  

### Vay SXKD

- Hộ KD / DN / đối tác có BĐS thế chấp — gói SXKD bank đối tác (kỳ hạn, ân hạn theo từng bank)  
- Nếu phù hợp giao dịch thật: cân nhắc cấu trúc mục đích mua bán BĐS để kỳ hạn / ân hạn tốt hơn — **không giả mục đích**; đối chiếu quy định bank  

---

*House X — Real estate made simple*
`;
