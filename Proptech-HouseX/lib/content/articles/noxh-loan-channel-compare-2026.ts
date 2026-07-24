import type { ArticleDetail } from "@/lib/data/article-types";
import { articlePath } from "@/lib/content/article-routes";
import { NOXH_TAG_THAM_DINH_VAY } from "@/lib/content/articles/noxh-handbook-tags";

const PUBLISHED = new Date("2026-07-24T03:00:00.000Z");
const TAG = NOXH_TAG_THAM_DINH_VAY;

export const NOXH_LOAN_CHANNEL_COMPARE_SLUG =
  "vay-noxh-nhcsxh-va-ngan-hang-thuong-mai" as const;

/**
 * So sánh kênh vay NOXH: NHCSXH · ưu đãi NHNN (neo lãi cho vay Big 4) · thả nổi HĐ.
 */
export const NOXH_LOAN_CHANNEL_COMPARE_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-loan-channel-compare-01",
    slug: NOXH_LOAN_CHANNEL_COMPARE_SLUG,
    title:
      "Vay mua nhà ở xã hội: NHCSXH khác ngân hàng thương mại thế nào?",
    excerpt:
      "Ba cơ chế lãi khi vay NOXH: lãi Nghị định tại NHCSXH, ưu đãi NHNN neo lãi cho vay Big 4, và thả nổi theo hợp đồng (huy động 12 tháng + biên độ). Room tín dụng quyết định ai tiếp cận được vốn kịp tiến độ.",
    body: `Đủ điều kiện mua nhà ở xã hội chưa đồng nghĩa mọi người cùng một gói vay. Thực tế có ít nhất ba lớp lãi và hai kênh giải ngân phổ biến: Ngân hàng Chính sách xã hội (NHCSXH) và ngân hàng thương mại (NHTM) — thường là ngân hàng liên kết chủ đầu tư hoặc tham gia chương trình ưu đãi theo hướng dẫn Ngân hàng Nhà nước.

Bài này giúp bạn phân biệt rõ cơ chế, đọc đúng hợp đồng, và chọn kênh phù hợp trước khi đóng tiền theo tiến độ dự án.

## Vì sao cần phân biệt NHCSXH và ngân hàng thương mại?

Hai kênh đều có thể phục vụ người mua NOXH, nhưng khác nhau về:

- Ai ấn định lãi ưu đãi và lãi có “hết hạn” không
- Thời hạn vay tối đa theo quy định hoặc thông lệ
- Tốc độ giải ngân và room tín dụng
- Cách lãi thay đổi sau giai đoạn đầu

Nếu chỉ nghe “vay NOXH lãi thấp”, rất dễ nhầm lãi Nghị định tại NHCSXH với lãi ưu đãi có cửa sổ thời gian tại NHTM, rồi bất ngờ khi chuyển thả nổi.

Đọc thêm nền tảng: [gói 120.000 tỷ / vay NHCSXH](/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026), [lãi suất NOXH người dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026), [tự thẩm định trước khi nộp hồ sơ](/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi).

## Bảng 3 cột — ba cơ chế lãi cần tách bạch

| Tiêu chí | NHCSXH (lãi theo Nghị định) | Ưu đãi NHNN tại NHTM (neo lãi cho vay Big 4) | Thả nổi theo hợp đồng NHTM (neo huy động 12T + biên độ) |
| --- | --- | --- | --- |
| Bản chất | Lãi ưu đãi do Chính phủ quy định cho vay tại NHCSXH | Lãi ưu đãi có kỳ hạn theo thông báo NHNN cho chương trình cụ thể (vd. người trẻ dưới 35 tuổi mua NOXH) | Lãi sau hết cửa sổ ưu đãi / gói liên kết CĐT — theo điều khoản HĐTD |
| Công thức neo | Mức cố định trong Nghị định (không dùng công thức Big 4 − X%) | Lãi cho vay trung–dài hạn VND bình quân của 4 NHTM nhà nước (Agribank, BIDV, Vietcombank, VietinBank) trừ mức ưu đãi | Thường: lãi tiền gửi tiết kiệm kỳ hạn 12 tháng (theo HĐ) + biên độ do ngân hàng ấn định |
| Ví dụ mức / cách đọc | 5,4%/năm (Điều 48 NĐ 100/2024, sửa NĐ 261/2025) | Ví dụ CV 5340/NHNN-CSTT (01/7–31/12/2026): 5 năm đầu thấp hơn 2 điểm % → 6,5%/năm; 10 năm tiếp thấp hơn 1 điểm % → 7,5%/năm | Ví dụ thị trường: huy động 12T + biên độ khoảng 4,0–4,5% (từng NH khác nhau — chỉ đúng khi ghi trong HĐ) |
| Ai chi phối khi đổi lãi | Đổi mức quy định: NHCSXH chủ trì, phối hợp Bộ Xây dựng và cơ quan liên quan, trình Thủ tướng xem xét, quyết định | NHNN công bố mức / công thức theo từng kỳ áp dụng chương trình | Ngân hàng theo công thức và kỳ điều chỉnh trong hợp đồng tín dụng — không chi phối bởi quyết định của Thủ tướng từng lần như cơ chế NHCSXH |
| Thời hạn vay (tham chiếu) | Tối đa 25 năm kể từ giải ngân đầu (Điều 48) | Theo chương trình + khả năng trả / tuổi cuối kỳ từng NH | Cùng khoản vay NHTM; sau ưu đãi vẫn trong kỳ hạn HĐ đã ký |
| Tỷ lệ vay (tham chiếu) | Mua/thuê mua: tối đa 80% giá trị HĐ (Điều 48) | Thường quanh 50–70% tùy NH và hồ sơ (thông lệ dự án liên kết) | Cùng hạn mức đã duyệt; không “tăng tỷ lệ” chỉ vì chuyển thả nổi |
| Điểm mạnh | Lãi ổn định theo chính sách; kỳ hạn dài | Có tầng ưu đãi pháp lý rõ trong nhiều năm đầu–giữa kỳ | Mở rộng cửa giải ngân qua NH liên kết CĐT khi room chính sách hẹp |
| Điểm cần lưu ý | Room / quy trình có thể làm chậm tiếp cận vốn | Phải đúng đối tượng chương trình; hết cửa sổ ưu đãi thì sang lớp thả nổi HĐ | Biên độ và lãi cơ sở khác nhau từng NH — stress-test trả tháng sau ưu đãi |

Cách đọc bảng: cột 2 và cột 3 thường nằm trên cùng một khoản vay NHTM theo thời gian — không phải hai ngân hàng khác nhau. Cột 1 là kênh NHCSXH riêng.

## Lãi và thời hạn tại NHCSXH — sau đó thay đổi thế nào?

Theo Điều 48 Nghị định 100/2024/NĐ-CP (được sửa bởi Nghị định 261/2025/NĐ-CP, hiệu lực từ 10/10/2025):

- Lãi suất cho vay ưu đãi mua/thuê mua nhà ở xã hội tại NHCSXH: 5,4%/năm
- Lãi nợ quá hạn: 130% lãi cho vay
- Thời hạn vay: thỏa thuận theo khả năng trả nợ, tối đa không quá 25 năm kể từ ngày giải ngân khoản vay đầu tiên
- Mức vốn cho vay khi mua/thuê mua: tối đa 80% giá trị hợp đồng mua/thuê mua

Khác NHTM: đây không phải lãi “ưu đãi 3–5 năm rồi hết”. Mức 5,4% gắn với quy định tại Nghị định. Khi cần thay đổi mức lãi, cơ chế là NHCSXH chủ trì, phối hợp Bộ Xây dựng và cơ quan liên quan, trình Thủ tướng xem xét, quyết định — không chi phối bởi quyết định của Thủ tướng từng lần theo kiểu điều chỉnh định kỳ của hợp đồng thương mại, mà là thay đổi mức chính sách khi được quyết định theo đúng quy trình đó.

Các khoản vay đã ký trước ngày 10/10/2025 được điều chỉnh hợp đồng để áp dụng 5,4%/năm cho dư nợ gốc thực tế (theo quy định chuyển tiếp Nghị định 261/2025).

## Ưu đãi NHNN tại NHTM — neo lãi cho vay Big 4

Khi khoản vay thuộc chương trình ưu đãi do NHNN thông báo (ví dụ người trẻ dưới 35 tuổi mua NOXH), lãi trong cửa sổ ưu đãi được neo theo:

Lãi cho vay trung–dài hạn VND bình quân của Agribank, BIDV, Vietcombank, VietinBank, trừ mức ưu đãi theo từng giai đoạn.

Ví dụ Công văn 5340/NHNN-CSTT (áp dụng dư nợ giai đoạn 01/7/2026–31/12/2026):

- 5 năm đầu kể từ giải ngân đầu: thấp hơn 2 điểm %/năm → mức công bố 6,5%/năm
- 10 năm vay tiếp theo: thấp hơn 1 điểm %/năm → mức công bố 7,5%/năm

Đây là lớp có căn cứ văn bản NHNN. Không nhầm với công thức thả nổi “huy động 12 tháng + biên độ”.

Chi tiết diễn giải: [lãi suất vay NOXH dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026).

## Thả nổi theo hợp đồng — neo huy động 12 tháng + biên độ

Sau khi hết cửa sổ ưu đãi chương trình (hoặc hết ưu đãi ngắn của gói liên kết CĐT — phổ biến vài tháng đến 3–5 năm tùy sản phẩm), nhiều hợp đồng NHTM chuyển sang lãi thả nổi dạng:

Lãi thả nổi ≈ lãi tiền gửi tiết kiệm kỳ hạn 12 tháng (theo đúng tham chiếu ghi trong HĐ) + biên độ cố định do ngân hàng ấn định.

Đặc điểm cần nhớ:

- Không có một nghị định duy nhất ấn định biên độ cho mọi ngân hàng
- Kỳ điều chỉnh (3/6/12 tháng) nằm trong hợp đồng
- Cùng một mức huy động 12T, biên độ khác nhau → trả tháng khác nhau rõ rệt

Trước khi ký, hỏi ngân hàng giải ngân hai câu:

1. Giai đoạn ưu đãi neo theo công thức / văn bản nào?
2. Sau ưu đãi, lãi cơ sở là huy động 12 tháng nào, biên độ bao nhiêu, điều chỉnh bao lâu một lần?

Mô phỏng ít nhất hai kịch bản trên [tính trả góp](/tinh-tra-gop): lãi ưu đãi và lãi sau ưu đãi giả định.

## Room tín dụng và tốc độ — vì sao “gói tốt” vẫn có thể không vào được

NHCSXH thường tốt về lãi và ổn định chính sách, nhưng hạn mức chương trình, tiến độ giải ngân và quy trình xác nhận có thể khiến không phải ai đủ điều kiện mua cũng tiếp cận vốn kịp tiến độ đóng tiền chủ đầu tư.

NHTM liên kết CĐT thường mở rộng cơ hội tiếp cận: gắn room dự án, nhiều cửa nộp hồ sơ hơn, tốc độ thẩm định quen với tiến độ bán hàng — đổi lại bạn phải đọc rõ cửa sổ ưu đãi và công thức thả nổi sau đó.

Cả hai kênh đều vẫn xét CIC, DTI, tuổi cuối kỳ và hồ sơ pháp lý. Dùng [tính hạn mức vay](/cong-cu/tinh-han-muc-vay) và [bộ thẩm định vay NOXH](/cong-cu/tham-dinh-vay-noxh) trước khi chọn kênh theo lời giới thiệu miệng.

## Vì sao vay NOXH vẫn lợi thế hơn vay nhà thương mại?

Ngay cả khi NHTM đã chuyển thả nổi, cấu trúc vay mua nhà ở xã hội vẫn thường lợi thế hơn vay nhà ở thương mại thông thường vì:

1. Có tầng ưu đãi pháp lý / chương trình (NHCSXH theo Nghị định; NHTM theo thông báo NHNN hoặc gói liên kết) — nhà thương mại thường không có lớp này.
2. Tỷ lệ vay và thời hạn được thiết kế gắn an cư (NHCSXH: tới 80% HĐ, tối đa 25 năm theo Điều 48; NHTM NOXH thông lệ thường 15–20 năm / quanh 70% tùy NH).
3. Đối tượng và mục đích vay được luật hóa trong Luật Nhà ở 2023 và Nghị định hướng dẫn — không phải gói thị trường tự do thuần túy.

Không khẳng định “sau thả nổi luôn thấp hơn nhà thương mại đúng X điểm %” nếu chưa có số liệu hợp đồng cụ thể. Cách đúng: so sánh cấu trúc + mô phỏng dòng tiền + đối chiếu phụ lục lãi của đúng ngân hàng giải ngân.

Lãi nhà thương mại thông lệ thị trường thường cao hơn vùng ưu đãi NOXH (tham chiếu khoảng 9–11%+/năm tùy thời điểm và NH) — chỉ dùng để định vị tương đối, không phải cam kết.

## Khi nào nghiêng NHCSXH, khi nào nghiêng NHTM liên kết CĐT?

| Tình huống | Hướng nghiêng |
| --- | --- |
| Ưu tiên lãi ổn định theo Nghị định, chấp nhận quy trình và chờ room | NHCSXH |
| Dự án đã có NH liên kết, cần khớp tiến độ đóng tiền | NHTM liên kết CĐT |
| Đủ điều kiện chương trình ưu đãi NHNN (vd. dưới 35 tuổi) | NHTM tham gia chương trình — hỏi rõ còn áp dụng CV nào |
| CIC/DTI sát ngưỡng hoặc chưa rõ trả tháng sau ưu đãi | Chưa chọn kênh — tự kiểm hạn mức và trả góp trước |
| Được mời “chắc vay được” nhưng chưa biết room | Dừng lại — xem [sai lầm khi tin chắc vay được](/tin-tuc/sai-lam-tin-moi-gioi-chac-vay-noxh) |

## Kết luận

NHCSXH là kênh tốt về lãi và ổn định chính sách: 5,4%/năm, thời hạn tới 25 năm, tỷ lệ vay mua/thuê mua tới 80% hợp đồng theo Điều 48 Nghị định 100/2024 (sửa Nghị định 261/2025). Cơ chế đổi lãi gắn quy trình chính sách — không chi phối bởi quyết định của Thủ tướng từng lần như cách điều chỉnh định kỳ trong hợp đồng thương mại. Điểm hạn chế thực tế là room tín dụng và tiến độ giải ngân: không phải ai đủ điều kiện mua cũng tiếp cận được vốn kịp lúc cần.

Ngân hàng thương mại liên kết chủ đầu tư mở rộng cơ hội tiếp cận gói vay. Trong cửa sổ ưu đãi chương trình NHNN, lãi neo theo lãi cho vay trung–dài hạn bình quân Big 4 trừ mức ưu đãi. Sau đó, nhiều hợp đồng chuyển thả nổi theo lãi huy động 12 tháng cộng biên độ — phải đọc đúng phụ lục lãi.

Dù đã thả nổi, vay mua nhà ở xã hội vẫn thường giữ lợi thế cấu trúc so với vay nhà ở thương mại nhờ tầng ưu đãi pháp lý/chương trình, tỷ lệ vay và thời hạn gắn an cư. Quyết định đúng là chọn kênh khớp room và dòng tiền của bạn — không phải chọn lời quảng bá thấp nhất ở tháng đầu.

## Câu hỏi thường gặp

**NHCSXH có thả nổi như NHTM sau 3–5 năm không?**  
Không theo kiểu hợp đồng thương mại. Lãi 5,4%/năm gắn Nghị định; đổi mức theo quy trình trình Thủ tướng khi cần thay đổi chính sách.

**Ưu đãi NHNN neo lãi huy động 12 tháng hay lãi cho vay Big 4?**  
Neo lãi cho vay trung–dài hạn bình quân của 4 NHTM nhà nước, rồi trừ mức ưu đãi (ví dụ Công văn 5340/NHNN-CSTT).

**Thả nổi sau ưu đãi tính thế nào?**  
Phổ biến: lãi huy động tiết kiệm 12 tháng theo hợp đồng cộng biên độ. Không có một biên độ chung cho mọi ngân hàng.

**Vì sao vẫn nên cân NHTM nếu NHCSXH lãi thấp hơn?**  
Vì room và tiến độ. NHTM liên kết CĐT thường mở rộng cửa tiếp cận vốn khi hạn mức chính sách đang hẹp hoặc chậm.

**Trước khi chọn kênh nên làm gì trên House X?**  
[Tính hạn mức vay](/cong-cu/tinh-han-muc-vay) → [tính trả góp](/tinh-tra-gop) (hai kịch bản lãi) → [thẩm định vay NOXH](/cong-cu/tham-dinh-vay-noxh). Nếu cần đối chiếu hồ sơ: [form tư vấn vay mua nhà](/vay-mua-nha#tu-van).

## Bài liên quan

- [Vay mua NOXH qua gói 120.000 tỷ NHCSXH](/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026)
- [Lãi suất vay NOXH người dưới 35 tuổi](/tin-tuc/lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026)
- [Thẩm định khoản vay mua nhà ở xã hội](/tin-tuc/tham-dinh-khoan-vay-mua-nha-o-xa-hoi)
- [Mua nhà ở xã hội có được vay ngân hàng không?](/tin-tuc/mua-nha-o-xa-hoi-co-duoc-vay-ngan-hang-khong)

## Bước tiếp theo

1. [Tính hạn mức vay](/cong-cu/tinh-han-muc-vay)
2. [Tính trả góp — mô phỏng lãi ưu đãi và sau ưu đãi](/tinh-tra-gop)
3. Nếu còn phân vân kênh vay — [để lại thông tin tư vấn](/vay-mua-nha#tu-van)

## Chuyên gia HouseX đồng hành rà soát miễn phí

Sau khi tự tách bạch ba cơ chế lãi và kiểm room thực tế của dự án, nếu bạn cần đối chiếu hồ sơ hoặc phương án vay — [để lại thông tin tại form tư vấn vay mua nhà](/vay-mua-nha#tu-van). House X hỗ trợ làm rõ nhu cầu và bước chuẩn bị. Kết quả phê duyệt cuối cùng thuộc về tổ chức tín dụng giải ngân.`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: PUBLISHED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Vay NOXH: NHCSXH vs ngân hàng thương mại — 3 cơ chế lãi | House X",
    seoDesc:
      "So sánh NHCSXH, ưu đãi NHNN neo lãi cho vay Big 4, và thả nổi HĐ (huy động 12T + biên độ). Room tín dụng và checklist chọn kênh trước khi cọc.",
    tags: [TAG],
    projects: [],
  },
];

export const NOXH_LOAN_CHANNEL_COMPARE_HREF = articlePath(
  NOXH_LOAN_CHANNEL_COMPARE_SLUG,
);
