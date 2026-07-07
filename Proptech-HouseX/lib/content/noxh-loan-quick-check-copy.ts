/** Copy landing lead magnet — kiểm tra nhanh thời hạn vay NOXH. */

import { noxhLoanClusterArticleLinks } from "@/lib/content/articles/noxh-loan-cluster-map-2026";

export const NOXH_LOAN_QUICK_COPY = {
  metaTitle: "Kiểm tra nhanh thời hạn vay NOXH | HouseX",
  metaDescription:
    "Ước tính tuổi cuối kỳ vay theo năm sinh — biết sớm thời hạn vay NOXH có khả thi hay không, trước khi nộp hồ sơ hoặc đặt cọc. Miễn phí, không thay thế ngân hàng.",
  kicker: "HouseX · Kiểm tra sơ bộ",
  title: "Kiểm tra nhanh thời hạn vay mua nhà ở xã hội",
  subtitle:
    "Biết sớm thời hạn vay áp dụng với bạn — trước khi mất thời gian, tiền đặt cọc, hoặc kỳ vọng sai từ môi giới hay chủ đầu tư.",
  heroCta: "Bắt đầu kiểm tra",
  heroCtaHref: "#kiem-tra",
  faqHeading: "Câu hỏi thường gặp",
} as const;

export const NOXH_LOAN_QUICK_HELP = [
  {
    title: "Biết sớm thời hạn vay",
    desc: "Ước tính tuổi hiện tại và tuổi cuối kỳ vay — yếu tố ngân hàng xét rất sớm khi thẩm định hồ sơ.",
  },
  {
    title: "Không phán duyệt — chỉ gợi ý hướng đi",
    desc: "Kết quả mang tính tham khảo. Điều kiện NOXH còn phụ thuộc đối tượng, thu nhập, CIC và hồ sơ pháp lý.",
  },
  {
    title: "Đồng hành, không thúc ép",
    desc: "Checklist tiếp theo giúp bạn tự trang bị — hoặc để lại thông tin nếu muốn chuyên gia HouseX rà soát miễn phí.",
  },
] as const;

export const NOXH_LOAN_QUICK_CHECKLIST = [
  { item: "Kiểm tra nhanh thời hạn vay NOXH", href: "/tin-tuc/kiem-tra-kha-nang-vay-noxh-60-giay" },
  { item: "Điều kiện đối tượng NOXH (Điều 76 Luật Nhà ở 2023)", href: "/cong-cu/dieu-kien-noxh" },
  { item: "Thu nhập và trần NOXH (NĐ 136/2026)", href: "/tin-tuc/vay-noxh-can-thu-nhap-bao-nhieu" },
  { item: "Tra CIC trên cic.gov.vn hoặc CIC Credit Connect", href: "/tin-tuc/cach-tra-cic-an-toan-truoc-khi-vay" },
  { item: "Tính hạn mức vay theo thu nhập hộ", href: "/cong-cu/tinh-han-muc-vay" },
  { item: "Tình trạng hôn nhân & nghĩa vụ nợ vợ/chồng", href: "/tin-tuc/vay-noxh-vo-chong-dong-vay-cic" },
  { item: "Giấy tờ chứng minh thu nhập và hợp đồng mua/thuê mua", href: "/tin-tuc/ho-so-vay-mua-nha-o-xa-hoi" },
  { item: "Dòng tiền & quỹ dự phòng — tránh tưởng đủ tiền mua nhà", href: "/tin-tuc/sai-lam-tai-chinh-tuong-du-tien-mua-nha" },
] as const;

export const NOXH_LOAN_QUICK_FAQ = [
  {
    q: "Công cụ này có thay thế quyết định ngân hàng không?",
    a: "Không. Đây chỉ là sàng lọc sơ bộ về tuổi vay và hướng dẫn chuẩn bị. Ngân hàng còn xét thu nhập, CIC, nghĩa vụ nợ, tài sản đảm bảo và điều kiện NOXH.",
  },
  {
    q: "Tại sao cần kiểm tra thời hạn vay trước?",
    a: "Mỗi người có tuổi cuối kỳ vay khác nhau — không phải ai cũng vay được 20–30 năm như môi giới thường nói. Biết sớm giúp bạn lập kế hoạch trả góp đúng, tránh đặt cọc khi chưa rõ khung thời gian vay.",
  },
  {
    q: "Tôi sinh năm X, vay được đến bao nhiêu tuổi?",
    a: "Thông lệ phổ biến: từ 18 tuổi và không quá khoảng 75 tuổi tại thời điểm kết thúc khoản vay (tham chiếu Vietcombank và đa số ngân hàng). NOXH thường vay 15–20 năm.",
  },
  {
    q: "CIC là gì và tra ở đâu an toàn?",
    a: "CIC (Trung tâm Thông tin Tín dụng Quốc gia) lưu lịch sử tín dụng. Bạn tra thông tin của chính mình qua website hoặc ứng dụng CIC Credit Connect — kênh chính thống, không qua bên thứ ba lạ.",
  },
  {
    q: "Môi giới nói “chắc vay được” — có tin không?",
    a: "Không nên dựa vào lời hứa miệng. Chỉ ngân hàng mới quyết định hạn mức sau khi thẩm định hồ sơ. Nên tự rà CIC và hạn mức trước khi đặt cọc.",
  },
  {
    q: "Khi nào nên gặp chuyên gia HouseX?",
    a: "Khi kết quả “cần kiểm tra thêm”, có nợ xấu, thu nhập sát trần NOXH, hoặc sắp đặt cọc mà chưa rõ CIC — chuyên gia giúp rà soát miễn phí, không thay thế ngân hàng.",
  },
] as const;

export const NOXH_LOAN_QUICK_ARTICLE_LINKS = [
  { href: "/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi", label: "Pillar — Tự kiểm tra trước khi nộp hồ sơ" },
  ...noxhLoanClusterArticleLinks(),
  { href: "/tin-tuc/vay-noxh-vo-chong-dong-vay-cic", label: "Vợ/chồng đồng vay & CIC" },
] as const;
