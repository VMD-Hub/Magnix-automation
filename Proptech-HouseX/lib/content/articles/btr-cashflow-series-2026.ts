import { NOXH_TAG_BTR } from "@/lib/content/articles/noxh-handbook-tags";
import type { ArticleDetail } from "@/lib/data/article-types";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import {
  BTR_LEGAL_DISCLAIMER,
  BTR_SUPPORT_CLOSING,
} from "@/lib/content/articles/long-term-rental-editorial-voice";
import { BTR_PILLAR_SLUG } from "@/lib/content/long-term-rental-btr";
import { ID_TOWN_SLUG, ID_TOWN_NAME } from "@/lib/content/id-town-landing";
import {
  EMERALD_68_SLUG,
  EMERALD_BOULEVARD_SLUG,
} from "@/lib/preview/ql13-commercial-mocks";
import { HGX_PROJECT_SLUG } from "@/lib/preview/ho-guom-xanh-mock";

const UPDATED = new Date("2026-08-06T00:00:00.000Z");
const PILLAR_HREF = `/tin-tuc/kien-thuc/${BTR_PILLAR_SLUG}`;
const HUB_HREF = "/tin-tuc/kien-thuc/chu-de/nha-o-cho-thue-dai-han";

const EMERALD_68_NAME = "The Emerald 68 Thuận An";
const EMERALD_BLVD_NAME = "The Emerald Boulevard Thuận An";
const HGX_NAME = "NOXH Hồ Gươm Xanh Thuận An";

/**
 * Nhóm 4 — Dòng vốn, dự án, công thức, thuế (Bài 9–12).
 */
