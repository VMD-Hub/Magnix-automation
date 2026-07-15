# Hướng dẫn tra cứu thông tin và nộp đơn vay — House X Agent

**Tài liệu đào tạo House X Agent**  
*Hệ sinh thái: House X Value (HX-Value), House X Mortgages, House X Homes*

> Biên soạn lại từ tài liệu gốc (`Huong_dan_Citics_Agent.md` + `Citics_Agent_User_Guide.md`).  
> Brand **Citics / Citics Agent** → **House X / House X Agent**.  
> Catalog: `VAY_01_UNG_DUNG_VA_QUY_TRINH` · AgentService `HOUSEX_AGENT_GUIDE`.

---

## SECTION 1: Đăng ký tài khoản và chương trình đối tác

### 1. Đăng ký tài khoản trên ứng dụng House X Agent

- **Cách thức truy cập:**
  - **Web / Mini App:** Ứng dụng **House X Agent** trên nền tảng House X
  - **App Android / iOS:** Theo link tải House X công bố (CH Play / App Store)
- **Các bước:**
  1. Truy cập ứng dụng hoặc website House X Agent
  2. Vào phần đăng ký tài khoản
  3. Nhập **số điện thoại đăng ký làm việc** (dùng để đăng nhập và lấy lại mật khẩu)
  4. Xác thực theo hướng dẫn trên màn hình để hoàn tất
- **Tiện ích đi kèm:** Tra cứu nhanh và định giá tài sản tích hợp trên nền tảng

### 2. Đăng ký chương trình đối tác khoản vay

- Sau khi đăng ký thành công, Agent tham gia các chương trình đối tác.
- **Cơ chế phân loại:**
  - **Chương trình mặc định:** *Vay thế chấp* và *Kinh doanh thẩm định*. Nếu không có nút "Đăng ký hợp tác", Agent được mặc định là đối tác của dịch vụ đó.
  - **Chương trình yêu cầu đăng ký:** Agent bấm đăng ký, cung cấp thêm thông tin. Phòng đối tác House X xét duyệt và gửi hướng dẫn qua Email / ứng dụng.
- **Cơ chế hợp đồng:** Hợp đồng hợp tác điện tử được hệ thống tự động kích hoạt và ký khi Agent phát sinh giao dịch đầu tiên.
- **Lợi ích:** Khách có nhu cầu định giá — Agent giới thiệu đến House X để nhận hoa hồng theo chính sách.

### 3. Hỗ trợ khách hàng và Trợ lý AI

- **Kênh hỗ trợ đối tác:** Hotline, Email, Zalo — theo thông tin hỗ trợ đối tác House X công bố trên ứng dụng / trang liên hệ.
- **Trợ lý AI bất động sản:** Hỏi đáp bằng câu lệnh tự nhiên, tìm kiếm nhanh thông tin BĐS (đang nâng cấp thành mô hình AI Agent toàn diện).

---

## SECTION 2: Tra cứu thông tin bất động sản

### 1. Tra cứu nhà đất lẻ: Tìm kiếm vị trí

Hệ thống cung cấp **4 phương thức tra cứu**:

1. **Theo địa chỉ cụ thể:** Số nhà, tên đường, khu vực
2. **Theo số tờ, số thửa:** Dữ liệu địa chính
3. **Theo tọa độ Google:** WGS84
4. **Theo tọa độ VN2000:** Nhập X, Y theo trích lục (chọn Tỉnh/Thành trước). Hỗ trợ **"Đọc tọa độ bằng tệp ảnh"** để quét nhanh từ ảnh sổ đỏ/sổ hồng

*Lưu ý: Kết quả có thể lệch hoặc không tồn tại do dữ liệu hiện trạng BĐS Việt Nam chưa đồng bộ hoàn toàn giữa các nguồn.*

### 2. Kết quả tra cứu và công cụ định giá

- **Bộ công cụ bản đồ:** Quy hoạch xây dựng/sử dụng đất, bản đồ giá, ảnh vệ tinh, thanh đo vẽ
- **Giá trị định giá sơ bộ (HX-Value):** AI + Big Data + lịch sử biến động giá khu vực
- **Độ tin cậy & biên độ sai số:** Ví dụ *Rất tin cậy* với sai lệch không vượt quá ±15%. Agent có thể dùng để tư vấn. Nếu thẩm định thực tế chênh lệch so với kết quả sơ bộ mức "Tin cậy", House X cam kết hoàn một phần phí dịch vụ (theo chính sách công bố)
- **Tự định giá:** Nhập thêm 1–3 tài sản so sánh theo biểu mẫu để tối ưu độ chính xác
- **Thao tác tiếp theo:** **"Thêm vào giỏ hàng"** → Định giá, Vay vốn, Mua hoặc Bán

