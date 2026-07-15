# Tài liệu đào tạo Agent — cấu trúc thư mục

> Ghi nhận từ UI đào tạo gốc (Tài liệu đào tạo).  
> Nội dung từng mục: **chờ bạn cung cấp** để nạp.  
> Catalog typed: `lib/content/agent-guides/training-catalog.ts`

## Cây thư mục

```
Tài liệu đào tạo
├── Vay thế chấp                         (5)   ← lĩnh vực Cho vay
│   ├── 1. Ứng dụng Agent và quy trình vay          [MD]    READY (`HOUSEX_AGENT_GUIDE`)
│   ├── 2. Nguồn khách hàng vay                     [MD]    READY (`NGUON_KHACH_VAY`)
│   ├── 3. Phân tích hồ sơ pháp lý bất động sản       [MD]    READY (`PHAP_LY_BDS`)
│   ├── 4. Hướng dẫn bảo hiểm khoản vay             [MD]    READY (`HOUSEX_INSURANCE`)
│   └── Hướng dẫn quy trình                         [Video] PENDING
│
└── Kinh doanh thẩm định                 (2)   ← lĩnh vực Thẩm định
    ├── Báo cáo chứng thư nhà đất                   [PDF]   READY (House X rebrand)
    └── Hướng dẫn gửi định giá khách hàng lẻ        [MD]    READY (`THAM_DINH_BDS`)
```

## Bảng mã (đối chiếu khi gửi file)

| Folder code | Domain | Doc code | Tiêu đề House X | Tiêu đề gốc (UI) | Status |
|---|---|---|---|---|---|
| `VAY_THE_CHAP` | cho-vay | `VAY_01_UNG_DUNG_VA_QUY_TRINH` | 1. Ứng dụng Agent và quy trình vay | 1. Ứng dụng Citics Agent và quy trình vay | ready → `HOUSEX_AGENT_GUIDE` |
| `VAY_THE_CHAP` | cho-vay | `VAY_02_NGUON_KHACH` | 2. Nguồn khách hàng vay | 2. Nguồn khách hàng vay | ready → `NGUON_KHACH_VAY` |
| `VAY_THE_CHAP` | cho-vay | `VAY_03_PHAP_LY_BDS` | 3. Phân tích hồ sơ pháp lý bất động sản | 3. Phân tích hồ sơ pháp lý bất động sản | ready → `PHAP_LY_BDS` |
| `VAY_THE_CHAP` | cho-vay | `VAY_04_BAO_HIEM` | 4. Hướng dẫn bảo hiểm khoản vay | 4. Hướng dẫn Citics Insurance | ready → `HOUSEX_INSURANCE` |
| `VAY_THE_CHAP` | cho-vay | `VAY_05_HUONG_DAN_QUY_TRINH_VIDEO` | Hướng dẫn quy trình | Hướng dẫn quy trình | pending |
| `KINH_DOANH_THAM_DINH` | tham-dinh | `TD_01_BAO_CAO_CHUNG_THU` | Báo cáo chứng thư nhà đất | Báo cáo chứng thư nhà đất | ready → PDF House X |
| `KINH_DOANH_THAM_DINH` | tham-dinh | `TD_02_DINH_GIA_KHACH_LE` | Hướng dẫn gửi định giá khách hàng lẻ | Hướng dẫn gửi định giá khách hàng lẻ | draft → `THAM_DINH_BDS` |

## Quy ước khi nạp tài liệu

1. Gửi file kèm **doc code** (vd. `VAY_02_NGUON_KHACH`) hoặc đúng tiêu đề gốc.
2. PDF/video gốc có logo/tên nền tảng cũ → biên soạn lại trung lập trước khi hiển thị trên House X.
3. Sau khi nạp: cập nhật `status` (`ready`) + `contentPath` trong `training-catalog.ts`.

## Đã có sẵn

- `VAY_01_UNG_DUNG_VA_QUY_TRINH` → `docs/agent/huong-dan-house-x-agent.md` + AgentService `HOUSEX_AGENT_GUIDE`  
  (nguồn: `Huong_dan_Citics_Agent.md` + `Citics_Agent_User_Guide.md`, đã rebrand)
- `VAY_02_NGUON_KHACH` → `docs/agent/nguon-khach-hang-vay.md` + AgentService `NGUON_KHACH_VAY`  
  (nguồn: `Nguon_Khach_Hang_Vay_Citics.md`, đã rebrand)
- `VAY_03_PHAP_LY_BDS` → `docs/agent/cam-nang-phap-ly-bds.md` + AgentService `PHAP_LY_BDS`  
  (nguồn: `cam_nang_phap_ly_bat-dong-san.md`, đã rebrand)
- `VAY_04_BAO_HIEM` → `docs/agent/huong-dan-house-x-insurance.md` + AgentService `HOUSEX_INSURANCE`  
  (nguồn: `Huong_dan_Citics_Insurance.md`, đã rebrand)
- `TD_01_BAO_CAO_CHUNG_THU` → `docs/agent/td01-chung-thu/chung-thu-mau-nha-dat-HOUSEX.pdf`  
  (rebrand từ `Chứng thư mẫu nhà đất.pdf`; script `scripts/rebrand-chung-thu-pdf.py`)
- `TD_02_DINH_GIA_KHACH_LE` → `docs/agent/huong-dan-tham-dinh-bds.md` + AgentService `THAM_DINH_BDS`
