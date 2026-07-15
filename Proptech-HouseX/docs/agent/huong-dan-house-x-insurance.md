# Hướng dẫn dịch vụ House X Insurance

**House X** — Đào tạo Agent  
*Real estate made simple*

> Catalog: `VAY_04_BAO_HIEM` · AgentService `HOUSEX_INSURANCE`  
> Nguồn: `Huong_dan_Citics_Insurance.md` — brand Citics Insurance → **House X Insurance**.

---

## 1. Tổng quan về House X Insurance

**House X Insurance** là đầu mối bảo hiểm số trong hệ sinh thái House X, đáp ứng nhu cầu bảo hiểm của khách hàng vay thế chấp trên nền tảng **House X Mortgages**.

Với quy trình liền mạch từ vay thế chấp đến mua bảo hiểm nhà ở, House X Insurance cung cấp giải pháp tiện lợi, toàn diện — và hướng tới mở rộng các sản phẩm bảo hiểm khác phục vụ khách trong hệ sinh thái House X.

---

## 2. Quy trình triển khai dịch vụ (workflow)

### Bước 1: Agent tư vấn chọn gói vay

- **Sơ loại & tư vấn:** Agent sơ loại khoản vay, tư vấn gói vay phù hợp kèm các chi phí liên quan.
- **Nhận diện gói bắt buộc BH:** Giao diện hệ thống hiển thị **ICON gói vay** với các gói yêu cầu bắt buộc mua bảo hiểm nhà ở.
- **Tư vấn sơ bộ bảo hiểm:** Agent tư vấn sơ bộ yêu cầu và phí tạm tính bảo hiểm từ House X Insurance theo gói vay đã chọn.
- **Xác nhận tư vấn (popup):** Khi nộp đơn vay sang ngân hàng với gói bắt buộc BH nhà ở, hệ thống hiện popup: *"Đã tư vấn chi phí và gói bảo hiểm từ House X Insurance cho khách hàng hay chưa?"*
  - **ĐÃ tư vấn:** Agent được hưởng hoa hồng khi House X Insurance bán BH thành công.
  - **CHƯA tư vấn:** Agent không được hưởng hoa hồng bảo hiểm cho hồ sơ đó.

### Bước 2: House X Insurance tiếp nhận và tư vấn chuyên sâu

- **Tự động khởi tạo:** Ngay khi Agent nộp đơn vay (hợp đồng bắt buộc BH tài sản), hệ thống khởi tạo hợp đồng bảo hiểm tương ứng và đẩy dữ liệu về House X Insurance.
- **Hỗ trợ Agent:** Chuyên viên kinh doanh House X Insurance tiếp nhận và tư vấn khách các bước tiếp theo (thay Agent ở phần chuyên sâu BH).
- **Phí tạm tính:** Phí BH nhà ở trên hệ thống lúc này là phí tạm tính — dựa trên giá định giá sơ bộ hoặc số tiền khách muốn vay.

### Bước 3: Chốt deal và mua bảo hiểm

- **Cập nhật phí chính thức:** Khi có giá định giá cuối hoặc giá trị khoản vay ngân hàng chấp nhận cuối cùng, hệ thống tính lại phí BH chính xác.
- **Chốt hợp đồng & thanh toán:** House X Insurance tư vấn lại phí chính thức, chốt HĐ và hướng dẫn khách thanh toán (hỗ trợ quét QR / cổng thanh toán House X công bố trên ứng dụng).
- **Xuất giấy chứng nhận (GCN):** Sau thanh toán, hệ thống kết nối đối tác bảo hiểm (ví dụ: *Tổng công ty Cổ phần Bảo hiểm Quân đội — MIC*) và xuất **Giấy chứng nhận bảo hiểm nhà tư nhân** điện tử cho người thụ hưởng.
- **Lưu trữ:** GCN lưu trực tiếp trên hợp đồng bảo hiểm tương ứng để tra cứu.

---

## 3. Chính sách hoa hồng bảo hiểm (Agent)

Hoa hồng cập nhật online trên ứng dụng **House X Agent** — theo dõi, quản lý và đối soát:

| Loại hình bảo hiểm | Tỷ lệ hoa hồng | Điều kiện áp dụng |
|---| :---: |---|
| **Bảo hiểm nhà ở** | **20%** | Agent đã tư vấn sơ bộ chi phí BH nhà ở theo gói vay và xác nhận trên hệ thống. |
| **Bảo hiểm vật chất xe ô tô** | **15%** | Agent giới thiệu khách có nhu cầu BH xe cho House X Insurance. |

> Tỷ lệ và điều kiện có thể cập nhật theo chính sách sàn — luôn đối chiếu bảng phí mới nhất trên ứng dụng House X Agent.

---

*House X — Together, we can improve the real estate market and make it more accessible to everyone.*

## Ghi chú biên soạn

| Gốc | House X |
|---|---|
| Citics / Citics.vn / Citics Group | House X |
| Citics Insurance | House X Insurance |
| Citics Mortgages | House X Mortgages |
| Citics Agent | House X Agent |
| thanhtoan.citics.vn | Cổng thanh toán House X (công bố trên app) |