### 3. Tra cứu quy hoạch & chỉnh sửa thông tin đất

Xác định diện tích vi phạm quy hoạch (VPQH):

- **Cách 1:** Bật lớp bản đồ Quy hoạch → hệ thống tự bóc tách diện tích Phù hợp quy hoạch (HQ) và VPQH
- **Cách 2:** Đo vẽ trên bản đồ vệ tinh (góc thửa, cạnh lộ giới)
- **Cập nhật dữ liệu:** Chỉnh sửa thửa đất hoặc công trình xây dựng (loại CTXD, diện tích, số tầng, năm xây dựng…) để hệ thống tính lại giá sơ bộ

### 4. Tra cứu căn hộ / dự án

- **Tìm dự án:** Theo tên hoặc Quận/Huyện; ranh giới hiển thị trên bản đồ. Thửa nằm trong dự án → hệ thống liên kết thông tin dự án
- **Tìm mã căn:** Nhập số phòng/mã căn. Nếu chưa có: tìm kiếm nâng cao hoặc **Thêm thủ công vào rổ hàng** (tên dự án có ID House X + thông số kỹ thuật)

---

## SECTION 3: Quy trình nộp đơn vay sang ngân hàng

### Tổng quan 6 bước

1. **Agent:** Sơ loại khoản vay và tư vấn khách mua BĐS  
2. **Agent:** Lựa chọn khoản vay, chốt khách và thu thập giấy tờ  
3. **Bank:** Tiếp nhận và kiểm tra hợp lệ hồ sơ  
4. **Bank:** Xét duyệt và yêu cầu House X cung cấp chứng thư bản cứng  
5. **Agent:** Thông báo khách và xác nhận khoản vay  
6. **Bank:** Giải ngân và hoàn tất hồ sơ  

---

### Bước 1: Agent sơ loại khoản vay

#### 1. Thêm tài sản thế chấp vào rổ hàng

- **Cách 1 — Từ màn hình tra cứu:** Tra cứu → kiểm tra pháp lý → chỉnh sửa thửa đất / CTXD nếu sai → **"Thêm vào giỏ hàng"**
- **Cách 2 — Thêm thủ công:** Giỏ hàng → **"+ Thêm"** → điền loại tài sản (Nhà đất / Căn hộ / Nhà đất thuộc dự án), địa chỉ, đính kèm pháp lý, ghi chú → **"Thêm tài sản"**

#### 2. Chọn tài sản và dịch vụ vay

Giỏ hàng → tích chọn tài sản → **"Chọn dịch vụ"** (*Vay mua nhà* hoặc *Vay thế chấp*)

#### 3. Chỉnh sửa, bổ sung thông tin BĐS

- Thông tin chưa đủ → tích (✓) **màu vàng** — cần chỉnh sửa, bóc tách diện tích vi phạm lộ giới/quy hoạch
- *Quan trọng:* Bóc tách giúp tính đúng hạn mức từng ngân hàng (mỗi bank có rule khác với phần VPQH / CTXD chưa hoàn công)
- **Thiếu giá sơ bộ / quá 6 tháng / độ tin cậy thấp:**
  1. Nhập giá mua bán thực tế → **"Cập nhật giá"**
  2. Hoặc **"Yêu cầu sơ bộ"** → chuyên viên House X trả kết quả sau **60 phút**

#### 4. Bổ sung thông tin khách hàng và nhu cầu vay

Tình trạng công việc, nguồn thu nhập, số tiền / thời hạn vay, phương thức trả nợ (gốc cố định lãi giảm dần hoặc gốc lãi chia đều) → hệ thống tính DTI

#### 5. Hệ thống gợi ý gói vay

Truy vấn ngân hàng đối tác (ví dụ: MB, VIB, Vietcombank, HDBank, Woori, OCB…) và hiển thị:

- Giá trị tài sản phê duyệt theo tiêu chuẩn từng bank  
- Tỷ lệ cho vay tối đa (LTV), ví dụ 70%, 90%  
- Phí thẩm định tài sản tương ứng  

Agent dùng bảng so sánh để tư vấn gói tối ưu.

