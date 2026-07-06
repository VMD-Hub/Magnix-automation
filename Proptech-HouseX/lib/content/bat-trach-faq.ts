import type { RichFaqItem } from "@/lib/content/faq-content";

/** FAQ — xem hướng nhà Bát trạch (AIO / FAQPage). */
export const BAT_TRACH_FAQ: RichFaqItem[] = [
  {
    q: "Cách xem hướng nhà hợp tuổi theo Bát trạch như thế nào?",
    blocks: [
      {
        type: "p",
        text: "Phong thủy Bát trạch xác định hướng nhà hợp tuổi dựa trên cung phi (quái số) của gia chủ — người đứng ra làm nhà. Chỉ cần năm sinh âm lịch và giới tính là tính được cung mệnh, từ đó suy ra 4 hướng tốt và 4 hướng xấu.",
      },
      {
        type: "ul",
        items: [
          "Bước 1: Nhập năm sinh âm lịch và giới tính của gia chủ vào công cụ phía trên.",
          "Bước 2: Công cụ tính quái số và cung mệnh (Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài).",
          "Bước 3: Xác định bạn thuộc Đông tứ mệnh hay Tây tứ mệnh.",
          "Bước 4: Đọc sơ đồ la bàn 8 hướng — 4 hướng cát (xanh) nên dùng cho cửa, giường, bàn thờ; 4 hướng hung (đỏ) nên đặt bếp, nhà vệ sinh.",
        ],
      },
    ],
  },
  {
    q: "Đông tứ mệnh và Tây tứ mệnh khác nhau ra sao?",
    blocks: [
      {
        type: "p",
        text: "Tám cung mệnh được chia thành hai nhóm. Người Đông tứ mệnh hợp với Đông tứ trạch, người Tây tứ mệnh hợp với Tây tứ trạch.",
      },
      {
        type: "ul",
        items: [
          "Đông tứ mệnh gồm 4 cung: Khảm, Ly, Chấn, Tốn — hợp 4 hướng Bắc, Nam, Đông, Đông Nam.",
          "Tây tứ mệnh gồm 4 cung: Càn, Khôn, Cấn, Đoài — hợp 4 hướng Tây, Tây Nam, Tây Bắc, Đông Bắc.",
          "Người thuộc nhóm nào nên chọn hướng nhà, hướng cửa chính thuộc nhóm đó để được cát.",
        ],
      },
    ],
  },
  {
    q: "4 hướng tốt và 4 hướng xấu trong Bát trạch có ý nghĩa gì?",
    blocks: [
      {
        type: "p",
        text: "Mỗi cung mệnh có 8 du niên (sao) tương ứng 8 hướng — 4 cát và 4 hung, xếp theo mức độ mạnh yếu.",
      },
      {
        type: "ul",
        items: [
          "Sinh Khí (đại cát): tài lộc, thăng tiến, công danh — hợp cửa chính, bàn làm việc.",
          "Thiên Y (đại cát): sức khỏe, quý nhân — hợp giường ngủ, hướng bếp.",
          "Diên Niên (cát): hòa thuận, hôn nhân, quan hệ — hợp phòng ngủ vợ chồng.",
          "Phục Vị (tiểu cát): ổn định, thi cử, bình an — hợp bàn thờ, bàn học.",
          "Họa Hại, Lục Sát, Ngũ Quỷ, Tuyệt Mệnh (hung): nên đặt bếp, nhà vệ sinh, nhà kho để 'tọa hung hướng cát'.",
        ],
      },
    ],
  },
  {
    q: "Vợ và chồng khác nhóm mệnh thì chọn hướng nhà theo ai?",
    blocks: [
      {
        type: "p",
        text: "Theo Bát trạch truyền thống, hướng nhà và cửa chính thường lấy theo cung mệnh của người trụ cột kinh tế hoặc người đứng tên xây/mua nhà (thường là gia chủ nam). Khi hai vợ chồng khác nhóm mệnh, có thể dung hòa như sau:",
      },
      {
        type: "ul",
        items: [
          "Cửa chính, hướng nhà: ưu tiên theo gia chủ.",
          "Phòng ngủ, đầu giường, bàn làm việc riêng: bố trí theo cung mệnh từng người.",
          "Tính riêng cung mệnh cho từng thành viên bằng công cụ phía trên để bố trí không gian cá nhân.",
        ],
      },
    ],
  },
  {
    q: "Sinh vào dịp gần Tết thì lấy năm âm lịch nào để tính?",
    blocks: [
      {
        type: "p",
        text: "Bát trạch dùng năm sinh âm lịch. Người sinh trong khoảng đầu tháng 1 đến trước Tết Nguyên đán dương lịch vẫn thuộc năm âm lịch trước đó, nên cần lùi 1 năm khi nhập.",
      },
      {
        type: "ul",
        items: [
          "Ví dụ: sinh ngày 20/01/2000 (dương lịch) — trước Tết Canh Thìn — thì tính theo năm âm lịch 1999 (Kỷ Mão).",
          "Nếu không chắc ngày Tết năm sinh, hãy tra lịch vạn niên trước khi nhập để có kết quả chính xác.",
        ],
      },
    ],
  },
  {
    q: "Kết quả xem hướng nhà có chính xác tuyệt đối không?",
    blocks: [
      {
        type: "p",
        text: "Công cụ tính theo phương pháp Bát trạch minh cảnh (cung phi bát trạch) được dùng phổ biến, cho kết quả nhất quán về cung mệnh và 8 hướng. Tuy nhiên đây là tri thức phong thủy mang tính tham khảo văn hóa, tín ngưỡng — không phải cơ sở khoa học.",
      },
      {
        type: "ul",
        items: [
          "Chọn nhà thực tế nên cân nhắc thêm công năng, ánh sáng, thông gió, giao thông và pháp lý.",
          "Một số trường phái (Huyền không phi tinh, Bát trạch có sao niên) có thể cho luận giải chi tiết hơn theo năm.",
          "Với quyết định lớn, nên tham khảo chuyên gia phong thủy và đội ngũ House X để chọn dự án, căn hộ hợp hướng.",
        ],
      },
    ],
  },
];
