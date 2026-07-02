import {
  housexNoxhServiceFaqs,
  noxhEligibilityFaq,
} from "@/lib/content/noxh-editorial";
import type { NoxhLandingDef } from "@/lib/preview/_noxh-landing-factory";

type EditorialPatch = Pick<
  NoxhLandingDef,
  | "description"
  | "heroSubtitle"
  | "seoDesc"
  | "locationNotes"
  | "highlights"
  | "faqs"
>;

/** Slug constants — tránh import vòng từ noxh-long-an-projects. */
const SLUG = {
  laHome: "noxh-la-home-luong-hoa-ben-luc",
  myHanh: "nha-o-xa-hoi-my-hanh-duc-hoa",
  ori: "the-ori-phuong-mai-my-hanh",
  hauNghia: "noxh-kdt-hau-nghia-duc-hoa",
  pvt: "noxh-kdt-phuoc-vinh-tay-can-giuoc",
  phuAn: "noxh-phu-an-thanh-ben-luc",
} as const;

/** Nội dung biên tập chuẩn proptech: mở đoạn ngữ cảnh, số liệu có nguồn, FAQ Q&A SEO. */
const PATCHES: Record<string, EditorialPatch> = {
  [SLUG.laHome]: {
    heroSubtitle:
      "400 căn NOXH · Block A–B 8 tầng · ~14–17 tr/m² · KĐT sinh thái 100 ha · bàn giao 12/2026",
    seoDesc:
      "NOXH LA Home Bến Lức: 400 căn Prodezi, giá từ ~385 triệu, vay NHCSXH 70%. HouseX tra cứu pháp lý & tính vay.",
    description: `Nhà ở xã hội LA Home do Công ty CP Prodezi Long An phát triển tại Khu đô thị sinh thái LA Home, xã Lương Hòa, huyện Bến Lức — đây là dự án NOXH đầu tiên khởi công tại Long An năm 2025, đáp ứng nhu cầu an cư của lao động vùng cửa ngõ TP.HCM.

Theo thông tin CĐT, phân khu gồm 2 block cao 8 tầng với 400 căn hộ diện tích 30–62 m², giá tham chiếu khoảng 14–17 triệu đồng/m² (từ ~385 triệu/căn). Dự án đã cất nóc (4/2026) và dự kiến bàn giao tháng 12/2026. Người mua NOXH có thể cân nhắc vay NHCSXH tối đa 70% theo gói tín dụng 120.000 tỷ — HouseX hỗ trợ tính toán dòng tiền trước khi nộp hồ sơ.`,
    locationNotes: `Nhà ở xã hội LA Home nằm trong Khu đô thị sinh thái LA Home (lô 8C, xã Lương Hòa), huyện Bến Lức, Long An — vị trí cửa ngõ giáp ranh TP.HCM, đối diện Khu công nghiệp Prodezi, thuận tiện cho công nhân và người lao động khu vực.

Theo Prodezi và website khudothilahome.vn, KĐT quy mô khoảng 100 ha với mật độ xây dựng ~31% và 20% diện tích cảnh quan mặt nước. Phân khu NOXH trên diện tích 7.103 m² gồm Block A và Block B cao 8 tầng, khởi công tháng 3/2025.

Về kết nối giao thông, cư dân tương lai hưởng lợi từ Đại lộ Lương Hòa–Bình Chánh, cao tốc Bến Lức–Long Thành, Vành đai 3 và tuyến Võ Văn Kiệt nối dài — các trục này được kỳ vọng gia tăng giá trị an cư dài hạn cho khu vực ven TP.HCM.`,
    highlights: [
      {
        title: "Quy mô 400 căn — phù hợp lao động KCN?",
        text: "Hai block 8 tầng, diện tích 30–62 m²; NOXH đầu tiên khởi công Long An 2025, phục vụ hơn 1.200 lao động vùng KCN Prodezi liền kề.",
      },
      {
        title: "Mức giá gốc cạnh tranh ~14–17 triệu/m²?",
        text: "Giá CĐT tham chiếu từ ~385 triệu đến ~800 triệu/căn. Với vay NHCSXH 70%, vốn tự có ban đầu có thể chỉ từ khoảng 115 triệu (tùy diện tích) — dùng công cụ tính vay trên HouseX để ước lượng.",
      },
      {
        title: "Tiện ích KĐT sinh thái 100 ha?",
        text: "Công viên trung tâm ~2,2 ha, trung tâm y tế 0,5 ha, trường liên cấp 4,3 ha và khu thể thao 1 ha — hạ tầng đồng bộ, không chỉ riêng block NOXH.",
      },
      {
        title: "Chủ đầu tư và tiến độ thi công?",
        text: "Prodezi Long An (Hướng Việt Holdings phát triển, Coteccons thi công). Đã cất nóc 4/2026; bàn giao dự kiến 12/2026. GPXD và chủ trương đầu tư đã có.",
      },
    ],
    faqs: [
      {
        q: "Nhà ở xã hội LA Home nằm ở đâu?",
        a: "Trong KĐT sinh thái LA Home, xã Lương Hòa, huyện Bến Lức, Long An — cửa ngõ kết nối TP.HCM và vùng miền Tây, đối diện KCN Prodezi.",
      },
      {
        q: "Giá nhà ở xã hội LA Home bao nhiêu?",
        a: "Tham chiếu CĐT khoảng 14–17 triệu/m²; căn từ ~385 triệu (30 m²) đến ~800 triệu (62 m²). Giá chính thức theo bảng niêm yết từng đợt mở bán Sở Xây dựng.",
      },
      {
        q: "LA Home bàn giao khi nào?",
        a: "Dự kiến tháng 12/2026. Theo thông tin Prodezi, dự án đã cất nóc sớm tháng 4/2026.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội LA Home"),
    ],
  },

  [SLUG.myHanh]: {
    heroSubtitle:
      "166 căn 1PN · Bee Home LA · ~31,4 tr/m² · gần QL1A · bàn giao 12/2026",
    seoDesc:
      "NOXH Mỹ Hạnh Đức Hòa: 166 căn 1PN 31–34 m², Bee Home Long An. HouseX tư vấn điều kiện & tính vay NHCSXH.",
    description: `Nhà ở xã hội Mỹ Hạnh (tên thương mại Bee Home LA) do Công ty CP Đầu tư Thương mại Bee Home Long An phát triển tại xã Mỹ Hạnh Nam, huyện Đức Hòa — thuộc vùng giáp ranh TP.HCM đang thu hút nguồn cung NOXH cho công nhân và hộ gia đình trẻ.

Theo công bố Sở Xây dựng (2026), dự án gồm một tòa chung cư 12 tầng với 166 căn một phòng ngủ (31–34 m²), giá tạm tính 31,38 triệu đồng/m² (chưa VAT và phí bảo trì), tương đương khoảng 972 triệu – 1,07 tỷ/căn. Khởi công tháng 10/2025, hoàn thành dự kiến tháng 12/2026.`,
    locationNotes: `Bee Home LA tọa lạc Ấp Mới 2, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An — khu vực nằm sát Quốc lộ 1A, thuận tiện di chuyển về TP.HCM và các KCN vùng ven.

Đây là phân khúc NOXH compact một phòng ngủ, phù hợp người độc thân, vợ chồng trẻ hoặc công nhân có nhu cầu nhà ở gần nơi làm việc. Với mức giá trên 31 triệu/m², người mua nên lập kế hoạch vốn tự có và vay NHCSXH sớm — HouseX cung cấp công cụ tính khoản vay và checklist điều kiện NOXH trước mỗi đợt mở bán.`,
    highlights: [
      {
        title: "166 căn 1PN — sản phẩm compact?",
        text: "100% quỹ NOXH; diện tích 31–34 m², thiết kế tối ưu cho công nhân và hộ trẻ tại vùng giáp TP.HCM.",
      },
      {
        title: "Giá công bố ~31,38 triệu/m²?",
        text: "Mức giá Sở Xây dựng 2026 (chưa VAT): ~972 triệu – 1,07 tỷ/căn. So với NOXH nội thành, đây là phân khúc giá cao hơn nhưng vị trí gần QL1A.",
      },
      {
        title: "Chủ đầu tư Bee Home Long An?",
        text: "Bee Home LA là thương hiệu nhà ở xã hội của Bee Home tại Long An; chung cư 12 tầng, khởi công 10/2025.",
      },
    ],
    faqs: [
      {
        q: "Nhà ở xã hội Mỹ Hạnh ở đâu?",
        a: "Ấp Mới 2, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An — thương hiệu Bee Home LA.",
      },
      {
        q: "Giá NOXH Mỹ Hạnh bao nhiêu?",
        a: "31,38 triệu/m² (chưa VAT & bảo trì) theo Sở Xây dựng — căn ~972 triệu – 1,07 tỷ tùy 31–34 m².",
      },
      {
        q: "Mỹ Hạnh có những loại căn nào?",
        a: "Dự án chỉ có loại 1 phòng ngủ 31–34 m² — phù hợp đối tượng NOXH thu nhập thấp và công nhân.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội Mỹ Hạnh"),
    ],
  },

  [SLUG.ori]: {
    heroSubtitle:
      "1.269 căn NOXH · 3 tháp 27 tầng · ~20 tr/m² · Gò Hưu · bàn giao Q3/2027",
    seoDesc:
      "NOXH The Ori Phương Mai: 1.269 căn, ~20 tr/m², Gò Hưu Đức Hòa. HouseX tra pháp lý & tính vay NHCSXH.",
    description: `Nhà ở xã hội The Ori Phương Mai (Khu nhà ở xã hội xã Mỹ Hạnh) do Công ty CP Phương Mai Long An đầu tư tại đường Gò Hưu, xã Mỹ Hạnh Nam — một trong các quỹ NOXH quy mô lớn nhất vùng Mỹ Hạnh với 1.269 căn trên tổng 1.646 căn (377 căn thương mại).

Dự án gồm 3 tháp cao 27 tầng và 1 tầng hầm trên 1,76 ha; khởi công 7/10/2025, bàn giao dự kiến quý III/2027. Giá NOXH tham chiếu khoảng 20 triệu đồng/m² (~570 triệu/căn 50 m²) — mức giá cạnh tranh so với nhà ở thương mại cùng khu vực.`,
    locationNotes: `The Ori Phương Mai nằm trên trục đường Gò Hưu, xã Mỹ Hạnh Nam, huyện Đức Hòa — gần Tỉnh lộ 8, kết nối Củ Chi, Hóc Môn và các tuyến vào TP.HCM.

Khu vực đã hình thành dân cư hiện hữu với tiện ích Bách Hóa Xanh, trạm y tế và công viên Trần Anh. Với quy mô 1.646 căn và vốn đầu tư khoảng 1.638 tỷ đồng, đây là dự án được kỳ vọng cải thiện đáng kể nguồn cung NOXH cho lao động vùng ven TP.HCM.`,
    highlights: [
      {
        title: "1.269 căn NOXH — quy mô lớn vùng Mỹ Hạnh?",
        text: "3 tháp 27 tầng (2 tháp NOXH + 1 tháp thương mại); hầm liên thông, shophouse tầng trệt.",
      },
      {
        title: "Giá dự kiến ~20 triệu/m²?",
        text: "Tham chiếu ~570 triệu/căn 50 m² — thấp hơn nhiều so với NOXH Mỹ Hạnh Bee Home cùng vùng. Giá chính thức theo đợt mở bán.",
      },
      {
        title: "Phương Mai Long An — tiến độ ra sao?",
        text: "Khởi công 7/10/2025; bàn giao dự kiến Q3/2027. Chấp thuận NOXH đã có; GPXD đang hoàn thiện.",
      },
    ],
    faqs: [
      {
        q: "The Ori Phương Mai nằm ở đâu?",
        a: "Đường Gò Hưu, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An — gần Tỉnh lộ 8.",
      },
      {
        q: "Quy mô NOXH The Ori Phương Mai?",
        a: "1.646 căn tổng, trong đó 1.269 căn NOXH; 3 tháp cao 27 tầng trên 1,76 ha.",
      },
      {
        q: "Giá NOXH The Ori Phương Mai dự kiến?",
        a: "Tham chiếu ~20 triệu/m² (~570 triệu/căn 50 m²). Bảng giá chính thức công bố khi mở bán.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội The Ori Phương Mai"),
    ],
  },

  [SLUG.hauNghia]: {
    heroSubtitle:
      "Masterplan 6.399 căn · Green Nestera 1.467 căn · Vinhomes Green City",
    seoDesc:
      "NOXH Hậu Nghĩa: 6.399 căn quy hoạch, Green Nestera đang xây. HouseX tư vấn NOXH & tính vay NHCSXH.",
    description: `Nhà ở xã hội thuộc Khu đô thị mới Hậu Nghĩa – Đức Hòa do Công ty CP Phát triển Thành phố Xanh làm chủ đầu tư — quy hoạch 16 ha với 6.399 căn NOXH, một trong các quỹ nhà ở xã hội lớn nhất Long An.

Giai đoạn đầu Green Nestera (MIK Group phát triển trong Vinhomes Green City ~192 ha) gồm 8 tháp 8 tầng, 1.467 căn 52–65 m², khởi công tháng 12/2025. Người mua có thể hưởng tiện ích đại đô thị: hồ sinh thái, Vincom và hạ tầng đồng bộ — mô hình tương tự các KĐT tổng thể chuyên nghiệp trên thị trường.`,
    locationNotes: `Khu NOXH Hậu Nghĩa tọa lạc trên đường Nguyễn Thị Hạnh, thuộc KĐT Vinhomes Green City (xã Hậu Nghĩa, huyện Đức Hòa) — cửa ngõ khu đô thị quy mô ~192 ha.

Phân khu Green Nestera là giai đoạn NOXH đầu tiên được triển khai: 8 tháp, 1.467 căn, vốn đầu tư khoảng 900 tỷ đồng. Masterplan tổng 6.399 căn sẽ được phát triển theo lộ trình — phù hợp nhu cầu an cư dài hạn của lao động vùng ven TP.HCM và các KCN Long An.`,
    highlights: [
      {
        title: "Masterplan 6.399 căn — quỹ NOXH lớn?",
        text: "Quy hoạch 16 ha theo kế hoạch tỉnh Long An; một trong những nguồn cung NOXH đáng chú ý nhất khu vực.",
      },
      {
        title: "Green Nestera — giai đoạn 1 đang triển khai?",
        text: "8 tháp 8 tầng, 1.467 căn 52–65 m²; khởi công 12/2025; giá tham chiếu ~20 triệu/m².",
      },
      {
        title: "Trong Vinhomes Green City ~192 ha?",
        text: "Hưởng hạ tầng đại đô thị: hồ sinh thái, TTTM Vincom (quy hoạch), công viên nội khu.",
      },
    ],
    faqs: [
      {
        q: "NOXH Hậu Nghĩa có bao nhiêu căn?",
        a: "Masterplan 6.399 căn NOXH trên 16 ha. Giai đoạn Green Nestera đang xây: 1.467 căn.",
      },
      {
        q: "Green Nestera là gì?",
        a: "Phân khu NOXH đầu tiên trong Vinhomes Green City Hậu Nghĩa, do MIK Group phát triển.",
      },
      {
        q: "Giá NOXH Hậu Nghĩa dự kiến?",
        a: "Green Nestera tham chiếu ~20 triệu/m². Giá chính thức theo từng đợt mở bán.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội KĐT mới Hậu Nghĩa"),
    ],
  },

  [SLUG.pvt]: {
    heroSubtitle:
      "13.440 căn NOXH · đại đô thị ~1.090 ha · Vinhomes–VIG · sắp mở bán",
    seoDesc:
      "NOXH Phước Vĩnh Tây: 13.440 căn, KĐT ~1.090 ha Cần Giuộc. HouseX cập nhật tiến độ & đăng ký nhận tin.",
    description: `Nhà ở xã hội thuộc Khu đô thị mới Phước Vĩnh Tây (Cần Giuộc, Long An) — dự án đại quy mô ~1.090 ha do liên danh Vinhomes và VIG phát triển, quy hoạch 13.440 căn hộ NOXH chung cư cao 10 tầng.

Dự án đang giai đoạn hoàn thiện hồ sơ quy hoạch, GPMB và hạ tầng; dự kiến hoàn thiện masterplan đến năm 2030. Đây là nguồn cung NOXH tiềm năng lớn cho lao động khu vực cảng, logistics phía Nam Long An — người quan tâm nên đăng ký nhận tin qua HouseX để cập nhật đợt mở bán đầu tiên.`,
    locationNotes: `KĐT mới Phước Vĩnh Tây tại xã Phước Vĩnh Tây, huyện Cần Giuộc — quy mô ~1.090 ha, vốn đầu tư khoảng 80.000 tỷ đồng, liên danh Vinhomes & VIG.

Theo báo cáo ĐTM: 13.440 căn NOXH (tháp 10 tầng), 15.244 lô thương mại và 2.370 căn tái định cư; quy mô dân số dự kiến ~90.000 người. Vị trí thuận lợi cho lao động ngành cảng, logistics và KCN vùng ven TP.HCM.`,
    highlights: [
      {
        title: "13.440 căn NOXH — siêu quy mô miền Nam?",
        text: "Một trong các quỹ NOXH lớn nhất được quy hoạch; chung cư cao 10 tầng theo masterplan.",
      },
      {
        title: "Đại đô thị ~1.090 ha Vinhomes–VIG?",
        text: "Kết hợp nhà thương mại, tái định cư và hạ tầng đồng bộ — mô hình phát triển tổng thể.",
      },
      {
        title: "Trạng thái hiện tại?",
        text: "Đang quy hoạch/ĐTM và GPMB — chưa mở bán cụ thể. Đăng ký nhận tin qua HouseX.",
      },
    ],
    faqs: [
      {
        q: "NOXH Phước Vĩnh Tây ở đâu?",
        a: "Xã Phước Vĩnh Tây, huyện Cần Giuộc, Long An — KĐT mới Vinhomes–VIG.",
      },
      {
        q: "Bao nhiêu căn NOXH được quy hoạch?",
        a: "13.440 căn hộ chung cư NOXH (10 tầng) theo quy hoạch đã công bố.",
      },
      {
        q: "Khi nào mở bán NOXH Phước Vĩnh Tây?",
        a: "Chưa có lịch mở bán cụ thể; dự án đang triển khai hạ tầng. Đăng ký nhận tin trên HouseX.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội KĐT mới Phước Vĩnh Tây"),
    ],
  },

  [SLUG.phuAn]: {
    heroSubtitle:
      "Quy hoạch ~1.100 căn · nhà ở công nhân KCN · TL830 Bến Lức",
    seoDesc:
      "NOXH Phú An Thạnh Bến Lức: ~1.100 căn công nhân, cạnh KCN 1.002 ha. HouseX tư vấn điều kiện NOXH.",
    description: `Nhà ở xã hội / nhà ở công nhân Phú An Thạnh thuộc masterplan Khu công nghiệp Phú An Thạnh (~1.002 ha) tại Tỉnh lộ 830, xã An Thạnh, huyện Bến Lức — do Công ty TNHH MTV Phú An Thạnh – Long An phát triển từ năm 2008.

Quy hoạch khu dân cư ~29 ha phục vụ chuyên gia và công nhân KCN, mục tiêu khoảng 1.100 căn nhà ở. Giai đoạn đầu đã triển khai các khu thấp tầng; quỹ NOXH/chung cư sẽ mở rộng theo tiến độ phát triển KCN — phù hợp nhu cầu an cư bám sát nơi làm việc.`,
    locationNotes: `Khu nhà ở chuyên gia – công nhân Phú An Thạnh nằm trên Tỉnh lộ 830, trong masterplan KCN Phú An Thạnh (~1.002 ha), huyện Bến Lức.

Cách cao tốc TP.HCM–Trung Lương khoảng 3 km và Quốc lộ 1A khoảng 6 km — thuận tiện cho lao động KCN di chuyển về TP.HCM. Mô hình nhà ở gắn KCN đang là xu hướng tại Long An nhằm giữ chân nguồn nhân lực vùng công nghiệp.`,
    highlights: [
      {
        title: "Quy hoạch ~1.100 căn công nhân?",
        text: "Phục vụ chuyên gia và CN KCN Phú An Thạnh — nhu cầu an cư bám sát nơi làm việc.",
      },
      {
        title: "KCN 1.002 ha liền kề?",
        text: "Hạ tầng KCN đồng bộ; thuận tiện cho người lao động, giảm chi phí di chuyển.",
      },
      {
        title: "Tiến độ triển khai?",
        text: "Giai đoạn thấp tầng đã có; quỹ NOXH mở rộng theo masterplan. Đăng ký nhận tin qua HouseX.",
      },
    ],
    faqs: [
      {
        q: "NOXH Phú An Thạnh ở đâu?",
        a: "Tỉnh lộ 830, xã An Thạnh, huyện Bến Lức, Long An — trong KCN Phú An Thạnh.",
      },
      {
        q: "Quy mô bao nhiêu căn?",
        a: "Quy hoạch mục tiêu ~1.100 căn nhà ở công nhân/chuyên gia; chi tiết từng giai đoạn theo tiến độ CĐT.",
      },
      {
        q: "Phú An Thạnh đã mở bán NOXH chưa?",
        a: "Một số giai đoạn thấp tầng đã triển khai; quỹ NOXH/chung cư mở rộng theo kế hoạch. Liên hệ HouseX để cập nhật.",
      },
      noxhEligibilityFaq("Long An"),
      ...housexNoxhServiceFaqs("Nhà ở xã hội Phú An Thạnh"),
    ],
  },
};

/** Áp dụng lớp biên tập proptech lên định nghĩa landing NOXH. */
export function applyNoxhEditorial(def: NoxhLandingDef): NoxhLandingDef {
  const patch = PATCHES[def.slug];
  if (!patch) return def;
  return { ...def, ...patch };
}
