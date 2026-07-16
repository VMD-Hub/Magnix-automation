import {
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_DU_AN_GIA,
} from "@/lib/content/articles/noxh-handbook-tags";
import { EDITORIAL_FIGURES } from "@/lib/content/articles/article-editorial-media";
import { NOXH_SUPPORT_CLOSING } from "@/lib/content/articles/article-editorial-voice";
import type { ArticleDetail } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import {
  HAU_NGHIA_SLUG,
  LA_HOME_SLUG,
  MY_HANH_SLUG,
  ORI_SLUG,
  PHU_AN_SLUG,
  PVT_SLUG,
} from "@/lib/preview/noxh-long-an-projects";

const PUBLISHED = new Date("2026-07-03T00:00:00.000Z");
const UPDATED = new Date("2026-07-16T00:00:00.000Z");

const PHUC_LOC_THO_SLUG = "chung-cu-phuc-loc-tho-noxh";
const PHUC_LOC_THO_NAME = "Chung cư Phúc Lộc Thọ (Block C NOXH)";

/**
 * Cluster kiến thức NOXH — pillar pháp lý, vay, quy trình, vùng/dự án.
 * Chuẩn biên tập: mỗi H2 trả lời xong tại chỗ (bảng/công thức/checklist);
 * không dùng "xem thêm / công cụ" thay phần làm rõ tiêu đề hoặc câu hỏi H2.
 */