---

### Bước 2: Lựa chọn khoản vay và thu thập hồ sơ

1. **Chọn ngân hàng** → xác nhận hiện trạng tài sản theo quy định bank đó  
2. **Thu thập tài liệu** — hệ thống gửi Email / SMS / Zalo cho khách; Agent tải lên:
   - *KH vay:* CCCD gắn chip, hôn nhân/độc thân, cư trú  
   - *Thu nhập:* HĐLĐ, xác nhận lương (≤ 6 tháng), sao kê/phiếu lương 3 tháng  
   - *Pháp lý TS:* Sổ hồng/đỏ, HĐMB công chứng  
3. **"NỘP ĐƠN"** → điều phối sang cán bộ tín dụng theo rule ngân hàng  
   - *Sau nộp:* Agent không tự hủy trừ khi bank từ chối (hồ sơ rác / không đạt) hoặc quá SLA — lúc đó mới đề xuất hủy để chọn bank khác  
   - **"Nộp ngân hàng khác":** nhóm liên kết tối đa &lt; 3 bank; hệ thống sao chép hồ sơ sang hợp đồng mới; quản lý qua "Mở rộng" mục Hợp đồng liên kết  

---

### Bước 3–6: Ngân hàng & giải ngân

- **B3:** Bank kiểm tra hồ sơ; thiếu giấy → yêu cầu bổ sung trên app Agent  
- **B4:** Bank duyệt hạn mức sơ bộ → yêu cầu House X **thẩm định hiện trường** + chứng thư cứng  
- **B5:** Kết quả phê duyệt (số tiền, lãi suất, phí tất toán trước hạn, trả tháng đầu…) → Agent hỗ trợ khách **Đồng ý vay** hoặc Từ chối  
- **B6:** Giải ngân → trạng thái **"Hoàn tất"** → hệ thống cập nhật hoa hồng vào ví Agent  

---

## SECTION 4: Tính năng và quy định khác

### 1. House X Point (HXP)

- Đơn vị thanh toán nội bộ trên ứng dụng House X Agent  
- Thanh toán tính năng nâng cao (tra cứu chuyên sâu, thẩm định nhanh) hoặc tích lũy thi đua đổi quà  
- Theo dõi Nạp / Chi / Nhận thưởng trên trang cá nhân  

### 2. Hoa hồng trực tuyến

- Thống kê hoa hồng theo tháng: mã HĐ, ngân hàng, ngày giải ngân, trạng thái, giá trị giải ngân, hoa hồng thô, trừ vi phạm, thuế TNCN, **hoa hồng thực nhận**  
- Agent đối soát và rút về tài khoản ngân hàng cá nhân theo chính sách sàn  

### 3. Bảng xếp hạng và chương trình thi đua

- Xếp hạng House X Agent cập nhật định kỳ hàng tháng  
- Theo tổng **tỷ lệ doanh số giải ngân thực tế (tỷ đồng)** trên hợp đồng vay thế chấp thành công  
- Top Agent: thưởng HXP hoặc tăng tỷ lệ chia sẻ hoa hồng theo chiến dịch  

### 4. Khóa dịch vụ và khóa tài khoản

House X áp dụng khóa tạm thời hoặc vĩnh viễn khi:

1. Hồ sơ bị ngân hàng từ chối / đánh dấu **"HỒ SƠ RÁC"**  
2. Cán bộ ngân hàng đánh giá **1 sao từ 3 lần trở lên**  
3. Rating trung bình **dưới 3 sao**  
4. Phản ánh tiêu cực về **thái độ làm việc** từ KH hoặc ngân hàng  
5. **Cố tình tư vấn sai lệch** so với dữ liệu / gợi ý hệ thống  
6. **Cung cấp thông tin sai / giả mạo hồ sơ** gửi ngân hàng (khóa vĩnh viễn + xử lý theo pháp luật)  

---

*House X — Together, we can improve the real estate market and make it more accessible to everyone.*

## Ghi chú biên soạn

| Gốc | House X |
|---|---|
| Citics / Citics.vn / Citics Team | House X |
| Citics Agent | House X Agent |
| Citics Value® / Mortgages® / Homes® | House X Value / Mortgages / Homes |
| Citics Point (CP) | House X Point (HXP) |
| Hotline / Email / Zalo Citics | Kênh hỗ trợ đối tác House X (công bố trên app) |
| agent.citics.vn | House X Agent (web / Mini App) |
