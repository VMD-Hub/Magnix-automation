import type { RichFaqItem } from "@/lib/content/faq-content";

/** Câu hỏi thường gặp — kiểm tra điều kiện mua NOXH (AIO / FAQPage). */
export const NOXH_ELIGIBILITY_FAQ: RichFaqItem[] = [
  {
    q: "Ai được mua nhà ở xã hội theo quy định mới nhất?",
    blocks: [
      {
        type: "p",
        text: "Để được mua hoặc thuê mua căn nhà ở xã hội (NOXH) do chủ đầu tư bán, bạn phải thuộc một trong các nhóm đối tượng tại Điều 76 Luật Nhà ở 2023 (27/2023/QH15) và đồng thời đáp ứng điều kiện về nhà ở, thu nhập tại Điều 78 cùng Luật (chi tiết tại Nghị định 100/2024/NĐ-CP).",
      },
      {
        type: "p",
        text: "Theo khoản 1 Điều 78, các nhóm sau được mua hoặc thuê mua NOXH khi đủ điều kiện: khoản 1, 4, 5, 6, 7, 8, 9 và 10 Điều 76. Các nhóm còn lại được hưởng chính sách theo hình thức khác (tự xây, tặng cho, thuê…).",
      },
      {
        type: "legal",
        cite: "Điều 76 Luật Nhà ở 2023 (27/2023/QH15) — Đối tượng được hưởng chính sách hỗ trợ về nhà ở xã hội",
        text: [
          "1. Người có công với cách mạng, thân nhân liệt sĩ thuộc trường hợp được hỗ trợ cải thiện nhà ở theo quy định của Pháp lệnh Ưu đãi người có công với cách mạng.",
          "2. Hộ gia đình nghèo, cận nghèo tại khu vực nông thôn.",
          "3. Hộ gia đình nghèo, cận nghèo tại khu vực nông thôn thuộc vùng thường xuyên bị ảnh hưởng bởi thiên tai, biến đổi khí hậu.",
          "4. Hộ gia đình nghèo, cận nghèo tại khu vực đô thị.",
          "5. Người thu nhập thấp tại khu vực đô thị.",
          "6. Công nhân, người lao động đang làm việc tại doanh nghiệp, hợp tác xã, liên hiệp hợp tác xã trong và ngoài khu công nghiệp.",
          "7. Sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan thuộc lực lượng vũ trang nhân dân, công nhân công an, công chức, công nhân và viên chức quốc phòng đang phục vụ tại ngũ; người làm công tác cơ yếu, người làm công tác khác trong tổ chức cơ yếu hưởng lương từ ngân sách nhà nước đang công tác.",
          "8. Cán bộ, công chức, viên chức theo quy định của pháp luật về cán bộ, công chức, viên chức.",
          "9. Đối tượng đã trả lại nhà ở công vụ theo quy định tại khoản 4 Điều 125 của Luật này, trừ trường hợp bị thu hồi nhà ở công vụ do vi phạm quy định của Luật này.",
          "10. Hộ gia đình, cá nhân thuộc trường hợp bị thu hồi đất và phải giải tỏa, phá dỡ nhà ở theo quy định của pháp luật mà chưa được Nhà nước bồi thường bằng nhà ở, đất ở.",
          "11. Học sinh, sinh viên đại học, học viện, trường đại học, cao đẳng, dạy nghề, trường chuyên biệt theo quy định của pháp luật; học sinh trường dân tộc nội trú công lập.",
          "12. Doanh nghiệp, hợp tác xã, liên hiệp hợp tác xã trong khu công nghiệp.",
        ].join("\n"),
      },
      {
        type: "ul",
        items: [
          "Khoản 5, 6, 8 (người thu nhập thấp, công nhân KCN, CBCCVC): phải đáp ứng trần thu nhập Điều 30 NĐ 100/2024 (hiện 25 / 35 / 50 triệu/tháng theo NĐ 136/2026, hiệu lực 07/4/2026).",
          "Khoản 7 (lực lượng vũ trang, cơ yếu): không dùng bảng 25/35/50 triệu — xác nhận thu nhập theo Điều 67 NĐ 100/2024 và mẫu đơn vị BQP/BCA.",
          "Khoản 1, 2, 3, 4, 9, 10: được miễn trần thu nhập Điều 30 k1 — dùng giấy chứng nhận đối tượng (NCC, hộ nghèo, quyết định thu hồi đất…) thay Mẫu xác nhận thu nhập dân sự.",
          "Khoản 11: được thuê nhà ở xã hội trong thời gian học tập — không phải đối tượng mua/thuê mua căn NOXH thương mại.",
          "Khoản 12: được thuê nhà lưu trú công nhân trong KCN để cho lao động thuê lại — không phải đối tượng mua căn cá nhân.",
        ],
      },
      {
        type: "p",
        text: "Văn bản gốc: Luật Nhà ở 2023 trên Cổng Thông tin Chính phủ (vanban.chinhphu.vn, docid 209627). Bạn có thể tự rà soát sơ bộ bằng công cụ kiểm tra phía trên trước khi xin giấy xác nhận tại đơn vị hoặc UBND.",
      },
    ],
  },
  {
    q: "Trần thu nhập mua NOXH năm 2026 là bao nhiêu?",
    blocks: [
      {
        type: "p",
        text: "Trần thu nhập chỉ áp dụng cho đối tượng khoản 5, 6 và 8 Điều 76 (người thu nhập thấp tại đô thị, công nhân/người lao động, cán bộ công chức viên chức). Các nhóm khác được miễn trần hoặc dùng cơ chế xác nhận riêng.",
      },
      {
        type: "legal",
        cite: "Điều 30 Nghị định 100/2024/NĐ-CP (sửa đổi bởi NĐ 136/2026/NĐ-CP, hiệu lực 07/4/2026)",
        text: [
          "Người độc thân hoặc chưa kết hôn: thu nhập bình quân thực nhận không quá 25 triệu đồng/tháng.",
          "Người độc thân đang nuôi con dưới tuổi thành niên: không quá 35 triệu đồng/tháng.",
          "Người đã kết hôn: tổng thu nhập bình quân thực nhận của hai vợ chồng không quá 50 triệu đồng/tháng.",
        ].join("\n"),
      },
      {
        type: "ul",
        items: [
          "Cách tính: lấy tổng thu nhập thực nhận 12 tháng liền kề (tiền lương, tiền công theo bảng lương do đơn vị xác nhận), chia 12 — theo Điều 30 NĐ 100/2024.",
          "Giai đoạn trước (NĐ 261/2025): 20 / 30 / 40 triệu từ 10/10/2025 đến 06/04/2026. Từ 07/04/2026 áp dụng mức 25 / 35 / 50 triệu.",
          "UBND cấp tỉnh có thể quy định hệ số điều chỉnh mức thu nhập (không vượt quá tỷ lệ thu nhập bình quân đầu người địa phương so với cả nước) — cần đối chiếu thông báo Sở Xây dựng nơi có dự án.",
          "Lao động tự do, không hợp đồng lao động: xin xác nhận thu nhập tại Công an cấp xã nơi thường trú/tạm trú (theo hướng dẫn NĐ 261/2025).",
        ],
      },
    ],
  },
  {
    q: "Đang có nhà thì có được mua NOXH không?",
    blocks: [
      {
        type: "p",
        text: "Vẫn có thể đủ điều kiện mua NOXH nếu tình trạng nhà ở của bạn (và hộ gia đình) phù hợp Điều 78 khoản 1 điểm a Luật Nhà ở 2023 và Điều 29 Nghị định 100/2024/NĐ-CP.",
      },
      {
        type: "legal",
        cite: "Điều 78 khoản 1 điểm a Luật Nhà ở 2023 — Điều kiện về nhà ở",
        text: [
          "Chưa có nhà ở thuộc sở hữu của mình tại tỉnh, thành phố trực thuộc Trung ương nơi có dự án đầu tư xây dựng nhà ở xã hội đó; hoặc",
          "Đã có nhà ở nhưng diện tích nhà ở bình quân đầu người thấp hơn mức diện tích nhà ở tối thiểu do Chính phủ quy định.",
        ].join("\n"),
      },
      {
        type: "ul",
        items: [
          "Mức diện tích tối thiểu hiện hành: 15 m² sàn/người (Điều 29 NĐ 100/2024, sửa đổi NĐ 136/2026). Ví dụ: hộ 4 người, nhà 50 m² sàn → bình quân 12,5 m²/người → có thể đủ điều kiện.",
          "Chưa được mua hoặc thuê mua nhà ở xã hội (trừ trường hợp chỉ thuê).",
          "Chưa được hưởng chính sách hỗ trợ nhà ở dưới mọi hình thức tại tỉnh/TP nơi có dự án.",
          "Nếu vợ/chồng đứng tên sổ nhà ở tại địa phương có dự án, hộ thường bị loại dù người nộp đơn không đứng tên — cần tra cứu sổ đỏ cả hộ trước khi nộp.",
        ],
      },
      {
        type: "p",
        text: "Mỗi đối tượng (khoản 1, 4, 5, 6, 8, 9, 10 Điều 76) chỉ được mua hoặc thuê mua 01 căn nhà ở xã hội. Đối tượng khoản 7 chỉ được mua hoặc thuê mua 01 căn NOXH hoặc 01 căn nhà ở cho lực lượng vũ trang nhân dân.",
      },
    ],
  },
  {
    q: "Nợ xấu nhóm 2 có ảnh hưởng khi mua NOXH không?",
    blocks: [
      {
        type: "p",
        text: "Nợ xấu và lịch sử tín dụng không nằm trong điều kiện được mua NOXH theo Luật Nhà ở 2023. Tức là bạn vẫn có thể đủ điều kiện về đối tượng, nhà ở và thu nhập dù đang có nợ xấu.",
      },
      {
        type: "p",
        text: "Tuy nhiên, nợ xấu ảnh hưởng trực tiếp đến khả năng được ngân hàng duyệt vay mua NOXH qua Ngân hàng Chính sách xã hội (NHCSXH) hoặc ngân hàng thương mại liên kết — vì điều kiện vay tuân theo quy định pháp luật về tín dụng.",
      },
      {
        type: "ul",
        items: [
          "Nợ xấu nhóm 2 trở lên (CIC): ngân hàng có thể từ chối, giảm hạn mức hoặc yêu cầu người đồng vay.",
          "Dư nợ cao, tỷ lệ trả nợ trên thu nhập (DTI) vượt ngưỡng nội bộ ngân hàng: ảnh hưởng hạn mức vay 70% giá căn.",
          "Hạn mức thẻ tín dụng lớn, khoản vay tiêu dùng chưa tất toán: có thể bị trừ vào khả năng chi trả khi thẩm định.",
        ],
      },
      {
        type: "p",
        text: "HouseX có thể hỗ trợ rà soát hồ sơ tín dụng và lên phương án vốn tự có trước khi bạn nộp hồ sơ mua NOXH — đây là bước chuẩn bị tài chính, tách biệt với điều kiện pháp lý mua nhà.",
      },
    ],
  },
  {
    q: "Kết quả kiểm tra có giá trị pháp lý không?",
    blocks: [
      {
        type: "p",
        text: "Không. Công cụ kiểm tra trên HouseX chỉ là bước sàng lọc sơ bộ dựa trên thông tin bạn khai báo và bộ quy tắc đang áp dụng (Luật Nhà ở 2023, NĐ 100/2024, NĐ 136/2026). Kết quả giúp định hướng trước khi tốn thời gian chuẩn bị hồ sơ.",
      },
      {
        type: "ul",
        items: [
          "Điều kiện chính thức do cơ quan có thẩm quyền xác nhận: đơn vị công tác (thu nhập, đối tượng), UBND cấp xã (hộ nghèo, cư trú), Sở Xây dựng/CĐT (rà soát đợt mở bán).",
          "Thu nhập thực tế có thể khác khi đối chiếu bảng lương 12 tháng, thưởng một lần, hoặc hệ số điều chỉnh của địa phương.",
          "Tình trạng nhà ở phải đối chiếu sổ đỏ, cam kết hộ gia đình và quy định riêng từng đợt mở bán.",
        ],
      },
      {
        type: "p",
        text: "Sau khi tự kiểm tra, bạn nên liên hệ chuyên gia HouseX để hoàn thiện checklist hồ sơ và chọn dự án NOXH phù hợp mức cạnh tranh từng đợt — đặc biệt khi quỹ căn ít mà số hồ sơ đăng ký lớn.",
      },
    ],
  },
];

/** FAQ đối tượng NOXH — gắn landing dự án theo tỉnh/khu vực. */
export function noxhEligibilityFaqForRegion(regionLabel: string): RichFaqItem {
  const base = NOXH_ELIGIBILITY_FAQ[0];
  return {
    q: `Ai được mua nhà ở xã hội tại ${regionLabel}?`,
    blocks: [
      {
        type: "p",
        text: `Tại ${regionLabel}, điều kiện mua NOXH tuân theo Luật Nhà ở 2023 áp dụng thống nhất toàn quốc. Mỗi đợt mở bán do Sở Xây dựng/CĐT rà soát theo đối tượng Điều 76, nhà ở và thu nhập — UBND tỉnh có thể ban hành hệ số điều chỉnh mức thu nhập.`,
      },
      ...base.blocks.slice(1),
    ],
  };
}
