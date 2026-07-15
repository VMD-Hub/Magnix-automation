/**
 * Hướng dẫn tra cứu & nộp đơn vay — House X Agent.
 * Source: docs/agent/huong-dan-house-x-agent.md
 * Nguồn gốc: Huong_dan_Citics_Agent.md + Citics_Agent_User_Guide.md (đã rebrand)
 * Catalog: VAY_01_UNG_DUNG_VA_QUY_TRINH → AgentService `HOUSEX_AGENT_GUIDE`
 */
export const HOUSEX_AGENT_GUIDE_SERVICE_CODE = "HOUSEX_AGENT_GUIDE" as const;

export const HOUSEX_AGENT_GUIDE_SERVICE_META = {
  code: HOUSEX_AGENT_GUIDE_SERVICE_CODE,
  category: "TRAINING" as const,
  name: "1. Ứng dụng Agent và quy trình vay",
  description:
    "Đăng ký House X Agent, tra cứu HX-Value & quy hoạch, nộp đơn vay ngân hàng (6 bước), Point / hoa hồng / xếp hạng và quy định khóa tài khoản.",
  sortOrder: 15,
};

/** Nội dung hướng dẫn hiển thị trên Mini App Agent. */
export const HOUSEX_AGENT_GUIDE_CONTENT_MARKDOWN = `# Hướng dẫn tra cứu thông tin và nộp đơn vay — House X Agent

*Hệ sinh thái: House X Value (HX-Value), House X Mortgages, House X Homes*

## SECTION 1: Đăng ký tài khoản và chương trình đối tác

### 1. Đăng ký House X Agent

- Truy cập **Web / Mini App** House X Agent hoặc app Android/iOS theo link House X công bố
- Nhập **số điện thoại đăng ký làm việc** → xác thực theo màn hình
- Tiện ích: tra cứu nhanh và định giá tài sản trên nền tảng

### 2. Chương trình đối tác khoản vay

- **Mặc định:** *Vay thế chấp* và *Kinh doanh thẩm định* (không có nút "Đăng ký hợp tác" = đã là đối tác)
- **Cần đăng ký:** Bấm đăng ký → phòng đối tác House X xét duyệt qua Email / app
- Hợp đồng điện tử tự kích hoạt khi phát sinh giao dịch đầu tiên
- Giới thiệu khách định giá đến House X → hoa hồng theo chính sách

### 3. Hỗ trợ & Trợ lý AI

- Hotline / Email / Zalo theo kênh hỗ trợ đối tác House X trên ứng dụng
- Trợ lý AI: hỏi đáp câu lệnh tự nhiên, tìm BĐS nhanh

---

## SECTION 2: Tra cứu thông tin bất động sản

### 1. Bốn cách tìm vị trí (nhà đất / căn hộ)

1. Địa chỉ cụ thể  
2. Số tờ / số thửa  
3. Tọa độ Google (WGS84)  
4. Tọa độ VN2000 (+ **"Đọc tọa độ bằng tệp ảnh"** từ sổ)

### 2. HX-Value & công cụ định giá

- Bản đồ quy hoạch, giá, vệ tinh, đo vẽ
- **HX-Value:** AI + Big Data + lịch sử giá khu vực; độ tin cậy & biên độ (vd. ±15%)
- Tự định giá: nhập 1–3 tài sản so sánh
- **"Thêm vào giỏ hàng"** → Định giá / Vay / Mua / Bán

### 3. Quy hoạch (VPQH) & chỉnh sửa

- Bật lớp quy hoạch → tự bóc tách HQ / VPQH  
- Hoặc đo vẽ lộ giới trên bản đồ  
- Chỉnh sửa thửa đất / CTXD → hệ thống tính lại giá sơ bộ  

### 4. Căn hộ / dự án

Tìm theo tên hoặc khu vực; mã căn cụ thể; hoặc **Thêm thủ công** nếu chưa có trên hệ thống.

---

## SECTION 3: Quy trình nộp đơn vay (6 bước)

\`\`\`
[B1 Agent] Sơ loại khoản vay & tư vấn
      ▼
[B2 Agent] Chọn gói vay, chốt KH, thu thập giấy tờ
      ▼
[B3 Bank] Tiếp nhận & kiểm tra hồ sơ
      ▼
[B4 Bank] Xét duyệt & yêu cầu House X chứng thư cứng
      ▼
[B5 Agent] Thông báo kết quả & xác nhận vay
      ▼
[B6 Bank] Giải ngân & cập nhật hoa hồng Agent
\`\`\`

### Bước 1 — Sơ loại

1. Thêm TS vào rổ (từ tra cứu hoặc **+ Thêm** thủ công)  
2. **"Chọn dịch vụ"** — Vay mua nhà / Vay thế chấp  
3. Tích vàng = thiếu thông tin; bóc tách VPQH/lộ giới để đúng hạn mức bank  
4. Thiếu giá / quá 6 tháng: **"Cập nhật giá"** hoặc **"Yêu cầu sơ bộ"** (House X ~60 phút)  
5. Nhập thu nhập & nhu cầu vay → DTI; so sánh LTV / phí thẩm định các bank  

### Bước 2 — Thu thập & nộp đơn

- Chọn bank; đính kèm CCCD, hôn nhân/cư trú, thu nhập, sổ/HĐMB  
- **"NỘP ĐƠN"** — không tự hủy (trừ bank từ chối hoặc quá SLA)  
- **"Nộp ngân hàng khác"** — nhóm liên kết &lt; 3  

### Bước 3–6

Bổ sung giấy tờ → thẩm định hiện trường House X + chứng thư cứng → Đồng ý vay / Từ chối → Giải ngân → hoa hồng vào ví.

---

## SECTION 4: Point, hoa hồng, xếp hạng, chế tài

### House X Point (HXP)

Thanh toán tính năng nâng cao / tích lũy thi đua đổi quà — xem lịch sử Nạp–Chi–Thưởng trên trang cá nhân.

### Hoa hồng

Thống kê theo tháng: mã HĐ, bank, ngày giải ngân, hoa hồng thô, trừ vi phạm, thuế TNCN, **thực nhận** — rút về TK cá nhân theo chính sách.

### Xếp hạng

Theo tổng doanh số giải ngân thực tế (tỷ đồng) hàng tháng; top nhận thưởng HXP hoặc tăng tỷ lệ chia sẻ.

### Khóa tài khoản

| Vi phạm | Hệ quả điển hình |
|---|---|
| Hồ sơ **"HỒ SƠ RÁC"** | Khóa vĩnh viễn |
| 1 sao từ ngân hàng ≥ 3 lần | Khóa vĩnh viễn |
| Rating trung bình &lt; 3 sao | Khóa vĩnh viễn |
| Thái độ tiêu cực (KH/bank) | Tạm khóa |
| Tư vấn sai lệch hệ thống | Tạm khóa |
| Giả mạo hồ sơ gửi bank | Khóa vĩnh viễn + pháp luật |
`;
