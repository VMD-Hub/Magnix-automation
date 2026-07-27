/**
 * 4 bài SEO chuyên mục CTV — `/affiliate-bat-dong-san/[slug]`.
 * Copy người đọc: không lộ thuật ngữ vận hành (mã, claim, hội nhập, duyệt…).
 */

import { CTV_AFFILIATE_PATH } from "@/lib/content/ctv-affiliate-landing";

export type CtvAffiliateArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDesc: string;
  publishedAt: string;
};

const HUB = CTV_AFFILIATE_PATH;
const SLUG_PILLAR = "cat-mau-hoa-hong-moi-gioi-va-cong-tac-vien-minh-bach";
const SLUG_MODEL = "mo-hinh-cong-tac-vien-bat-dong-san-house-x";
const SLUG_PERSONA = "chan-dung-doi-tac-cong-tac-vien-bds";
const SLUG_GUIDE = "dang-ky-ctv-ban-hang-lien-ket-huong-dan";

export const CTV_AFFILIATE_ARTICLE_SLUGS = [
  SLUG_PILLAR,
  SLUG_MODEL,
  SLUG_PERSONA,
  SLUG_GUIDE,
] as const;

export function ctvAffiliateArticlePath(slug: string): string {
  return `${HUB}/${slug}`;
}

const CTA_BLOCK = `## Đăng ký cộng tác viên House X

[Đăng ký tham gia](/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv), [tiếp tục nếu đã có tài khoản](/moi-gioi/dang-ky-ctv), hoặc [tư vấn thêm](/lien-he?goi=tu-van-cong-tac-vien#tu-van) nếu bạn muốn làm rõ trước khi đăng ký.

Xem tổng quan chương trình: [${HUB}](${HUB}).`;

