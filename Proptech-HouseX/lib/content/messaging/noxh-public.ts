/**
 * Copy công khai NOXH — SEO + cảm xúc.
 * Không dùng tên nội bộ "Rada"; giữ từ khóa nhà ở xã hội miền Nam / an cư / người lao động.
 */

import {
  articlePath,
  NOXH_HANDBOOK_PATH,
} from "@/lib/content/article-routes";
import { NOXH_CATALOG_PATH } from "@/lib/content/project-catalog-paths";

export { NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";
export { NOXH_CATALOG_PATH };

/** Dòng giới thiệu trên banner danh mục & hero từng dự án NOXH. */
export const NOXH_REGION_TAGLINE =
  "Nhà ở xã hội miền Nam — cơ hội an cư cho người lao động" as const;

export const NOXH_CATALOG_TITLE = "Nhà ở xã hội miền Nam" as const;

export const NOXH_CATALOG_SEO_TITLE =
  "Nhà ở xã hội miền Nam — an cư người lao động" as const;

export const NOXH_CATALOG_SEO_DESCRIPTION =
  "Danh mục NOXH miền Nam trên House X: Long An, Đồng Nai, TP.HCM, Cần Thơ — giá, mặt bằng, điều kiện mua và hỗ trợ vay cho người lao động." as const;

export const NOXH_CATALOG_FAQ_HEADING =
  "Câu hỏi thường gặp về điều kiện mua nhà ở xã hội" as const;

export const NOXH_HANDBOOK_TITLE = "Cẩm nang NOXH" as const;

export const NOXH_HANDBOOK_SEO_TITLE =
  "Cẩm nang NOXH — mua nhà xã hội minh bạch" as const;

/** Meta description riêng — không dùng INTRO dài trên trang. */
export const NOXH_HANDBOOK_SEO_DESCRIPTION =
  "Cẩm nang nhà ở xã hội trên House X: điều kiện mua, hồ sơ, quy trình và vay NOXH — thông tin có căn cứ để bạn kiểm tra trước khi quyết định." as const;

export const NOXH_HANDBOOK_INTRO =
  "Mua nhà ở xã hội cần thông tin có căn cứ — không dựa vào tin đồn hay lời giới thiệu miệng. Cẩm nang này hệ thống hóa tiến độ dự án, khung pháp lý và phương án tài chính từ chuyên gia, giúp bạn chủ động kiểm tra điều kiện, hồ sơ và khả năng vay trước khi quyết định." as const;

/** Mô tả hub chủ đề NOXH — đồng bộ với cẩm nang chính. */
export const NOXH_TOPIC_HUB_INTRO = NOXH_HANDBOOK_INTRO;

/** Bài pillar & cluster — hiển thị trên hub chủ đề NOXH. */
export const NOXH_TOPIC_PILLAR_LINKS = [
  {
    href: articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat"),
    label: "Chọn NOXH đúng cách — bài tổng quan",
  },
  {
    href: articlePath("quy-trinh-mua-thue-mua-noxh-2026"),
    label: "Quy trình mua/thuê mua — 7 bước",
  },
  {
    href: articlePath("dieu-kien-nha-o-mua-noxh-dieu-77-2026"),
    label: "Điều kiện nhà ở — Điều 78",
  },
  {
    href: articlePath("vay-noxh-goi-120000-ty-nhcsxh-2026"),
    label: "Vay gói 120.000 tỷ NHCSXH",
  },
  {
    href: articlePath("chon-noxh-dung-cach-theo-nang-luc"),
    label: "Chọn NOXH đúng cách — đừng mua theo cảm xúc",
  },
  {
    href: articlePath("vi-sao-mua-nha-sai-vi-chay-theo-do-hot"),
    label: "Vì sao mua nhà sai vì chạy theo độ hot?",
  },
  {
    href: articlePath("du-an-hot-suat-nhanh-vi-tri-dep-mat-tinh-tao"),
    label: "Hot, suất nhanh, vị trí đẹp — ba yếu tố mất tỉnh táo",
  },
  {
    href: articlePath("dung-mua-vi-so-mat-co-hoi"),
    label: "Đừng mua vì sợ mất cơ hội",
  },
  {
    href: articlePath("gan-trung-tam-chua-chac-tot-nhat-noxh"),
    label: "Gần trung tâm chưa chắc tốt nhất với NOXH",
  },
  {
    href: articlePath("xa-hon-nhung-di-nhanh-hon-khi-nao-khon-ngoan"),
    label: "Xa hơn nhưng đi nhanh hơn — khi nào khôn ngoan?",
  },
  {
    href: articlePath("nha-xa-ket-noi-tot-dang-mua-hon"),
    label: "Nhà xa nhưng kết nối tốt — có đáng mua hơn?",
  },
  {
    href: articlePath("vung-ven-khong-xau-khong-gian-song-noxh"),
    label: "Vùng ven không xấu — không gian sống NOXH",
  },
  {
    href: articlePath("khi-nao-chon-du-an-hop-tui-tien"),
    label: "Khi nào chọn dự án NOXH hợp túi tiền?",
  },
  {
    href: articlePath("chon-nha-de-o-khac-chon-nha-giu-suat"),
    label: "Chọn nhà để ở vs giữ suất — khác gì?",
  },
  {
    href: articlePath("ba-tieu-chuan-moi-chon-noxh"),
    label: "3 tiêu chuẩn mới chọn NOXH",
  },
  {
    href: articlePath("chi-phi-an-sau-khi-xuong-tien-mua-noxh"),
    label: "Chi phí ẩn sau khi xuống tiền — không chỉ trả tiền nhà",
  },
  {
    href: articlePath("30-phut-di-chuyen-co-phai-mat-mat-noxh"),
    label: "30 phút di chuyển — có phải mất mát?",
  },
  {
    href: articlePath("dta-happy-home-nhon-trach-noi-o-de-so-huu"),
    label: "DTA Happy Home Nhơn Trạch — chọn nơi ở dễ sở hữu",
  },
  {
    href: articlePath("checklist-chot-mua-noxh-tai-chinh-ha-tang-cic"),
    label: "Checklist chốt mua — tài chính, CIC, dự phòng",
  },
  {
    href: articlePath("lam-sao-khong-bi-roi-khi-tim-mua-noxh"),
    label: "Không bị rối khi tìm mua NOXH — tổng kho HouseX",
  },
  {
    href: "/cong-cu/tham-dinh-vay-noxh",
    label: "Bộ công cụ thẩm định vay NOXH",
  },
  {
    href: "/cong-cu/kiem-tra-vay-noxh",
    label: "Kiểm tra nhanh thời hạn vay NOXH (công cụ)",
  },
  {
    href: articlePath("kiem-tra-kha-nang-vay-noxh-60-giay"),
    label: "Vì sao mỗi người có thời hạn vay NOXH khác nhau",
  },
  {
    href: articlePath("tham-dinh-khoan-vay-mua-nha-o-xa-hoi"),
    label: "Thẩm định khoản vay NOXH — tự kiểm tra trước khi nộp hồ sơ",
  },
  {
    href: articlePath("mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong"),
    label: "NOXH có vay ngân hàng được không?",
  },
  {
    href: articlePath("cach-tra-cic-an-toan-truoc-khi-vay"),
    label: "Kiểm tra CIC an toàn trước khi vay",
  },
  {
    href: articlePath("no-xau-nhom-2-vay-mua-nha-o-xa-hoi"),
    label: "Nợ xấu nhóm 2 có vay NOXH được không?",
  },
  {
    href: articlePath("dieu-kien-vay-noxh-theo-tuoi-hon-nhan"),
    label: "Cách tính tuổi vay — độc thân, kết hôn, có con",
  },
  {
    href: articlePath("ho-so-vay-mua-nha-o-xa-hoi"),
    label: "Hồ sơ vay NOXH — checklist đầy đủ",
  },
  {
    href: articlePath("sai-lam-tai-chinh-tuong-du-tien-mua-nha"),
    label: "Sai lầm tài chính — tưởng đủ tiền mua nhà",
  },
  {
    href: articlePath("checklist-truoc-khi-dat-coc-noxh"),
    label: "Đừng cọc khi chưa kiểm tra vay",
  },
  {
    href: articlePath("sai-lam-tin-moi-gioi-chac-vay-noxh"),
    label: "Sai lầm khi tin “chắc chắn vay được”",
  },
  {
    href: articlePath("vay-noxh-can-thu-nhap-bao-nhieu"),
    label: "Thu nhập vay NOXH — bao nhiêu là phù hợp?",
  },
  {
    href: articlePath("dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat"),
    label: "Điều kiện thu nhập mua NOXH",
  },
  {
    href: "/cong-cu/dieu-kien-noxh",
    label: "Công cụ kiểm tra điều kiện",
  },
  {
    href: NOXH_CATALOG_PATH,
    label: "Danh mục dự án NOXH",
  },
] as const;

/** Alt banner danh mục NOXH. */
export const NOXH_CATALOG_BANNER_ALT =
  "Khu căn hộ nhà ở xã hội — danh mục dự án miền Nam trên HouseX" as const;
