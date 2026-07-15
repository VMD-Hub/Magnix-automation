import {
  renderAffiliateInline,
  renderAffiliateServiceMarkdown,
} from "../lib/content/affiliate-body-render";

const sample = `## HouseX hỗ trợ những gì?

1. **Làm rõ nhu cầu** — mục đích mua
2. Xem [thẩm định](/dinh-gia/tham-dinh-ngan-hang)

> HouseX là đầu mối tư vấn.

• **Khách hàng:** CCCD
• Bullet thường

| Nhóm | Ví dụ |
|---|---|
| **Bảo hiểm nhà ở** | Cháy nổ |
`;

const html = renderAffiliateServiceMarkdown(sample);
const checks = {
  hasStrong: html.includes("<strong"),
  hasLink: html.includes('href="/dinh-gia/tham-dinh-ngan-hang"'),
  hasQuote: html.includes("<blockquote"),
  hasTable: html.includes("<table"),
  noRawBold: !html.includes("**"),
  noRawGt: !html.includes("> HouseX") && html.includes("blockquote"),
  inline: renderAffiliateInline("a **b** [c](/x)"),
};

console.log(JSON.stringify(checks, null, 2));
if (!checks.hasStrong || !checks.hasLink || !checks.noRawBold) {
  console.error(html);
  process.exit(1);
}
console.log("ok — affiliate-body-render");