export const CTV_AFFILIATE_ARTICLES: readonly CtvAffiliateArticle[] = [
  {
    slug: SLUG_PILLAR,
    title:
      "Cắt máu hoa hồng môi giới là gì? Vì sao cuộc đua này hại cả người bán lẫn người mua",
    excerpt:
      "Cắt máu — trả lại phần lớn hoa hồng cá nhân để chốt deal — đẩy nghề xuống đáy: mất hậu mãi, phí ngầm, niềm tin sụp. Có đường khác: cộng tác viên minh bạch trên House X.",
    seoTitle: "Cắt máu hoa hồng môi giới — vòng xoáy và lối ra CTV | House X",
    seoDesc:
      "Cắt máu hoa hồng là gì, vì sao hại cả nghề và khách hàng, và cộng tác viên House X khác cuộc đua ngoài luồng thế nào.",
    publishedAt: "2026-07-27T10:00:00.000Z",
    body: `## Cắt máu hoa hồng đang biến nghề thành cuộc đua xuống đáy

Trong bất động sản, “cắt máu” là khi người làm trung gian tự nguyện trả lại một phần — đôi khi gần hết — hoa hồng cá nhân cho khách để đổi lấy cái gật đầu chốt cọc. Nhiều người mua coi đó là ưu đãi xứng đáng. Nhiều người bán coi đó là cách linh hoạt để giữ giao dịch.

Dưới góc nhìn thực tế nghề, đây là cuộc đua xuống đáy: các bên kéo nhau vào vòng xoáy tự hủy giá trị lao động. Một khi biên thưởng bị ép về mức gần bằng không, chuỗi trách nhiệm sau ký cũng mỏng đi.

## Hai hệ lụy khi đã cắt máu để tranh khách

### Hậu mãi và pháp lý bị cắt theo

Hoa hồng không phải tiền từ trên trời. Đó là chi phí cho thời gian, chất xám và trách nhiệm dài hạn quanh giấy tờ, tranh chấp, cấp sổ. Khi lợi nhuận sau cắt máu kiệt quệ, động lực đồng hành sau ký thường biến mất: khách bị bỏ rơi, không còn người rà soát, không ai cầm tay làm thủ tục. Số tiền tưởng “tiết kiệm” thực chất có thể là khoản cắt đi từ sự an toàn pháp lý của chính giao dịch.

### Bù đắp sai lệch và phí ngầm

Để sống sau khi đã cắt máu tranh khách, một bộ phận bất chính tìm cách bù: bóp méo thông tin, “vẽ bùa” thủ tục để thu phí dịch vụ vài triệu vô căn cứ, hoặc đẩy khách vào hợp đồng biến tướng. Cắt máu ngoài luồng biến mối quan hệ tư vấn dựa trên niềm tin thành trò rượt đuổi mập mờ — làm xấu hình ảnh người làm nghề chân chính.

## Khách “hời” thật không?

Khách nghĩ mình thắng vì nhận lại một phần hoa hồng. Thực tế họ thường đánh đổi:

- Ít hỗ trợ sau ký hơn khi biên thưởng của bên kia đã cạn.
- Rủi ro phí dịch vụ / lời hứa ngoài hợp đồng chủ đầu tư.
- Khó phân biệt ưu đãi dự án chính thức với cắt hoa hồng cá nhân ngoài luồng.

Muốn tối ưu chi phí đúng luật, hãy tách: chính sách dự án / đợt mở bán (có công bố) khác với đòi cắt hoa hồng cá nhân không kiểm chứng được.

## Lối ra: cộng tác viên minh bạch, không đua cắt máu

Thay vì giấu thưởng rồi bị ép cắt ngoài luồng, House X mở chương trình [cộng tác viên](${HUB}): giới thiệu, bán hoặc mua trên luật chơi rõ ràng — không đua cắt máu.

Đọc tiếp:

- [Mô hình cộng tác viên BĐS House X](${ctvAffiliateArticlePath(SLUG_MODEL)})
- [Chân dung đối tác phù hợp](${ctvAffiliateArticlePath(SLUG_PERSONA)})
- [Cách bắt đầu với House X](${ctvAffiliateArticlePath(SLUG_GUIDE)})

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_MODEL,
    title:
      "Mô hình cộng tác viên bất động sản House X: từ đối thủ ngoài luồng thành đối tác",
    excerpt:
      "Cộng tác viên House X: đăng ký tham gia, rồi giới thiệu hoặc mua đúng kênh. Hợp tác minh bạch, không đua cắt máu ngoài luồng.",
    seoTitle: "Mô hình cộng tác viên BĐS House X — luật chơi minh bạch | House X",
    seoDesc:
      "Cộng tác viên bất động sản House X là gì: giới thiệu, bán hoặc mua minh bạch — khác cuộc đua cắt máu ngoài luồng thế nào.",
    publishedAt: "2026-07-27T11:00:00.000Z",
    body: `## Vì sao cần mô hình khác cuộc đua cắt máu?

Khi hoa hồng bị mặc cả ngoài luồng, cả người bán lẫn người mua đều khó tin. House X mở chương trình cộng tác viên: ghi nhận giới thiệu và bán hàng liên kết một cách chính danh — thay vì thỏa thuận miệng ngoài quy trình.

Xem bối cảnh: [Cắt máu hoa hồng môi giới](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

## Bạn làm gì được khi tham gia?

- Giới thiệu người thân / khách — House X hỗ trợ tư vấn và chốt nếu bạn không muốn đóng vai bán hàng.
- Bán hàng liên kết trên sản phẩm / dự án đang mở.
- Mua cho chính mình trên cùng luật chơi rõ ràng — không ép ai cắt máu để “ưu đãi”.

## Ba bước bắt đầu

1. Đăng ký tham gia chương trình cộng tác viên.
2. House X hướng dẫn cách giới thiệu hoặc mua phù hợp với bạn.
3. Bắt đầu giới thiệu, bán hoặc mua — minh bạch, không đua cắt máu.

Chi tiết hợp tác được trao đổi trực tiếp khi bạn tham gia.

## Khác gì chỉ đăng tin?

Đăng tin đưa sản phẩm lên sàn. Cộng tác viên là chương trình giới thiệu và bán hàng liên kết với House X. Bạn có thể làm cả hai nếu phù hợp. Cách bắt đầu: [Hướng dẫn đăng ký](${ctvAffiliateArticlePath(SLUG_GUIDE)}).

Ai phù hợp: [Chân dung đối tác](${ctvAffiliateArticlePath(SLUG_PERSONA)}).

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_PERSONA,
    title:
      "Chân dung đối tác cộng tác viên BĐS: ai nên tham gia chương trình House X?",
    excerpt:
      "Nhân viên ngân hàng, bảo hiểm, chứng khoán, môi giới tự do, người chỉ muốn giới thiệu, người mua cho mình — chân dung rõ để tự nhận diện trước khi đăng ký.",
    seoTitle: "Chân dung cộng tác viên BĐS House X — ai phù hợp? | House X",
    seoDesc:
      "Đối tượng cộng tác viên House X: ngân hàng, bảo hiểm, chứng khoán, môi giới độc lập, giới thiệu mạng lưới, tự mua — bối cảnh và cách hợp tác.",
    publishedAt: "2026-07-27T12:00:00.000Z",
    body: `## Không chỉ dành cho môi giới bất động sản

Chương trình cộng tác viên House X mở cho nhiều nhóm đối tác: người có mạng lưới, nhu cầu mua, hoặc muốn giới thiệu đúng kênh. Dưới đây là các nhóm thường gặp và cách hợp tác.

Tổng quan mô hình: [Mô hình cộng tác viên House X](${ctvAffiliateArticlePath(SLUG_MODEL)}).

## Nhân viên ngân hàng, bảo hiểm, chứng khoán

Bối cảnh: Khách hàng tin tưởng bạn về tài chính và thường hỏi thêm về nhà ở xã hội hoặc dự án bất động sản.

Cách hợp tác: Bạn giới thiệu đúng kênh; House X đảm nhiệm tư vấn sản phẩm. Bạn giữ vai trò người cố vấn đáng tin cậy.

## Môi giới bất động sản độc lập

Bối cảnh: Bạn muốn giữ chuẩn tư vấn và đồng hành sau giao dịch, thay vì cạnh tranh chỉ bằng giảm hoa hồng.

Cách hợp tác: Hợp tác trên nền tảng có quy trình rõ — tập trung chuyên môn pháp lý và lựa chọn căn. Đọc thêm [vòng xoáy cắt máu hoa hồng](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

## Người có mạng lưới, không muốn bán trực tiếp

Bối cảnh: Người thân hoặc đồng nghiệp cần mua nhà; bạn muốn hỗ trợ giới thiệu mà không đóng vai môi giới.

Cách hợp tác: Bạn thực hiện giới thiệu; House X hỗ trợ tư vấn và hoàn tất giao dịch khi cần.

## Người mua cho chính mình

Bối cảnh: Bạn ưu tiên giao dịch minh bạch, không dựa trên thỏa thuận hoa hồng miệng ngoài quy trình.

Cách hợp tác: Tham gia chương trình cộng tác viên để mua trên cùng khung hợp tác rõ ràng với House X.

## Truyền thông, HR, công đoàn, mạng lưới khu công nghiệp

Bối cảnh: Bạn tiếp cận nhóm quan tâm nhà ở / NOXH nhưng cần kênh sản phẩm đáng tin cậy.

Cách hợp tác: Giới thiệu có kiểm chứng; đồng hành nội dung hoặc dự án khi hai bên phù hợp.

## Bước tiếp theo

1. Đối chiếu nhóm đối tác ở trên.
2. Đọc [hướng dẫn bắt đầu](${ctvAffiliateArticlePath(SLUG_GUIDE)}).
3. Đăng ký tham gia hoặc [tư vấn thêm](/lien-he?goi=tu-van-cong-tac-vien#tu-van).

${CTA_BLOCK}
`,
  },
  {
    slug: SLUG_GUIDE,
    title:
      "Đăng ký cộng tác viên bán hàng liên kết House X: cách bắt đầu và câu hỏi thường gặp",
    excerpt:
      "Từ đăng ký tham gia đến giới thiệu hoặc mua — các bước thực tế, FAQ và liên hệ. Rõ ràng, không đua cắt máu.",
    seoTitle: "Đăng ký cộng tác viên House X — hướng dẫn bắt đầu | House X",
    seoDesc:
      "Cách đăng ký cộng tác viên House X: các bước bắt đầu, FAQ — hợp tác minh bạch, không đua cắt máu.",
    publishedAt: "2026-07-27T13:00:00.000Z",
    body: `## Bạn sẽ bắt đầu như thế nào?

1. Đọc [tổng quan chương trình](${HUB}) và [mô hình cộng tác viên](${ctvAffiliateArticlePath(SLUG_MODEL)}).
2. [Đăng ký tham gia](/dang-ky/moi-gioi?next=/moi-gioi/dang-ky-ctv).
3. Nếu đã có tài khoản: [tiếp tục đăng ký](/moi-gioi/dang-ky-ctv).
4. House X hướng dẫn cách giới thiệu hoặc mua phù hợp với bạn.
5. Bắt đầu giới thiệu, bán hoặc mua đúng kênh.

## Trước khi đăng ký

- Biết mình thuộc chân dung nào: [Chân dung đối tác](${ctvAffiliateArticlePath(SLUG_PERSONA)}).
- Sẵn sàng hợp tác rõ ràng với House X — không dựa vào thỏa thuận miệng ngoài luồng.
- Cần làm rõ trước? [Tư vấn thêm](/lien-he?goi=tu-van-cong-tac-vien#tu-van).

## Câu hỏi thường gặp

### Tôi chưa làm môi giới BĐS có đăng ký được không?

Được, nếu bạn muốn giới thiệu, bán hàng liên kết hoặc mua qua House X.

### Tôi có cần chứng chỉ môi giới không?

Không bắt buộc ngay từ đầu. Cách đồng hành có thể khác nhau tùy bạn tự tư vấn hay nhờ House X — đội ngũ sẽ trao đổi khi bạn tham gia.

### Thưởng được thỏa thuận thế nào?

Theo thỏa thuận hợp tác rõ ràng với House X — không mặc cả miệng ngoài quy trình. Chi tiết phù hợp từng trường hợp khi bạn tham gia.

### Khác gì chỉ đăng tin?

Đăng tin = đưa sản phẩm lên sàn. Cộng tác viên = chương trình giới thiệu và bán hàng liên kết với House X. Có thể làm cả hai nếu phù hợp.

### Tôi chỉ muốn hỏi trước khi đăng ký?

[Tư vấn thêm](/lien-he?goi=tu-van-cong-tac-vien#tu-van) hoặc đọc lại [hub cộng tác viên](${HUB}).

${CTA_BLOCK}
`,
  },
];

export function getCtvAffiliateArticle(
  slug: string,
): CtvAffiliateArticle | undefined {
  return CTV_AFFILIATE_ARTICLES.find((a) => a.slug === slug);
}

export function listCtvAffiliateArticleCards(): {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  publishedAt: string;
}[] {
  return CTV_AFFILIATE_ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    href: ctvAffiliateArticlePath(a.slug),
    publishedAt: a.publishedAt,
  }));
}