export const NOXH_KNOWLEDGE_ARTICLES_2026: ArticleDetail[] = [
  {
    id: "article-noxh-knowledge-01",
    slug: "quy-trinh-mua-thue-mua-noxh-2026",
    title:
      "Mua NOXH khác gì căn hộ thương mại? — Quy trình 7 bước đến nhận căn",
    excerpt:
      "Bảng so sánh NOXH vs thương mại, ba trụ cột đối tượng–nhà ở–thu nhập, 7 bước đợt mở bán, thuê mua vs mua, lỗi hay bị loại — tự đủ trong một bài.",
    body: `## Mua NOXH khác gì mua căn hộ thương mại?

Hai giao dịch khác nhau ngay từ cửa vào — không chỉ khác giá.

| Tiêu chí | Nhà ở xã hội (NOXH) | Căn hộ thương mại |
| --- | --- | --- |
| Ai được mua | Phải thuộc nhóm đối tượng Điều 76 Luật Nhà ở 2023 | Ai cũng mua được nếu đủ tiền / vay |
| Nhà ở hiện có | Xét cả hộ tại tỉnh, thành phố nơi có dự án (chưa có nhà, nhà chật, hoặc chưa hưởng hỗ trợ) | Không xét điều kiện nhà ở hiện có |
| Thu nhập | Trần 25/35/50 triệu/tháng (k5, k6, k8) hoặc cơ chế riêng (k7, người có công…) | Không có trần “được phép mua” |
| Quy trình | Nộp hồ sơ → rà soát Sở/UBND/CĐT → công khai danh sách → bốc thăm nếu vượt quỹ căn | Giữ chỗ / cọc → ký HĐMB theo tiến độ CĐT |
| Thời điểm “chốt căn” | Chỉ sau khi đủ điều kiện và được chọn | Có thể chốt ngay khi còn hàng |
| Chuyển nhượng | Hạn chế theo Luật (thường sau thời hạn tối thiểu) | Tự do hơn theo HĐ và pháp luật chung |
| Giá /m² | Có khung kiểm soát, thường thấp hơn thương mại cùng khu | Theo thị trường |

Ví dụ thực tế: NOXH Lý Thường Kiệt (đường Lý Thường Kiệt, Quận 10 cũ — nội thành trung tâm TP.HCM) công bố khoảng 23 triệu/m², thấp hơn nhiều căn thương mại nội thành cùng phân khúc vị trí — nhưng hơn 12.000 hồ sơ tranh 755 suất. Giá thấp không đồng nghĩa dễ mua: cạnh tranh tỷ lệ thuận với vị trí trung tâm và quỹ căn hạn chế.

## Ba trụ cột phải đạt trước khi nộp (làm ngay tại đây)

| Trụ cột | Đạt khi nào | Không đạt thì sao |
| --- | --- | --- |
| Đối tượng (Đ.76) | Bạn thuộc một khoản: công nhân KCN (k6), CBCCVC (k8), thu nhập thấp đô thị (k5), LLVT (k7), người có công / hộ nghèo… | Sai nhóm → sai mẫu giấy → trả hồ sơ |
| Nhà ở (Đ.78 / Đ.29 NĐ 100) | Chưa có nhà tại tỉnh/thành phố nơi có dự án, hoặc bình quân dưới 15 m² sàn/người, hoặc chưa hưởng hỗ trợ | Có nhà đủ diện tích tại tỉnh/thành phố nơi có dự án (kể cả đứng tên vợ/chồng) → loại |
| Thu nhập | k5/k6/k8: bình quân 12 tháng ≤ 25 (độc thân) / 35 (nuôi con) / 50 (đã kết hôn, tổng vợ chồng). k7: theo Điều 67, không dùng trần dân sự | Vượt trần → không đủ điều kiện mua |

Công thức thu nhập: (Tổng lương/tiền công thực nhận 12 tháng liền kề) ÷ 12 ≤ trần. Đã kết hôn thì cộng cả hai trước khi chia 12.

## Các bước trong một đợt mở bán NOXH (thực tế 2025–2026)

| Bước | Việc cần làm | Cơ quan / bên liên quan | Hệ quả nếu sai |
| --- | --- | --- | --- |
| 1 | Theo dõi thông báo mở đăng ký (giá, quỹ căn, thời hạn, số bộ hồ sơ) | Sở Xây dựng, CĐT | Xin giấy quá sớm → hết hạn 12 tháng giữa đợt |
| 2 | Chốt đúng nhóm Đ.76 + trường hợp điều kiện nhà ở + tính thu nhập ÷ 12 | Tự làm trước khi xin giấy | Sai trường hợp nhà ở → làm lại toàn bộ giấy |
| 3 | Xin giấy xác nhận thu nhập/đối tượng + giấy xác nhận nhà ở (Mẫu 02/03 hoặc BQP/BCA) | Đơn vị / CA xã / VPĐK / UBND xã | Giấy sai mẫu hoặc lệch BHXH → trả / hậu kiểm |
| 4 | Nộp đúng hạn — mỗi hộ một dự án tại một thời điểm | CĐT / điểm tiếp nhận | Nộp hai dự án → loại |
| 5 | Rà soát đối tượng, thu nhập, nhà ở, cư trú | Sở XĐ, UBND, CĐT | Lệch dữ liệu → trả trong 15 ngày sau công khai |
| 6 | Công bố danh sách; bốc thăm / ưu tiên nếu vượt quỹ căn | Theo thông báo đợt | Đủ điều kiện ≠ chắc được căn |
| 7 | Ký HĐ mua/thuê mua, đóng tiền, làm vay (nếu có) | CĐT, NH liên kết / NHCSXH | Thiếu ~30% vốn tự có → treo tiến độ |

## Thuê, thuê mua và mua — khác nhau thế nào?

Căn cứ Điều 77, Điều 78 và Điều 89 [Luật Nhà ở số 27/2023/QH15](https://vanban.chinhphu.vn/?docid=209627&pageid=27160); thủ tục tại Mục 7 [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160) (đã được sửa bởi [Nghị định 54/2026/NĐ-CP](https://baochinhphu.vn/sua-doi-bo-sung-quy-dinh-ve-nha-o-xa-hoi-10226020917541606.htm)). Cùng đối tượng đủ điều kiện có thể đăng ký mua, thuê mua hoặc thuê — tùy hình thức đợt mở bán do chủ đầu tư thông báo. Ba hình thức không thay thế nhau; nhầm tên trên HĐ là nguồn gốc nhiều tranh chấp sau 5 năm.

### Ba hình thức — bản chất theo luật

| Hình thức | Căn cứ chính | Bản chất | Thời điểm xét đủ điều kiện để “mua” | Thời điểm đứng tên |
| --- | --- | --- | --- | --- |
| Mua | Điều 89 khoản 1 Luật Nhà ở | Hợp đồng mua bán NOXH; thanh toán theo tiến độ HĐ | Ngay khi nộp hồ sơ đợt mở bán (đối tượng Đ.76 + điều kiện Đ.78 / NĐ 100) | Theo tiến độ HĐMB và cấp GCN |
| Thuê mua | Điều 89 khoản 2 Luật Nhà ở | Hợp đồng thuê mua; thời hạn thanh toán tiền thuê mua tối thiểu 05 năm kể từ ngày ký HĐ (điểm a khoản 2 Điều 89) | Ngay khi ký HĐ thuê mua — đã xét đối tượng và điều kiện như mua | Sau khi thanh toán đủ tiền thuê mua theo HĐ |
| Thuê | Điều 78 khoản 2 Luật Nhà ở; ưu tiên mua lại: Điều 78 khoản 12 NĐ 100 (sửa bởi NĐ 54) | Hợp đồng thuê; không phải giao dịch mua | Không xét mua ngay. Khi muốn mua: được ưu tiên bán nếu đang thuê và còn trong khung trước thời hạn 10 năm (NĐ 54), và phải đủ điều kiện mua tại thời điểm đề nghị mua | Chỉ có quyền thuê theo HĐ; mua lại là giao dịch mới |

Điểm dễ nhầm: “ở khoảng 5 năm rồi mới được xét mua” thuộc nhánh thuê → ưu tiên mua lại (Điều 78 khoản 12 NĐ 100/NĐ 54), không phải bản chất thuê mua tại Điều 89 khoản 2.

### So sánh mua và thuê mua (Điều 89)

| Điểm so sánh | Mua (khoản 1 Điều 89) | Thuê mua (khoản 2 Điều 89) |
| --- | --- | --- |
| Xét đối tượng / điều kiện | Ngay từ đầu đợt | Ngay từ đầu — không cần ở thuê trước |
| Dòng tiền đầu | Theo thông báo CĐT | Theo thông báo CĐT từng giai đoạn — luật không mặc định “thuê mua = nộp ít hơn mua” |
| Thời hạn thanh toán tối thiểu | Theo HĐMB / tiến độ dự án | Tối thiểu 05 năm kể từ ngày ký HĐ thuê mua |
| Hạn chế bán lại trong 05 năm sau khi trả đủ | Chỉ bán lại cho CĐT hoặc đối tượng đủ điều kiện mua NOXH; giá tối đa bằng giá trong HĐ với CĐT (điểm d, đ khoản 1 Điều 89); thủ tục NĐ 100 Điều 39–40 | Khung tương tự (điểm b, c khoản 2 Điều 89) |
| Sau 05 năm (đã trả đủ, đủ điều kiện cấp GCN) | Bán theo cơ chế thị trường (điểm e khoản 1 Điều 89) | Bán theo cơ chế thị trường (điểm d khoản 2 Điều 89) |

### Nỗi đau thực tế: sau vài năm CĐT không duyệt mua, viện dẫn “thu nhập theo luật mới”, muốn thanh lý giá cũ để bán người khác

Tình huống hay gặp: gia đình ký với CĐT dưới tên “thuê mua” hoặc “thuê”; sau khoảng 5 năm nhà tăng giá; khi đề nghị hoàn tất mua / đứng tên, CĐT bảo không còn đủ điều kiện thu nhập theo nghị định mới và muốn thanh lý theo giá cũ để bán cho người mua mới. Cách xử lý phụ thuộc đúng loại hợp đồng đã ký — không xử theo lời nói miệng của CĐT.

### Nhánh A — Đã ký đúng hợp đồng thuê mua (Điều 89 khoản 2)

- Điều kiện đối tượng và thu nhập đã được xét tại thời điểm ký HĐ thuê mua (Điều 78 + NĐ 100 tại thời điểm đó).
- Khi bên thuê mua đã thanh toán đủ tiền thuê mua theo thời hạn điểm a khoản 2 Điều 89, quyền hoàn tất theo HĐ và khung Điều 89 không bị “reset” chỉ vì sau này Nhà nước nâng/hạ trần thu nhập (NĐ 261, NĐ 136…).
- CĐT không được tự ý từ chối hoàn tất nghĩa vụ HĐ thuê mua rồi ép thanh lý để bán lại người khác chỉ vì giá thị trường đã tăng — đó là tranh chấp thực hiện hợp đồng, không phải “mở đợt xét đối tượng mới”.
- Khoản 10 Điều 88 Luật Nhà ở 2023: hợp đồng mua/thuê mua vô hiệu khi bán, cho thuê mua vi phạm quy định về đối tượng hoặc điều kiện — hướng tới giao dịch sai từ đầu. CĐT muốn viện dẫn điều này phải chứng minh sai đối tượng/điều kiện tại thời điểm giao kết, không thể chỉ lấy mức thu nhập hiện tại theo luật mới để phủ nhận HĐ đã ký hợp lệ.
- Việc cần làm: yêu cầu CĐT trả lời bằng văn bản (căn cứ điều khoản HĐ + điều luật cụ thể); đối chiếu bản HĐ là “thuê mua” hay chỉ “thuê”; gửi Sở Xây dựng nơi có dự án đề nghị kiểm tra; giữ biên lai thanh toán đủ tiền thuê mua; cân nhắc khởi kiện yêu cầu tiếp tục thực hiện HĐ nếu CĐT cố tình thanh lý trái thỏa thuận.

### Nhánh B — Thực chất là thuê, sau đó xin mua (Điều 78 khoản 12 NĐ 100, sửa NĐ 54)

- Người đang thuê được ưu tiên bán trước thời hạn 10 năm nếu có nhu cầu mua và đủ điều kiện; hoặc CĐT bán cho Quỹ nhà ở quốc gia.
- Giá bán khi chuyển từ thuê sang mua theo NĐ 54: giá thẩm định + lãi vay bình quân ngân hàng thương mại nhà nước tương ứng thời gian thuê − khấu hao — không phải CĐT tự đặt giá thị trường tùy tiện.
- Vì đây là giao dịch mua mới, điều kiện nhà ở và thu nhập được xác định lại tại thời điểm đề nghị mua (nguyên tắc chuyển tiếp từng giai đoạn nghị định thu nhập — ví dụ NĐ 261 từng ghi nhận hướng dẫn đang thuê/thuê mua muốn mua thì xác định theo quy định đang hiệu lực tại thời điểm đó; sau 07/04/2026 áp khung NĐ 136 nếu thuộc nhóm chịu trần).
- Nếu không còn đủ điều kiện mua theo luật tại thời điểm đó: không bắt buộc CĐT phải bán cho bạn theo suất mua NOXH; nhưng CĐT cũng không được nhân danh “không đủ điều kiện” để thanh lý trái HĐ thuê đang còn hiệu lực, hoặc ép bán lại dưới giá trị quyền lợi hợp pháp của bên thuê ngoài khung luật.
- Việc cần làm: xác nhận văn bản đây là HĐ thuê; hỏi rõ quy trình ưu tiên mua theo Điều 78 khoản 12; nộp hồ sơ điều kiện mua tại thời điểm hiện hành; nếu CĐT từ chối, yêu cầu văn bản và gửi Sở Xây dựng đối chiếu giá và thứ tự ưu tiên.

### Ai chịu trách nhiệm — đọc nhanh

| Việc CĐT làm | Trách nhiệm / hướng xử lý theo khung pháp lý |
| --- | --- |
| Ghi “thuê mua” trên giấy nhưng thực chất chỉ cho thuê | Tranh chấp bản chất HĐ — đối chiếu nội dung HĐ (thanh toán tối thiểu 05 năm thuê mua hay chỉ tiền thuê); Sở XD / Tòa án làm rõ |
| Đã nhận đủ tiền thuê mua theo HĐ rồi từ chối hoàn tất đứng tên vì “luật thu nhập mới” | Tranh chấp thực hiện HĐ thuê mua (Điều 89 khoản 2); đề nghị Sở XD kiểm tra; có thể kiện yêu cầu tiếp tục thực hiện nghĩa vụ |
| Ép thanh lý giá cũ rồi bán người mới khi nhà đã tăng giá | Trong 05 năm sau khi trả đủ, bán lại cho CĐT/đối tượng đủ điều kiện có trần giá theo HĐ gốc (Điều 89; NĐ 100 Điều 39–40). CĐT không được dùng thanh lý cưỡng bức trái luật để chiếm chênh lệch thị trường |
| Thuê hợp lệ, xin mua nhưng vượt trần thu nhập luật mới | Có thể từ chối bán NOXH vì không đủ điều kiện tại thời điểm mua (nhánh B); không đồng nghĩa được đơn phương chấm dứt thuê trái HĐ |

Trước khi ký bất kỳ hình thức nào: yêu cầu CĐT ghi rõ trên HĐ là mua, thuê mua hay thuê; lịch thanh toán; điều kiện hoàn tất đứng tên; và căn cứ pháp lý nếu sau này chuyển từ thuê sang mua. Không ký khi chỉ có tư vấn miệng “năm năm là được mua”.

## Ai được ưu tiên khi nhiều hồ sơ cùng đạt điều kiện?

Hai lớp quy định khác nhau — nhiều người nhầm “đối tượng được mua” với “đối tượng được ưu tiên bố trí căn”.

### Lớp 1 — Ai được hưởng chính sách NOXH? (Điều 76)

Điều 76 [Luật Nhà ở số 27/2023/QH15](https://vanban.chinhphu.vn/?docid=209627&pageid=27160) liệt kê đối tượng được hưởng chính sách hỗ trợ về nhà ở xã hội. Từ ngày 01/7/2026, [Luật Dân số số 113/2025/QH15](https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Luat-dan-so-2025-so-113-2025-QH15-443680.aspx) bổ sung khoản 13 vào sau khoản 12 Điều 76, nâng danh mục lên 13 nhóm:

| Khoản Đ.76 | Đối tượng |
| --- | --- |
| 1 | Người có công với cách mạng, thân nhân liệt sĩ (theo Pháp lệnh ưu đãi người có công) |
| 2 | Hộ nghèo, cận nghèo khu vực nông thôn |
| 3 | Hộ nghèo, cận nghèo nông thôn vùng thiên tai, biến đổi khí hậu |
| 4 | Hộ nghèo, cận nghèo khu vực đô thị |
| 5 | Người thu nhập thấp tại khu vực đô thị |
| 6 | Công nhân, người lao động tại DN, HTX trong và ngoài KCN |
| 7 | Lực lượng vũ trang nhân dân đang phục vụ tại ngũ; cơ yếu hưởng lương NSNN |
| 8 | Cán bộ, công chức, viên chức |
| 9 | Đối tượng đã trả lại nhà ở công vụ (trừ bị thu hồi do vi phạm) |
| 10 | Hộ bị thu hồi đất, giải tỏa, phá dỡ nhà mà chưa được bồi thường bằng nhà/đất ở |
| 11 | Học sinh, sinh viên (chủ yếu hình thức thuê) |
| 12 | DN, HTX trong KCN (thuê nhà lưu trú công nhân) |
| 13 | Người có từ 02 con đẻ trở lên (bổ sung từ 01/7/2026) |

Thuộc một trong 13 khoản trên mới vào cửa chính sách. Để được mua hoặc thuê mua căn dự án, còn phải đủ điều kiện nhà ở và thu nhập theo Điều 78 Luật Nhà ở và Nghị định 100/2024/NĐ-CP (đã được sửa bởi NĐ 54, NĐ 136).

### Lớp 2 — Khi cùng đủ điều kiện, ai được ưu tiên trước? (điểm đ khoản 1 Điều 79)

Không phải cả 13 khoản Điều 76 đều được xếp ưu tiên bố trí căn. Thứ tự ưu tiên chỉ áp khi các đối tượng đã cùng tiêu chuẩn và điều kiện, theo điểm đ khoản 1 Điều 79 Luật Nhà ở (được sửa bởi Luật Dân số 2025), nguyên văn cấu trúc:

“Trường hợp một đối tượng được hưởng nhiều chính sách hỗ trợ khác nhau thì được hưởng một chính sách hỗ trợ mức cao nhất; trường hợp các đối tượng có cùng tiêu chuẩn và điều kiện thì thực hiện hỗ trợ theo thứ tự ưu tiên trước đối với: người có công với cách mạng, thân nhân liệt sĩ, người khuyết tật, người được bố trí tái định cư theo hình thức mua, thuê mua nhà ở xã hội, người có từ 02 con đẻ trở lên, nữ giới.”

Từ câu trên, thứ tự ưu tiên bố trí (cao → thấp) là:

| Thứ tự | Nhóm theo điểm đ khoản 1 Điều 79 | Ý nghĩa thực tế khi đọc hồ sơ |
| --- | --- | --- |
| 1 | Người có công với cách mạng | Có quyết định/giấy chứng nhận người có công theo Pháp lệnh ưu đãi |
| 2 | Thân nhân liệt sĩ | Có giấy tờ thân nhân liệt sĩ / chế độ theo quy định |
| 3 | Người khuyết tật | Có giấy xác nhận khuyết tật do cơ quan có thẩm quyền cấp (Luật Người khuyết tật) — không phải tự khai “sức khỏe yếu” |
| 4 | Người được bố trí tái định cư theo hình thức mua, thuê mua NOXH | Thuộc phương án tái định cư và đăng ký mua/thuê mua NOXH theo đợt |
| 5 | Người có từ 02 con đẻ trở lên | Áp dụng từ 01/7/2026 theo Luật Dân số 2025; cần giấy tờ chứng minh quan hệ cha/mẹ–con đẻ |
| 6 | Nữ giới | Người đứng đơn là nữ và đã đủ điều kiện mua/thuê mua; xếp sau năm nhóm trên |

Điểm e khoản 1 Điều 79: nếu hộ gia đình có nhiều đối tượng cùng hưởng chính sách thì chỉ áp dụng một chính sách hỗ trợ cho cả hộ.

### Cách bố trí căn khi hồ sơ nhiều hơn số căn (Điều 38 NĐ 100, sửa bởi NĐ 54/2026)

Khi số hồ sơ đủ điều kiện lớn hơn số căn dự kiến bán:

1. Chủ đầu tư tổ chức bốc thăm; có sự giám sát của Sở Xây dựng, UBND cấp xã và Công an cấp xã (NĐ 54 sửa Điều 38).
2. Nhóm thuộc điểm đ khoản 1 Điều 79 được ưu tiên bố trí theo tỷ lệ: số căn ưu tiên = (số hồ sơ đủ điều kiện thuộc nhóm ưu tiên ÷ tổng hồ sơ đủ điều kiện) × tổng căn dự kiến bán.
3. Các căn dành cho ưu tiên được bố trí lần lượt theo thứ tự 1 → 6 ở bảng trên cho đến khi hết phần căn ưu tiên.
4. Trong cùng một nhóm ưu tiên, nếu số hồ sơ vượt số căn dành cho nhóm đó thì bốc thăm trong nhóm đó.
5. Các đối tượng còn lại (đủ điều kiện mua nhưng không thuộc sáu nhóm ưu tiên trên, hoặc không còn suất ưu tiên) tiếp tục tham gia bốc thăm phần căn còn lại.

### Ba tình huống đọc theo đúng hai lớp quy định

Tình huống A — Công nhân KCN (khoản 6 Điều 76), không thuộc sáu nhóm điểm đ Điều 79:
Đủ đối tượng–nhà ở–thu nhập thì vào danh sách đủ điều kiện, nhưng không được ưu tiên bố trí trước. Phải tham gia bốc thăm phần căn không dành riêng cho ưu tiên. Ví dụ thực tế nội thành: hơn 12.000 hồ sơ / 755 suất tại Lý Thường Kiệt — đủ điều kiện pháp lý chưa đồng nghĩa được chọn mua.

Tình huống B — Người khuyết tật (thứ tự 3) nhưng số hồ sơ khuyết tật vượt chỉ tiêu căn ưu tiên của nhóm:
Vẫn thuộc nhóm ưu tiên, nhưng phải bốc thăm trong nhóm khuyết tật. “Có ưu tiên” không có nghĩa chắc chắn nhận căn.

Tình huống C — Người có từ 02 con đẻ trở lên (khoản 13 Điều 76 và thứ tự 5 điểm đ Điều 79, từ 01/7/2026):
Vẫn phải đủ điều kiện nhà ở, thu nhập theo Điều 78 / NĐ 100 như các đối tượng mua khác. Khoản 13 mở cửa đối tượng và đồng thời xếp vào thứ tự ưu tiên bố trí; không miễn ba trụ cột pháp lý.

### Việc cần làm trước khi tick ưu tiên trên đơn

- [ ] Chốt đúng khoản Điều 76 của mình (1–13) — đây là cửa đối tượng
- [ ] Nếu nghĩ mình thuộc điểm đ Điều 79: xác định đúng thứ tự 1–6 và cầm giấy tờ khớp nhóm đó
- [ ] Không nhầm “thuộc 13 đối tượng” với “được ưu tiên bố trí căn”
- [ ] Hỏi CĐT bằng văn bản: đợt này tính căn ưu tiên theo điểm đ Điều 79 thế nào, công bố danh sách ra sao
- [ ] Nhớ: ưu tiên chỉ phát huy khi đã cùng đủ tiêu chuẩn và điều kiện; vượt chỉ tiêu trong nhóm vẫn phải bốc thăm

## Năm lỗi thường gặp ở bước nộp hồ sơ

| Lỗi | Hệ quả | Sửa trước khi nộp |
| --- | --- | --- |
| Đăng ký đồng thời hai dự án | Loại | Chỉ nộp một dự án trong cùng thời điểm tiếp nhận |
| Dùng trần cũ 20/30/40 triệu | Sai điều kiện thu nhập | Áp NĐ 136 từ 07/04/2026: 25/35/50 |
| Vợ/chồng có nhà tại tỉnh/thành phố nơi có dự án nhưng khai “chưa có” | Loại / hủy sau công khai | Tra GCN cả hộ trước; chọn đúng Mẫu 02 hoặc 03 |
| Thiếu giấy đơn vị hoặc nộp sau hạn | Không vào danh sách xét | Xin giấy sớm hơn hạn nộp ít nhất vài ngày |
| Không đọc phạm vi “nhà ở tại tỉnh, thành phố nơi có dự án” | Giấy xác nhận sai địa phương | Xin Mẫu 02/03 đúng tỉnh/thành phố nơi có dự án, không theo nơi thuê trọ |

## Checklist 10 điểm trước khi photo hồ sơ

- [ ] Đã chọn đúng khoản Điều 76
- [ ] Thu nhập ÷ 12 đã so với trần (hoặc đúng cơ chế k7 / miễn trần)
- [ ] Đã tra nhà ở cả vợ chồng tại tỉnh/thành phố nơi có dự án
- [ ] Mẫu thu nhập / nhà ở đúng loại (04/05 hoặc BQP/BCA; 02/03)
- [ ] Giấy còn hiệu lực 12 tháng tính đến mốc ký HĐ dự kiến
- [ ] Chỉ nộp một dự án
- [ ] Đơn Mẫu 01 khớp toàn bộ giấy kèm
- [ ] Đã hỏi quy trình bốc thăm nếu vượt quỹ căn
- [ ] Đã tính vốn tự có ~20–30% trước khi cọc
- [ ] Có biên nhận / email xác nhận khi nộp

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Mua NOXH khác gì căn hộ thương mại — quy trình 7 bước | HouseX",
    seoDesc:
      "So sánh NOXH và thương mại, ba trụ cột điều kiện, 7 bước đợt mở bán, thuê mua vs mua, checklist hồ sơ 2026.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [],
  },
  {
    id: "article-noxh-knowledge-02",
    slug: "vay-noxh-goi-120000-ty-nhcsxh-2026",
    title:
      "Vay mua NOXH qua gói 120.000 tỷ NHCSXH — điều kiện, tỷ lệ 70% và ngân hàng",
    excerpt:
      "Ai được vay, hồ sơ cần có, tỷ lệ vay tối đa ~70% giá căn, lãi ưu đãi và khác biệt với vay thương mại — kèm link công cụ tính khoản vay HouseX.",
    body: `## Gói tín dụng 120.000 tỷ dành cho ai?

Chương trình tín dụng ưu đãi 120.000 tỷ đồng (thường gọi gói NHCSXH) hỗ trợ đối tượng nhà ở xã hội vay vốn mua, thuê mua NOXH hoặc tự xây/sửa nhà — căn cứ Điều 77 và Điều 78 [Luật Nhà ở 2023](https://vanban.chinhphu.vn/?docid=209627&pageid=27160) và hướng dẫn tại [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160).

Đối tượng được xét vay gồm các nhóm khoản 1, 2, 3, 4, 5, 6, 7 và 8 Điều 76 — sau khi đã có hợp đồng mua/thuê mua NOXH và đáp ứng điều kiện vay theo quy định tổ chức tín dụng.

${EDITORIAL_FIGURES.dtaPhoiCanh}

## Vay được tối đa bao nhiêu phần trăm giá căn?

Thông lệ thị trường và chính sách CĐT nhiều dự án NOXH miền Nam (ví dụ [DTA Happy Home](/du-an/dta-happy-home-nhon-trach)) công bố hỗ trợ vay ngân hàng liên kết tới khoảng 70% giá trị căn, thời hạn tối đa 20 năm — tỷ lệ cụ thể phụ thuộc hồ sơ tín dụng và ngân hàng thẩm định.

| Hạng mục | Tham chiếu thực tế | Ghi chú |
| --- | --- | --- |
| Tỷ lệ vay | Thường 50–70% giá căn | Tùy ngân hàng, thu nhập, CIC |
| Vốn tự có | 30–50% + phí bảo trì, làm sổ | Cần dự trù trước khi ký HĐ |
| Thời hạn | 15–20 năm phổ biến | NOXH thường ưu đãi hơn TM |
| Lãi suất | Gói ưu đãi + thả nổi sau giai đoạn đầu | Hỏi NH liên kết trước khi cọc |

Dùng bảng trên để ước lượng: căn 700 triệu × 70% vay = 490 triệu; vốn tự có tối thiểu khoảng 210 triệu trước khi trông chờ giải ngân. Tiền trả tháng phụ thuộc lãi và kỳ hạn — hỏi NH liên kết dự án số cụ thể trước khi cọc.

## Điều kiện vay khác gì điều kiện mua NOXH?

Hai lớp tách biệt — đạt lớp 1 không bảo đảm lớp 2.

| Lớp | Ai xét | Xét gì | Ví dụ thất bại |
| --- | --- | --- | --- |
| 1. Được mua NOXH | Sở / UBND / CĐT | Đối tượng Đ.76, nhà ở, thu nhập trong trần (hoặc miễn trần) | Vượt trần 25 triệu dù CIC sạch |
| 2. Được vay | Ngân hàng / NHCSXH | CIC, DTI (trả nợ ÷ thu nhập), HĐ mua hợp lệ, room dự án | Đủ mua nhưng nợ xe + trả nhà = 60% lương → từ chối |

Công thức DTI tham chiếu: (Nợ cũ hàng tháng + khoản trả nhà mới) ÷ thu nhập tháng. Nhiều NH kỳ vọng dưới khoảng 40–50% — tỷ lệ cụ thể do từng NH quy định.

Ví dụ: Lương 24 triệu (đủ trần mua độc thân). Nợ xe 7 triệu + dự kiến trả nhà 9 triệu = 16 triệu ≈ 67% → dễ bị từ chối vay dù hồ sơ NOXH đạt.

## Hồ sơ vay NOXH thường gồm những gì?

1. Hợp đồng mua/thuê mua NOXH đã ký với CĐT.
2. Giấy xác nhận đối tượng và thu nhập (đơn vị / UBND / mẫu BQP-BCA nếu k7).
3. CCCD, giấy tờ hôn nhân, cư trú theo yêu cầu NH.
4. Cam kết tình trạng nhà ở theo mẫu đợt mở bán.
5. Sao kê lương 3–6 tháng, bảng kê tài sản (tùy NH).
6. Tra CIC trước khi nộp — xử lý nợ xấu/nhóm 2 nếu có.

Ngân hàng liên kết từng dự án có thể thêm biểu mẫu riêng — hỏi trước khi cọc: còn room giải ngân không, tỷ lệ vay thực tế (70% hay thấp hơn), thời gian thẩm định.

## Gói 120.000 tỷ và lãi suất người trẻ dưới 35 tuổi

Từ 01/7/2026, NHNN có khung lãi suất cho vay mua NOXH với người dưới 35 tuổi (Công văn 5340/NHNN-CSTT). Đây là lớp ưu đãi lãi suất bổ sung — không thay thế điều kiện đối tượng mua và không bảo đảm được duyệt vay nếu CIC/DTI/room không đạt.

Trước khi ký HĐ: hỏi NH liên kết mức lãi áp dụng cho độ tuổi của bạn, giai đoạn ưu đãi bao lâu, và lãi thả nổi sau đó tính thế nào.

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Vay NOXH gói 120.000 tỷ NHCSXH — 70% giá căn, điều kiện & hồ sơ | HouseX",
    seoDesc:
      "Hướng dẫn vay mua nhà ở xã hội qua NHCSXH: tỷ lệ 70%, hồ sơ, khác biệt với điều kiện mua. Công cụ tính vay HouseX.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [{ slug: DTA_HAPPY_HOME_SLUG, name: "DTA Happy Home Nhơn Trạch" }],
  },
  {
    id: "article-noxh-knowledge-03",
    slug: "dieu-kien-nha-o-mua-noxh-dieu-77-2026",
    title:
      "Điều kiện nhà ở khi mua NOXH — Điều 78 Luật Nhà ở và 15 m²/người là gì?",
    excerpt:
      "Giải thích khi nào được mua dù đang có nhà, ngưỡng 15 m² sàn/người (NĐ 100), trường hợp vợ chồng đứng tên sổ và lỗi hồ sơ hay bị loại nhất.",
    body: `## Vì sao nhiều hồ sơ NOXH bị loại ở khâu “nhà ở”?

Sau khi qua cửa đối tượng (Điều 76), bước rà soát kế tiếp là tình trạng nhà ở — đây là lý do phổ biến khiến hộ đã thỏa điều kiện về thu nhập vẫn không được chọn mua. Khung pháp lý nằm tại điểm a khoản 1 Điều 78 [Luật Nhà ở 2023](https://vanban.chinhphu.vn/?docid=209627&pageid=27160), chi tiết hóa tại Điều 29 [Nghị định 100/2024/NĐ-CP](https://vanban.chinhphu.vn/?docid=210760&pageid=27160).

${EDITORIAL_FIGURES.noxhEligibility}

## Ba tình huống được coi là đủ điều kiện nhà ở

Theo Điều 78 khoản 1 điểm a, đối tượng mua/thuê mua NOXH (khoản 1, 4, 5, 6, 7, 8, 9, 10 Điều 76) phải thuộc một trong các trường hợp:

1. Chưa có nhà ở thuộc sở hữu của mình tại tỉnh, thành phố trực thuộc Trung ương nơi có dự án NOXH đó.
2. Chưa được mua hoặc thuê mua NOXH (trừ thuê).
3. Chưa được hưởng chính sách hỗ trợ nhà ở dưới mọi hình thức tại tỉnh/TP nơi có dự án.
4. Hoặc đã có nhà nhưng diện tích nhà ở bình quân đầu người thấp hơn mức tối thiểu do Chính phủ quy định.

## Mức 15 m² sàn/người áp dụng thế nào?

Nghị định 100/2024 (sửa bởi NĐ 136/2026) quy định diện tích nhà ở bình quân tối thiểu 15 m² sàn/người. Cách kiểm tra thực tế:

- Lấy tổng diện tích sàn nhà ở đang ở (theo sổ, hợp đồng hoặc cam kết) chia cho số người trong hộ tại thời điểm nộp hồ sơ.
- Ví dụ: nhà 60 m² sàn, hộ 5 người → 12 m²/người → có thể đủ điều kiện nếu các điều kiện khác thỏa.
- Ví dụ: nhà 80 m², hộ 4 người → 20 m²/người → thường không đủ điều kiện “nhà ở tối thiểu”.

## Vợ chồng đứng tên sổ — ai bị ảnh hưởng?

Thực hành rà soát đợt mở bán: tình trạng nhà ở xét theo hộ gia đình, không chỉ người đứng tên nộp đơn. Nếu vợ hoặc chồng sở hữu nhà ở tại tỉnh, thành phố nơi có dự án NOXH, hộ thường bị loại dù người nộp đơn không đứng tên sổ đỏ.

Nên tra cứu sổ đỏ, quyền sử dụng đất và cam kết của cả hộ trước khi đóng phí hồ sơ — chi phí làm hồ sơ và cơ hội đợt mở bán không lặp lại ngay.

## Mỗi người được mua mấy căn NOXH?

Điều 78 khoản 6 Luật Nhà ở 2023: mỗi đối tượng (khoản 1, 4, 5, 6, 8, 9, 10 Điều 76) chỉ được mua hoặc thuê mua 01 căn NOXH. Đối tượng khoản 7 (lực lượng vũ trang) chỉ được 01 căn NOXH hoặc 01 căn nhà ở cho lực lượng vũ trang.

Đã từng mua/thuê mua NOXH hoặc đã hưởng hỗ trợ nhà ở tại cùng tỉnh/TP → không đủ điều kiện cho đợt mới tại địa phương đó.

## Checklist trước khi nộp — nhà ở

- [ ] Đã xác định đúng tỉnh, thành phố nơi có dự án (không dùng nơi thuê trọ)
- [ ] Đã tra GCN bạn và vợ/chồng tại tỉnh đó
- [ ] Đã chọn đúng trường hợp điều kiện nhà ở: chưa có nhà (Mẫu 02) hoặc nhà chật (Mẫu 03)
- [ ] Nếu Mẫu 03: đã tính m² ÷ số người và có giấy cư trú chứng minh số người ở
- [ ] Phần nhà ở trên đơn Mẫu 01 khớp giấy xác nhận
- [ ] Chưa từng mua/thuê mua NOXH tại cùng tỉnh/TP (trừ thuê)
- [ ] Giấy xác nhận còn trong 12 tháng tại mốc ký HĐ dự kiến

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "Điều kiện nhà ở mua NOXH — Điều 78, 15 m²/người, lỗi hồ sơ | HouseX",
    seoDesc:
      "Giải thích điều kiện nhà ở khi mua NOXH: chưa có nhà, 15 m²/người, một căn/hộ. Điều 78 Luật Nhà ở 2023.",
    tags: [NOXH_TAG_CHINH_SACH],
    projects: [],
  },
  {
    id: "article-noxh-knowledge-04",
    slug: "phuc-loc-tho-block-c-noxh-gia-ho-so-2026",
    title:
      "NOXH Phúc Lộc Thọ Block C — giá ~35,3 triệu/m², 140 căn và điều kiện hồ sơ",
    excerpt:
      "Cùng đợt công bố với Lý Thường Kiệt: chung cư 35 Lê Văn Chí Thủ Đức, 140 căn NOXH, giá bình quân ~35,35 triệu/m² — phân tích đối tượng và chuẩn bị hồ sơ.",
    body: `## Phúc Lộc Thọ nằm trong đợt công bố NOXH nội thành nào?

Cùng với [Lý Thường Kiệt (Phú Thọ DMC)](/tin-tuc/tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc), TP.HCM đã công bố giá bán cho chung cư Phúc Lộc Thọ tại 35 Lê Văn Chí, phường Linh Xuân, TP. Thủ Đức — tham khảo [VnExpress](https://vnexpress.net/hai-du-an-nha-xa-hoi-noi-thanh-tp-hcm-co-gia-tu-23-trieu-va-35-trieu-mot-m2-5090748.html).

UBND TP.HCM phê duyệt chuyển một phần quỹ căn Block C sang nhà ở xã hội: 140 căn, diện tích 40–75 m².

## Giá và tổng vốn tham chiếu

| Chỉ tiêu | Số liệu công bố |
| --- | --- |
| Giá bình quân | ~35.349.299 đồng/m² (đã VAT) |
| Phí bảo trì | Chưa gồm 2% phí bảo trì |
| Hệ số vị trí | Có điều chỉnh theo căn (Ki) |
| Quy mô NOXH | 140 căn Block C |
| Giá căn tham chiếu | Khoảng 1,4 – 2,65 tỷ tùy diện tích |

Mức giá cao hơn Lý Thường Kiệt (~23,25 triệu/m²) nhưng vẫn thấp hơn nhiều căn thương mại cùng khu Thủ Đức. Trade-off: vị trí nội thành + tổng vốn cao hơn — chỉ nên nộp nếu đã tính được vốn tự có và khả năng vay, không chỉ vì gần trung tâm.

## Ai nên cân nhắc Phúc Lộc Thọ Block C?

- Thuộc nhóm Điều 76 (thu nhập thấp, công nhân, CBCCVC…) và đủ nhà ở: chưa có nhà tại TP.HCM hoặc bình quân dưới 15 m²/người.
- Cần ở gần ngã tư Thủ Đức, Xa lộ Hà Nội, KCN Linh Trung — ưu tiên vị trí hơn mức giá tuyệt đối thấp nhất.
- Đã tính thu nhập ÷ 12 trong trần 25/35/50 (NĐ 136) và dự trù vay khoảng 70%: ví dụ căn 1,8 tỷ → vốn tự có ~540 triệu trước giải ngân.

## Chuẩn bị hồ sơ trước đợt mở bán

1. Xác nhận đối tượng và thu nhập tại đơn vị (12 tháng lương thực nhận).
2. Tra GCN cả vợ chồng tại TP.HCM; xin Mẫu 02 hoặc 03 khớp trường hợp điều kiện nhà ở.
3. Theo dõi thông báo Sở Xây dựng TP.HCM về thời hạn nộp và số bộ photo.
4. Hỏi NH liên kết: còn room không, tỷ lệ vay thực tế, DTI tối thiểu.
5. Không cọc nếu chưa cầm đủ phần vốn tự có đến mốc ký HĐ.

Tra cứu mặt bằng, vị trí và gallery: [/du-an/chung-cu-phuc-loc-tho-noxh](/du-an/chung-cu-phuc-loc-tho-noxh).

*HouseX tổng hợp từ VnExpress và thông tin công bố — giá và tiến độ có thể thay đổi theo đợt.*`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Phúc Lộc Thọ Block C — giá ~35,3 tr/m², 140 căn | HouseX",
    seoDesc:
      "Phân tích NOXH Phúc Lộc Thọ 35 Lê Văn Chí: giá ~35,3 triệu/m², 140 căn Block C, điều kiện và hồ sơ 2026.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [{ slug: PHUC_LOC_THO_SLUG, name: PHUC_LOC_THO_NAME }],
  },
  {
    id: "article-noxh-knowledge-05",
    slug: "noxh-long-an-6-du-an-mien-nam-2026",
    title:
      "6 dự án NOXH Long An 2026 — LA Home, Mỹ Hạnh, The Ori và bảng giá tham chiếu",
    excerpt:
      "Danh mục NOXH vùng ven TP.HCM: 6 dự án tại Bến Lức, Đức Hòa, Cần Giuộc — giá từ ~14 triệu/m², phù hợp công nhân và hộ trẻ chưa trúng suất nội thành.",
    body: `## Vì sao Long An là “vùng đệm” NOXH của TP.HCM?

Khi NOXH nội thành như Lý Thường Kiệt ghi nhận áp lực hồ sơ vượt quỹ căn hàng chục lần, nhiều hộ chuyển sang vùng ven Long An — giá/m² thấp hơn, quỹ căn mở rộng dần, phù hợp công nhân KCN và người lao động làm việc dọc Quốc lộ 1A, QL22.

Điều kiện mua vẫn theo Luật Nhà ở 2023 toàn quốc — làm đủ ba trụ trước khi nộp bất kỳ dự án Long An nào:

| Trụ | Mốc cần đạt |
| --- | --- |
| Đối tượng | Thuộc Điều 76 (hay gặp: k5, k6, k8) |
| Nhà ở | Chưa có nhà tại Long An (tỉnh/thành phố nơi có dự án) hoặc dưới 15 m²/người — xét cả vợ chồng |
| Thu nhập | Bình quân 12 tháng ≤ 25/35/50 triệu (k5/k6/k8); k7 theo Điều 67 |

## Bảng 6 dự án NOXH Long An trên HouseX

| Dự án | Khu vực | Quy mô / điểm nổi | Giá tham chiếu |
| --- | --- | --- | --- |
| [LA Home](/du-an/${LA_HOME_SLUG}) | Bến Lức, Lương Hòa | KĐT sinh thái, đối diện KCN Prodezi | ~14–17 triệu/m², căn từ ~385 triệu |
| [Mỹ Hạnh (Bee Home)](/du-an/${MY_HANH_SLUG}) | Đức Hòa | 166 căn 1PN 31–34 m², 12 tầng | ~31,38 triệu/m² |
| [The Ori Phương Mai](/du-an/${ORI_SLUG}) | Mỹ Hạnh, Gò Hưu | 1.269 căn NOXH, 3 tháp 27 tầng | ~20 triệu/m² |
| [Hậu Nghĩa](/du-an/${HAU_NGHIA_SLUG}) | Đức Hòa | KĐT Hậu Nghĩa | Theo CĐT từng đợt |
| [Phước Vĩnh Tây](/du-an/${PVT_SLUG}) | Cần Giuộc | KĐT ven sông | Theo CĐT từng đợt |
| [Phú An](/du-an/${PHU_AN_SLUG}) | Thạnh Bình, Bến Lức | NOXH thấp tầng | Theo CĐT từng đợt |

Giá trên là tham chiếu công bố Sở Xây dựng/CĐT tại thời điểm biên tập — mức chính thức từng đợt mở bán có thể điều chỉnh.

## Long An phù hợp nhóm đối tượng nào?

- Công nhân, người lao động (khoản 6 Điều 76) tại KCN Prodezi, KCN Long Hậu, vùng giáp ranh TP.HCM.
- Người thu nhập thấp đô thị (khoản 5) đã đủ ba trụ cột nhưng chưa trúng suất nội thành.
- Hộ trẻ cần tổng vốn thấp: ví dụ LA Home căn ~385 triệu → vốn tự có ~115–155 triệu (30–40%) trước khi vay phần còn lại — thấp hơn nhiều căn NOXH nội thành 1,4–2 tỷ.

## Chuẩn bị gì trước đợt mở bán Long An?

1. Tính thu nhập ÷ 12 và tra GCN cả hộ tại Long An (không chỉ TP.HCM nếu dự án ở Long An).
2. Xin giấy xác nhận thu nhập tại đơn vị (công nhân: HĐLĐ + bảng lương 12 tháng).
3. Theo dõi Sở Xây dựng Long An và từng CĐT — mỗi dự án mở đợt riêng; chỉ nộp một dự án tại một thời điểm.
4. Hỏi NH liên kết: room, tỷ lệ vay, lãi; không cọc nếu chưa đủ vốn tự có đến mốc ký HĐ.

Danh mục đầy đủ: [/du-an/nha-o-xa-hoi](/du-an/nha-o-xa-hoi)

${NOXH_SUPPORT_CLOSING}`,
    status: "PUBLISHED",
    publishedAt: PUBLISHED,
    updatedAt: UPDATED,
    coverImageUrl: null,
    authorName: "Ban biên tập House X",
    seoTitle:
      "NOXH Long An 2026 — 6 dự án, giá tham chiếu & điều kiện | HouseX",
    seoDesc:
      "Danh mục 6 dự án nhà ở xã hội Long An: LA Home, Mỹ Hạnh, The Ori… Giá từ ~14 triệu/m², hướng dẫn đối tượng và hồ sơ.",
    tags: [NOXH_TAG_DU_AN_GIA],
    projects: [
      { slug: LA_HOME_SLUG, name: "Nhà ở xã hội LA Home" },
      { slug: MY_HANH_SLUG, name: "Nhà ở xã hội Mỹ Hạnh" },
      { slug: ORI_SLUG, name: "The Ori Phương Mai" },
    ],
  },
];