export const BTR_CASHFLOW_SERIES_2026: ArticleDetail[] = [
  {
    id: "article-btr-09-capital",
    slug: "dong-von-dau-tu-can-ho-cho-thue-dai-han-2026",
    title:
      "Dòng vốn dài hạn vào căn hộ cho thuê: Vì sao các quỹ đầu tư quan tâm phân khúc này?",
    excerpt:
      "Quỹ và nhà đầu tư dài hạn nhìn căn hộ cho thuê thế nào — dòng tiền đều thay vì lướt sóng ngắn hạn? Phân tích định tính; không cam kết lợi nhuận.",
    body: `> Dưới lăng kính phân tích tài chính vĩ mô và chiến lược phân bổ tài sản tổ chức, thị trường bất động sản đang chứng kiến một cuộc dịch chuyển trọng tâm. Khi kỷ nguyên đầu cơ “lướt sóng” đất nền hay căn hộ cao cấp chạy theo kỳ vọng tăng giá ngắn hạn dần khép lại trước những biến động của chi phí vốn và rủi ro thanh khoản, dòng tiền của các quỹ đầu tư chuyên nghiệp bắt đầu đổ mạnh hơn vào một phân khúc khác: căn hộ cho thuê dài hạn gắn với nhu cầu ở thực. Đây không đơn thuần là một kênh trú ẩn, mà là chiến lược tối ưu hóa cấu trúc dòng tiền bền vững trong chu kỳ kinh tế mới.

## 1. Bản chất chiến lược: Vì sao dòng vốn tổ chức dịch chuyển từ “đầu cơ giá” sang “khai thác dòng tiền”?

Trong nhiều chu kỳ trước, nhà đầu tư cá nhân thường ưu tiên các tài sản có biên độ tăng giá vốn nhanh nhờ tâm lý đám đông hoặc thông tin hạ tầng kỳ vọng. Tuy nhiên, khi môi trường lãi suất định hình ở mặt bằng mới và thanh khoản thị trường thứ cấp phân hóa mạnh, bài toán phân bổ tài sản buộc phải tuân theo nguyên lý cốt lõi của tài chính doanh nghiệp: giá trị nội tại và khả năng sinh dòng tiền đều đặn (Recurring Cash Flow).

Các quỹ đầu tư và dòng vốn dài hạn nhắm đến phân khúc căn hộ ở thực dựa trên 3 trụ cột giá trị:

- Tính dự báo và ổn định của dòng tiền: Doanh thu từ cho thuê được thu định kỳ theo tháng, quý hoặc năm, tạo ra biên độ dòng tiền mặt (Cash Flow) đều đặn, giúp các quỹ quản trị thanh khoản quỹ và trả lãi suất tức thời mà không phụ thuộc vào việc tài sản có được sang nhượng hay không.
- Hệ số neo vào kinh tế thực: Phân khúc căn hộ phục vụ nhu cầu ở thật gắn liền với hệ sinh thái việc làm, đô thị hóa và các tiện ích hạ tầng hiện hữu (như tuyến metro, khu công nghiệp, trung tâm thương mại), giúp tài sản ít phụ thuộc hơn vào các cơn sóng đầu cơ ngắn hạn.
- Hiệu suất phòng thủ lạm phát: Trong dài hạn, giá trị tài sản nhà ở đô thị và giá thuê có xu hướng điều chỉnh tiệm cận hoặc vượt mức lạm phát, bảo vệ sức mua của nguồn vốn gốc tốt hơn so với một số tài sản tài chính phi vật chất khác.

Nghiên cứu chiều sâu định hướng vĩ mô tại: [Thuê dài hạn đến 2030](${PILLAR_HREF}).

${EDITORIAL_FIGURES.hcmSkyline}

## 2. Phương pháp luận tài chính: Cách các quỹ đọc “Tỷ suất cho thuê” (Rental Yield) thực chiến

Một nhà đầu tư tổ chức hoặc chuyên nghiệp không định giá suất sinh lời chỉ dựa trên những con số “lý thuyết” hay tỷ suất gộp (Gross Yield) được quảng cáo sơ sài trên thị trường. Bài toán định giá dòng tiền chuẩn mực đòi hỏi bóc tách qua các lớp chi phí và biến số vận hành:

| Bước phân tích kỹ thuật | Nội dung cốt lõi trong mô hình tài chính | Mục đích kiểm soát rủi ro |
| --- | --- | --- |
| 1. Trừ chi phí chìm và vận hành | Hạch toán đầy đủ chi phí quản lý vận hành tòa nhà, quỹ bảo trì, thuế thu nhập cá nhân / doanh nghiệp, và tỷ lệ trống phòng (Vacancy Rate) giả định trong năm. | Triệt tiêu ảo tưởng về lợi nhuận gộp; phản ánh chính xác Net Operating Income (NOI). |
| 2. Kiểm định đòn bẩy tài chính (Leverage Check) | Đặt tỷ suất dòng tiền ròng lên bàn cân đối chiếu trực tiếp với chi phí lãi vay (Cost of Debt) khi sử dụng đòn bẩy ngân hàng. | Ngăn chặn tình trạng dòng tiền âm (Negative Carry) khi chi phí vốn vượt quá biên độ sinh lời của tài sản. |
| 3. Định giá dựa trên giao dịch thực (Comparable Market Data) | Chỉ sử dụng dữ liệu lịch sử giao dịch và hợp đồng cho thuê thực tế của khu vực, loại bỏ các mức giá chào thuê phi thực tế trên thị trường tự động. | Đảm bảo mô hình chiết khấu dòng tiền (DCF) phản ánh sát thực tế sức mua của thị trường. |

Khung phương pháp luận chi tiết tham khảo tại: [Bản chất dòng tiền căn hộ cho thuê](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

${EDITORIAL_FIGURES.metroHub}

## 3. Động lực vĩ mô: Khi khung pháp lý và chính sách quốc gia mở đường cho dòng vốn tổ chức

Sự quan tâm của các quỹ đầu tư không phải là ngẫu nhiên, mà là kết quả của sự đồng pha giữa chiến lược phát triển đô thị và sự chuyển dịch khung pháp lý từ Chính phủ:

- Giảm thiểu rủi ro thể chế: Các nghị định, luật sửa đổi gần đây tạo ra hành lang pháp lý rõ ràng hơn cho các mô hình kinh doanh bất động sản dòng tiền, chuẩn hóa mã ngành kinh doanh dịch vụ lưu trú và hoạt động cho thuê chuyên nghiệp (Build-to-Rent).
- Hưởng lợi từ hạ tầng giao thông đô thị (TOD): Sự phát triển của các tuyến đường sắt đô thị (Metro) và các siêu đô thị đa trung tâm hình thành các quỹ đất lớn với mật độ dân cư cao, tạo ra hệ sinh thái thuận lợi cho các dự án căn hộ cho thuê quy mô lớn.
- Xu hướng chủ đạo của thị trường tương lai: Khi tỷ lệ sở hữu nhà của thế hệ trẻ gặp rào cản về giá trị tài sản tích lũy, nhà ở cho thuê dài hạn dưới các tiêu chuẩn vận hành tổ chức sẽ trở thành phân khúc quan trọng giải quyết nhu cầu an cư quốc gia.

${EDITORIAL_FIGURES.thuThiem}

## 4. Công cụ mô phỏng và kết nối giải pháp tài chính

Để xây dựng một danh mục đầu tư căn hộ cho thuê đạt chuẩn chuyên nghiệp, việc lượng hóa dòng tiền bằng dữ liệu là yêu cầu bắt buộc trước khi đưa ra quyết định giải ngân:

- Tự động hóa tính toán dòng tiền ròng và hệ số sinh lời với [Công cụ dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue).
- Cần tư vấn chiến lược pháp lý doanh nghiệp, kê khai thuế hoặc hợp tác phát triển quỹ tài sản cho thuê? Kết nối tại [trang Liên hệ](/lien-he) hoặc gửi phương án hợp tác tại [Hub cho thuê](/cho-thue).

${EDITORIAL_FIGURES.bitexcoMetro}

> Các nhận định và mô hình phân tích trên mang tính chất định hướng chuyên môn tài chính dựa trên dữ liệu thị trường tại thời điểm biên tập. Nhà đầu tư và các tổ chức cần tiến hành thẩm định độc lập (Due Diligence) trước khi thực hiện các quyết định phân bổ vốn.

## Kiểm tra nhanh

Bạn đang phân vân mình có đủ điều kiện mua nhà ở xã hội không?
[Kiểm tra miễn phí bạn có thuộc đối tượng đủ điều kiện mua NƠXH không](/cong-cu/dieu-kien-noxh)

## Nghiên cứu chuyên sâu & Bài viết liên quan

- [Chọn căn hộ nào để cho thuê dài hạn?](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026)
- [Cho thuê nhà: mã ngành 68103 và cách kê khai](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103)
- Chủ đề chuyên đề: [Nhà ở cho thuê dài hạn](${HUB_HREF})

${BTR_LEGAL_DISCLAIMER}`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T12:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/hcmc-skyline-river-day.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Dòng vốn dài hạn vào căn hộ cho thuê — logic quỹ đầu tư | HouseX",
    seoDesc:
      "Vì sao quỹ và NĐT quan tâm thuê dài hạn: dòng tiền đều, bảo toàn dòng vốn — không cam kết lợi nhuận.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-10-projects",
    slug: "du-an-can-ho-van-hanh-cho-thue-dai-han-2026",
    title:
      "Chọn căn hộ nào để cho thuê dài hạn? Năm tiêu chí trước khi mua",
    excerpt:
      "Không phải căn hộ nào cũng dễ cho thuê ổn định. Bài này nêu năm tiêu chí: vị trí việc làm, bố trí căn, nội thất bàn giao, phí quản lý và pháp lý — kèm vài dự án tham chiếu trên House X.",
    body: `## Căn hộ «mua để ở» và căn «mua để cho thuê dài hạn» khác nhau thế nào?

Không phải căn hộ nào đang bán trên thị trường cũng phù hợp cho thuê dài hạn. Căn dễ bán lại không đồng nghĩa căn dễ có khách thuê ổn định, hợp đồng rõ và chi phí vận hành kiểm soát được.

Trước khi mua, nên tự hỏi: khách thuê mục tiêu là ai, họ đi làm bao lâu thì tới nơi, căn có sẵn nội thất không, phí quản lý bao nhiêu, và pháp lý có cho phép cho thuê theo quy định hiện hành không.

## Năm tiêu chí chọn căn để cho thuê dài hạn

1. Vị trí gần việc làm hoặc gần ga / trạm giao thông công cộng — tính bằng thời gian di chuyển thực tế, không chỉ khoảng cách trên bản đồ.
2. Diện tích và bố trí dễ thuê: thường 1–2 phòng ngủ, căn vuông, đủ ánh sáng — dễ khớp nhu cầu người thuê dài hạn.
3. Nội thất và thiết bị bàn giao rõ ràng — giảm chi phí sửa sang trước khi cho thuê.
4. Phí quản lý và đơn vị vận hành minh bạch — biết trước khoản trừ hàng tháng khỏi tiền thuê.
5. Pháp lý đủ điều kiện giao dịch và cho thuê theo quy định hiện hành.

Nền chính sách: [Thuê dài hạn đến 2030](${PILLAR_HREF}). Cách đọc dòng tiền: [tiền thuê về và tiền còn lại](/tin-tuc/kien-thuc/tinh-dong-tien-don-bay-can-ho-cho-thue-2026).

## Một số dự án tham chiếu trên House X

Các dự án dưới đây được nhắc vì vị trí việc làm hoặc mô hình vận hành khu đô thị — không phải bảng xếp hạng hay cam kết giá thuê.

| Dự án | Vì sao đáng đối chiếu | Link |
|-------|----------------------|------|
| ${ID_TOWN_NAME} | Nhà ở xã hội cửa ngõ Long Thành — gần việc làm và hạ tầng sân bay | [/du-an/${ID_TOWN_SLUG}](/du-an/${ID_TOWN_SLUG}) |
| ${EMERALD_68_NAME} | Cao tầng dọc Quốc lộ 13 / Thuận An — gần khu công nghiệp và dịch vụ | [/du-an/${EMERALD_68_SLUG}](/du-an/${EMERALD_68_SLUG}) |
| ${EMERALD_BLVD_NAME} | Phân khu thương mại cùng hành lang Quốc lộ 13 | [/du-an/${EMERALD_BOULEVARD_SLUG}](/du-an/${EMERALD_BOULEVARD_SLUG}) |
| ${HGX_NAME} | Nhà ở xã hội trong khu đô thị — chuẩn vận hành khu ở đồng bộ | [/du-an/${HGX_PROJECT_SLUG}](/du-an/${HGX_PROJECT_SLUG}) |

Giá bán, tiến độ và điều kiện cho thuê cần xác nhận tại thời điểm giao dịch với chủ đầu tư hoặc đơn vị phân phối.

## Checklist trước khi xuống tiền

1. Rà pháp lý: đủ điều kiện mua và cho thuê theo quy định hiện hành.
2. Ước phí quản lý + thuế cho thuê — xem [bài thuế & mã ngành 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103).
3. Dự phòng 1–2 tháng trống mỗi năm khi tính tiền còn lại.
4. Đối chiếu nhu cầu thuê quanh [Quốc lộ 13 / vành đai](/tin-tuc/kien-thuc/can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026).

Công cụ hỗ trợ: [tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Cần đồng hành thủ tục: [Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue).

Chủ đề: [nhà ở cho thuê dài hạn](${HUB_HREF}).`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T14:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/urban-skyline-golden-hour.jpg",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Chọn căn hộ nào để cho thuê dài hạn? Năm tiêu chí | HouseX",
    seoDesc:
      "Năm tiêu chí: vị trí việc làm, bố trí căn, nội thất bàn giao, phí quản lý, pháp lý — kèm dự án tham chiếu ID Town, Emerald, Hồ Gươm Xanh.",
    tags: [NOXH_TAG_BTR],
    projects: [
      { slug: ID_TOWN_SLUG, name: ID_TOWN_NAME },
      { slug: EMERALD_68_SLUG, name: EMERALD_68_NAME },
      { slug: EMERALD_BOULEVARD_SLUG, name: EMERALD_BLVD_NAME },
      { slug: HGX_PROJECT_SLUG, name: HGX_NAME },
    ],
  },
  {
    id: "article-btr-11-cashflow",
    slug: "tinh-dong-tien-don-bay-can-ho-cho-thue-2026",
    title:
      "Bản chất dòng tiền thực tế của căn hộ cho thuê: tiền thuê về và tiền còn lại",
    excerpt:
      "Sai lầm phổ biến: nhìn tiền thuê trên hợp đồng rồi tưởng đó là lợi nhuận. Bài này tách doanh thu gộp, phí, thuế, trả góp và dự phòng tháng trống — rồi xem vay thêm còn hợp lý không.",
    body: `## Bản chất dòng tiền thực tế của căn hộ cho thuê

Trong đầu tư bất động sản cho thuê, sai lầm lớn nhất là nhầm tiền thuê thu về với tiền còn lại trong túi. Tiền trên hợp đồng thuê chỉ là doanh thu gộp. Tiền còn lại mới phản ánh hiệu quả sau phí vận hành, nghĩa vụ thuế, trả góp vốn vay và dự phòng tháng trống.

Chỉ khi tách rõ các lớp này, bạn mới trả lời được: căn này tự nuôi nợ được không, hay đang trông vào bán lại sau này.

## Tiền thuê về và tiền còn lại khác nhau thế nào?

Để quản trị dòng tiền, cần phân biệt hai khái niệm:

- Tiền thuê về (doanh thu gộp): toàn bộ tiền thu theo hợp đồng thuê — chưa trừ phí, thuế hay trả góp.
- Tiền còn lại (dòng tiền ròng thực tế): số còn sau khi trừ phí quản lý, bảo trì, nghĩa vụ thuế ước tính, trả gốc và lãi vay (nếu có), cùng khoản dự phòng cho tháng không có khách.

Nhiều chủ nhà chỉ nhìn số thuê niêm yết rồi kết luận «đủ sống». Số còn lại mới cho biết căn có đỡ gánh vay hay không.

Bạn có thể bóc tách nhanh trên [công cụ dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue).

## Bảng thông số tài chính và pháp lý cho một căn

| Hạng mục | Căn cứ từ hợp đồng / thực tế | Cơ sở pháp lý và quản trị |
|----------|------------------------------|---------------------------|
| Giá trị căn hộ | Hợp đồng mua / thỏa thuận | Cộng thuế phí mua; đối chiếu chứng thư định giá nếu cần |
| Vốn tự có | Tiết kiệm hợp pháp | Ngân hàng thường yêu cầu một phần vốn tự có |
| Khoản vay | Hợp đồng tín dụng | Lãi suất, kỳ hạn, điều kiện thế chấp |
| Tiền thuê tháng | Hợp đồng thuê (+ phụ lục) | Nghĩa vụ kê khai thuế theo doanh thu năm — xem [bài thuế & mã ngành 68103](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103) |
| Phí quản lý / hạ tầng | Ban quản trị / đơn vị vận hành | Có thể tăng theo năm; thuộc chi phí vận hành chung |
| Thuế ước tính | Ngưỡng doanh thu năm | Luật thuế GTGT và TNCN; cá nhân thường khai mẫu 01/TTS |
| Tháng trống | Ước 1–3 tháng/năm (kịch bản xấu) | Hệ số an toàn khi dòng tiền đứt đoạn |
| Trả góp tháng | Lịch ngân hàng | Có thể mô phỏng tại [/tinh-tra-gop](/tinh-tra-gop) |

Cách nhớ nhanh: tiền còn lại ≈ tiền thuê − phí − thuế/12 − trả góp − dự phòng trống.

## Khi nào đòn bẩy vay vốn còn hợp lý?

Vay mua để cho thuê là con dao hai lưỡi. Chỉ nên cân nhắc khi dòng tiền ròng sau thuế, phí và dự phòng trống vẫn đủ trả gốc–lãi theo lịch ngân hàng — kể cả khi lãi tăng hoặc căn trống vài tháng.

Nếu biên lợi nhuận thấp hơn chi phí lãi vay thực tế, tiền thuê không đủ bù nghĩa vụ nợ. Lúc đó bạn đang phụ thuộc giá bán sau này: thị trường chậm hoặc căn trống lâu sẽ tạo áp lực tài chính nặng.

## Trước khi ký mua hoặc cho thuê, nên làm gì?

1. Tính dòng tiền thực tế sau thuế, phí và trả góp — đừng chỉ nhìn giá thuê niêm yết.
2. Lập khoản dự phòng cho tháng không có khách (thường 1–3 tháng/năm tùy khu vực và loại căn).
3. Cập nhật nghĩa vụ thuế và mã ngành khi mở hộ kinh doanh / doanh nghiệp — xem [hướng dẫn thuế cho thuê nhà](/tin-tuc/kien-thuc/thue-cho-thue-nha-2026-ma-nganh-68103).

Công cụ hỗ trợ: [tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Cần người đồng hành thủ tục: [Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue).

Đọc thêm: [Thuê dài hạn đến 2030](${PILLAR_HREF}) · [Chọn dự án phù hợp cho thuê](/tin-tuc/kien-thuc/du-an-can-ho-van-hanh-cho-thue-dai-han-2026) · chủ đề [nhà ở cho thuê dài hạn](${HUB_HREF}).`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-26T16:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-01-civic-center.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Dòng tiền căn hộ cho thuê: tiền thuê về vs tiền còn lại | HouseX",
    seoDesc:
      "Tách doanh thu gộp, phí, thuế, trả góp và dự phòng tháng trống. Khi nào vay thêm còn hợp lý — kèm công cụ tự tính.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
  {
    id: "article-btr-12-tax",
    slug: "thue-cho-thue-nha-2026-ma-nganh-68103",
    title:
      "Cho thuê nhà: mã ngành 68103, ngưỡng thuế và cách kê khai theo quy định mới",
    excerpt:
      "Mã ngành hộ kinh doanh / doanh nghiệp cho thuê nhà ở dài hạn là 68103. Cá nhân khai thuế trực tiếp dùng mẫu 01/TTS. Từ 1/1/2026 bỏ thuế khoán — chuyển tự khai, tự nộp.",
    body: `## Cá nhân cho thuê nhà có phải nộp thuế không?

Có — nếu tổng doanh thu cho thuê trong năm vượt ngưỡng miễn thuế.

Ngưỡng hiện hành theo Thông tư 40/2021/TT-BTC:

| Tổng doanh thu thuê trong năm | Thuế GTGT | Thuế TNCN |
|-------------------------------|-----------|-----------|
| Từ 100 triệu đồng trở xuống | Không phải nộp | Không phải nộp |
| Trên 100 triệu đồng | 5% trên doanh thu tính thuế | 5% trên doanh thu tính thuế |

Từ ngày 1/1/2026, ngưỡng miễn thuế tăng lên 200 triệu đồng/năm theo Luật Thuế GTGT 2024.

## Mã ngành cho thuê nhà là gì?

Khi đăng ký thành lập doanh nghiệp hoặc hộ kinh doanh có hoạt động cho thuê nhà ở dài hạn, việc ghi đúng mã ngành kinh tế quốc gia là bước pháp lý cần có trên hồ sơ đăng ký — gắn với hợp đồng và quy trình xuất hóa đơn sau này.

- Mã ngành chính thức: 68103
- Tên ngành theo Hệ thống ngành kinh tế Việt Nam: Cho thuê và vận hành nhà ở và đất ở (Quyết định 36/2025/QĐ-TTg, hiệu lực từ 15/11/2025)
- Phạm vi: hộ kinh doanh cá thể hoặc doanh nghiệp đầu tư, vận hành và cho thuê bất động sản nhà ở dài hạn

Cá nhân cho thuê nhà độc lập, không thành lập hộ kinh doanh / doanh nghiệp, khai nộp thuế trực tiếp với cơ quan thuế thì dùng mẫu 01/TTS theo Thông tư 40/2021/TT-BTC. Mã ngành 68103 dùng khi bạn đăng ký hộ hoặc doanh nghiệp để kinh doanh cho thuê nhà.

## Hồ sơ kê khai thuế cho thuê nhà gồm những gì?

Theo Điều 14 Thông tư 40/2021/TT-BTC, cá nhân trực tiếp khai thuế với cơ quan thuế cần:

1. Tờ khai theo mẫu 01/TTS — khai theo kỳ thanh toán hoặc theo năm dương lịch.
2. Phụ lục bảng kê 01-1/BK-TTS nếu là lần khai đầu tiên của hợp đồng hoặc phụ lục hợp đồng.
3. Bản sao hợp đồng thuê và phụ lục (lần khai đầu tiên).
4. Bản sao giấy ủy quyền nếu nhờ người khai thay.

Nơi nộp: Chi cục Thuế quản lý trực tiếp nơi có bất động sản cho thuê — không phải nơi bạn đăng ký hộ khẩu.

Doanh thu tính thuế lấy theo toàn bộ tiền thuê trên hợp đồng (kể cả phụ lục), không chỉ theo số tiền thực về tài khoản.

## Hai phương pháp kê khai thuế — chọn một và giữ nhất quán

Cá nhân cho thuê nhà được chọn một trong hai phương thức và nên giữ nhất quán trong kỳ tính thuế:

### Khai theo từng lần phát sinh kỳ thanh toán

Thời hạn nộp hồ sơ: chậm nhất ngày thứ 10 kể từ ngày bắt đầu kỳ thanh toán thuê. Phù hợp hợp đồng có chu kỳ thanh toán linh hoạt (tháng, quý hoặc nửa năm).

### Khai theo năm dương lịch

Thời hạn nộp hồ sơ: chậm nhất ngày cuối cùng của tháng đầu tiên năm dương lịch tiếp theo. Phù hợp hợp đồng thuê dài hạn, ổn định theo năm — giảm số lần khai trong năm.

## Từ 1/1/2026: bỏ thuế khoán, chuyển tự khai tự nộp

Từ ngày 1/1/2026, cơ chế thuế khoán đối với hoạt động cho thuê tài sản bị bãi bỏ, chuyển sang tự khai, tự nộp theo hướng dẫn sửa đổi Luật Quản lý thuế.

Nếu bạn đang nộp khoán, cần:

1. Rà soát phương pháp nộp thuế hiện tại.
2. Chuyển sang kê khai theo kỳ thanh toán hoặc theo năm.
3. Giữ đủ hợp đồng thuê, phụ lục và chứng từ thanh toán — cơ quan thuế yêu cầu minh bạch chứng từ hơn trong giai đoạn mới.

## Lỗi hay gặp khiến hồ sơ bị trả lại

- Bỏ sót phụ lục hợp đồng khi cộng doanh thu năm.
- Nộp hồ sơ tại chi cục thuế nơi cư trú thay vì nơi có bất động sản.
- Dùng mẫu khai cũ (trước Thông tư 40/2021/TT-BTC).
- Đăng ký hộ / doanh nghiệp cho thuê nhà ở nhưng ghi sai mã ngành (đúng là 68103).

Ước tính dòng tiền sau thuế: [công cụ tính dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue). Cần hỗ trợ thủ tục: [Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue).

Bài trụ cột chính sách: [Thuê dài hạn đến 2030](${PILLAR_HREF}).`,
    status: "PUBLISHED",
    publishedAt: new Date("2026-07-27T10:00:00.000Z"),
    updatedAt: UPDATED,
    coverImageUrl: "/images/hero/housex-hero-slide-02-metro-hub.webp",
    authorName: "Ban biên tập House X",
    seoTitle:
      "Cho thuê nhà: mã ngành 68103, ngưỡng thuế và cách kê khai | HouseX",
    seoDesc:
      "Mã ngành hộ KD / DN cho thuê nhà ở dài hạn là 68103. Cá nhân khai thuế dùng mẫu 01/TTS. Từ 1/1/2026 bỏ thuế khoán — chuyển tự khai, tự nộp.",
    tags: [NOXH_TAG_BTR],
    projects: [],
  },
];
