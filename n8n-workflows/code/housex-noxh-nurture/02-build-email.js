// Soạn email nurture theo tier — Value-First, không chèo kéo.

const item = $input.first().json;
const name = item.contact_name || 'Anh/Chị';
const base = item.base_url || 'https://timnhaxahoi.com';
const tier = item.tier;
const reasons = String(item.reason_codes || '');

const links = {
  noxhArticle: `${base}/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat`,
  loanCalc: `${base}/cong-cu/tinh-khoan-vay`,
  noxhProjects: `${base}/du-an?projectType=NHA_O_XA_HOI`,
  allProjects: `${base}/du-an`,
  contact: `${base}/lien-he`,
  noxhCheck: `${base}/cong-cu/dieu-kien-noxh`,
};

let subject;
let headline;
let bodyHtml;
let bodyText;

if (tier === 'OUT') {
  subject = 'HouseX — Gợi ý lộ trình mua nhà phù hợp với bạn';
  headline = 'Có thể bạn phù hợp nhà ở thương mại hơn NOXH';
  bodyHtml = `
<p>Xin chào ${name},</p>
<p>Cảm ơn bạn đã dùng công cụ kiểm tra điều kiện NOXH của HouseX. Theo thông tin bạn cung cấp, nhóm đối tượng hiện tại có thể chưa khớp chính sách nhà ở xã hội — nhưng vẫn có nhiều lựa chọn nhà ở thương mại và tư vấn tài chính phù hợp.</p>
<p><strong>Gợi ý bước tiếp theo:</strong></p>
<ul>
  <li><a href="${links.allProjects}">Xem dự án đang mở bán</a></li>
  <li><a href="${links.loanCalc}">Tính thử khoản vay mua nhà</a></li>
  <li><a href="${links.contact}">Đặt lịch tư vấn miễn phí với chuyên gia HouseX</a></li>
</ul>
<p>Chúng tôi sẵn sàng giải thích rõ hồ sơ và tìm giải pháp phù hợp — không áp lực mua bán.</p>
<p>Trân trọng,<br/>Đội ngũ HouseX</p>`;
  bodyText = `Xin chào ${name},\n\nCảm ơn bạn đã kiểm tra điều kiện NOXH. Nhóm đối tượng có thể chưa khớp NOXH — bạn có thể xem dự án: ${links.allProjects}\nTính vay: ${links.loanCalc}\nTư vấn: ${links.contact}\n\nTrân trọng, HouseX`;
} else {
  const incomeOver = reasons.includes('income_over_ceiling');
  const housingFail = reasons.includes('housing_fail');
  subject = incomeOver
    ? 'HouseX — Phương án nhà ở khi thu nhập vượt trần NOXH'
    : 'HouseX — Tài liệu & công cụ hữu ích cho hành trình mua nhà';
  headline = incomeOver
    ? 'Thu nhập trên ngưỡng NOXH — vẫn có lộ trình rõ ràng'
    : 'Chuẩn bị hồ sơ & công cụ cho quyết định mua nhà';

  const extra = incomeOver
    ? `<p>Thu nhập của bạn có thể vượt trần NOXH theo quy định hiện hành. HouseX gợi ý cân nhắc <a href="${links.allProjects}">nhà ở thương mại</a> hoặc liên hệ chuyên gia để rà soát lại hồ sơ (một số trường hợp vẫn có ngoại lệ cần xác minh).</p>`
    : housingFail
      ? `<p>Điều kiện nhà ở hiện tại có thể cần rà soát thêm. Chuyên gia HouseX có thể giúp bạn hiểu rõ quy định trước khi nộp hồ sơ chính thức.</p>`
      : `<p>Bạn có thể tiếp tục tìm hiểu điều kiện và chuẩn bị hồ sơ qua các tài liệu dưới đây.</p>`;

  bodyHtml = `
<p>Xin chào ${name},</p>
<p>Cảm ơn bạn đã sử dụng công cụ <a href="${links.noxhCheck}">Kiểm tra điều kiện NOXH</a> của HouseX.</p>
${extra}
<p><strong>Tài liệu & công cụ miễn phí:</strong></p>
<ul>
  <li><a href="${links.noxhArticle}">Tóm tắt điều kiện mua NOXH 2026</a></li>
  <li><a href="${links.loanCalc}">Tính khoản vay mua nhà</a></li>
  <li><a href="${links.noxhProjects}">Dự án NOXH đang mở bán</a></li>
  <li><a href="${links.contact}">Đặt lịch tư vấn với chuyên gia</a></li>
</ul>
<p>Khi bạn sẵn sàng, chúng tôi sẽ giải thích rõ tình trạng hồ sơ và tìm giải pháp phù hợp.</p>
<p>Trân trọng,<br/>Đội ngũ HouseX</p>`;
  bodyText = `Xin chào ${name},\n\nCảm ơn bạn đã dùng công cụ NOXH HouseX.\n\nBài viết: ${links.noxhArticle}\nTính vay: ${links.loanCalc}\nDự án NOXH: ${links.noxhProjects}\nTư vấn: ${links.contact}\n\nTrân trọng, HouseX`;
}

const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#333;line-height:1.6"><h2 style="color:#b81425">${headline}</h2>${bodyHtml}<p style="font-size:12px;color:#888">Bạn nhận email vì đã để lại thông tin trên HouseX. Nếu không muốn nhận thêm, trả lời email này.</p></body></html>`;

return [{
  json: {
    ...item,
    email_subject: subject,
    email_html: html,
    email_text: bodyText.slice(0, 8000),
  },
}];
