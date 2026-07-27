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

Trong bất động sản, “cắt máu” là khi người làm trung gian tự nguyện trả lại một phần — đôi khi gần hết — hoa hồng cá nhân cho khách để đổi lấy cái gật đầu chốt cọc. Nhiều người mua coi đó là “bớt lộc” xứng đáng. Nhiều người bán coi đó là “linh hoạt để sống”.

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

Khi hoa hồng bị mặc cả ngoài luồng, cả người bán lẫn người mua đều khó tin. House X mở chương trình cộng tác viên: ghi nhận giới thiệu và bán hàng liên kết một cách chính danh — thay vì “bớt lộc” miệng.

Xem gốc nỗi đau: [Cắt máu hoa hồng môi giới](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

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
      "Đối tượng cộng tác viên House X: ngân hàng, bảo hiểm, chứng khoán, MG tự do, giới thiệu người thân, tự mua — nỗi đau và việc làm cùng House X.",
    publishedAt: "2026-07-27T12:00:00.000Z",
    body: `## Không chỉ dành cho môi giới bất động sản

Chương trình cộng tác viên House X mở cho ai có mạng lưới, nhu cầu mua, hoặc muốn giới thiệu đúng kênh. Dưới đây là chân dung thường gặp.

Tổng quan mô hình: [Mô hình cộng tác viên House X](${ctvAffiliateArticlePath(SLUG_MODEL)}).

## Nhân viên ngân hàng, bảo hiểm, chứng khoán

Nỗi đau: Khách tin bạn về tài chính nhưng hỏi nhà / NOXH / dự án — bạn không muốn (hoặc không được) đóng vai “cò cắt máu”.

Trên House X: Bạn giới thiệu đúng chỗ; House X tư vấn sản phẩm. Bạn vẫn là người khách tin tưởng.

## Môi giới bất động sản tự do

Nỗi đau: Bị kéo vào đua cắt máu; mất giá trị tư vấn và hậu mãi.

Trên House X: Cạnh tranh bằng chuyên môn pháp lý và lựa chọn căn — không bằng ai cắt nhiều hơn. Đọc thêm [vòng xoáy cắt máu](${ctvAffiliateArticlePath(SLUG_PILLAR)}).

## Người có mạng lưới nhưng ngại bán

Nỗi đau: Người thân / đồng nghiệp muốn mua; bạn ngại ra mặt tư vấn và sợ bị kéo vào mặc cả hoa hồng.

Trên House X: Bạn chỉ cần giới thiệu; House X hỗ trợ tư vấn và chốt. Không buộc phải đóng vai môi giới.

## Người mua cho chính mình

Nỗi đau: Không muốn ép môi giới cắt máu; cũng không tin “bớt lộc” thiếu minh bạch.

Trên House X: Mua qua chương trình cộng tác viên — rõ ràng, không thỏa thuận miệng ngoài luồng.

## Truyền thông, HR, công đoàn, mạng lưới KCN

Nỗi đau: Có người quan tâm nhà ở / NOXH nhưng thiếu kênh sản phẩm đáng tin.

Trên House X: Giới thiệu có kiểm chứng; đồng hành nội dung hoặc dự án khi phù hợp.

## Bạn thuộc nhóm nào — bước tiếp theo

1. Đối chiếu chân dung ở trên.
2. Đọc [cách bắt đầu](${ctvAffiliateArticlePath(SLUG_GUIDE)}).
3. Đăng ký tham gia.

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

Theo thỏa thuận hợp tác rõ ràng với House X — không mặc cả “bớt lộc” miệng ngoài luồng. Chi tiết phù hợp từng trường hợp khi bạn tham gia.

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
